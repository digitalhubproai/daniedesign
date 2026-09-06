# Danie Design — FastAPI Backend & Admin CRM

## 🚀 Project Overview

Full-stack system powering the Danie Design website with:
- **Python FastAPI** backend connected to **Neon PostgreSQL**
- **Admin CRM Dashboard** built in Next.js (inside `/frontend/app/admin/`)
- Auto-seeded database with all frontend content on first run

---

## 📁 Folder Structure

```
daniedesign/
├── frontend/               # Next.js 16 App Router
│   ├── app/
│   │   ├── admin/          # 🔐 Admin CRM Dashboard (ALL pages)
│   │   │   ├── login/      # Login page
│   │   │   ├── page.tsx    # Dashboard overview
│   │   │   ├── projects/   # Portfolio management
│   │   │   ├── blogs/      # Article management
│   │   │   ├── services/   # Service editing
│   │   │   ├── creative/   # Creative wall
│   │   │   ├── clients/    # Clients & testimonials
│   │   │   ├── team/       # Team members
│   │   │   ├── gallery/    # Studio gallery
│   │   │   ├── inquiries/  # Contact inbox
│   │   │   └── media/      # Image upload library
│   │   └── ...             # Public website pages
│   ├── lib/api.ts          # API helper (all CRUD operations)
│   └── .env.local          # NEXT_PUBLIC_API_URL=http://localhost:8000/api
│
└── backend/                # FastAPI Python Backend
    ├── app/
    │   ├── main.py         # App entry, CORS, routes, lifespan
    │   ├── config.py       # Settings & Neon DB URL
    │   ├── database.py     # SQLAlchemy engine & sessions
    │   ├── auth.py         # JWT tokens & password hashing
    │   ├── seed_data.py    # Auto-seeds DB with all initial data
    │   ├── models/         # SQLAlchemy ORM models
    │   ├── schemas/        # Pydantic request/response schemas
    │   └── routers/        # All API endpoints
    ├── .env                # Neon DB connection string
    ├── pyproject.toml      # Python dependencies
    ├── uv.lock             # Locked dependency versions (uv)
    └── run.py              # Start server
```

---

## ⚙️ Backend Setup & Start

### 1. Install Dependencies

```bash
cd daniedesign/backend
uv sync
```

### 2. Run the Server

```bash
uv run python run.py
```

Server starts at: **http://localhost:8000**

On first run it will:
- ✅ Connect to Neon PostgreSQL
- ✅ Create all database tables
- ✅ Seed initial projects, blogs, services, team, clients, stats, etc.
- ✅ Create default admin account

---

## 🔐 Admin CRM Access

**URL:** http://localhost:3000/admin/login

| Field    | Value                        |
|----------|------------------------------|
| Email    | `admin@daniedesign.com`      |
| Password | `admin123456`                |

---

## 📚 API Documentation (Swagger)

Open: **http://localhost:8000/docs**

All endpoints grouped by section:
- `POST /api/auth/login` — Admin login, returns JWT token
- `GET /api/projects` — Public list of all projects
- `POST /api/projects` — Create project (admin)
- `PUT /api/projects/{slug}` — Update project (admin)
- `DELETE /api/projects/{slug}` — Delete project (admin)
- `POST /api/upload/image` — Upload single image
- `POST /api/upload/multiple` — Upload multiple images
- `GET /api/contact` — Get all inquiries (admin)
- `POST /api/contact` — Submit contact form (public)
- And all `/api/blogs`, `/api/services`, `/api/creative`, `/api/clients`, `/api/team`, `/api/gallery`, `/api/stats` endpoints

---

## 🌐 Frontend Setup & Start

```bash
cd daniedesign/frontend
npm install
npm run dev
```

Frontend at: **http://localhost:3000**

Admin CRM at: **http://localhost:3000/admin**

---

## 📦 Environment Variables

### Backend `.env`
```env
DATABASE_URL=postgresql://neondb_owner:...@neon.tech/neondb?sslmode=require
ADMIN_EMAIL=admin@daniedesign.com
ADMIN_PASSWORD=admin123456
JWT_SECRET=danie-design-crm-super-secret-key-2026
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 🛡️ Admin CRM Pages Summary

| Page | URL | Description |
|------|-----|-------------|
| Login | `/admin/login` | Secure JWT login |
| Dashboard | `/admin` | Stats overview, recent work & leads |
| Projects | `/admin/projects` | Create / edit / delete portfolio projects with image upload |
| Blogs | `/admin/blogs` | Write, edit, publish articles with cover photo & content blocks |
| Services | `/admin/services` | Edit titles, taglines, capabilities, accent colors |
| Creative Wall | `/admin/creative` | Manage hover showcase items |
| Clients | `/admin/clients` | Add/remove client names & testimonials |
| Team | `/admin/team` | Manage squad member photos & roles |
| Gallery | `/admin/gallery` | Studio photo management |
| Inquiries | `/admin/inquiries` | Lead inbox with status management (new → contacted → resolved) |
| Media Library | `/admin/media` | Drag & drop image upload with copyable direct URLs |
