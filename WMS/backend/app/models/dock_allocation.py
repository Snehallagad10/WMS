from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, String, Text

from ..db import Base


class DockAllocation(Base):
    __tablename__ = "dock_allocations"

    dock_allocation_id = Column(String(30), primary_key=True)
    gate_entry_id = Column(
        String(36), ForeignKey("gate_entries.gate_entry_id"), nullable=False
    )
    dock_id = Column(String(36), ForeignKey("docks.dock_id"), nullable=False)
    allocated_at = Column(DateTime, default=datetime.utcnow)
    allocated_by = Column(String(36), ForeignKey("users.user_id"), nullable=True)
    status = Column(String(30), default="ALLOCATED")
    remarks = Column(Text, nullable=True)
