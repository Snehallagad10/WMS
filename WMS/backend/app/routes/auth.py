import logging

from fastapi import APIRouter, Depends, HTTPException
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from ..core.security import create_access_token, verify_token
from ..db import get_db
from ..models.core import Role, User, UserRole
from ..utils.id_generator import generate_id

router = APIRouter(prefix="/auth", tags=["Auth"])
logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password[:72])


def verify_password(plain, hashed):
    return pwd_context.verify(plain[:72], hashed)


@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    try:
        username = data.get("username")
        password = data.get("password")

        logger.info("Incoming login request for username=%s", username)

        if not username or not password:
            raise HTTPException(status_code=400, detail="Username and password required")

        logger.info("DB query: fetching user for username=%s", username)
        user = db.query(User).filter(User.username == username).first()

        if not user:
            logger.warning("Authentication failed: user not found for username=%s", username)
            raise HTTPException(status_code=401, detail="Invalid credentials")

        logger.info("DB query result: user found for username=%s", username)
        if not verify_password(password, user.password_hash):
            logger.warning("Authentication failed: invalid password for username=%s", username)
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if user.is_locked:
            logger.warning("Authentication blocked: user locked for username=%s", username)
            raise HTTPException(status_code=403, detail="User is locked by admin")

        if not user.is_active:
            logger.warning("Authentication blocked: user inactive for username=%s", username)
            raise HTTPException(status_code=403, detail="User is inactive")

        if user.force_password_change:
            logger.info(
                "Authentication result: password reset required for username=%s",
                username,
            )
            return {
                "message": "Password reset required",
                "force_reset": True,
                "user_id": user.user_id,
            }

        logger.info("DB query: fetching roles for username=%s", username)
        user_roles = db.query(UserRole).filter(UserRole.user_id == user.user_id).all()
        role_ids = [user_role.role_id for user_role in user_roles]

        roles = db.query(Role).filter(Role.role_id.in_(role_ids)).all()
        role_codes = [role.role_code.lower() for role in roles]

        if not any(role in ["wms_admin", "supervisor"] for role in role_codes):
            logger.warning(
                "Authentication blocked: insufficient role for username=%s",
                username,
            )
            raise HTTPException(status_code=403, detail="Access denied")

        access_token = create_access_token(data={"sub": user.user_id})
        logger.info("Authentication result: success for username=%s", username)

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user.user_id,
            "username": user.username,
            "roles": role_codes,
        }
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("LOGIN ERROR")
        print("LOGIN ERROR:", str(exc))
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/fix-supervisor")
def fix_supervisor(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == "supervisor").first()

    if not user:
        user = User(
            user_id=generate_id("USR", db),
            username="supervisor",
            password_hash=hash_password("super123"),
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.password_hash = hash_password("super123")
        db.commit()

    role = db.query(Role).filter(Role.role_code == "SUPERVISOR").first()

    if not role:
        raise HTTPException(status_code=400, detail="Supervisor role not found")

    mapping = db.query(UserRole).filter(
        UserRole.user_id == user.user_id,
        UserRole.role_id == role.role_id,
    ).first()

    if not mapping:
        db.add(
            UserRole(
                user_role_id=generate_id("USRROLE", db),
                user_id=user.user_id,
                role_id=role.role_id,
            )
        )
        db.commit()

    return {"msg": "Supervisor ready"}


@router.post("/change-password")
def change_password(data: dict, user=Depends(verify_token), db: Session = Depends(get_db)):
    new_password = data.get("new_password")

    if not new_password:
        raise HTTPException(status_code=400, detail="New password required")

    user.password_hash = hash_password(new_password)
    user.force_password_change = False
    db.commit()

    return {"message": "Password updated"}


@router.get("/fix-admin")
def fix_admin(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == "admin").first()

    if not user:
        user = User(
            user_id=generate_id("USR", db),
            username="admin",
            password_hash=hash_password("admin123"),
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.password_hash = hash_password("admin123")
        db.commit()

    role = db.query(Role).filter(Role.role_code == "WMS_ADMIN").first()

    if not role:
        raise HTTPException(status_code=400, detail="Admin role not found")

    mapping = db.query(UserRole).filter(
        UserRole.user_id == user.user_id,
        UserRole.role_id == role.role_id,
    ).first()

    if not mapping:
        db.add(
            UserRole(
                user_role_id=generate_id("USRROLE", db),
                user_id=user.user_id,
                role_id=role.role_id,
            )
        )
        db.commit()

    return {"msg": "Admin fixed"}
