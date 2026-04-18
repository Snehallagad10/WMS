from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..models.core import Dock, Warehouse
from ..utils.id_generator import generate_id

router = APIRouter(prefix="/docks", tags=["Docks"])


# ---------------- CREATE DOCK ----------------
@router.post("/")
def create_dock(data: dict, db: Session = Depends(get_db)):
    dock_code = data.get("dock_code")
    warehouse_id = data.get("warehouse_id")

    if not dock_code or not warehouse_id:
        raise HTTPException(
            status_code=400,
            detail="dock_code and warehouse_id required",
        )

    existing = db.query(Dock).filter(Dock.dock_code == dock_code).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Dock already exists",
        )

    warehouse = (
        db.query(Warehouse).filter(Warehouse.warehouse_id == warehouse_id).first()
    )

    if not warehouse:
        raise HTTPException(
            status_code=404,
            detail="Warehouse not found",
        )

    dock = Dock(
        dock_id=generate_id("DOCK", db),
        dock_code=dock_code,
        warehouse_id=warehouse_id,
        status="AVAILABLE",
    )

    db.add(dock)
    db.commit()
    db.refresh(dock)

    return {
        "message": "Dock created successfully",
        "dock_id": dock.dock_id,
    }


# ---------------- LIST DOCKS ----------------
@router.get("/")
def list_docks(db: Session = Depends(get_db)):
    docks = db.query(Dock).all()

    return [
        {
            "dock_id": d.dock_id,
            "dock_code": d.dock_code,
            "warehouse_id": d.warehouse_id,
            "status": d.status,
        }
        for d in docks
    ]


# ---------------- UPDATE DOCK ----------------
@router.put("/{dock_id}")
def update_dock(
    dock_id: str,
    data: dict,
    db: Session = Depends(get_db),
):
    dock = db.query(Dock).filter(Dock.dock_id == dock_id).first()

    if not dock:
        raise HTTPException(
            status_code=404,
            detail="Dock not found",
        )

    if "status" in data:
        dock.status = data["status"]

    db.commit()
    db.refresh(dock)

    return {"message": "Dock Updated Successfully!"}
