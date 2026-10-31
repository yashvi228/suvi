# SUVI — Fine Jewellery E-Commerce Platform

A bespoke, high-luxury jewellery e-commerce platform built to closely match the provided editorial reference design. Powered by **React.js + Vite** on the frontend and **Python FastAPI + SQLAlchemy (PostgreSQL / SQLite)** on the backend.

---


---

## 🚀 Quickstart Guide

### 1. Backend (FastAPI)

```bash
cd backend

# Activate virtual environment
source venv/bin/activate

# Install dependencies (already pre-installed)
pip install -r requirements.txt

# Run the FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- **API Base URL**: `http://localhost:8000/api`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

### 2. Frontend (React + Vite)

```bash
cd frontend

# Install npm dependencies (already pre-installed)
npm install

# Start Vite dev server
npm run dev
```

- **Storefront URL**: `http://localhost:5173`

---

## 🔑 Demo Accounts for Immediate Testing

Both accounts come pre-configured in the database and can also be auto-filled via the **"Quick Fill Demo Accounts"** buttons in the Sign In modal:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Patron / Customer** | `ananya@suvi.com` | `password123` | Browsing, Bag, Checkout, Saved Addresses, My Orders, Wishlist |
| **Atelier Administrator** | `admin@suvi.com` | `admin123` | Full access + Atelier Admin Operations (`/admin`), Sales Analytics, Product CRUD, Order Status Updating |

---

## 🏷️ Demo Coupons

- **`SUVI10`**: 10% discount on orders over ₹20,000 (up to ₹15,000 savings)
- **`BRIDAL20`**: 20% discount on bridal orders over ₹50,000 (up to ₹25,000 savings)
- **`WELCOME5`**: 5% welcome discount on orders over ₹10,000