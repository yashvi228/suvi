import sys
from sqlalchemy import inspect, text
from app.database import get_engine, SessionLocal
from app.models import User, Category, Product, Order, CartItem, WishlistItem, Address, Coupon, Review

def show_database_overview(table_name=None):
    engine = get_engine()
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    db = SessionLocal()
    try:
        if not table_name:
            print("\n" + "=" * 70)
            print("💎 SUVI FINE JEWELLERY — DATABASE OVERVIEW")
            print("=" * 70)
            print(f"Database Engine: {engine.url}")
            print("-" * 70)
            print(f"{'Table Name':<20} | {'Rows':<6} | {'Columns'}")
            print("-" * 70)
            
            for t in sorted(tables):
                cols = [c['name'] for c in inspector.get_columns(t)]
                count = db.execute(text(f"SELECT COUNT(*) FROM {t}")).scalar()
                print(f"{t:<20} | {count:<6} | {', '.join(cols[:4])}...")
            
            print("=" * 70)
            print("Tip: Run 'python inspect_db.py <table_name>' to view all records.")
            print("Examples: python inspect_db.py products")
            print("          python inspect_db.py orders")
            print("          python inspect_db.py users")
            print("=" * 70 + "\n")
        else:
            t = table_name.lower().strip()
            if t in ["product", "products"]:
                items = db.query(Product).all()
                print(f"\n--- PRODUCTS TABLE ({len(items)} items) ---")
                for p in items:
                    print(f"[{p.id}] {p.name:<28} | {p.category_name:<16} | ₹{p.price:<10,.0f} | Stock: {p.stock}")
            elif t in ["user", "users"]:
                users = db.query(User).all()
                print(f"\n--- USERS TABLE ({len(users)} users) ---")
                for u in users:
                    print(f"[{u.id}] {u.full_name:<20} | {u.email:<24} | Role: {u.role:<10} | Phone: {u.phone}")
            elif t in ["order", "orders"]:
                orders = db.query(Order).all()
                print(f"\n--- ORDERS TABLE ({len(orders)} orders) ---")
                for o in orders:
                    print(f"[{o.id}] {o.order_number:<18} | Patron: {o.customer_name:<18} | Total: ₹{o.final_amount:<10,.0f} | Status: {o.order_status}")
            elif t in ["category", "categories"]:
                cats = db.query(Category).all()
                print(f"\n--- CATEGORIES TABLE ({len(cats)} categories) ---")
                for c in cats:
                    print(f"[{c.id}] {c.name:<25} | Slug: {c.slug}")
            elif t in ["coupon", "coupons"]:
                coupons = db.query(Coupon).all()
                print(f"\n--- COUPONS TABLE ({len(coupons)} coupons) ---")
                for c in coupons:
                    print(f"[{c.id}] Code: {c.code:<12} | Discount: {c.discount_percent}% | Max: ₹{c.max_discount}")
            else:
                print(f"Unknown table '{table_name}'. Available: {', '.join(tables)}")
    finally:
        db.close()

if __name__ == "__main__":
    tbl = sys.argv[1] if len(sys.argv) > 1 else None
    show_database_overview(tbl)
