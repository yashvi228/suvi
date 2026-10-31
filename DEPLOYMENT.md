# 🚀 SUVI Fine Jewellery — Deployment Guide

This guide covers the two best ways to deploy the SUVI E-Commerce website:
1. **Option 1 (Recommended & Free): Vercel (Frontend) + Render / Railway (Backend) + Neon (PostgreSQL)**
2. **Option 2 (Single Server / Cloud VPS): One-Command Docker Compose (DigitalOcean, AWS, Hetzner)**

---

## 🌟 Option 1: Vercel + Render (Recommended & Free)

This is the standard modern architecture: fast global CDN for the React frontend, and a managed container for the FastAPI backend.

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Complete SUVI Jewellery E-Commerce website with deployment configs"
git remote add origin https://github.com/your-username/suvi.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy Backend to Render (Free)
1. Go to **[Render.com](https://render.com)** and sign in.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository `suvi`.
4. Configure the service settings:
   - **Name:** `suvi-api`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. In **Environment Variables**, add:
   - `SECRET_KEY`: `suvi-luxury-jewellery-secret-key-2026-cormorant-garamond`
   - *(Optional for PostgreSQL)* `DATABASE_URL`: Your PostgreSQL connection string (from Neon.tech or Render PostgreSQL). If left unset, it automatically uses the local SQLite database.
6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL (e.g. `https://suvi-api.onrender.com`).

---

### Step 3: Deploy Frontend to Vercel (Free)
1. Go to **[Vercel.com](https://vercel.com)** and sign in with GitHub.
2. Click **Add New…** → **Project** and select `suvi`.
3. In Project Settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and choose `frontend`.
4. Under **Environment Variables**, add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://suvi-api.onrender.com/api` *(Your Render backend URL with `/api`)*
5. Click **Deploy**.
6. Your website is live with free global CDN and HTTPS!

---

## 🐳 Option 2: Docker Compose (Any Cloud VPS)

If you have a Linux VPS (DigitalOcean Droplet, AWS EC2, Linode, or Hetzner):

1. **SSH into your server and clone the repo:**
   ```bash
   git clone https://github.com/your-username/suvi.git
   cd suvi
   ```

2. **Launch with Docker Compose:**
   ```bash
   docker compose up -d --build
   ```
   *This automatically starts:*
   - **PostgreSQL 16** container on port 5432
   - **FastAPI Backend** container on port 8000
   - **React Frontend + Nginx** container on port 80

3. **(Optional) Add Free SSL with Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🛠️ Environment Variables Reference

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | SQLAlchemy PostgreSQL URI | `postgresql+psycopg2://user:pass@host:5432/suvi_db` |
| `SECRET_KEY` | Secret key for signing JWTs | Any random 32+ character string |
| `VITE_API_URL` | Frontend URL pointing to backend API | `https://your-api.onrender.com/api` |
