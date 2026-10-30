from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, Field

# User & Auth
class UserRegister(BaseModel):
    email: str
    password: str = Field(..., min_length=6)
    full_name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Address
class AddressCreate(BaseModel):
    full_name: str
    phone: str
    address_line: str
    city: str
    state: str
    postal_code: str
    is_default: bool = False

class AddressResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    phone: str
    address_line: str
    city: str
    state: str
    postal_code: str
    is_default: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Category
class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = 0

class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: int

    class Config:
        from_attributes = True

# Product
class ProductBase(BaseModel):
    name: str
    slug: str
    category_id: int
    price: float
    original_price: Optional[float] = None
    description: Optional[str] = None
    metal_type: Optional[str] = "18k Yellow Gold"
    purity: Optional[str] = "18 KT (750)"
    diamond_weight: Optional[str] = "0.45 ct"
    gross_weight: Optional[str] = "4.20 g"
    stock: int = 10
    tag: Optional[str] = None  # "best", "new", "trend"
    images: List[str] = []
    is_featured: bool = False

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    category_id: Optional[int] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    description: Optional[str] = None
    metal_type: Optional[str] = None
    purity: Optional[str] = None
    diamond_weight: Optional[str] = None
    gross_weight: Optional[str] = None
    stock: Optional[int] = None
    tag: Optional[str] = None
    images: Optional[List[str]] = None
    is_featured: Optional[bool] = None

class ProductResponse(ProductBase):
    id: int
    category_name: Optional[str] = None
    rating: float
    review_count: int
    created_at: datetime

    class Config:
        from_attributes = True

# Cart
class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1
    selected_size: Optional[str] = "Standard"
    selected_metal: Optional[str] = "18k Yellow Gold"

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    selected_size: Optional[str] = None
    selected_metal: Optional[str] = None
    product: ProductResponse

    class Config:
        from_attributes = True

# Order
class OrderItem(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int
    selected_size: Optional[str] = None
    selected_metal: Optional[str] = None
    image: Optional[str] = None

class ShippingAddress(BaseModel):
    full_name: str
    phone: str
    address_line: str
    city: str
    state: str
    postal_code: str

class OrderCreate(BaseModel):
    items: List[OrderItem]
    shipping_address: ShippingAddress
    total_amount: float
    discount_amount: float = 0.0
    final_amount: float
    payment_method: str = "UPI"
    coupon_code: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    order_status: str
    tracking_number: Optional[str] = None

class OrderResponse(BaseModel):
    id: int
    order_number: str
    user_id: Optional[int] = None
    customer_name: str
    customer_email: str
    customer_phone: str
    items: Any
    shipping_address: Any
    total_amount: float
    discount_amount: float
    final_amount: float
    payment_method: str
    payment_status: str
    order_status: str
    tracking_number: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Wishlist
class WishlistToggle(BaseModel):
    product_id: int

# Coupon
class CouponValidate(BaseModel):
    code: str
    order_amount: float

class CouponResponse(BaseModel):
    code: str
    discount_percent: float
    discount_amount: float
    valid: bool
    message: str

# Review
class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str

class ReviewResponse(BaseModel):
    id: int
    product_id: int
    user_name: str
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True

# Admin Analytics
class AnalyticsResponse(BaseModel):
    total_revenue: float
    total_orders: int
    total_customers: int
    total_products: int
    low_stock_products: int
    recent_orders: List[OrderResponse]
