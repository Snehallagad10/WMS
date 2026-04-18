from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, DECIMAL
from sqlalchemy.orm import relationship
from ..db import Base


# ---------------- User ----------------
class User(Base):
    __tablename__ = "users"

    user_id = Column(String(30), primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=True)
    phone = Column(String(20), nullable=True)
    password_hash = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    is_locked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)
    force_password_change = Column(Boolean, default=False)

    roles = relationship("UserRole", back_populates="user")


# ---------------- Role ----------------
class Role(Base):
    __tablename__ = "roles"

    role_id = Column(String(30), primary_key=True)
    role_code = Column(String(30), unique=True, nullable=False)
    role_name = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    is_system = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("UserRole", back_populates="role")


# ---------------- UserRole ----------------
class UserRole(Base):
    __tablename__ = "user_roles"

    user_role_id = Column(String(30), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False)
    role_id = Column(String(36), ForeignKey("roles.role_id"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow)
    assigned_by = Column(String(36), nullable=True)

    user = relationship("User", back_populates="roles")
    role = relationship("Role", back_populates="users")


# ---------------- Warehouse ----------------
class Warehouse(Base):
    __tablename__ = "warehouses"

    warehouse_id = Column(String(30), primary_key=True)
    warehouse_code = Column(String(50), unique=True, nullable=False)
    warehouse_name = Column(String(255), nullable=False)
    status = Column(String(20), default="ACTIVE")
    address_line1 = Column(String(255), nullable=True)
    address_line2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)
    total_area_sqft = Column(DECIMAL(10, 2), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)


# ----------------- Permission ----------------
class Permission(Base):
    __tablename__ = "permissions"

    permission_id = Column(String(30), primary_key=True)
    module = Column(String(50), nullable=True)
    action = Column(String(50), nullable=True)
    permission_code = Column(String(50), unique=True, nullable=False)
    description = Column(Text, nullable=True)


# ------------------ Role Permission -----------
class RolePermission(Base):
    __tablename__ = "role_permissions"

    role_id = Column(String(30), ForeignKey("roles.role_id"), primary_key=True)
    permission_id = Column(
        String(30), ForeignKey("permissions.permission_id"), primary_key=True
    )


# ------------------- User Warehouse -------------
class UserWarehouse(Base):
    __tablename__ = "user_warehouses"

    user_id = Column(String(36), ForeignKey("users.user_id"), primary_key=True)
    warehouse_id = Column(
        String(36), ForeignKey("warehouses.warehouse_id"), primary_key=True
    )


# ------------------- Security Gate --------------
class SecurityGate(Base):
    __tablename__ = "security_gates"

    gate_id = Column(String(30), primary_key=True)
    warehouse_id = Column(
        String(36), ForeignKey("warehouses.warehouse_id"), nullable=False
    )

    gate_code = Column(String(30), unique=True, nullable=False)
    gate_name = Column(String(100), nullable=True)
    gate_type = Column(String(30), nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# ------------------- Gate Entry ----------------
class GateEntry(Base):
    __tablename__ = "gate_entries"

    gate_entry_id = Column(String(30), primary_key=True)

    warehouse_id = Column(
        String(36), ForeignKey("warehouses.warehouse_id"), nullable=False
    )
    gate_id = Column(String(36), ForeignKey("security_gates.gate_id"), nullable=False)

    entry_type = Column(String(30), nullable=False)
    movement_type = Column(String(10), nullable=False)

    reference_no = Column(String(100), nullable=True)

    vehicle_number = Column(String(20), nullable=True)
    driver_name = Column(String(100), nullable=True)
    driver_phone = Column(String(20), nullable=True)

    person_name = Column(String(100), nullable=True)
    company_name = Column(String(100), nullable=True)

    entry_time = Column(DateTime, nullable=False)
    exit_time = Column(DateTime, nullable=True)

    recorded_by = Column(String(36), ForeignKey("users.user_id"), nullable=True)

    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    status = Column(String(20), default="pending")  # pending / approved / rejected
    approved_by = Column(String(36), ForeignKey("users.user_id"), nullable=True)
    approved_at = Column(DateTime, nullable=True)


# ------------------- Gate Material Details -------------
class GateMaterialDetial(Base):
    __tablename__ = "gate_material_details"

    id = Column(String(30), primary_key=True)
    gate_entry_id = Column(
        String(36), ForeignKey("gate_entries.gate_entry_id"), nullable=False
    )

    sku_code = Column(String(50), nullable=True)
    description = Column(String(255), nullable=True)

    quantity = Column(DECIMAL(12, 2), nullable=True)
    uom = Column(String(20), nullable=True)


# --------------------- Gate Document -------------------
class GateDocument(Base):
    __tablename__ = "gate_documents"

    id = Column(String(30), primary_key=True)
    gate_entry_id = Column(
        String(36), ForeignKey("gate_entries.gate_entry_id"), nullable=False
    )

    document_type = Column(String(30), nullable=True)
    document_number = Column(String(100), nullable=True)
    document_url = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)


# ---------------------- Gate Vehicle Inspection ------------------
class GateVehicleInspection(Base):
    __tablename__ = "gate_vehicle_inspection"

    id = Column(String(30), primary_key=True)
    gate_entry_id = Column(
        String(36), ForeignKey("gate_entries.gate_entry_id"), nullable=False
    )

    vehicle_condition_ok = Column(Boolean, nullable=True)
    seal_number = Column(String(50), nullable=True)
    seal_intact = Column(Boolean, nullable=True)
    temperature_ok = Column(Boolean, nullable=True)

    inspected_by = Column(String(36), ForeignKey("users.user_id"), nullable=True)
    inspected_at = Column(DateTime, default=datetime.utcnow)


# ----------------- Gate Entry Photo ------------------------
# class GateEntryPhoto(Base):
#     __tablename__ = "gate_entry_photos"

#     id = Column(String(30), primary_key=True)
#     gate_entry_id = Column(
#         String(36), ForeignKey("gate_entries.gate_entry_id"), nullable=False
#     )

#     photo_type = Column(Text, nullable=True)
#     captured_at = Column(DateTime, default=datetime.utcnow)


class GateEntryPhoto(Base):
    __tablename__ = "gate_entry_photos"

    id = Column(String(30), primary_key=True)
    gate_entry_id = Column(
        String(36), ForeignKey("gate_entries.gate_entry_id"), nullable=False
    )

    photo_type = Column(Text, nullable=True)
    photo_url = Column(Text, nullable=True)  # ✅ ADD THIS LINE
    captured_at = Column(DateTime, default=datetime.utcnow)


# ----------------- Dock Allocation ------------------------
class Dock(Base):
    __tablename__ = "docks"

    dock_id = Column(String, primary_key=True)
    dock_code = Column(String, unique=True)
    warehouse_id = Column(String, ForeignKey("warehouses.warehouse_id"))
    status = Column(String, default="AVAILABLE")
    created_at = Column(DateTime, default=datetime.utcnow)


# ----------------- Dock Allocation ------------------------
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

# ------------------ Model ------------------------------
class UnloadingDetails(Base):
    __tablename__ = "unloading_details"

    unloading_id = Column(String, primary_key=True)

    gate_entry_id = Column(String, ForeignKey("gate_entries.gate_entry_id"))
    dock_allocation_id = Column(String, ForeignKey("dock_allocation.dock_allocationa_id"))

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