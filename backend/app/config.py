import os

class Settings:
    PROJECT_NAME: str = "SUVI — Fine Jewellery API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "suvi-luxury-jewellery-secret-key-2026-cormorant-garamond")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database URL: default tries postgresql with psycopg2, falls back to sqlite if postgresql unavailable
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/suvi_db")
    SQLITE_FALLBACK_URL: str = "sqlite:///./suvi.db"

settings = Settings()
