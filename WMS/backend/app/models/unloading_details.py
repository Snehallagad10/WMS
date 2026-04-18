from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from ..db import Base


class UnloadingDetails(Base):
    __tablename__ = "unloading_details"

    unloading_id = Column(String, primary_key=True)
    gate_entry_id = Column(String, ForeignKey("gate_entries.gate_entry_id"))
    dock_allocation_id = Column(
        String, ForeignKey("dock_allocations.dock_allocation_id")
    )
    staging_area = Column(String)
    total_cartoons = Column(Integer)
    unloaded_by = Column(String, ForeignKey("users.user_id"))
    unloading_start = Column(DateTime)
    unloading_end = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)


class UnloadingPhoto(Base):
    __tablename__ = "unloading_photos"

    photo_id = Column(String, primary_key=True)
    unloading_id = Column(String, ForeignKey("unloading_details.unloading_id"))
    photo_url = Column(Text)
    photo_type = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
