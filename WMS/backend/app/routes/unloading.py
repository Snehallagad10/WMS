from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from ..db import get_db
from ..models.core import UnloadingDetails, DockAllocation
from ..utils.id_generator import generate_id
from ..dependencies.permissions import require_permission

router = APIRouter(prefix="/unloading", tags=["Unloading"])

@router.post("/", dependencies=[Depends(require_permission("dock.unload.start"))])
def create_unloading(data: dict, db: Session = Depends(get_db)):

    allocation_id = data.get("dock_allocation_id")

    allocation = db.query(DockAllocation).filter(
        DockAllocation.dock_allocation_id == allocation_id
    ).first()

    if not allocation:
        raise HTTPException(status_code=404, detail="Allocation not found")
    
    if allocation.status != "IN_PROGRESS":
        raise HTTPException(status_code=400, detail="Unloading not started yet")
    
    existing = db.query(UnloadingDetails).filter(
        UnloadingDetails.dock_allocation_id == allocation_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Unloading already recorded")
    
    unloading = UnloadingDetails(
        unloading_id = generate_id("UNLOAD", db),
        dock_allocation_id = allocation_id,
        gate_entry_id = allocation.gate_entry_id,
        staging_area = data.get("staging_area"),
        total_cartons = data.get("total_cartons"),
        unloading_by = data.get("unloaded_by"),
        unloading_start = datetime.utcnow()
    )

    db.add(unloading)
    db.commit()
    db.refresh(unloading)

    return {
        "message": "Unloading recorded successfully",
        "unloading_id": unloading.unloading_id
    }