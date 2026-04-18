from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from ..models.core import User, UserRole, Role
from ..db import get_db
from ..core.security import create_access_token, verify_token
from ..utils.id_generator import generate_id

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ===============================
# PASSWORD HELPERS
# ===============================

def hash_password(password: str):
    return pwd_context.hash(password[:72])


def verify_password(plain, hashed):
    return pwd_context.verify(plain[:72], hashed)


# ===============================
# LOGIN (CLEAN & WORKING)
# ===============================
@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):

    username = data.get("username")
    password = data.get("password")

    if not username or not password:   # ✅ FIX (avoid None crash)
        raise HTTPException(status_code=400, detail="Username and password required")

    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 🔥 STATUS LOGIC (UNCHANGED)
    if user.is_locked:
        raise HTTPException(status_code=403, detail="User is locked by admin")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User is inactive")

    if user.force_password_change:
        return {
            "message": "Password reset required",
            "force_reset": True,
            "user_id": user.user_id
        }

    # 🔥 ROLE CHECK (UNCHANGED)
    user_roles = db.query(UserRole).filter(UserRole.user_id == user.user_id).all()
    role_ids = [ur.role_id for ur in user_roles]

    roles = db.query(Role).filter(Role.role_id.in_(role_ids)).all()
    role_codes = [r.role_code.lower() for r in roles]

    if not any(r in ["wms_admin", "supervisor"] for r in role_codes):
        raise HTTPException(status_code=403, detail="Access denied")

    # 🔥 TOKEN (IMPORTANT FIX FOR FRONTEND)
    access_token = create_access_token(data={"sub": user.user_id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.user_id,
        "username": user.username,
        "roles": role_codes
    }


# ===============================
# FIX SUPERVISOR (RUN ONCE)
# ===============================
@router.get("/fix-supervisor")
def fix_supervisor(db: Session = Depends(get_db)):

    user = db.query(User).filter(User.username == "supervisor").first()

    if not user:
        user = User(
            user_id=generate_id("USR", db),
            username="supervisor",
            password_hash=hash_password("super123"),
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    else:
        user.password_hash = hash_password("super123")
        db.commit()

    role = db.query(Role).filter(Role.role_code == "SUPERVISOR").first()

    if not role:   # ✅ SAFETY FIX
        raise HTTPException(status_code=400, detail="Supervisor role not found")

    mapping = db.query(UserRole).filter(
        UserRole.user_id == user.user_id,
        UserRole.role_id == role.role_id
    ).first()

    if not mapping:
        db.add(UserRole(
            user_role_id=generate_id("USRROLE", db),
            user_id=user.user_id,
            role_id=role.role_id
        ))
        db.commit()

    return {"msg": "Supervisor ready"}


# ===============================
# CHANGE PASSWORD
# ===============================
@router.post("/change-password")
def change_password(data: dict, user=Depends(verify_token), db: Session = Depends(get_db)):

    new_password = data.get("new_password")

    if not new_password:
        raise HTTPException(status_code=400, detail="New password required")

    user.password_hash = hash_password(new_password)
    user.force_password_change = False   # ✅ IMPORTANT FIX
    db.commit()

    return {"message": "Password updated"}


# ===============================
# FIX ADMIN
# ===============================
@router.get("/fix-admin")
def fix_admin(db: Session = Depends(get_db)):

    user = db.query(User).filter(User.username == "admin").first()

    if not user:
        user = User(
            user_id=generate_id("USR", db),
            username="admin",
            password_hash=hash_password("admin123"),
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    else:
        user.password_hash = hash_password("admin123")
        db.commit()

    role = db.query(Role).filter(Role.role_code == "WMS_ADMIN").first()

    if not role:   # ✅ SAFETY FIX
        raise HTTPException(status_code=400, detail="Admin role not found")

    mapping = db.query(UserRole).filter(
        UserRole.user_id == user.user_id,
        UserRole.role_id == role.role_id
    ).first()

    if not mapping:
        db.add(UserRole(
            user_role_id=generate_id("USRROLE", db),
            user_id=user.user_id,
            role_id=role.role_id
        ))
        db.commit()

    return {"msg": "Admin fixed"}