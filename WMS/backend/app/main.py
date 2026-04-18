from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.openapi.utils import get_openapi
from fastapi.staticfiles import StaticFiles
import os

from .db import engine
from .models import core

# ROUTERS
from .routes.auth import router as auth_router
from .routes.gates import router as gates_router
from .routes.gate_entries import router as gate_entries_router
from .routes.warehouses import router as warehouse_router
from .routes.users import router as users_router
from .routes.roles import router as roles_router
from .routes.permissions import router as permissions_router
from .routes.docks import router as docks_router
from .routes.dock_allocation import router as dock_alloc_router

# Create tables
core.Base.metadata.create_all(bind=engine)

app = FastAPI()

security = HTTPBearer()

# 🔴 IMPORTANT: CORS MUST BE BEFORE ROUTERS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create folders
os.makedirs("uploads/uploading", exist_ok=True)
# Static Files (Image Access)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ROUTERS
app.include_router(auth_router)
app.include_router(gates_router)
app.include_router(gate_entries_router)
app.include_router(warehouse_router)
app.include_router(users_router)
app.include_router(roles_router)
app.include_router(permissions_router)
app.include_router(docks_router)
app.include_router(dock_alloc_router)

@app.get("/")
def root():
    return {"message": "WMS backend running"}


@app.get("/health")
def health():
    return {"status": "ok"}


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="WMS Backend",
        version="1.0.0",
        description="Warehouse Management System API",
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    openapi_schema["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
