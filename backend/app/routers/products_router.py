from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from app.database import get_db
from app.models import Product, Category, Review, User
from app.schemas import (
    ProductCreate, ProductUpdate, ProductResponse,
    ReviewCreate, ReviewResponse
)
from app.auth import get_admin_user, get_current_user_optional, get_current_user

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = Query(None, description="Category name or slug"),
    tag: Optional[str] = Query(None, description="Tag e.g. best, new, trend"),
    q: Optional[str] = Query(None, description="Search query"),
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    metal_type: Optional[str] = None,
    sort: Optional[str] = Query("f", description="f=featured, l=price low-to-high, h=price high-to-low, r=rating"),
    featured: Optional[bool] = None,
    in_stock_only: Optional[bool] = False,
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if category and category.lower() != "all":
        query = query.join(Category).filter(
            or_(
                Category.slug.ilike(category),
                Category.name.ilike(category),
                Product.category_name.ilike(category)
            )
        )

    if tag:
        query = query.filter(Product.tag == tag)

    if q:
        search_filter = f"%{q.lower()}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_filter),
                Product.description.ilike(search_filter),
                Product.metal_type.ilike(search_filter)
            )
        )

    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if metal_type:
        query = query.filter(Product.metal_type.ilike(f"%{metal_type}%"))

    if in_stock_only:
        query = query.filter(Product.stock > 0)

    if featured is not None:
        query = query.filter(Product.is_featured == featured)

    if sort == "l":
        query = query.order_by(asc(Product.price))
    elif sort == "h":
        query = query.order_by(desc(Product.price))
    elif sort == "r":
        query = query.order_by(desc(Product.rating))
    else:
        query = query.order_by(desc(Product.is_featured), desc(Product.id))

    return query.all()

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    prod_in: ProductCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user)
):
    cat = db.query(Category).filter(Category.id == prod_in.category_id).first()
    if not cat:
        raise HTTPException(status_code=400, detail="Invalid category_id")

    existing = db.query(Product).filter(Product.slug == prod_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product slug already exists")

    prod = Product(
        **prod_in.model_dump(),
        category_name=cat.name
    )
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    prod_in: ProductUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user)
):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = prod_in.model_dump(exclude_unset=True)
    if "category_id" in update_data:
        cat = db.query(Category).filter(Category.id == update_data["category_id"]).first()
        if cat:
            prod.category_name = cat.name

    for key, val in update_data.items():
        setattr(prod, key, val)

    db.commit()
    db.refresh(prod)
    return prod

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user)
):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(prod)
    db.commit()
    return None

@router.get("/{product_id}/reviews", response_model=List[ReviewResponse])
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.product_id == product_id).order_by(desc(Review.created_at)).all()

@router.post("/{product_id}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def add_product_review(
    product_id: int,
    review_in: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    rev = Review(
        product_id=product_id,
        user_id=current_user.id,
        user_name=current_user.full_name,
        rating=review_in.rating,
        comment=review_in.comment
    )
    db.add(rev)

    # Recalculate average rating
    all_revs = db.query(Review).filter(Review.product_id == product_id).all()
    new_count = len(all_revs) + 1
    new_avg = (sum(r.rating for r in all_revs) + review_in.rating) / new_count
    prod.rating = round(new_avg, 1)
    prod.review_count = new_count

    db.commit()
    db.refresh(rev)
    return rev
