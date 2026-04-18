from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import os
from datetime import datetime

from ..db import get_db
from ..models.core import UnloadingPhoto, UnloadingDetails
from ..utils.id_generator import generate_id
from ..dependencies.permissions import require_permission

router = APIRouter(prefix="/unloading-photos", tags=["Unloading Photos"])

UPLOAD_DIR = "uploads/unloading"

os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", dependencies=[Depends(require_permission("dock.unload.start"))])
async def upload_photo(
    unloading_id: str = Form(...),
    photo_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    unloading = db.query(UnloadingDetails).filter(
        UnloadingDetails.unloading_id == unloading_id
    ).first()

    if not unloading:
        raise HTTPException(status_code=404, detail="Unloading not found")
    
    file_ext = file.filename.split(".")[-1]
    photo_id = generate_id("PHOTO", db)
    file_name = f"{photo_id}.{file_ext}"

    file_path = os.path.join(UPLOAD_DIR, file_name)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    photo = UnloadingPhoto(
        photo_id=photo_id,
        unloading_id=unloading_id,
        photo_url=file_path,
        photo_type=photo_type
    )

    db.add(photo)
    db.commit()
    db.refresh(photo)

    return {
        "message": "Photo uploaded successfully",
        "photo_id": photo.photo_id,
        "file_path": file_path
    }