import logging
import os
import urllib.parse
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

logger = logging.getLogger(__name__)

ENV_FILE = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=ENV_FILE)


def build_database_url() -> str | None:
    try:
        database_url = os.getenv("DATABASE_URL")
        if database_url:
            # Render commonly provides a Postgres URL via DATABASE_URL.
            normalized_url = database_url.replace("postgres://", "postgresql://", 1)
            logger.info("DATABASE_URL found in environment")
            return normalized_url

        db_user = os.getenv("DB_USER")
        db_password = os.getenv("DB_PASSWORD")
        db_host = os.getenv("DB_HOST")
        db_port = os.getenv("DB_PORT", "5432")
        db_name = os.getenv("DB_NAME")

        if all([db_user, db_password, db_host, db_name]):
            quoted_password = urllib.parse.quote_plus(db_password)
            logger.info("Building database URL from DB_* environment variables")
            return (
                f"postgresql+psycopg2://{db_user}:{quoted_password}@"
                f"{db_host}:{db_port}/{db_name}"
            )

        logger.warning(
            "Database configuration is incomplete. Set DATABASE_URL or DB_USER, "
            "DB_PASSWORD, DB_HOST, and DB_NAME."
        )
        return None
    except Exception:
        logger.exception("Failed while building database configuration")
        return None


def create_db_engine(database_url: str | None):
    if not database_url:
        logger.warning("Database engine was not created because no database URL is configured")
        return None

    try:
        logger.info("Creating SQLAlchemy engine")
        return create_engine(
            database_url,
            echo=os.getenv("SQLALCHEMY_ECHO", "false").lower() == "true",
            pool_pre_ping=True,
        )
    except Exception:
        logger.exception("Failed to create SQLAlchemy engine")
        return None


def test_database_connection(db_engine) -> bool:
    if db_engine is None:
        logger.warning("Skipping database connection test because engine is unavailable")
        return False

    try:
        with db_engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        logger.info("Database connection test succeeded")
        return True
    except Exception:
        logger.exception("Database connection test failed")
        return False


DATABASE_URL = build_database_url()
engine = create_db_engine(DATABASE_URL)
SessionLocal = (
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
    if engine is not None
    else None
)

Base = declarative_base()


def get_db():
    if SessionLocal is None:
        logger.error("Database session requested before database was configured.")
        raise RuntimeError("Database is not configured.")

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
