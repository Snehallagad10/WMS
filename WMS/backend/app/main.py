from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.openapi.utils import get_openapi
from fastapi.staticfiles import StaticFiles
import logging
from pathlib import Path

from . import models
from .db import Base, engine, test_database_connection

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

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)

app = FastAPI()
logger = logging.getLogger(__name__)

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

BASE_DIR = Path(__file__).resolve().parents[2]
UPLOADS_DIR = BASE_DIR / "uploads"
UPLOADS_UPLOADING_DIR = UPLOADS_DIR / "uploading"

try:
    UPLOADS_UPLOADING_DIR.mkdir(parents=True, exist_ok=True)
except OSError:
    logger.exception("Failed to create uploads directory at startup import time")

# Static Files (Image Access)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR), check_dir=False), name="uploads")

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


@app.on_event("startup")
def startup() -> None:
    logger.info("FastAPI application startup began")

    try:
        try:
            UPLOADS_UPLOADING_DIR.mkdir(parents=True, exist_ok=True)
            logger.info("Uploads directory is ready at %s", UPLOADS_UPLOADING_DIR)
        except OSError:
            logger.exception("Failed to create uploads directory during startup")

        if engine is None:
            logger.warning(
                "Database engine is unavailable. App will continue without database initialization"
            )
            return

        db_ready = test_database_connection(engine)
        logger.info("Database connection status: %s", "connected" if db_ready else "failed")

        if not db_ready:
            logger.warning(
                "Skipping metadata initialization because database connection test failed"
            )
            return

        try:
            logger.info("Initializing database tables")
            Base.metadata.create_all(bind=engine)
            logger.info("Database initialization completed")
        except Exception:
            logger.exception("Database initialization failed during startup")
    except Exception:
        logger.exception("Unhandled exception during FastAPI startup")
    finally:
        logger.info("FastAPI application startup finished")

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
