# # from fastapi import APIRouter, Depends, HTTPException, Header, Request
# # from sqlalchemy.orm import Session
# # from datetime import datetime


# # from ..db import get_db
# # from ..models.core import GateEntry, SecurityGate, Warehouse, User, GateMaterialDetial, GateDocument, GateVehicleInspection, GateEntryPhoto
# # from ..dependencies.permissions import require_permission
# # from ..utils.id_generator import generate_id
# # from ..dependencies.permissions import require_role
# # from ..core.security import verify_token

# # router = APIRouter(prefix="/gate-entries", tags=["Gate Entries"])

# # # Can't edit after approval
# # def ensure_not_approved(entry: GateEntry):
# #     if entry.is_approved:
# #         raise HTTPException(status_code=400, detail="Approved gate entry cannot be modified")

# # router = APIRouter(prefix="/gate-entries", tags=["Gate Entries"])

# # # Create Gate Entry

# # @router.post("/")
# # async def create_gate_entry(request: Request, db: Session = Depends(get_db)):

# #     data = await request.json()

# #     warehouse_id = data.get("warehouse_id")
# #     gate_id = data.get("gate_id")
# #     entry_type = data.get("entry_type")
# #     movement_type = data.get("movement_type")
# #     recorded_by = data.get("recorded_by")

# #     # Validate required fields
# #     if not warehouse_id or not gate_id or not entry_type or not movement_type:
# #         raise HTTPException(status_code=400, detail="Required fields missing")

# #     # Validate Warehouse
# #     warehouse = db.query(Warehouse).filter(
# #         Warehouse.warehouse_id == warehouse_id
# #     ).first()

# #     if not warehouse:
# #         raise HTTPException(status_code=404, detail="Warehouse not found")

# #     # Validate Gate
# #     gate = db.query(SecurityGate).filter(
# #         SecurityGate.gate_id == gate_id
# #     ).first()

# #     if not gate:
# #         raise HTTPException(status_code=404, detail="Gate not found")

# #     # Validate User
# #     if recorded_by:
# #         user = db.query(User).filter(
# #             User.user_id == recorded_by
# #         ).first()

# #         if not user:
# #             raise HTTPException(status_code=404, detail="Recorded user not found")

# #     entry = GateEntry(
# #         gate_entry_id=generate_id("GE", db),
# #         warehouse_id=warehouse_id,
# #         gate_id=gate_id,
# #         entry_type=entry_type,
# #         movement_type=movement_type,
# #         reference_no=data.get("reference_no"),
# #         vehicle_number=data.get("vehicle_number"),
# #         driver_name=data.get("driver_name"),
# #         driver_phone=data.get("driver_phone"),
# #         person_name=data.get("person_name"),
# #         company_name=data.get("company_name"),
# #         entry_time=datetime.utcnow(),
# #         recorded_by=recorded_by
# #     )

# #     db.add(entry)
# #     db.commit()

# #     db.refresh(entry)

# #     return {
# #         "message": "Gate entry created successfully",
# #         "gate_entry_id": entry.gate_entry_id
# #     }
# # # List Gate Entries


# # @router.get("/")
# # def list_gate_entries(db: Session = Depends(get_db)):

# #     entries = (
# #         db.query(GateEntry, Warehouse, SecurityGate)
# #         .join(Warehouse, GateEntry.warehouse_id == Warehouse.warehouse_id)
# #         .join(SecurityGate, GateEntry.gate_id == SecurityGate.gate_id)
# #         .all()
# #     )

# #     return [
# #         {
# #             "gate_entry_id": entry.gate_entry_id,
# #             "warehouse_name": warehouse.warehouse_name,
# #             "gate_name": gate.gate_name,
# #             "entry_type": entry.entry_type,
# #             "movement_type": entry.movement_type,
# #             "entry_time": entry.entry_time,
# #             "exit_time": entry.exit_time
# #         }
# #         for entry, warehouse, gate in entries
# #     ]

# # # Exit Gate Entry
# # @router.put("/{gate_entry_id}/exit", dependencies=[Depends(require_permission("gate.update"))])
# # def exit_gate_entry(gate_entry_id: str, db: Session = Depends(get_db)):
# #     entry = db.query(GateEntry).filter(
# #         GateEntry.gate_entry_id == gate_entry_id
# #     ).first()

# #     if not entry:
# #         raise HTTPException(status_code=404, detail="Gate entry not found")

# #     ensure_not_approved(entry)
# #     if entry.exit_time is not None:
# #         raise HTTPException(status_code=400, detail="Exit already recorded")

# #     entry.exit_time = datetime.utcnow()
# #     entry.movement_type = "EXIT"

# #     db.commit()
# #     db.refresh(entry)

# #     return {
# #         "message": "Exit recorded successfully",
# #         "gate_entry_id": entry.gate_entry_id,
# #         "exit_time": entry.exit_time
# #     }

# # # Add Material to Gate Entry
# # @router.post("/{gate_entry_id}/materials", dependencies=[Depends(require_permission("gate.update"))])
# # def add_material(gate_entry_id: str, data: dict, db: Session = Depends(get_db)):
# #     entry = db.query(GateEntry).filter(
# #         GateEntry.gate_entry_id == gate_entry_id
# #     ).first()

# #     if not entry:
# #         raise HTTPException(status_code=404, detail="Gate entry not found")

# #     ensure_not_approved(entry)

# #     material = GateMaterialDetial(
# #         id=generate_id("GMAT", db),
# #         gate_entry_id=gate_entry_id,
# #         sku_code=data.get("sku_code"),
# #         description=data.get("description"),
# #         quantity=data.get("quantity"),
# #         uom=data.get("uom")
# #     )

# #     db.add(material)
# #     db.commit()
# #     db.refresh(material)

# #     return {
# #         "message": "Material added successfully",
# #         "material_id": material.id
# #     }

# # # List Materials for Entry
# # @router.get("/{gate_entry_id}/materials", dependencies=[Depends(require_permission("gate.view"))])
# # def list_materials(gate_entry_id: str, db: Session = Depends(get_db)):
# #     materials = db.query(GateMaterialDetial).filter(
# #         GateMaterialDetial.gate_entry_id == gate_entry_id
# #     ).all()

# #     return [
# #         {
# #             "id": m.id,
# #             "sku_code": m.sku_code,
# #             "description": m.description,
# #            "quantity": m.quantity,
# #             "uom": m.uom
# #         }
# #         for m in materials
# #     ]

# # # Add Document to Gate Entry
# # @router.post("/{gate_entry_id}/documents")
# # def add_document(gate_entry_id: str, data: dict, db: Session = Depends(get_db)):
# #     entry = db.query(GateEntry).filter(
# #         GateEntry.gate_entry_id == gate_entry_id
# #     ).first()

# #     if not entry:
# #         raise HTTPException(status_code=404, detail="Gate entry not found")

# #     ensure_not_approved(entry)

# #     document = GateDocument(
# #         id=generate_id("GDOC", db),
# #         gate_entry_id=gate_entry_id,
# #         document_type=data.get("document_type"),
# #         document_number=data.get("document_number"),
# #         document_url=data.get("document_url")
# #     )

# #     db.add(document)
# #     db.commit()
# #     db.refresh(document)

# #     return {
# #         "message": "Document added successfully",
# #         "document_id": document.id
# #     }

# # # List Documents for Entry
# # @router.get("/{gate_entry_id}/documents")
# # def list_documents(gate_entry_id: str, db: Session = Depends(get_db)):
# #     documents = db.query(GateDocument).filter(
# #         GateDocument.gate_entry_id == gate_entry_id
# #     ).all()

# #     return [
# #         {
# #             "id": d.id,
# #             "document_type": d.document_type,
# #             "document_number": d.document_number,
# #             "document_url": d.document_url,
# #             "created_at": d.created_at
# #         }
# #         for d in documents
# #     ]

# # # Add Update Vehicle Inspection
# # @router.post("/{gate_entry_id}/inspection")
# # def add_inspection(gate_entry_id: str, data: dict, db: Session = Depends(get_db)):
# #     entry = db.query(GateEntry).filter(
# #         GateEntry.gate_entry_id == gate_entry_id
# #     ).first()


# #     if not entry:
# #         raise HTTPException(status_code=404, detail="Gate entry not found")

# #     existing_inspection = db.query(GateVehicleInspection).filter(
# #         GateVehicleInspection.gate_entry_id == gate_entry_id
# #     ).first()

# #     if existing_inspection:
# #         raise HTTPException(status_code=400, detail="Inspection already exists")

# #     ensure_not_approved(entry)

# #     inspection = GateVehicleInspection(
# #         id=generate_id("GINSP", db),
# #         gate_entry_id=gate_entry_id,
# #         vehicle_condition_ok=data.get("vehicle_condition_ok"),
# #         seal_number=data.get("seal_number"),
# #         seal_intact=data.get("seal_intact"),
# #         temperature_ok=data.get("temperature_ok"),
# #         inspected_by=data.get("inspected_by")
# #     )

# #     db.add(inspection)
# #     db.commit()
# #     db.refresh(inspection)

# #     return {
# #         "message": "Inspection recorded successfully",
# #         "inspection_id": inspection.id
# #     }

# # # Get Inspection
# # @router.get("/{gate_entry_id}/inspection")
# # def get_inspection(gate_entry_id: str, db: Session = Depends(get_db)):
# #     inspection = db.query(GateVehicleInspection).filter(
# #         GateVehicleInspection.gate_entry_id == gate_entry_id
# #     ).first()

# #     if not inspection:
# #         raise HTTPException(status_code=404, detail="Inspection not found")

# #     return {
# #         "inspection_id": inspection.id,
# #         "vehicle_condition_ok": inspection.vehicle_condition_ok,
# #         "seal_number": inspection.seal_number,
# #         "seal_intact": inspection.seal_intact,
# #         "temperature_ok": inspection.temperature_ok,
# #         "inspected_by": inspection.inspected_by,
# #         "inspected_at": inspection.inspected_at
# #     }

# # # Add Photo
# # @router.post("/{gate_entry_id}/photos")
# # def add_photo(gate_entry_id: str, data: dict, db: Session = Depends(get_db)):
# #     entry = db.query(GateEntry).filter(
# #         GateEntry.gate_entry_id == gate_entry_id
# #     ).first()

# #     if not entry:
# #         raise HTTPException(status_code=404, detail="Gate entry not found")

# #     photo = GateEntryPhoto(
# #         id=generate_id("GPHOTO", db),
# #         gate_entry_id=gate_entry_id,
# #         photo_type=data.get("photo_type"),
# #         photo_url=data.get("photo_url")
# #     )

# #     db.add(photo)
# #     db.commit()
# #     db.refresh(photo)

# #     return {
# #         "message": "Photo added successfully",
# #         "photo_id": photo.id
# #     }

# # # List Photos
# # @router.get("/{gate_entry_id}/photos")
# # def list_photos(gate_entry_id: str, db: Session = Depends(get_db)):
# #     photos = db.query(GateEntryPhoto).filter(
# #         GateEntryPhoto.gate_entry_id == gate_entry_id
# #     ).all()

# #     return [
# #         {
# #             "id": p.id,
# #             "photo_type": p.photo_type,
# #             "photo_url": p.photo_url,
# #             "captured_at": p.captured_at
# #         }
# #         for p in photos
# #     ]

# # # Approval

# # @router.put("/{gate_entry_id}/approve", dependencies=[Depends(require_permission("gate.approve"))])
# # def approve_gate_entry(gate_entry_id: str, x_user_id: str = Header(None), db: Session = Depends(get_db)):
# #     entry = db.query(GateEntry).filter(
# #         GateEntry.gate_entry_id == gate_entry_id
# #     ).first()

# #     if not entry:
# #         raise HTTPException(status_code=404, detail="Gate entry not found.")

# #     if  not entry.exit_time:
# #         raise HTTPException(
# #             status_code=300,
# #             detail="Cannot approve before exit is recorded"
# #         )

# #     if entry.is_approved:
# #         raise HTTPException(status_code=400, detail="Gate entry already approved")

# #     entry.is_approved = True
# #     entry.approved_by = x_user_id
# #     entry.approved_at = datetime.utcnow()

# #     db.commit()
# #     db.refresh(entry)

# #     return {
# #         "message": "Gate entry approved successfully",
# #         "gate_entry_id": entry.gate_entry_id,
# #         "approved_at": entry.approved_at
# #     }


# # @router.post("/")
# # def create_entry(data: dict, user = Depends(require_role(["wms_admin"])), db: Session = Depends(get_db)):

# #     entry = GateEntry(
# #         gate_entry_id = generate_id("GE", db),
# #         warehouse_id = data["warehouse_id"],
# #         gate_id = data["gate_id"],
# #         entry_type = data["entry_type"],
# #         movement_type = data["movement_type"],
# #         entry_time = datetime.utcnow(),
# #         recorded_by = user.user_id,
# #         status = "pending"
# #     )

# #     db.add(entry)
# #     db.commit()

# #     return {"msg": "Entry created"}


# # @router.get("/")
# # def get_entries(user = Depends(require_role(["wms_admin", "supervisor"])), db: Session = Depends(get_db)):

# #     entries = db.query(GateEntry).all()
# #     return entries

# # @router.put("/{entry_id}/approve")
# # def approve_entry(entry_id: str, user = Depends(require_role(["supervisor"])), db: Session = Depends(get_db)):

# #     entry = db.query(GateEntry).filter(GateEntry.gate_entry_id == entry_id).first()

# #     if not entry:
# #         raise HTTPException(status_code=404, detail="Entry not found")

# #     entry.status = "approved"
# #     entry.approved_by = user.user_id
# #     entry.approved_at = datetime.utcnow()

# #     db.commit()

# #     return {"msg": "Approved"}


# # @router.put("/approve/{entry_id}")
# # def approve_entry(
# #     entry_id: str,
# #     user = Depends(verify_token),
# #     db: Session = Depends(get_db)
# # ):
# #     # CHECK ROLE
# #     roles = [r.role.role_code.lower() for r in user.roles]

# #     if "supervisor" not in roles:
# #         raise HTTPException(status_code=403, detail="Only supervisor can approve")

# #     entry = db.query(GateEntry).filter(
# #         GateEntry.gate_entry_id == entry_id
# #     ).first()

# #     if not entry:
# #         raise HTTPException(status_code=404, detail="Entry not found")

# #     entry.status = "approved"
# #     entry.approved_by = user.user_id
# #     entry.approved_at = datetime.utcnow()

# #     db.commit()

# #     return {"msg": "Entry approved"}

# # @router.put("/complete/{entry_id}")
# # def complete_entry(
# #     entry_id: str,
# #     user = Depends(verify_token),
# #     db: Session = Depends(get_db)
# # ):

# #     roles = [r.role.role_code.lower() for r in user.roles]

# #     if "supervisor" not in roles:
# #         raise HTTPException(status_code=403, detail="Only supervisor can complete")

# #     entry = db.query(GateEntry).filter(
# #         GateEntry.gate_entry_id == entry_id
# #     ).first()

# #     if not entry:
# #         raise HTTPException(status_code=404, detail="Entry not found")

# #     entry.status = "completed"
# #     entry.exit_time = datetime.utcnow()

# #     db.commit()

# #     return {"msg": "Entry completed"}


# from fastapi import APIRouter, Depends, HTTPException, Header, Request
# from sqlalchemy.orm import Session
# from datetime import datetime

# from ..db import get_db
# from ..models.core import (
#     GateEntry,
#     SecurityGate,
#     Warehouse,
#     User,
#     GateMaterialDetial,
#     GateDocument,
#     GateVehicleInspection,
#     GateEntryPhoto,
# )
# from ..dependencies.permissions import require_permission, require_role
# from ..utils.id_generator import generate_id

# from fastapi import APIRouter, HTTPException

# router = APIRouter()

# router = APIRouter(prefix="/gate-entries", tags=["Gate Entries"])


# # ===============================
# # CREATE ENTRY (ADMIN ONLY)
# # ===============================
# @router.post("/")
# def create_entry(
#     data: dict, user=Depends(require_role(["wms_admin"])), db: Session = Depends(get_db)
# ):
#     entry = GateEntry(
#         gate_entry_id=generate_id("GE", db),
#         warehouse_id=data.get("warehouse_id"),
#         gate_id=data.get("gate_id"),
#         entry_type=data.get("entry_type"),
#         movement_type=data.get("movement_type"),
#         # IMPORTANT FIELDS
#         vehicle_number=data.get("vehicle_number"),
#         driver_name=data.get("driver_name"),
#         driver_phone=data.get("driver_phone"),
#         company_name=data.get("company_name"),
#         person_name=data.get("person_name"),
#         entry_time=datetime.utcnow(),
#         recorded_by=user.user_id,
#         status="pending",
#     )

#     db.add(entry)
#     db.commit()
#     db.refresh(entry)

#     return {"message": "Entry created", "gate_entry_id": entry.gate_entry_id}


# # ===============================
# # GET ALL ENTRIES (ADMIN + SUPERVISOR)
# # ===============================


# @router.get("/")
# def get_entries(
#     user=Depends(require_role(["wms_admin", "supervisor"])),
#     db: Session = Depends(get_db),
# ):
#     entries = db.query(GateEntry).all()

#     result = []

#     for e in entries:
#         materials = (
#             db.query(GateMaterialDetial)
#             .filter(GateMaterialDetial.gate_entry_id == e.gate_entry_id)
#             .all()
#         )

#         descriptions = [m.description for m in materials if m.description]
#         quantities = [str(m.quantity) for m in materials if m.quantity is not None]

#         result.append(
#             {
#                 "gate_entry_id": e.gate_entry_id,
#                 "reference_no": e.reference_no or "",
#                 "vehicle_number": e.vehicle_number or "",
#                 "driver_name": e.driver_name or "",
#                 "company_name": e.company_name or "",
#                 "person_name": e.person_name or "",
#                 "driver_phone": e.driver_phone or "",
#                 "warehouse_id": e.warehouse_id,
#                 "entry_type": e.entry_type or "",
#                 "movement_type": e.movement_type or "",
#                 "entry_time": e.entry_time,
#                 "exit_time": e.exit_time,
#                 "status": e.status or "pending",
#                 "material_name": ", ".join(descriptions),
#                 "qty": ", ".join(quantities),
#                 "materials": [
#                     {
#                         "id": m.id,
#                         "sku_code": m.sku_code,
#                         "description": m.description,
#                         "quantity": m.quantity,
#                         "uom": m.uom,
#                     }
#                     for m in materials
#                 ],
#             }
#         )

#     return result


# # ===============================
# # APPROVE ENTRY (SUPERVISOR ONLY)
# # ===============================
# @router.put("/{entry_id}/approve")
# def approve_entry(
#     entry_id: str,
#     user=Depends(require_role(["supervisor"])),
#     db: Session = Depends(get_db),
# ):
#     entry = db.query(GateEntry).filter(GateEntry.gate_entry_id == entry_id).first()

#     if not entry:
#         raise HTTPException(status_code=404, detail="Entry not found")

#     if entry.status == "approved":
#         raise HTTPException(status_code=400, detail="Already approved")

#     entry.status = "approved"
#     entry.approved_by = user.user_id
#     entry.approved_at = datetime.utcnow()

#     db.commit()

#     return {"msg": "Entry approved"}


# # ===============================
# # COMPLETE ENTRY (OPTIONAL)
# # ===============================
# @router.put("/{entry_id}/complete")
# def complete_entry(
#     entry_id: str,
#     user=Depends(require_role(["supervisor"])),
#     db: Session = Depends(get_db),
# ):
#     entry = db.query(GateEntry).filter(GateEntry.gate_entry_id == entry_id).first()

#     if not entry:
#         raise HTTPException(status_code=404, detail="Entry not found")

#     entry.status = "completed"
#     entry.exit_time = datetime.utcnow()

#     db.commit()

#     return {"msg": "Entry completed"}


# # ===============================
# # EXIT ENTRY (KEEP YOUR OLD LOGIC)
# # ===============================
# @router.put(
#     "/{gate_entry_id}/exit", dependencies=[Depends(require_permission("gate.update"))]
# )
# def exit_gate_entry(gate_entry_id: str, db: Session = Depends(get_db)):
#     entry = db.query(GateEntry).filter(GateEntry.gate_entry_id == gate_entry_id).first()

#     if not entry:
#         raise HTTPException(status_code=404, detail="Gate entry not found")

#     if entry.exit_time is not None:
#         raise HTTPException(status_code=400, detail="Exit already recorded")

#     entry.exit_time = datetime.utcnow()
#     entry.movement_type = "EXIT"

#     db.commit()
#     db.refresh(entry)

#     return {
#         "message": "Exit recorded successfully",
#         "gate_entry_id": entry.gate_entry_id,
#         "exit_time": entry.exit_time,
#     }


# # ===============================
# # MATERIALS (UNCHANGED)
# # ===============================
# # @router.post("/{gate_entry_id}/materials")
# # def add_material(gate_entry_id: str, data: dict, db: Session = Depends(get_db)):
# #     entry = db.query(GateEntry).filter(
# #         GateEntry.gate_entry_id == gate_entry_id
# #     ).first()

# #     if not entry:
# #         raise HTTPException(status_code=404, detail="Gate entry not found")

# #     material = GateMaterialDetial(
# #         id=generate_id("GMAT", db),
# #         gate_entry_id=gate_entry_id,
# #         sku_code=data.get("sku_code"),
# #         description=data.get("description"),
# #         quantity=data.get("quantity"),
# #         uom=data.get("uom")
# #     )

# #     db.add(material)
# #     db.commit()

# #     return {"message": "Material added"}


# @router.post("/{gate_entry_id}/materials")
# async def add_material(
#     gate_entry_id: str, request: Request, db: Session = Depends(get_db)
# ):
#     try:
#         data = await request.json()

#         print("ENTRY ID RECEIVED:", gate_entry_id)
#         print("DATA RECEIVED:", data)

#         entry = (
#             db.query(GateEntry).filter(GateEntry.gate_entry_id == gate_entry_id).first()
#         )

#         print("ENTRY FOUND:", entry)

#         if not entry:
#             raise HTTPException(status_code=404, detail="Gate entry not found")

#         material = GateMaterialDetial(
#             id=generate_id("GMAT", db),
#             gate_entry_id=gate_entry_id,
#             sku_code=data.get("sku_code"),
#             description=data.get("description"),
#             quantity=int(data.get("quantity", 0)),
#             uom=data.get("uom"),
#         )

#         db.add(material)
#         db.commit()
#         db.refresh(material)

#         return {"message": "Material added", "id": material.id}

#     except Exception as e:
#         db.rollback()
#         print("MATERIAL ERROR:", str(e))
#         raise HTTPException(status_code=500, detail=str(e))


# @router.get("/{gate_entry_id}/materials")
# def get_materials(
#     gate_entry_id: str,
#     user=Depends(require_role(["wms_admin", "supervisor"])),
#     db: Session = Depends(get_db),
# ):
#     entry = db.query(GateEntry).filter(GateEntry.gate_entry_id == gate_entry_id).first()

#     if not entry:
#         raise HTTPException(status_code=404, detail="Gate entry not found")

#     materials = (
#         db.query(GateMaterialDetial)
#         .filter(GateMaterialDetial.gate_entry_id == gate_entry_id)
#         .all()
#     )

#     return [
#         {
#             "id": m.id,
#             "sku_code": m.sku_code,
#             "description": m.description,
#             "quantity": m.quantity,
#             "uom": m.uom,
#         }
#         for m in materials
#     ]


# @router.post("/{gate_entry_id}/documents")
# async def add_document(
#     gate_entry_id: str, request: Request, db: Session = Depends(get_db)
# ):
#     data = await request.json()

#     document = GateDocument(
#         id=generate_id("GDOC", db),
#         gate_entry_id=gate_entry_id,
#         document_type=data.get("document_type"),
#         document_number=data.get("document_number"),
#         document_url=data.get("document_url"),
#     )

#     db.add(document)
#     db.commit()

#     return {"message": "Document added"}


# @router.put("/{gate_entry_id}/inspection")
# async def update_inspection(
#     gate_entry_id: str, request: Request, db: Session = Depends(get_db)
# ):
#     try:
#         data = await request.json()

#         inspection = (
#             db.query(GateVehicleInspection)
#             .filter(GateVehicleInspection.gate_entry_id == gate_entry_id)
#             .first()
#         )

#         if inspection:
#             inspection.vehicle_condition_ok = data.get("vehicle_condition_ok")
#             inspection.seal_number = data.get("seal_number")
#             inspection.seal_intact = data.get("seal_intact")
#             inspection.temperature_ok = data.get("temperature_ok")
#             inspection.inspected_by = data.get("inspected_by")
#         else:
#             inspection = GateVehicleInspection(
#                 id=generate_id("GINSP", db),
#                 gate_entry_id=gate_entry_id,
#                 vehicle_condition_ok=data.get("vehicle_condition_ok"),
#                 seal_number=data.get("seal_number"),
#                 seal_intact=data.get("seal_intact"),
#                 temperature_ok=data.get("temperature_ok"),
#                 inspected_by=data.get("inspected_by"),
#             )
#             db.add(inspection)

#         db.commit()
#         db.refresh(inspection)

#         return {"message": "Inspection updated successfully", "id": inspection.id}

#     except Exception as e:
#         db.rollback()
#         print("INSPECTION ERROR:", str(e))
#         raise HTTPException(status_code=500, detail=str(e))


# @router.post("/{gate_entry_id}/photos")
# async def add_photo(
#     gate_entry_id: str, request: Request, db: Session = Depends(get_db)
# ):
#     data = await request.json()

#     photo = GateEntryPhoto(
#         id=generate_id("GPHOTO", db),
#         gate_entry_id=gate_entry_id,
#         photo_type=data.get("photo_type"),
#         photo_url=data.get("photo_url"),
#     )

#     db.add(photo)
#     db.commit()

#     return {"message": "Photo added"}


# @router.put("/{entry_id}")
# def update_gate_entry(entry_id: str, payload: dict, db: Session = Depends(get_db)):
#     print("UPDATE ENTRY ID:", entry_id)
#     print("PAYLOAD RECEIVED:", payload)

#     entry = db.query(GateEntry).filter(GateEntry.gate_entry_id == entry_id).first()

#     if not entry:
#         raise HTTPException(status_code=404, detail="Gate entry not found")

#     if payload.get("warehouse_id"):
#         entry.warehouse_id = payload["warehouse_id"]

#     if payload.get("gate_id"):
#         entry.gate_id = payload["gate_id"]

#     if payload.get("entry_type"):
#         entry.entry_type = payload["entry_type"]

#     if payload.get("movement_type"):
#         entry.movement_type = payload["movement_type"]

#     if payload.get("reference_no"):
#         entry.reference_no = payload["reference_no"]

#     if payload.get("vehicle_number"):
#         entry.vehicle_number = payload["vehicle_number"]

#     if payload.get("driver_name"):
#         entry.driver_name = payload["driver_name"]

#     if payload.get("driver_phone"):
#         entry.driver_phone = payload["driver_phone"]

#     if payload.get("person_name"):
#         entry.person_name = payload["person_name"]

#     if payload.get("company_name"):
#         entry.company_name = payload["company_name"]

#     db.commit()
#     db.refresh(entry)

#     return {
#         "message": "Gate entry updated successfully",
#         "data": {
#             "gate_entry_id": entry.gate_entry_id,
#             "vehicle_number": entry.vehicle_number,
#             "driver_name": entry.driver_name,
#             "status": entry.status,
#         },
#     }


# @router.get("/{entry_id}")
# def get_gate_entry_details(
#     entry_id: str,
#     user=Depends(require_role(["wms_admin", "supervisor"])),
#     db: Session = Depends(get_db),
# ):
#     entry = db.query(GateEntry).filter(GateEntry.gate_entry_id == entry_id).first()

#     if not entry:
#         raise HTTPException(status_code=404, detail="Entry not found")

#     materials = (
#         db.query(GateMaterialDetial)
#         .filter(GateMaterialDetial.gate_entry_id == entry_id)
#         .all()
#     )

#     documents = (
#         db.query(GateDocument).filter(GateDocument.gate_entry_id == entry_id).all()
#     )

#     photos = (
#         db.query(GateEntryPhoto).filter(GateEntryPhoto.gate_entry_id == entry_id).all()
#     )

#     inspection = (
#         db.query(GateVehicleInspection)
#         .filter(GateVehicleInspection.gate_entry_id == entry_id)
#         .first()
#     )

#     return {
#         "gate_entry_id": entry.gate_entry_id,
#         "warehouse_id": entry.warehouse_id,
#         "gate_id": entry.gate_id,
#         "entry_type": entry.entry_type,
#         "movement_type": entry.movement_type,
#         "reference_no": entry.reference_no,
#         "vehicle_number": entry.vehicle_number,
#         "driver_name": entry.driver_name,
#         "driver_phone": entry.driver_phone,
#         "person_name": entry.person_name,
#         "company_name": entry.company_name,
#         "entry_time": entry.entry_time,
#         "exit_time": entry.exit_time,
#         "status": entry.status,
#         "materials": [
#             {
#                 "id": m.id,
#                 "sku_code": m.sku_code,
#                 "description": m.description,
#                 "quantity": m.quantity,
#                 "uom": m.uom,
#             }
#             for m in materials
#         ],
#         "documents": [
#             {
#                 "id": d.id,
#                 "document_type": d.document_type,
#                 "document_number": d.document_number,
#                 "document_url": d.document_url,
#             }
#             for d in documents
#         ],
#         "photos": [
#             {
#                 "id": p.id,
#                 "photo_type": p.photo_type,
#                 "photo_url": p.photo_url,
#             }
#             for p in photos
#         ],
#         "vehicle_condition_ok": (
#             inspection.vehicle_condition_ok if inspection else False
#         ),
#         "seal_number": inspection.seal_number if inspection else "",
#         "seal_intact": inspection.seal_intact if inspection else False,
#         "temperature_ok": inspection.temperature_ok if inspection else False,
#     }


# ============================================================
# gate_entries.py  —  FIXED
# Changes:
#  1. PUT /{entry_id} — fixed falsy-check bug (fields now use `in` check,
#     not truthiness), so empty strings and False are saved correctly
#  2. PUT /{entry_id} — added missing fields: remarks, entry_time,
#     exit_time, status
#  3. PUT /{entry_id} — added auth dependency (was missing, security hole)
#  4. GET /{entry_id} — added remarks to response (was missing)
#  5. GET /{entry_id} — photos now return photo_url key (consistent naming)
#  6. Added DELETE /{entry_id}/materials|documents|photos endpoints
#     so the frontend can clear sub-records before re-inserting on edit
#  7. Added POST /{entry_id}/photos/upload multipart endpoint for real
#     file uploads (stores file on disk / S3 and returns a real URL)
#  8. Moved GET /{entry_id} ABOVE PUT /{entry_id} — route order safety
# ============================================================

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Header,
    Request,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.orm import Session
from datetime import datetime
import os, shutil, uuid

from ..db import get_db
from ..models.core import (
    GateEntry,
    SecurityGate,
    Warehouse,
    User,
    GateMaterialDetial,
    GateDocument,
    GateVehicleInspection,
    GateEntryPhoto,
)
from ..dependencies.permissions import require_permission, require_role
from ..utils.id_generator import generate_id

router = APIRouter(prefix="/gate-entries", tags=["Gate Entries"])

# ── Directory for uploaded photos ────────────────────────────────────────────
UPLOAD_DIR = "uploads/photos"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ===============================
# CREATE ENTRY
# ===============================
@router.post("/")
def create_entry(
    data: dict,
    user=Depends(require_role(["wms_admin"])),
    db: Session = Depends(get_db),
):
    entry = GateEntry(
        gate_entry_id=generate_id("GE", db),
        warehouse_id=data.get("warehouse_id"),
        gate_id=data.get("gate_id"),
        entry_type=data.get("entry_type"),
        movement_type=data.get("movement_type"),
        reference_no=data.get("reference_no"),  # ← was missing
        vehicle_number=data.get("vehicle_number"),
        driver_name=data.get("driver_name"),
        driver_phone=data.get("driver_phone"),
        company_name=data.get("company_name"),
        person_name=data.get("person_name"),
        entry_time=data.get("entry_time") or datetime.utcnow(),
        exit_time=data.get("exit_time"),
        remarks=data.get("remarks"),  # ← was missing
        recorded_by=user.user_id,
        status="pending",
    )

    db.add(entry)
    db.commit()
    db.refresh(entry)

    return {"message": "Entry created", "gate_entry_id": entry.gate_entry_id}


# ===============================
# GET ALL ENTRIES
# ===============================
@router.get("/")
def get_entries(
    user=Depends(require_role(["wms_admin", "supervisor"])),
    db: Session = Depends(get_db),
):
    entries = db.query(GateEntry).all()
    result = []

    for e in entries:
        materials = (
            db.query(GateMaterialDetial)
            .filter(GateMaterialDetial.gate_entry_id == e.gate_entry_id)
            .all()
        )

        descriptions = [m.description for m in materials if m.description]
        quantities = [str(m.quantity) for m in materials if m.quantity is not None]

        result.append(
            {
                "gate_entry_id": e.gate_entry_id,
                "reference_no": e.reference_no or "",
                "vehicle_number": e.vehicle_number or "",
                "driver_name": e.driver_name or "",
                "company_name": e.company_name or "",
                "person_name": e.person_name or "",
                "driver_phone": e.driver_phone or "",
                "warehouse_id": e.warehouse_id,
                "gate_id": e.gate_id,
                "entry_type": e.entry_type or "",
                "movement_type": e.movement_type or "",
                "entry_time": e.entry_time,
                "exit_time": e.exit_time,
                "remarks": e.remarks or "",
                "status": e.status or "pending",
                "material_name": ", ".join(descriptions),
                "qty": ", ".join(quantities),
                "materials": [
                    {
                        "id": m.id,
                        "sku_code": m.sku_code,
                        "description": m.description,
                        "quantity": m.quantity,
                        "uom": m.uom,
                    }
                    for m in materials
                ],
            }
        )

    return result


# ===============================
# FIX #8 — GET SINGLE ENTRY
# (moved above PUT to avoid route shadowing)
# ===============================
@router.get("/{entry_id}")
def get_gate_entry_details(
    entry_id: str,
    user=Depends(require_role(["wms_admin", "supervisor"])),
    db: Session = Depends(get_db),
):
    entry = db.query(GateEntry).filter(GateEntry.gate_entry_id == entry_id).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    materials = (
        db.query(GateMaterialDetial)
        .filter(GateMaterialDetial.gate_entry_id == entry_id)
        .all()
    )

    documents = (
        db.query(GateDocument).filter(GateDocument.gate_entry_id == entry_id).all()
    )

    photos = (
        db.query(GateEntryPhoto).filter(GateEntryPhoto.gate_entry_id == entry_id).all()
    )

    inspection = (
        db.query(GateVehicleInspection)
        .filter(GateVehicleInspection.gate_entry_id == entry_id)
        .first()
    )

    return {
        "gate_entry_id": entry.gate_entry_id,
        "warehouse_id": entry.warehouse_id,
        "gate_id": entry.gate_id,
        "entry_type": entry.entry_type,
        "movement_type": entry.movement_type,
        "reference_no": entry.reference_no,
        "vehicle_number": entry.vehicle_number,
        "driver_name": entry.driver_name,
        "driver_phone": entry.driver_phone,
        "person_name": entry.person_name,
        "company_name": entry.company_name,
        "entry_time": entry.entry_time,
        "exit_time": entry.exit_time,
        "status": entry.status,
        # FIX #4 — remarks was missing from GET response
        "remarks": entry.remarks or "",
        "materials": [
            {
                "id": m.id,
                "sku_code": m.sku_code,
                "description": m.description,
                "quantity": m.quantity,
                "uom": m.uom,
            }
            for m in materials
        ],
        "documents": [
            {
                "id": d.id,
                "document_type": d.document_type,
                "document_number": d.document_number,
                "document_url": d.document_url,
            }
            for d in documents
        ],
        # FIX #5 — always return photo_url (frontend was reading p.url / p.preview)
        "photos": [
            {
                "id": p.id,
                "photo_type": p.photo_type,
                "photo_url": p.photo_url,
            }
            for p in photos
        ],
        "vehicle_condition_ok": (
            inspection.vehicle_condition_ok if inspection else False
        ),
        "seal_number": inspection.seal_number if inspection else "",
        "seal_intact": inspection.seal_intact if inspection else False,
        "temperature_ok": inspection.temperature_ok if inspection else False,
    }


# ===============================
# FIX #1 #2 #3 — UPDATE ENTRY
# ===============================
@router.put("/{entry_id}")
def update_gate_entry(
    entry_id: str,
    payload: dict,
    # FIX #3 — auth was completely missing on this route
    user=Depends(require_role(["wms_admin", "supervisor"])),
    db: Session = Depends(get_db),
):
    print("UPDATE ENTRY ID:", entry_id)
    print("PAYLOAD RECEIVED:", payload)

    entry = db.query(GateEntry).filter(GateEntry.gate_entry_id == entry_id).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Gate entry not found")

    # FIX #1 — Use `in payload` instead of `if payload.get(field)`.
    # The old code used truthiness checks, so:
    #   - reference_no="" would be SKIPPED (field stays dirty in DB)
    #   - vehicle_condition_ok=False would be SKIPPED
    # Now we update any key that is explicitly present in the payload.

    updatable_fields = [
        "warehouse_id",
        "gate_id",
        "entry_type",
        "movement_type",
        "reference_no",
        "vehicle_number",
        "driver_name",
        "driver_phone",
        "person_name",
        "company_name",
        # FIX #2 — these three were never saved on update
        "remarks",
        "status",
    ]

    for field in updatable_fields:
        if field in payload:
            setattr(entry, field, payload[field])

    # FIX #2 — datetime fields need special handling (string → datetime)
    if "entry_time" in payload and payload["entry_time"]:
        try:
            entry.entry_time = datetime.fromisoformat(payload["entry_time"])
        except (ValueError, TypeError):
            pass  # keep existing value if unparseable

    if "exit_time" in payload and payload["exit_time"]:
        try:
            entry.exit_time = datetime.fromisoformat(payload["exit_time"])
        except (ValueError, TypeError):
            pass

    db.commit()
    db.refresh(entry)

    return {
        "message": "Gate entry updated successfully",
        "data": {
            "gate_entry_id": entry.gate_entry_id,
            "reference_no": entry.reference_no,
            "vehicle_number": entry.vehicle_number,
            "driver_name": entry.driver_name,
            "remarks": entry.remarks,
            "status": entry.status,
        },
    }


# ===============================
# APPROVE ENTRY
# ===============================
@router.put("/{entry_id}/approve")
def approve_entry(
    entry_id: str,
    user=Depends(require_role(["supervisor"])),
    db: Session = Depends(get_db),
):
    entry = db.query(GateEntry).filter(GateEntry.gate_entry_id == entry_id).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    if entry.status == "approved":
        raise HTTPException(status_code=400, detail="Already approved")

    entry.status = "approved"
    entry.approved_by = user.user_id
    entry.approved_at = datetime.utcnow()

    db.commit()
    return {"msg": "Entry approved"}


# ===============================
# COMPLETE ENTRY
# ===============================
@router.put("/{entry_id}/complete")
def complete_entry(
    entry_id: str,
    user=Depends(require_role(["supervisor"])),
    db: Session = Depends(get_db),
):
    entry = db.query(GateEntry).filter(GateEntry.gate_entry_id == entry_id).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    entry.status = "completed"
    entry.exit_time = datetime.utcnow()

    db.commit()
    return {"msg": "Entry completed"}


# ===============================
# EXIT ENTRY
# ===============================
@router.put(
    "/{gate_entry_id}/exit",
    dependencies=[Depends(require_permission("gate.update"))],
)
def exit_gate_entry(gate_entry_id: str, db: Session = Depends(get_db)):
    entry = db.query(GateEntry).filter(GateEntry.gate_entry_id == gate_entry_id).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Gate entry not found")

    if entry.exit_time is not None:
        raise HTTPException(status_code=400, detail="Exit already recorded")

    entry.exit_time = datetime.utcnow()
    entry.movement_type = "EXIT"

    db.commit()
    db.refresh(entry)

    return {
        "message": "Exit recorded successfully",
        "gate_entry_id": entry.gate_entry_id,
        "exit_time": entry.exit_time,
    }


# ===============================
# MATERIALS — ADD
# ===============================
@router.post("/{gate_entry_id}/materials")
async def add_material(
    gate_entry_id: str, request: Request, db: Session = Depends(get_db)
):
    try:
        data = await request.json()

        entry = (
            db.query(GateEntry).filter(GateEntry.gate_entry_id == gate_entry_id).first()
        )

        if not entry:
            raise HTTPException(status_code=404, detail="Gate entry not found")

        material = GateMaterialDetial(
            id=generate_id("GMAT", db),
            gate_entry_id=gate_entry_id,
            sku_code=data.get("sku_code"),
            description=data.get("description"),
            quantity=int(data.get("quantity") or 0),
            uom=data.get("uom"),
        )

        db.add(material)
        db.commit()
        db.refresh(material)

        return {"message": "Material added", "id": material.id}

    except Exception as e:
        db.rollback()
        print("MATERIAL ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# ===============================
# MATERIALS — GET
# ===============================
@router.get("/{gate_entry_id}/materials")
def get_materials(
    gate_entry_id: str,
    user=Depends(require_role(["wms_admin", "supervisor"])),
    db: Session = Depends(get_db),
):
    entry = db.query(GateEntry).filter(GateEntry.gate_entry_id == gate_entry_id).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Gate entry not found")

    materials = (
        db.query(GateMaterialDetial)
        .filter(GateMaterialDetial.gate_entry_id == gate_entry_id)
        .all()
    )

    return [
        {
            "id": m.id,
            "sku_code": m.sku_code,
            "description": m.description,
            "quantity": m.quantity,
            "uom": m.uom,
        }
        for m in materials
    ]


# ===============================
# FIX #6 — MATERIALS DELETE (bulk)
# ===============================
@router.delete("/{gate_entry_id}/materials")
def delete_all_materials(
    gate_entry_id: str,
    user=Depends(require_role(["wms_admin", "supervisor"])),
    db: Session = Depends(get_db),
):
    deleted = (
        db.query(GateMaterialDetial)
        .filter(GateMaterialDetial.gate_entry_id == gate_entry_id)
        .delete()
    )
    db.commit()
    return {"message": f"Deleted {deleted} materials"}


# ===============================
# DOCUMENTS — ADD
# ===============================
@router.post("/{gate_entry_id}/documents")
async def add_document(
    gate_entry_id: str, request: Request, db: Session = Depends(get_db)
):
    data = await request.json()

    document = GateDocument(
        id=generate_id("GDOC", db),
        gate_entry_id=gate_entry_id,
        document_type=data.get("document_type"),
        document_number=data.get("document_number"),
        document_url=data.get("document_url"),
    )

    db.add(document)
    db.commit()

    return {"message": "Document added"}


# ===============================
# FIX #6 — DOCUMENTS DELETE (bulk)
# ===============================
@router.delete("/{gate_entry_id}/documents")
def delete_all_documents(
    gate_entry_id: str,
    user=Depends(require_role(["wms_admin", "supervisor"])),
    db: Session = Depends(get_db),
):
    deleted = (
        db.query(GateDocument)
        .filter(GateDocument.gate_entry_id == gate_entry_id)
        .delete()
    )
    db.commit()
    return {"message": f"Deleted {deleted} documents"}


# ===============================
# PHOTOS — ADD (URL-based)
# ===============================
@router.post("/{gate_entry_id}/photos")
async def add_photo(
    gate_entry_id: str, request: Request, db: Session = Depends(get_db)
):
    data = await request.json()

    photo = GateEntryPhoto(
        id=generate_id("GPHOTO", db),
        gate_entry_id=gate_entry_id,
        photo_type=data.get("photo_type"),
        photo_url=data.get("photo_url"),
    )

    db.add(photo)
    db.commit()

    return {"message": "Photo added"}


# ===============================
# FIX #7 — PHOTOS UPLOAD (multipart)
# Accepts a real file, saves it, stores a permanent URL
# ===============================
@router.post("/{gate_entry_id}/photos/upload")
async def upload_photo(
    gate_entry_id: str,
    photo_type: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Validate entry exists
    entry = db.query(GateEntry).filter(GateEntry.gate_entry_id == gate_entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Gate entry not found")

    # Save file to disk  (swap this block for S3/GCS upload in production)
    ext = os.path.splitext(file.filename)[1] or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Build a publicly accessible URL
    # In production replace with your CDN/S3 URL
    photo_url = f"/static/photos/{filename}"

    photo = GateEntryPhoto(
        id=generate_id("GPHOTO", db),
        gate_entry_id=gate_entry_id,
        photo_type=photo_type,
        photo_url=photo_url,
    )

    db.add(photo)
    db.commit()
    db.refresh(photo)

    return {"message": "Photo uploaded", "id": photo.id, "photo_url": photo_url}


# ===============================
# FIX #6 — PHOTOS DELETE (bulk)
# ===============================
@router.delete("/{gate_entry_id}/photos")
def delete_all_photos(
    gate_entry_id: str,
    user=Depends(require_role(["wms_admin", "supervisor"])),
    db: Session = Depends(get_db),
):
    deleted = (
        db.query(GateEntryPhoto)
        .filter(GateEntryPhoto.gate_entry_id == gate_entry_id)
        .delete()
    )
    db.commit()
    return {"message": f"Deleted {deleted} photos"}


# ===============================
# INSPECTION — UPSERT
# ===============================
@router.put("/{gate_entry_id}/inspection")
async def update_inspection(
    gate_entry_id: str, request: Request, db: Session = Depends(get_db)
):
    try:
        data = await request.json()

        inspection = (
            db.query(GateVehicleInspection)
            .filter(GateVehicleInspection.gate_entry_id == gate_entry_id)
            .first()
        )

        if inspection:
            inspection.vehicle_condition_ok = data.get("vehicle_condition_ok")
            inspection.seal_number = data.get("seal_number")
            inspection.seal_intact = data.get("seal_intact")
            inspection.temperature_ok = data.get("temperature_ok")
            inspection.inspected_by = data.get("inspected_by")
        else:
            inspection = GateVehicleInspection(
                id=generate_id("GINSP", db),
                gate_entry_id=gate_entry_id,
                vehicle_condition_ok=data.get("vehicle_condition_ok"),
                seal_number=data.get("seal_number"),
                seal_intact=data.get("seal_intact"),
                temperature_ok=data.get("temperature_ok"),
                inspected_by=data.get("inspected_by"),
            )
            db.add(inspection)

        db.commit()
        db.refresh(inspection)

        return {"message": "Inspection updated successfully", "id": inspection.id}

    except Exception as e:
        db.rollback()
        print("INSPECTION ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
