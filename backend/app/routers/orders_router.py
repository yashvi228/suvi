import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models import Order, CartItem, Product, User
from app.schemas import OrderCreate, OrderResponse, OrderStatusUpdate
from app.auth import get_current_user_optional, get_current_user, get_admin_user

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Cannot place an empty order")

    # Generate unique luxurious order number e.g. SUVI-2026-XXXX
    order_num = f"SUV-{datetime.datetime.utcnow().strftime('%y%m')}-{uuid.uuid4().hex[:6].upper()}"

    # Customer info
    cust_name = order_in.shipping_address.full_name
    cust_phone = order_in.shipping_address.phone
    cust_email = current_user.email if current_user else "guest@suvijewels.in"

    order = Order(
        order_number=order_num,
        user_id=current_user.id if current_user else None,
        customer_name=cust_name,
        customer_email=cust_email,
        customer_phone=cust_phone,
        items=[item.model_dump() for item in order_in.items],
        shipping_address=order_in.shipping_address.model_dump(),
        total_amount=order_in.total_amount,
        discount_amount=order_in.discount_amount,
        final_amount=order_in.final_amount,
        payment_method=order_in.payment_method,
        payment_status="PAID" if order_in.payment_method != "Cash on Delivery" else "PENDING",
        order_status="CONFIRMED",
        tracking_number=f"TRK-{uuid.uuid4().hex[:8].upper()}"
    )

    # Decrement stock
    for item in order_in.items:
        prod = db.query(Product).filter(Product.id == item.product_id).first()
        if prod:
            prod.stock = max(0, prod.stock - item.quantity)

    # If logged in, clear cart
    if current_user:
        db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()

    db.add(order)
    db.commit()
    db.refresh(order)
    return order

@router.get("/my", response_model=List[OrderResponse])
def get_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Order).filter(Order.user_id == current_user.id).order_by(desc(Order.created_at)).all()

@router.get("/{order_number}", response_model=OrderResponse)
def get_order_by_number(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.order_status = status_update.order_status
    if status_update.tracking_number:
        order.tracking_number = status_update.tracking_number

    db.commit()
    db.refresh(order)
    return order
