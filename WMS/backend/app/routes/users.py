# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# import secrets

# from ..db import get_db
# from ..models.core import User, Role, UserRole
# from ..dependencies.permissions import require_permission, require_role
# from ..utils.id_generator import generate_id
# from passlib.context import CryptContext
# from ..models.core import UserWarehouse
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# router = APIRouter(prefix="/users", tags=["Users"])

# def hash_password(password: str):
#     return pwd_context.hash(password[:72])


# # ===============================
# # CREATE USER
# # ===============================
# @router.post("/", dependencies=[Depends(require_permission("user.manage"))])
# def create_user(data: dict, db: Session = Depends(get_db)):

#     user_info = data.get("user_information", {})
#     phone = user_info.get("phone")
#     roles = data.get("assigned_roles", [])

#     username = user_info.get("username")
#     email = user_info.get("email")

#     if not username or not roles:
#         raise HTTPException(status_code=400, detail="username and role_code required")

#     role_code = roles[0].get("role_code")

#     if not role_code:
#         raise HTTPException(status_code=400, detail="role_code required")

#     if not email:
#         raise HTTPException(status_code=400, detail="Email required")

#     existing = db.query(User).filter(User.username == username).first()
#     if existing:
#         raise HTTPException(status_code=400, detail="User already exists")

#     role = db.query(Role).filter(Role.role_code == role_code).first()
#     if not role:
#         raise HTTPException(status_code=400, detail="Invalid role")

#     temp_password = secrets.token_urlsafe(8)

#     user_id = generate_id("USR", db)
#     user_role_id = generate_id("USRROLE", db)
#     new_user = User(
#     user_id=user_id,
#     username=username,
#     email=email,
#     phone=phone,   # ✅ ADDED
#     password_hash=hash_password(temp_password),
#     force_password_change=True,
#     is_active=True
# )

#     user_role = UserRole(
#     user_role_id=user_role_id,
#     user_id=user_id,
#     role_id=role.role_id
# )

# # ✅ ADD USER + ROLE
#     db.add(new_user)
#     db.add(user_role)

# # 🔥 SAVE WAREHOUSES
#     warehouses = data.get("assigned_warehouses", [])

#     for wh in warehouses:
#         user_wh = UserWarehouse(
#         user_id=user_id,
#         warehouse_id=wh.get("warehouse_id")
#     )
#     db.add(user_wh)

# # ✅ COMMIT ONCE (IMPORTANT)
#     db.commit()

# # ✅ REFRESH AFTER COMMIT
#     db.refresh(new_user)

#     return {
#     "message": "User created",
#     "username": username,
#     "temporary_password": temp_password
# }

# # ===============================
# # LIST USERS
# # ===============================
# @router.get("/")
# def list_users(
#     db: Session = Depends(get_db),
#     user = Depends(require_role(["wms_admin"]))
# ):

#     users = (
#         db.query(User, Role)
#         .join(UserRole, User.user_id == UserRole.user_id)
#         .join(Role, Role.role_id == UserRole.role_id)
#         .all()
#     )

#     return [
#        {
#     "user_id": u.User.user_id,
#     "username": u.User.username,
#     "email": u.User.email,
#     "phone": u.User.phone,   # ✅ ADD THIS

#     "role_name": u.Role.role_name,
#     "is_active": u.User.is_active,

#     # ✅ ADD THIS
#     "warehouse_ids": [
#         uw.warehouse_id
#         for uw in db.query(UserWarehouse)
#         .filter(UserWarehouse.user_id == u.User.user_id)
#         .all()
#     ]
# }
#         for u in users
#         if u.Role.role_code not in ["wms_admin", "supervisor"]
#     ]


# # ===============================
# # GET ROLES
# # ===============================
# @router.get("/roles")
# def get_roles(db: Session = Depends(get_db)):

#     roles = db.query(Role).all()

#     return [
#         {
#             "role_id": r.role_id,
#             "role_name": r.role_name,
#             "role_code": r.role_code
#         }
#         for r in roles
#     ]
# @router.put("/{user_id}", dependencies=[Depends(require_permission("user.manage"))])
# def update_user(user_id: str, data: dict, db: Session = Depends(get_db)):

#     # =========================
#     # FETCH USER
#     # =========================
#     user: User | None = db.query(User).filter(User.user_id == user_id).first()

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     user_info = data.get("user_information", {})
#     roles = data.get("assigned_roles", [])
#     warehouses = data.get("assigned_warehouses", [])

#     # =========================
#     # UPDATE BASIC INFO
#     # =========================
#     user.username = user_info.get("username", user.username)
#     user.email = user_info.get("email", user.email)
#     user.phone = user_info.get("phone", user.phone)

#     # =========================
#     # STATUS LOGIC
#     # =========================
#     status = user_info.get("status")

#     if status == "active":
#         user.is_active = True
#         user.is_locked = False
#         user.force_password_change = False

#     elif status == "locked":
#         user.is_locked = True

#     elif status == "reset":
#         temp_password = secrets.token_urlsafe(8)
#         user.password_hash = hash_password(temp_password)
#         user.force_password_change = True
#     # =========================
#     # UPDATE ROLE
#     # =========================
#     if roles:
#         role_code = roles[0].get("role_code")

#         role = db.query(Role).filter(Role.role_code == role_code).first()
#         if not role:
#             raise HTTPException(status_code=400, detail="Invalid role")

#         db.query(UserRole).filter(UserRole.user_id == user_id).delete()

#         db.add(UserRole(
#             user_role_id=generate_id("USRROLE", db),
#             user_id=user_id,
#             role_id=role.role_id
#         ))

#     # =========================
#     # UPDATE WAREHOUSES
#     # =========================
#     db.query(UserWarehouse).filter(UserWarehouse.user_id == user_id).delete()

#     for wh in warehouses:
#         user_wh = UserWarehouse(
#         user_id=user_id,
#         warehouse_id=wh.get("warehouse_id")
#     )
#     db.add(user_wh)   # ✅ INSIDE LOOP

#     # =========================
#     # SAVE
#     # =========================
#     db.commit()
#     db.refresh(user)
#     return {"message": "User updated successfully"}


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import secrets

from ..db import get_db
from ..models.core import User, Role, UserRole, UserWarehouse
from ..dependencies.permissions import require_permission, require_role
from ..utils.id_generator import generate_id
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/users", tags=["Users"])


def hash_password(password: str):
    return pwd_context.hash(password[:72])


# ===============================
# CREATE USER
# ===============================
@router.post("/", dependencies=[Depends(require_permission("user.manage"))])
def create_user(data: dict, db: Session = Depends(get_db)):

    user_info = data.get("user_information", {})
    phone = user_info.get("phone")
    roles = data.get("assigned_roles", [])

    username = user_info.get("username")
    email = user_info.get("email")

    if not username or not roles:
        raise HTTPException(status_code=400, detail="username and role_code required")

    role_code = roles[0].get("role_code")

    if not role_code:
        raise HTTPException(status_code=400, detail="role_code required")

    if not email:
        raise HTTPException(status_code=400, detail="Email required")

    existing = db.query(User).filter(User.username == username).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    role = db.query(Role).filter(Role.role_code == role_code).first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role")

    temp_password = secrets.token_urlsafe(8)

    user_id = generate_id("USR", db)
    user_role_id = generate_id("USRROLE", db)
    is_privileged = role.role_code in ["wms_admin", "supervisor"]

    new_user = User(
        user_id=user_id,
        username=username,
        email=email,
        phone=phone,
        password_hash=hash_password(temp_password),
        force_password_change=not is_privileged,  # ✅ FIX
        is_active=True,
    )

    user_role = UserRole(
        user_role_id=user_role_id, user_id=user_id, role_id=role.role_id
    )

    # ADD USER + ROLE
    db.add(new_user)
    db.add(user_role)

    # SAVE WAREHOUSES
    warehouses = data.get("assigned_warehouses", [])

    for wh in warehouses:
        db.add(UserWarehouse(user_id=user_id, warehouse_id=wh.get("warehouse_id")))

    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created",
        "username": username,
        "temporary_password": temp_password,
    }


# ===============================
# LIST USERS
# ===============================
@router.get("/")
def list_users(
    db: Session = Depends(get_db), user=Depends(require_role(["wms_admin"]))
):

    users = (
        db.query(User, Role)
        .join(UserRole, User.user_id == UserRole.user_id)
        .join(Role, Role.role_id == UserRole.role_id)
        .all()
    )

    return [
        {
            "user_id": u.User.user_id,
            "username": u.User.username,
            "email": u.User.email,
            "phone": u.User.phone,
            "role_name": u.Role.role_name,
            # 🔥 IMPORTANT FIX (your issue)
            "is_active": u.User.is_active,
            "is_locked": u.User.is_locked,
            "force_password_change": u.User.force_password_change,
            "warehouse_ids": [
                uw.warehouse_id
                for uw in db.query(UserWarehouse)
                .filter(UserWarehouse.user_id == u.User.user_id)
                .all()
            ],
        }
        for u in users
        if u.Role.role_code not in ["wms_admin", "supervisor"]
    ]


# ===============================
# GET ROLES
# ===============================
@router.get("/roles")
def get_roles(db: Session = Depends(get_db)):

    roles = db.query(Role).all()

    return [
        {"role_id": r.role_id, "role_name": r.role_name, "role_code": r.role_code}
        for r in roles
    ]


# ===============================
# UPDATE USER
# ===============================
@router.put("/{user_id}", dependencies=[Depends(require_permission("user.manage"))])
def update_user(user_id: str, data: dict, db: Session = Depends(get_db)):

    # FETCH USER
    user: User | None = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_info = data.get("user_information", {})
    roles = data.get("assigned_roles", [])
    warehouses = data.get("assigned_warehouses", [])

    # UPDATE BASIC INFO
    user.username = user_info.get("username", user.username)
    user.email = user_info.get("email", user.email)
    user.phone = user_info.get("phone", user.phone)

    # ✅ ADD THIS BLOCK
    password = user_info.get("password")
    if password:
        user.password_hash = hash_password(password)
        user.force_password_change = False

    # STATUS LOGIC
    # =========================
    # STATUS LOGIC
    # =========================
    status = user_info.get("status")

    if status == "active":
        user.is_active = True
        user.is_locked = False
        user.force_password_change = False

    elif status == "locked":
        user.is_active = True
        user.is_locked = True
        user.force_password_change = False

    elif status == "reset":
        user.is_active = True
        user.is_locked = False
        user.force_password_change = True

    # =========================
    # UPDATE ROLE
    # =========================
    if roles:
        role_code = roles[0].get("role_code")

        role = db.query(Role).filter(Role.role_code == role_code).first()
        if not role:
            raise HTTPException(status_code=400, detail="Invalid role")

        db.query(UserRole).filter(UserRole.user_id == user_id).delete()

        db.add(
            UserRole(
                user_role_id=generate_id("USRROLE", db),
                user_id=user_id,
                role_id=role.role_id,
            )
        )

    # =========================
    # UPDATE WAREHOUSES
    # =========================
    db.query(UserWarehouse).filter(UserWarehouse.user_id == user_id).delete()

    for wh in warehouses:
        db.add(UserWarehouse(user_id=user_id, warehouse_id=wh.get("warehouse_id")))

    # =========================
    # SAVE
    # =========================
    db.commit()
    db.refresh(user)

    return {"message": "User updated successfully"}


# ===============================
# DELETE USER
# ===============================
@router.delete("/{user_id}", dependencies=[Depends(require_permission("user.manage"))])
def delete_user(user_id: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 🔥 DELETE RELATED DATA FIRST
    db.query(UserRole).filter(UserRole.user_id == user_id).delete()
    db.query(UserWarehouse).filter(UserWarehouse.user_id == user_id).delete()

    # 🔥 DELETE USER
    db.delete(user)

    db.commit()

    return {"message": "User deleted successfully"}
