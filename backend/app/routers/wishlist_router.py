from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import WishlistItem, Product, User
from app.schemas import WishlistToggle, ProductResponse
from app.auth import get_current_user

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])

@router.get("", response_model=List[ProductResponse])
def get_wishlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(WishlistItem).filter(WishlistItem.user_id == current_user.id).all()
    product_ids = [item.product_id for item in items]
    return db.query(Product).filter(Product.id.in_(product_ids)).all() if product_ids else []

@router.post("/toggle")
def toggle_wishlist(
    item_in: WishlistToggle,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prod = db.query(Product).filter(Product.id == item_in.product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == item_in.product_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"status": "removed", "product_id": item_in.product_id}
    else:
        new_item = WishlistItem(user_id=current_user.id, product_id=item_in.product_id)
        db.add(new_item)
        db.commit()
        return {"status": "added", "product_id": item_in.product_id}
