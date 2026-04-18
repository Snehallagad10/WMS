from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..models.core import UserRole, RolePermission, Permission
from ..core.security import verify_token

from ..models.core import Role


# ===============================
# GET USER PERMISSIONS FROM JWT
# ===============================
def get_current_user_permissions(
    user = Depends(verify_token),
    db: Session = Depends(get_db)
):

    # Get user roles
    user_roles = db.query(UserRole).filter(
        UserRole.user_id == user.user_id
    ).all()

    if not user_roles:
        raise HTTPException(status_code=403, detail="User has no roles assigned")

    role_ids = [ur.role_id for ur in user_roles]

    # Get role permissions
    role_permissions = db.query(RolePermission).filter(
        RolePermission.role_id.in_(role_ids)
    ).all()

    permission_ids = [rp.permission_id for rp in role_permissions]

    permissions = db.query(Permission).filter(
        Permission.permission_id.in_(permission_ids)
    ).all()

    return [p.permission_code for p in permissions]


# ===============================
# REQUIRE PERMISSION DECORATOR
# ===============================
# def require_permission(permission_code: str):

#     async def permission_checker(
#         permissions: list = Depends(get_current_user_permissions)
#     ):
#         if permission_code not in permissions:
#             raise HTTPException(
#                 status_code=403,
#                 detail=f"Permission `{permission_code}` required"
#             )

#     return permission_checker

def require_permission(permission_code: str):

    async def permission_checker(
        permissions: list = Depends(get_current_user_permissions)
    ):
        if permission_code not in permissions:
            raise HTTPException(
                status_code=403,
                detail=f"Permission `{permission_code}` required"
            )

    return permission_checker



def require_role(allowed_roles: list):

    def role_checker(
        user = Depends(verify_token),
        db: Session = Depends(get_db)
    ):

        user_roles = db.query(UserRole).filter(
            UserRole.user_id == user.user_id
        ).all()

        role_ids = [ur.role_id for ur in user_roles]

        roles = db.query(Role).filter(
            Role.role_id.in_(role_ids)
        ).all()

        role_codes = [r.role_code.lower() for r in roles]

        if not any(role in allowed_roles for role in role_codes):
            raise HTTPException(
                status_code=403,
                detail="Unauthorized role"
            )

        return user

    return role_checker