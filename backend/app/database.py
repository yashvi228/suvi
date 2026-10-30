import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger(__name__)

engine = None
SessionLocal = None

def get_engine():
    global engine, SessionLocal
    if engine is not None:
        return engine

    # First attempt: Try configured DATABASE_URL (e.g. PostgreSQL)
    if "postgresql" in settings.DATABASE_URL:
        try:
            test_engine = create_engine(
                settings.DATABASE_URL,
                pool_pre_ping=True,
                connect_args={"connect_timeout": 3}
            )
            with test_engine.connect() as conn:
                logger.info("Successfully connected to PostgreSQL database.")
            engine = test_engine
        except Exception as e:
            logger.warning(
                f"Could not connect to PostgreSQL ({e}). "
                f"Falling back to local SQLite database at {settings.SQLITE_FALLBACK_URL}."
            )
            engine = create_engine(
                settings.SQLITE_FALLBACK_URL,
                connect_args={"check_same_thread": False}
            )
    else:
        engine = create_engine(
            settings.DATABASE_URL,
            connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
        )

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return engine

get_engine()
Base = declarative_base()

def get_db():
    global SessionLocal
    if SessionLocal is None:
        get_engine()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
