import datetime
from sqlalchemy.orm import Session
from app.models import User, Category, Product, Coupon, Order, Review, Address
from app.auth import get_password_hash

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Category).first():
        return

    print("Seeding SUVI Fine Jewellery database...")

    # 1. Categories
    categories_data = [
        {"name": "Rings", "slug": "rings", "description": "Solitaires, halo rings, and bands in 18k hallmarked gold.", "sort_order": 1, "image_url": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"},
        {"name": "Earrings", "slug": "earrings", "description": "Studs, jhumkas, and drop earrings crafted with precision diamonds.", "sort_order": 2, "image_url": "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80"},
        {"name": "Necklaces", "slug": "necklaces", "description": "Delicate chains, statement pendants, and diamond colliers.", "sort_order": 3, "image_url": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"},
        {"name": "Bangles", "slug": "bangles", "description": "Kadas, stackable bangles, and diamond encrusted heritage cuffs.", "sort_order": 4, "image_url": "https://images.unsplash.com/photo-1611591475155-426c045b4c61?auto=format&fit=crop&w=800&q=80"},
        {"name": "Bracelets", "slug": "bracelets", "description": "Tennis bracelets, charm links, and modern wristwear.", "sort_order": 5, "image_url": "https://images.unsplash.com/photo-1611591475155-426c045b4c61?auto=format&fit=crop&w=800&q=80"},
        {"name": "Bridal Jewellery", "slug": "bridal-jewellery", "description": "Heirloom bridal sets, kundan-inspired choker sets, and tiaras.", "sort_order": 6, "image_url": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"}
    ]

    cat_map = {}
    for c in categories_data:
        cat = Category(**c)
        db.add(cat)
        db.flush()
        cat_map[cat.name] = cat.id

    # 2. Products (from reference website + rich jewelry details)
    products_data = [
        {
            "name": "Aurelia Solitaire Ring",
            "slug": "aurelia-solitaire-ring",
            "category_name": "Rings",
            "price": 84500.0,
            "original_price": 95000.0,
            "description": "A breathtaking 1.05ct IGI-certified round brilliant diamond mounted on a six-prong 18k yellow gold band with hidden diamond accents along the gallery. Designed in Surat for heirloom longevity.",
            "metal_type": "18k Yellow Gold",
            "purity": "18 KT (750)",
            "diamond_weight": "1.05 ct (VVS1, E)",
            "gross_weight": "3.85 g",
            "stock": 8,
            "tag": "best",
            "is_featured": True,
            "rating": 4.9,
            "review_count": 42,
            "images": [
                "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=85"
            ]
        },
        {
            "name": "Lumière Halo Ring",
            "slug": "lumiere-halo-ring",
            "category_name": "Rings",
            "price": 62900.0,
            "original_price": 69000.0,
            "description": "An exquisite cushion-cut center diamond enveloped by a double micro-pavé halo, set in 18k rose gold. Radiates extraordinary brilliance in any light.",
            "metal_type": "18k Rose Gold",
            "purity": "18 KT (750)",
            "diamond_weight": "0.78 ct (VS2, F)",
            "gross_weight": "3.40 g",
            "stock": 12,
            "tag": "new",
            "is_featured": True,
            "rating": 4.8,
            "review_count": 19,
            "images": [
                "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85"
            ]
        },
        {
            "name": "Celeste Drop Earrings",
            "slug": "celeste-drop-earrings",
            "category_name": "Earrings",
            "price": 38900.0,
            "original_price": 44000.0,
            "description": "Articulated chandelier drops featuring marquise and round diamonds falling gracefully from 18k yellow gold hooks. Perfect for galas and evening celebrations.",
            "metal_type": "18k Yellow Gold",
            "purity": "18 KT (750)",
            "diamond_weight": "0.65 ct",
            "gross_weight": "5.10 g",
            "stock": 14,
            "tag": "best",
            "is_featured": True,
            "rating": 5.0,
            "review_count": 31,
            "images": [
                "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85"
            ]
        },
        {
            "name": "Perle Dorée Studs",
            "slug": "perle-doree-studs",
            "category_name": "Earrings",
            "price": 21500.0,
            "original_price": 25000.0,
            "description": "Lustrous South Sea golden cultured pearls crowned with a constellation of bezel-set round brilliant diamonds in 18k solid gold.",
            "metal_type": "18k Yellow Gold",
            "purity": "18 KT (750)",
            "diamond_weight": "0.22 ct",
            "gross_weight": "3.90 g",
            "stock": 20,
            "tag": "trend",
            "is_featured": True,
            "rating": 4.7,
            "review_count": 27,
            "images": [
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=85"
            ]
        },
        {
            "name": "Soleil Pendant Necklace",
            "slug": "soleil-pendant-necklace",
            "category_name": "Necklaces",
            "price": 54200.0,
            "original_price": 60000.0,
            "description": "Sunburst motif pendant with a certified 0.50ct canary diamond center and diamond-paved sunbeams suspended on an 18-inch adjustable 18k chain.",
            "metal_type": "18k Yellow Gold",
            "purity": "18 KT (750)",
            "diamond_weight": "0.82 ct",
            "gross_weight": "6.20 g",
            "stock": 10,
            "tag": "trend",
            "is_featured": True,
            "rating": 4.9,
            "review_count": 38,
            "images": [
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85"
            ]
        },
        {
            "name": "Riviera Gold Chain",
            "slug": "riviera-gold-chain",
            "category_name": "Necklaces",
            "price": 47800.0,
            "original_price": 52000.0,
            "description": "Seamless interlocking hollow-core cable links with high-polish mirror finish and custom SUVI monogram lobster clasp. Everyday luxury.",
            "metal_type": "18k Yellow Gold",
            "purity": "18 KT (750)",
            "diamond_weight": "None",
            "gross_weight": "8.40 g",
            "stock": 15,
            "tag": "new",
            "is_featured": False,
            "rating": 4.8,
            "review_count": 14,
            "images": [
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85"
            ]
        },
        {
            "name": "Maharani Kada Bangle",
            "slug": "maharani-kada-bangle",
            "category_name": "Bangles",
            "price": 96000.0,
            "original_price": 110000.0,
            "description": "Royally inspired openable kada bangle with hand-carved filigree work, finished with uncut polki diamonds and ruby terminal finials.",
            "metal_type": "18k Yellow Gold",
            "purity": "18 KT (750)",
            "diamond_weight": "1.40 ct",
            "gross_weight": "18.50 g",
            "stock": 6,
            "tag": "best",
            "is_featured": True,
            "rating": 5.0,
            "review_count": 22,
            "images": [
                "https://images.unsplash.com/photo-1611591475155-426c045b4c61?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85"
            ]
        },
        {
            "name": "Étoile Slim Bangle",
            "slug": "etoile-slim-bangle",
            "category_name": "Bangles",
            "price": 33400.0,
            "original_price": 38000.0,
            "description": "Modern minimalist stackable oval bangle adorned with 12 star-set flush diamonds. Equipped with a secure double-safety tongue clasp.",
            "metal_type": "18k Rose Gold",
            "purity": "18 KT (750)",
            "diamond_weight": "0.36 ct",
            "gross_weight": "7.10 g",
            "stock": 16,
            "tag": "new",
            "is_featured": False,
            "rating": 4.7,
            "review_count": 18,
            "images": [
                "https://images.unsplash.com/photo-1611591475155-426c045b4c61?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85"
            ]
        },
        {
            "name": "Opale Tennis Bracelet",
            "slug": "opale-tennis-bracelet",
            "category_name": "Bracelets",
            "price": 71500.0,
            "original_price": 82000.0,
            "description": "Classic four-prong inline tennis bracelet hand-set with 54 matched round brilliant diamonds in 18k white gold for a seamless river of light.",
            "metal_type": "18k White Gold",
            "purity": "18 KT (750)",
            "diamond_weight": "2.10 ct (VS, F-G)",
            "gross_weight": "9.80 g",
            "stock": 7,
            "tag": "trend",
            "is_featured": True,
            "rating": 4.9,
            "review_count": 45,
            "images": [
                "https://images.unsplash.com/photo-1611591475155-426c045b4c61?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=85"
            ]
        },
        {
            "name": "Muse Charm Bracelet",
            "slug": "muse-charm-bracelet",
            "category_name": "Bracelets",
            "price": 28900.0,
            "original_price": 32000.0,
            "description": "Cable link chain bracelet hung with five handcrafted celestial charms: moon, sun, star, evil eye, and lotus, each accented with micro-diamonds.",
            "metal_type": "18k Yellow Gold",
            "purity": "18 KT (750)",
            "diamond_weight": "0.18 ct",
            "gross_weight": "5.60 g",
            "stock": 18,
            "tag": "best",
            "is_featured": False,
            "rating": 4.8,
            "review_count": 29,
            "images": [
                "https://images.unsplash.com/photo-1611591475155-426c045b4c61?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85"
            ]
        },
        {
            "name": "Royale Bridal Tiara",
            "slug": "royale-bridal-tiara",
            "category_name": "Bridal Jewellery",
            "price": 128000.0,
            "original_price": 145000.0,
            "description": "An imperial heirloom tiara handcrafted in Surat with cascading diamond arches and pear-cut crowning highlights, designed to be worn across bridal generations.",
            "metal_type": "18k Yellow Gold",
            "purity": "18 KT (750)",
            "diamond_weight": "3.50 ct",
            "gross_weight": "26.80 g",
            "stock": 4,
            "tag": "new",
            "is_featured": True,
            "rating": 5.0,
            "review_count": 12,
            "images": [
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85"
            ]
        },
        {
            "name": "Shaadi Heirloom Set",
            "slug": "shaadi-heirloom-set",
            "category_name": "Bridal Jewellery",
            "price": 215000.0,
            "original_price": 240000.0,
            "description": "The quintessential royal Indian bridal ensemble: grand choker necklace, matching chandelier jhumkas, and maang tikka, encrusted with certified uncut diamonds and natural emerald drops.",
            "metal_type": "18k Yellow Gold",
            "purity": "18 KT (750)",
            "diamond_weight": "5.80 ct",
            "gross_weight": "54.20 g",
            "stock": 3,
            "tag": "trend",
            "is_featured": True,
            "rating": 5.0,
            "review_count": 35,
            "images": [
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85"
            ]
        }
    ]

    for p in products_data:
        c_name = p.pop("category_name")
        c_id = cat_map[c_name]
        prod = Product(**p, category_id=c_id, category_name=c_name)
        db.add(prod)

    # 3. Demo Users
    admin_user = User(
        email="admin@suvi.com",
        hashed_password=get_password_hash("admin123"),
        full_name="SUVI Administrator",
        phone="+91 98765 43210",
        role="admin"
    )
    customer_user = User(
        email="ananya@suvi.com",
        hashed_password=get_password_hash("password123"),
        full_name="Ananya Sharma",
        phone="+91 98200 12345",
        role="customer"
    )
    db.add(admin_user)
    db.add(customer_user)
    db.flush()

    # 4. Saved Address for Ananya
    addr = Address(
        user_id=customer_user.id,
        full_name="Ananya Sharma",
        phone="+91 98200 12345",
        address_line="Flat 402, Sea Green Apartments, Worli Sea Face",
        city="Mumbai",
        state="Maharashtra",
        postal_code="400018",
        is_default=True
    )
    db.add(addr)

    # 5. Coupons
    coupons = [
        Coupon(code="SUVI10", discount_percent=10.0, max_discount=15000.0, min_order_amount=20000.0, is_active=True),
        Coupon(code="BRIDAL20", discount_percent=20.0, max_discount=25000.0, min_order_amount=50000.0, is_active=True),
        Coupon(code="WELCOME5", discount_percent=5.0, max_discount=5000.0, min_order_amount=10000.0, is_active=True),
    ]
    for c in coupons:
        db.add(c)

    # 6. Sample Initial Orders for Analytics
    sample_order = Order(
        order_number="SUV-2603-9B2F81",
        user_id=customer_user.id,
        customer_name="Ananya Sharma",
        customer_email="ananya@suvi.com",
        customer_phone="+91 98200 12345",
        items=[
            {
                "product_id": 1,
                "name": "Aurelia Solitaire Ring",
                "price": 84500.0,
                "quantity": 1,
                "selected_size": "Size 12",
                "selected_metal": "18k Yellow Gold",
                "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85"
            }
        ],
        shipping_address={
            "full_name": "Ananya Sharma",
            "phone": "+91 98200 12345",
            "address_line": "Flat 402, Sea Green Apartments, Worli Sea Face",
            "city": "Mumbai",
            "state": "Maharashtra",
            "postal_code": "400018"
        },
        total_amount=84500.0,
        discount_amount=8450.0,
        final_amount=76050.0,
        payment_method="UPI",
        payment_status="PAID",
        order_status="SHIPPED",
        tracking_number="TRK-98172641",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
    )
    db.add(sample_order)

    # 7. Sample Reviews
    sample_review = Review(
        product_id=1,
        user_id=customer_user.id,
        user_name="Ananya Sharma",
        rating=5,
        comment="The sparkle of this solitaire is unmatched! It came in a velvet box with full IGI certification. SUVI's Surat craftsmanship is pure art.",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
    )
    db.add(sample_review)

    db.commit()
    print("Seeding completed successfully!")
