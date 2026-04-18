from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..db import get_db
from ..models.core import Permission

router = APIRouter(prefix="/permissions", tags=["Permissions"])


@router.get("/")
def get_permissions(db: Session = Depends(get_db)):

    permissions = db.query(Permission).all()

    return [
        {
            "permission_id": p.permission_id,
            "module": p.module,
            "action": p.action,
            "permission_code": p.permission_code,
        }
        for p in permissions
    ]
