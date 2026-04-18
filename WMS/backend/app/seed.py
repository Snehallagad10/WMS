from datetime import datetime
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError

from .db import SessionLocal, engine, Base
from .models.core import User, Role, UserRole, Warehouse, Permission, RolePermission, UserWarehouse
from .utils.id_generator import generate_id


# Password Hashing

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password[:72])


def seed_data():
    db = SessionLocal()
    try:
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully!")

        # Roles

        roles = [
            {"role_code": "SECURITY", "role_name": "Security"},
            {"role_code": "WAREHOUSE_EXEC", "role_name": "warehouse Executive"},
            {"role_code": "QC_EXEC", "role_name": "QC Executive"},
            {"role_code": "SUPERVISOR", "role_name": "Supervisor"},
            {"role_code": "WMS_ADMIN", "role_name": "WMS Admin"},
        ]

        for r in roles:
            existing = db.query(Role).filter(
                Role.role_code == r["role_code"]
            ).first()

            if not existing:
                role_obj = Role(
                    role_id=generate_id("ROLE", db),
                    role_code=r["role_code"],
                    role_name=r["role_name"],
                    description=r.get("description"),
                )
                db.add(role_obj)

        db.commit()
        print("Roles seeded successfully!")
        
        # Permissions
        permissions = [
            {"module": "gate", "action": "view", "code": "gate.view"},
            {"module": "gate", "action": "create", "code": "gate.create"},
            {"module": "gate", "action": "update", "code": "gate.update"},
            {"module": "gate", "action": "approve", "code": "gate.approve"},
            {"module": "warehouse", "action": "view", "code": "warehouse.view"},
            {"module": "warehouse", "action": "manage", "code": "warehouse.manage"},
            {"module": "user", "action": "view", "code": "user.view"},
            {"module": "user", "action": "manage", "code": "user.manage"},
            {"module": "role", "action": "manage", "code": "role.manage"},
        ]

        for p in permissions:
            existing = db.query(Permission).filter(
                Permission.permission_code == p["code"]
            ).first()

            if not existing:
                perm = Permission(
                    permission_id=generate_id("PERM", db),
                    module=p["module"],
                    action=p["action"],
                    permission_code=p["code"],
                    description=f"{p['action']} access for {p['module']}"
                )
                db.add(perm)

        db.commit()
        print("Permissions seeded successfully!")

        # Role Permission Mapping

        role_permission_map = {
            "WMS_ADMIN": [
                "gate.view",
                "gate.create",
                "gate.approve",
                "warehouse.view",
                "warehouse.manage",
                "user.view",
                "user.manage",
                "role.manage",
            ],
            "SECURITY": [
                "gate.view",
                "gate.create",
                "gate.update",
            ],
            "WAREHOUSE_EXEC": [
                "gate.view",
                "gate.update"
            ],
            "QC_EXEC": [
                "gate.view",
                "gate.update",
            ],
            "SUPERVISOR": [
                "gate.view",
                "gate.approve",
            ],
        }
        for role_code, permission_codes in role_permission_map.items():
            role = db.query(Role).filter(
                Role.role_code == role_code
            ).first()

            if not role:
                print(f"Role {role_code} not found. Skipping")
                continue

            for perm_code in permission_codes:
                permission = db.query(Permission).filter(
                    Permission.permission_code == perm_code
                ).first()

                if not permission:
                    print(f"Permission {perm_code} not. Skipping.")
                    continue

                existing_mapping = db.query(RolePermission).filter(
                    RolePermission.role_id == role.role_id,
                    RolePermission.permission_id == permission.permission_id
                ).first()

                if not existing_mapping:
                    role_perm = RolePermission(
                        role_id=role.role_id,
                        permission_id=permission.permission_id
                    )
                    db.add(role_perm)


        db.commit()
        print("Role-permission mappings seeded successfully!")

        # All Permission to Admin

        admin_role = db.query(Role).filter(
            Role.role_code == "WMS_ADMIN"
        ).first()

        all_permissions = db.query(Permission).all()

        for perm in all_permissions:
            existing_mapping = db.query(RolePermission).filter(
                RolePermission.role_id == admin_role.role_id,
                RolePermission.permission_id == perm.permission_id
            ).first()

            if not existing_mapping:
                role_perm = RolePermission(
                    role_id=admin_role.role_id,
                    permission_id=perm.permission_id
                )
                db.add(role_perm)

        db.commit()
        print("All permissions assigned to WMS_ADMIN!")

        # Warehouse
        existing_wh = db.query(Warehouse).filter(
            Warehouse.warehouse_code == "WH001"
        ).first()
        if not existing_wh:
            warehouse = Warehouse(
                warehouse_id = generate_id("WH", db),
                warehouse_code = "WH001",
                warehouse_name = "Main Warehouse",
                status = "ACTIVE",
                city = "Navi Mumbai",
                state = "Maharashtra",
                country = "India",
                total_area_sqft = 10000
            )
            db.add(warehouse)
            db.commit()
            print("Warehouse seeded successfully!")
        else:
            print("Warehouse already exists - skipped.")

        # Admin User

        admin_user = db.query(User).filter(
            User.username == "admin"
        ).first()

        if not admin_user:
            admin_user = User(
                user_id = generate_id("USR", db),
                username = "admin",
                email = "admin@wms.com",
                password_hash = hash_password("admin123"),
                is_active = True
            )
            db.add(admin_user)
            db.commit()
            print("Admin user seeded successfully!")
        else:
            print("Admin user already exists - skipped.")

        admin_role = db.query(Role).filter(Role.role_code == "WMS_ADMIN").first()
        
        if not admin_role:
            raise Exception("WMS_ADMIN role not found. Seed roles first.")
        
        existing_mapping = db.query(UserRole).filter(
            UserRole.user_id == admin_user.user_id,
            UserRole.role_id == admin_role.role_id
        ).first()

        if not existing_mapping:
            user_role = UserRole(
                user_role_id = generate_id("USRROLE", db),
                user_id = admin_user.user_id,
                role_id = admin_role.role_id,
                assigned_by=admin_user.user_id
            )
            db.add(user_role)
            db.commit()
            print("Admin role assigned to user successfully!")
        else:
            print("Admin role already assigned - skipped")

        # Map admin user to WH001

        warehouse = db.query(Warehouse).filter(
            Warehouse.warehouse_code == "WH001"
        ).first()

        if not warehouse:
            raise Exception("Warehouse WH001 not found. Seed warehouse first.")

        existing_user_wh = db.query(UserWarehouse).filter(
            UserWarehouse.user_id == admin_user.user_id,
            UserWarehouse.warehouse_id == warehouse.warehouse_id
        ).first()

        if not existing_user_wh:
            user_wh = UserWarehouse(
                user_id=admin_user.user_id,
                warehouse_id=warehouse.warehouse_id
            )
            db.add(user_wh)
            db.commit()
            print("Admin mapped to warehouse successfully!")
        else:
            print("Admin already mapped to warehouse - skipped.")

    except IntegrityError as e:
        db.rollback()
        print("Integrity Error: ", e)
    except Exception as e:
        db.rollback()
        print("Error seeding data: ", e)
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()



# ================= SUPERVISOR USER =================

def seed_data():
    db = SessionLocal()

    try:
        # ================= ADMIN PERMISSION FIX =================
        admin_role = db.query(Role).filter(Role.role_code == "WMS_ADMIN").first()
        role_manage = db.query(Permission).filter(
            Permission.permission_code == "role.manage"
        ).first()

        if admin_role and role_manage:
            existing = db.query(RolePermission).filter(
                RolePermission.role_id == admin_role.role_id,
                RolePermission.permission_id == role_manage.permission_id
            ).first()

            if not existing:
                db.add(RolePermission(
                    role_id=admin_role.role_id,
                    permission_id=role_manage.permission_id
                ))
                db.commit()
                print("role.manage added to WMS_ADMIN ✅")

        # ================= SUPERVISOR USER =================
        supervisor_user = db.query(User).filter(
            User.username == "supervisor"
        ).first()

        if not supervisor_user:
            supervisor_user = User(
                user_id=generate_id("USR", db),
                username="supervisor",
                email="supervisor@wms.com",
                password_hash=hash_password("super123"),
                is_active=True
            )
            db.add(supervisor_user)
            db.commit()
            print("Supervisor CREATED ✅")
        else:
            supervisor_user.password_hash = hash_password("super123")
            db.commit()
            print("Supervisor PASSWORD RESET ✅")

        supervisor_role = db.query(Role).filter(
            Role.role_code == "SUPERVISOR"
        ).first()

        existing_mapping = db.query(UserRole).filter(
            UserRole.user_id == supervisor_user.user_id,
            UserRole.role_id == supervisor_role.role_id
        ).first()

        if not existing_mapping:
            db.add(UserRole(
                user_role_id=generate_id("USRROLE", db),
                user_id=supervisor_user.user_id,
                role_id=supervisor_role.role_id
            ))
            db.commit()
            print("Supervisor ROLE ASSIGNED ✅")

    except Exception as e:
        db.rollback()
        print("Error:", e)

    finally:
        db.close()