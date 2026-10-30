from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Coupon
from app.schemas import CouponValidate, CouponResponse

router = APIRouter(prefix="/coupons", tags=["Coupons"])

@router.post("/apply", response_model=CouponResponse)
def apply_coupon(coupon_data: CouponValidate, db: Session = Depends(get_db)):
    code_upper = coupon_data.code.strip().upper()
    coupon = db.query(Coupon).filter(
        Coupon.code == code_upper,
        Coupon.is_active == True
    ).first()

    if not coupon:
        raise HTTPException(status_code=400, detail="Invalid coupon code")

    if coupon_data.order_amount < coupon.min_order_amount:
        raise HTTPException(
            status_code=400,
            detail=f"Coupon requires a minimum order value of ₹{coupon.min_order_amount:,.0f}"
        )

    discount_calc = (coupon.discount_percent / 100.0) * coupon_data.order_amount
    if coupon.max_discount and discount_calc > coupon.max_discount:
        discount_calc = coupon.max_discount

    return {
        "code": coupon.code,
        "discount_percent": coupon.discount_percent,
        "discount_amount": round(discount_calc, 2),
        "valid": True,
        "message": f"Coupon {coupon.code} applied successfully! You saved ₹{discount_calc:,.0f}"
    }
