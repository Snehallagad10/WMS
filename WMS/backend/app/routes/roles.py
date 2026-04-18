from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..models.core import Role, Permission, RolePermission
from ..dependencies.permissions import require_permission
from ..utils.id_generator import generate_id

router = APIRouter(prefix="/roles", tags=["Roles"])


# =============================
# GET ALL ROLES
# =============================
@router.get("/")
def list_roles(db: Session = Depends(get_db)):

    roles = db.query(Role).all()

    print("ROLES IN DATABASE:")
    for r in roles:
        print(r.role_id, r.role_name)

    return [
        {
            "role_id": r.role_id,
            "role_code": r.role_code,
            "role_name": r.role_name
        }
        for r in roles
    ]


# =============================
# CREATE ROLE WITH PERMISSIONS
# =============================
@router.post("/", dependencies=[Depends(require_permission("role.manage"))])
def create_role(data: dict, db: Session = Depends(get_db)):

    role_name = data.get("role_name")

    if not role_name:
        raise HTTPException(status_code=400, detail="role_name required")

    role_code = role_name.upper().replace(" ", "_")

    existing = db.query(Role).filter(Role.role_code == role_code).first()

    if existing:
        raise HTTPException(status_code=400, detail="Role already exists")

    role = Role(
        role_id=generate_id("Role", db),
        role_code=role_code,
        role_name=role_name,
        is_system=False
    )

    db.add(role)
    db.commit()
    db.refresh(role)

    return {
        "message": "Role created sucessfully",
        "role_id": role.role_id
    }

    # # assign permissions
    # for p in permissions:

    #     permission = db.query(Permission).filter(
    #         Permission.permission_code == p
    #     ).first()

    #     if permission:

    #         role_permission = RolePermission(
    #             role_id=role.role_id,
    #             permission_id=permission.permission_id
    #         )

    #         db.add(role_permission)

    # db.commit()

    # return {
    #     "message": "Role created successfully",
    #     "role_id": role.role_id
    # }

# Update Role
@router.put("/{role_id}", dependencies=[Depends(require_permission("role.manage"))])
def update_role(role_id: str, data: dict, db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.role_id == role_id).first()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    if role.is_system:
        raise HTTPException(status_code=400, detail="System roles cannot be modified")
    
    role.role_name = data.get("role_name", role.role_name)

    db.commit()

    return {"message": "Role updated successfully"}

# =============================
# ASSIGN PERMISSIONS  ✅ FIXED
# =============================
# @router.post("/assign-permissions")
# def assign_permissions(data: dict, db: Session = Depends(get_db)):

#     role_code = data.get("role_code")   # ✅ FIX
#     permissions = data.get("permissions", [])

#     role = db.query(Role).filter(Role.role_code == role_code).first()  # ✅ FIX

#     if not role:
#         raise HTTPException(status_code=404, detail="Role not found")

#     # ✅ CLEAR OLD PERMISSIONS
#     db.query(RolePermission).filter(
#         RolePermission.role_id == role.role_id
#     ).delete()

#     for perm_code in permissions:

#         perm = db.query(Permission).filter(
#             Permission.permission_code == perm_code
#         ).first()

#         if not perm:
#             continue

#         rp = RolePermission(
#             role_id=role.role_id,
#             permission_id=perm.permission_id
#         )

#         db.add(rp)

#     db.commit()

#     return {"message": "Permissions assigned successfully"}

# =============================
# DELETE ROLE  ✅ FIXED
# =============================

@router.delete("/{role_id}")
def clear_role_permissions(role_id: str, db: Session = Depends(get_db)):

    role = db.query(Role).filter(Role.role_id == role_id).first()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    # 🔥 ONLY DELETE PERMISSIONS
    db.query(RolePermission).filter(
        RolePermission.role_id == role_id
    ).delete()

    db.commit()

    return {"message": "Permissions cleared, role kept"}

# Get Role Permissions
@router.get("/{role_id}/permissions", dependencies=[Depends(require_permission("role.manage"))])
def get_role_permissions(role_id: str, db: Session = Depends(get_db)):

    role = db.query(Role).filter(Role.role_id == role_id).first()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    mappings = db.query(RolePermission).filter(RolePermission.role_id == role_id).all()

    permission_ids = [m.permission_id for m in mappings]

    permissions = db.query(Permission).filter(Permission.permission_id.in_(permission_ids)).all()

    return [p.permission_code for p in permissions]

# Update Role Permissions (Admin Control)
@router.put("/{role_id}/permissions", dependencies=[Depends(require_permission("role.manage"))])
def update_role_permissions(role_id: str, data: dict, db: Session = Depends(get_db)):
    
    permission_codes = data.get("permissions", [])

    role = db.query(Role).filter(Role.role_id == role_id).first()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    # Clear old permissions
    db.query(RolePermission).filter(
        RolePermission.role_id == role_id
    ).delete()

    for code in permission_codes:

        perm = db.query(Permission).filter(Permission.permission_code == code).first()

        if not perm:
            raise HTTPException(status_code=400, detail=f"Invalid Permission: {code}")
        
        mapping = RolePermission(
            role_id=role_id, 
            permission_id=perm.permission_id
        )

        db.add(mapping)
    db.commit()

    return {"message": "Role permissions updated successfully"}


# =============================
# SETUP DEFAULT ROLES  ✅ FIXED
# =============================
@router.post("/setup-default-roles", dependencies=[Depends(require_permission("role.manage"))])
def setup_default_roles(db: Session = Depends(get_db)):

    default_roles = [
        {"code": "SECURITY", "name": "Security"},            # ✅ FIX
        {"code": "WAREHOUSE_EXEC", "name": "Warehouse Executive"},
        {"code": "QC_EXEC", "name": "QC Executive"},
        {"code": "SUPERVISOR", "name": "Supervisor"},
        {"code": "WMS_ADMIN", "name": "WMS Admin"}
    ]

    created = []

    for r in default_roles:

        existing = db.query(Role).filter(Role.role_code == r["code"]).first()

        if not existing:

            role = Role(
                role_id=generate_id("ROLE", db),
                role_code=r["code"],
                role_name=r["name"],
                is_system=True
            )

            db.add(role)
            created.append(r["name"])

    db.commit()

    return {
        "message": "Default roles setup complete",
        "created_roles": created
    }

@router.get("/with-permissions")
def get_roles_with_permissions(db: Session = Depends(get_db)):
    roles = db.query(Role).all()

    result = []
    for role in roles:
        permissions = (
            db.query(Permission.permission_code)
            .join(RolePermission, Permission.permission_id == RolePermission.permission_id)
            .filter(RolePermission.role_id == role.role_id)
            .all()
        )

        result.append({
            "role": role.role_name,
            "role_code": role.role_code,
            "permissions": [p[0] for p in permissions]
        })

    return result