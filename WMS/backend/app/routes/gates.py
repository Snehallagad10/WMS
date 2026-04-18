from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..models.core import SecurityGate, Warehouse
from ..dependencies.permissions import require_permission
from ..utils.id_generator import generate_id

router = APIRouter(prefix="/gates", tags=["Security Gates"])


# Create Gate

@router.post("", dependencies=[Depends(require_permission("gate.create"))])
def create_gate(data: dict, db: Session = Depends(get_db)):
    warehouse_code = data.get("warehouse_code")
    gate_code = data.get("gate_code")
    gate_name = data.get("gate_name")
    gate_type = data.get("gate_type")

    if not warehouse_code or not gate_code:
        raise HTTPException(status_code=400, detail="warehouse_code and gate_code are required")
    
    warehouse = db.query(Warehouse).filter(
        Warehouse.warehouse_code == warehouse_code
    ).first()

    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    
    existing_gate = db.query(SecurityGate).filter(
        SecurityGate.gate_code == gate_code
    ).first()

    if existing_gate:
        raise HTTPException(status_code=400, detail="Gate code already exists")
    
    gate = SecurityGate(
        gate_id=generate_id("GATE", db),
        warehouse_id=warehouse.warehouse_id,
        gate_code=gate_code,
        gate_name=gate_name,
        gate_type=gate_type
    )

    db.add(gate)
    db.commit()
    db.refresh(gate)

    return {
        "message": "Gate created successfully",
        "gate_id": gate.gate_id,
        "gate_code": gate.gate_code
    }

# List Gates
@router.get("/")
def list_gates(warehouse_id: str = None, db: Session = Depends(get_db)):
    query = db.query(SecurityGate)

    if warehouse_id:
        query = query.filter(SecurityGate.warehouse_id == warehouse_id)

    gates = query.all()

    return [
        {
            "gate_id": g.gate_id,
            "gate_name": g.gate_name,
            "warehouse_id": g.warehouse_id
        }
        for g in gates
    ]