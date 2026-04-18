from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from ..db import get_db
from ..models.core import DockAllocation, Dock, GateEntry
from ..utils.id_generator import generate_id
from ..dependencies.permissions import require_permission

router = APIRouter(prefix="/dock-allocation", tags=["Dock Allocation"])


# Allocate Dock
@router.post("/", dependencies=[Depends(require_permission("dock.allocate"))])
def allocate_dock(data: dict, db: Session = Depends(get_db)):
    gate_entry_id = data.get("gate_entry_id")
    dock_id = data.get("dock_id")

    if not gate_entry_id or not dock_id:
        raise HTTPException(
            status_code=400, detail="gate_entry_id and dock_id requrired"
        )

    # Validate Gate Entry
    gate_entry = (
        db.query(GateEntry).filter(GateEntry.gate_entry_id == gate_entry_id).first()
    )

    if not gate_entry:
        raise HTTPException(status_code=404, detail="Gate entry not found")

    # Validate Dock
    dock = db.query(Dock).filter(Dock.dock_id == dock_id).first()

    if not dock:
        raise HTTPException(status_code=404, detail="Dock not found")

    if dock.status != "AVAILABLE":
        raise HTTPException(status_code=400, detail="Dock is not available")

    allocation = DockAllocation(
        dock_allocation_id=generate_id("DOCK_ALLOC", db),
        gate_entry_id=gate_entry_id,
        dock_id=dock_id,
        status="ASSIGNED",
        assigned_time=datetime.utcnow(),
    )

    # Mark Dock Occupied
    dock.status = "OCCUPIED"

    db.add(allocation)
    db.commit()
    db.refresh(allocation)

    return {
        "message": "Dock allocated successfully!",
        "dock_allocation_id": "allocation.dock_allocation_id",
    }


# Start Unloading
@router.post(
    "/{allocation_id}/start",
    dependencies=[Depends(require_permission("dock.unload.start"))],
)
def start_unloading(allocation_id: str, db: Session = Depends(get_db)):
    allocation = (
        db.query(DockAllocation)
        .filter(DockAllocation.dock_allocation_id == allocation_id)
        .first()
    )

    if not allocation:
        raise HTTPException(status_code=404, detail="Allocation not found")

    allocation.status = "IN_PROGRESS"
    allocation.unloading_start_time = datetime.utcnow()

    db.commit()

    return {"message": "Unloading Started"}


# Complete Unloading
@router.put(
    "/{allocation_id}/complete",
    dependencies=[Depends(require_permission("dock.unload.complete"))],
)
def complete_unloading(allocation_id: str, db: Session = Depends(get_db)):
    allocation = (
        db.query(DockAllocation)
        .filter(DockAllocation.dock_allcoation_id == allocation_id)
        .first()
    )

    if not allocation:
        raise HTTPException(status_code=404, detail=" Allocation not found")

    allocation.status = "COMPLETED"
    allocation.unloading_end_time = datetime.utcnow()

    # Free Dock
    dock = db.query(Dock).filter(Dock.dock_id == allocation.dock_id).first()
    if dock:
        dock.status = "AVAILABLE"

    db.commit()

    return {"message": "Unloading Completed"}


# GET ALL DOCK ALLOCATIONS
@router.get("/")
def get_dock_allocations(db: Session = Depends(get_db)):
    allocations = db.query(DockAllocation).all()

    result = []

    for allocation in allocations:
        gate_entry = (
            db.query(GateEntry)
            .filter(GateEntry.gate_entry_id == allocation.gate_entry_id)
            .first()
        )

        dock = db.query(Dock).filter(Dock.dock_id == allocation.dock_id).first()

        result.append(
            {
                "gate_entry_id": allocation.gate_entry_id,
                "vehicle_number": gate_entry.vehicle_number if gate_entry else "",
                "dock_number": dock.dock_name if dock else allocation.dock_id,
                "assigned_by": "System",
                "status": allocation.status or "pending",
                "assigned_time": allocation.assigned_time,
            }
        )

    return result
