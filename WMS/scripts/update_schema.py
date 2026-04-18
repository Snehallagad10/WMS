import os
import sys

print("Updating DB Schema (Struture Only)...")

res1 = os.system("pg_dump -U postgres -d wms --schema-only -f db/wms_schema.sql")

if res1 != 0:
    print("Failed to generate schema file")
    sys.exit(1)

print("Updating full DB dump (structure + data)...")

res2 = os.system("pg_dump -U postgres -d wms -f db/wms.sql")

if res2 != 0:
    print("Failed to generate full dump")
    sys.exit(1)

print("Both SQL files update successfully!")