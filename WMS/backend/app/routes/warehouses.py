# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session

# from ..db import get_db
# from ..models.core import Warehouse
# from ..dependencies.permissions import require_permission
# from ..utils.id_generator import generate_id

# router = APIRouter(prefix="/warehouses", tags=["Warehouses"])


# @router.post("/", dependencies=[Depends(require_permission("warehouse.manage"))])
# def create_warehouse(data: dict, db: Session = Depends(get_db)):

#     existing = db.query(Warehouse).filter(
#         Warehouse.warehouse_code == data.get("warehouse_code")
#     ).first()

#     if existing:
#         raise HTTPException(status_code=400, detail="Warehouse code already exists")

#     warehouse = Warehouse(
#         warehouse_id=generate_id("WH", db),
#         warehouse_code=data.get("warehouse_code"),
#         warehouse_name=data.get("warehouse_name"),
#         status=data.get("status", "ACTIVE"),
#         address_line1=data.get("address_line1") or "",
#         address_line2=data.get("address_line2") or "",
#         city=data.get("city") or "",
#         state=data.get("state") or "",
#         country=data.get("country") or "",
#         postal_code=data.get("postal_code") or "",
#         total_area_sqft=data.get("total_area_sqft")
#     )

#     db.add(warehouse)
#     db.commit()
#     db.refresh(warehouse)

#     return serialize_warehouse(warehouse)


# @router.get("/")
# def list_warehouses(db: Session = Depends(get_db)):
#     warehouses = db.query(Warehouse).all()
#     return [serialize_warehouse(w) for w in warehouses]


# @router.put("/{warehouse_id}", dependencies=[Depends(require_permission("warehouse.manage"))])
# def update_warehouse(warehouse_id: str, data: dict, db: Session = Depends(get_db)):

#     warehouse = db.query(Warehouse).filter(
#         Warehouse.warehouse_id == warehouse_id
#     ).first()

#     if not warehouse:
#         raise HTTPException(status_code=404, detail="Warehouse not found")

#     for field in [
#         "warehouse_name",
#         "status",
#         "address_line1",
#         "address_line2",
#         "city",
#         "state",
#         "country",
#         "postal_code",
#         "total_area_sqft"
#     ]:
#         if field in data:
#             setattr(warehouse, field, data[field] or "")

#     db.commit()
#     db.refresh(warehouse)

#     return serialize_warehouse(warehouse)


# @router.delete("/{warehouse_id}", dependencies=[Depends(require_permission("warehouse.manage"))])
# def delete_warehouse(warehouse_id: str, db: Session = Depends(get_db)):

#     warehouse = db.query(Warehouse).filter(
#         Warehouse.warehouse_id == warehouse_id
#     ).first()

#     if not warehouse:
#         raise HTTPException(status_code=404, detail="Warehouse not found")

#     db.delete(warehouse)
#     db.commit()

#     return {"message": "Warehouse deleted successfully"}


# def serialize_warehouse(w: Warehouse):
#     return {
#         "warehouse_id": w.warehouse_id,
#         "warehouse_code": w.warehouse_code,
#         "warehouse_name": w.warehouse_name,
#         "status": w.status,
#         "address_line1": w.address_line1,
#         "address_line2": w.address_line2,
#         "city": w.city,
#         "state": w.state,
#         "country": w.country,
#         "postal_code": w.postal_code,
#         "total_area_sqft": str(w.total_area_sqft) if w.total_area_sqft else "",
#         "created_at": w.created_at.isoformat() if w.created_at else None
#     }






# Snehal fixed code 


from fastapi import APIRouter, Depends, HTTPException, Body   # ✅ added Body
from sqlalchemy.orm import Session

from ..db import get_db
from ..models.core import Warehouse
from ..dependencies.permissions import require_permission
from ..utils.id_generator import generate_id

router = APIRouter(prefix="/warehouses", tags=["Warehouses"])


# ================= CREATE WAREHOUSE =================
@router.post("/", dependencies=[Depends(require_permission("warehouse.manage"))])
def create_warehouse(
    data: dict = Body(...),   # ✅ FIX: ensure FastAPI reads JSON body correctly
    db: Session = Depends(get_db)
):

    existing = db.query(Warehouse).filter(
        Warehouse.warehouse_code == data.get("warehouse_code")
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Warehouse code already exists")

    warehouse = Warehouse(
        warehouse_id=generate_id("WH", db),
        warehouse_code=data.get("warehouse_code"),
        warehouse_name=data.get("warehouse_name"),
        status=data.get("status", "ACTIVE"),
        address_line1=data.get("address_line1") or "",
        address_line2=data.get("address_line2") or "",
        city=data.get("city") or "",
        state=data.get("state") or "",
        country=data.get("country") or "",
        postal_code=data.get("postal_code") or "",
        # ✅ FIX: convert string to int to avoid DB 500 error
        total_area_sqft=int(data.get("total_area_sqft")) if data.get("total_area_sqft") else None
    )

    db.add(warehouse)
    db.commit()
    db.refresh(warehouse)

    return serialize_warehouse(warehouse)


# ================= LIST WAREHOUSES =================
@router.get("/")
def list_warehouses(db: Session = Depends(get_db)):
    try:
        print("WAREHOUSE HIT")
        data = db.query(Warehouse).all()
        return [serialize_warehouse(w) for w in data]
    except Exception as e:
        print("WAREHOUSE ERROR:", str(e))
        return []


# ================= UPDATE WAREHOUSE =================
@router.put("/{warehouse_id}", dependencies=[Depends(require_permission("warehouse.manage"))])
def update_warehouse(
    warehouse_id: str,
    data: dict = Body(...),   # ✅ FIX: ensure JSON body parsing
    db: Session = Depends(get_db)
):

    warehouse = db.query(Warehouse).filter(
        Warehouse.warehouse_id == warehouse_id
    ).first()

    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    for field in [
        "warehouse_name",
        "status",
        "address_line1",
        "address_line2",
        "city",
        "state",
        "country",
        "postal_code",
        "total_area_sqft"
    ]:
        if field in data:
            value = data[field]

            # ✅ FIX: convert sqft to int safely
            if field == "total_area_sqft" and value:
                value = int(value)

            setattr(warehouse, field, value or "")

    db.commit()
    db.refresh(warehouse)

    return serialize_warehouse(warehouse)


# ================= DELETE WAREHOUSE =================
@router.delete("/{warehouse_id}", dependencies=[Depends(require_permission("warehouse.manage"))])
def delete_warehouse(warehouse_id: str, db: Session = Depends(get_db)):

    warehouse = db.query(Warehouse).filter(
        Warehouse.warehouse_id == warehouse_id
    ).first()

    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    db.delete(warehouse)
    db.commit()

    return {"message": "Warehouse deleted successfully"}


# ================= SERIALIZER =================
def serialize_warehouse(w: Warehouse):
    return {
        "warehouse_id": w.warehouse_id,
        "warehouse_code": w.warehouse_code,
        "warehouse_name": w.warehouse_name,
        "status": w.status,
        "address_line1": w.address_line1,
        "address_line2": w.address_line2,
        "city": w.city,
        "state": w.state,
        "country": w.country,
        "postal_code": w.postal_code,
        "total_area_sqft": str(w.total_area_sqft) if w.total_area_sqft else "",
        "created_at": w.created_at.isoformat() if w.created_at else None
    }
