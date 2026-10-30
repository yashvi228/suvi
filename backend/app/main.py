import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import get_engine, Base, SessionLocal
from app.seed import seed_database
from app.routers import (
    auth_router,
    categories_router,
    products_router,
    cart_router,
    orders_router,
    wishlist_router,
    coupons_router,
    user_router,
    admin_router
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    engine = get_engine()
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables verified.")

    # Seed initial data
    db = SessionLocal()
    try:
        seed_database(db)
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router.router, prefix=settings.API_V1_STR)
app.include_router(categories_router.router, prefix=settings.API_V1_STR)
app.include_router(products_router.router, prefix=settings.API_V1_STR)
app.include_router(cart_router.router, prefix=settings.API_V1_STR)
app.include_router(orders_router.router, prefix=settings.API_V1_STR)
app.include_router(wishlist_router.router, prefix=settings.API_V1_STR)
app.include_router(coupons_router.router, prefix=settings.API_V1_STR)
app.include_router(user_router.router, prefix=settings.API_V1_STR)
app.include_router(admin_router.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "brand": "SUVI — Fine Jewellery",
        "status": "online",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
