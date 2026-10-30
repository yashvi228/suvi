from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.database import get_db
from app.models import Order, Product, User, Category
from app.schemas import AnalyticsResponse, OrderResponse, UserResponse
from app.auth import get_admin_user

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

@router.get("/analytics", response_model=AnalyticsResponse)
def get_admin_analytics(db: Session = Depends(get_db), _admin: User = Depends(get_admin_user)):
    total_rev = db.query(func.coalesce(func.sum(Order.final_amount), 0.0)).filter(
        Order.order_status != "CANCELLED"
    ).scalar()

    total_orders = db.query(Order).count()
    total_customers = db.query(User).filter(User.role == "customer").count()
    total_products = db.query(Product).count()
    low_stock = db.query(Product).filter(Product.stock <= 5).count()

    recent_orders = db.query(Order).order_by(desc(Order.created_at)).limit(8).all()

    return {
        "total_revenue": round(float(total_rev), 2),
        "total_orders": total_orders,
        "total_customers": total_customers,
        "total_products": total_products,
        "low_stock_products": low_stock,
        "recent_orders": recent_orders
    }

@router.get("/orders", response_model=List[OrderResponse])
def get_all_orders(db: Session = Depends(get_db), _admin: User = Depends(get_admin_user)):
    return db.query(Order).order_by(desc(Order.created_at)).all()

@router.get("/customers", response_model=List[UserResponse])
def get_all_customers(db: Session = Depends(get_db), _admin: User = Depends(get_admin_user)):
    return db.query(User).filter(User.role == "customer").order_by(desc(User.created_at)).all()
