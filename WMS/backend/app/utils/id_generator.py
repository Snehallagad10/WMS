# from datetime import datetime
# from sqlalchemy import text

# def generate_id(entity: str, db):
#     now = datetime.now()

#     date_str = now.strftime("%d%m%Y")
#     time_str = now.strftime("%H%M%S")

#     result = db.execute(
#         text("""
#         SELECT last_serial FROM id_counters
#         WHERE entity = :entity AND date = :date
#         FOR UPDATE
#         """),
#         {"entity": entity, "date": date_str}
#     ).fetchone()

#     if result:
#         serial = result[0] + 1

#         db.execute(
#             text("""
#             UPDATE id_counters
#             SET last_serial = :serial
#             WHERE entity = :entity AND date = :date
#             """),
#             {"serial": serial, "entity": entity, "date": date_str}
#         )

#     else:
#         serial = 1

#         db.execute(
#             text("""
#             INSERT INTO id_counters(entity, date, last_serial)
#             VALUES(:entity, :date, :serial)
#             """),
#             {"entity": entity, "date": date_str, "serial": serial}
#         )

#     db.flush()

#     serial_str = str(serial).zfill(4)

#     return f"{entity}_{date_str}_{time_str}_{serial_str}"


# from sqlalchemy import text
# from datetime import datetime

# def generate_id(entity: str, db):

#     today = datetime.utcnow().date()

#     # get last serial for this entity
#     result = db.execute(
#         text("""
#         SELECT last_serial FROM id_counters
#         WHERE entity = :entity AND date = :date
#         FOR UPDATE
#         """),
#         {"entity": entity, "date": today}
#     ).fetchone()

#     if result:
#         serial = result[0] + 1

#         db.execute(
#             text("""
#             UPDATE id_counters
#             SET last_serial = :serial
#             WHERE entity = :entity AND date = :date
#             """),
#             {"serial": serial, "entity": entity, "date": today}
#         )

#     else:
#         serial = 1

#         db.execute(
#             text("""
#             INSERT INTO id_counters(entity, date, last_serial)
#             VALUES(:entity, :date, :serial)
#             """),
#             {"entity": entity, "date": today, "serial": serial}
#         )

#     db.flush()
#     date_str = today.strftime("%d%m%y") # Date format as DDMMYYYY

#     return f"{entity}_{str(serial).zfill(3)}"


# from sqlalchemy import text

# def generate_id(prefix, db):
#     count = db.execute(
#         text("SELECT COUNT(*) FROM gate_entries")
#     ).scalar()

#     next_id = count + 1

#     return f"{prefix}-{next_id:03d}"

from sqlalchemy import text


def generate_id(prefix: str, db):
    table_map = {
        "GE": "gate_entries",
        "GMAT": "gate_material_details",
        "GDOC": "gate_documents",
        "GINSP": "gate_vehicle_inspection",
        "GPHOTO": "gate_entry_photos",
    }

    table_name = table_map.get(prefix)

    if not table_name:
        raise ValueError(f"Unknown prefix: {prefix}")

    query = text(
        f"""
        SELECT id FROM {table_name}
        ORDER BY id DESC
        LIMIT 1
    """
    )

    last_id = db.execute(query).scalar()

    if last_id:
        last_num = int(last_id.split("-")[-1])
        next_num = last_num + 1
    else:
        next_num = 1

    return f"{prefix}-{next_num:03d}"
