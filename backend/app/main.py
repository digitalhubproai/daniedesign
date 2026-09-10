"""FastAPI application entry point: wires up CORS, static uploads, routers and startup seeding."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database
from app.routers import (
    auth_router,
    dashboard_router,
    upload_router,
    projects_router,
    blogs_router,
    services_router,
    creative_router,
    clients_router,
    team_router,
    gallery_router,
    stats_router,
    contact_router,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Runs on startup (create tables + seed) and shutdown; a startup failure is logged, not fatal."""
    logger.info("Connecting to Neon DB & creating tables...")
    try:
        # create_all is idempotent: it only creates tables that don't already exist
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized.")

        # Seed demo/initial content once, on its own session (seeding is skipped for non-empty tables)
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
    except Exception as e:
        # Keep serving even if the DB is unreachable; endpoints will surface the errors
        logger.error(f"Database startup error: {e}")

    # Hand control to the running application; shutdown continues below on exit
    yield
    logger.info("Backend shut down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Danie Design CRM & Website FastAPI Backend powered by Neon PostgreSQL.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS: open to all origins in development, restricted to the configured list in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ENVIRONMENT == "development" else settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uploads Static Files
upload_directory = settings.upload_path
# Serve uploaded files at /uploads without going through the API
app.mount("/uploads", StaticFiles(directory=upload_directory), name="uploads")

# Include Routers (all API routes live under the /api prefix)
app.include_router(auth_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(projects_router, prefix="/api")
app.include_router(blogs_router, prefix="/api")
app.include_router(services_router, prefix="/api")
app.include_router(creative_router, prefix="/api")
app.include_router(clients_router, prefix="/api")
app.include_router(team_router, prefix="/api")
app.include_router(gallery_router, prefix="/api")
app.include_router(stats_router, prefix="/api")
app.include_router(contact_router, prefix="/api")

@app.get("/", tags=["Health"])
def health_check():
    """Public health endpoint used by uptime checks and the frontend to verify the API is up."""
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "database": "Neon PostgreSQL",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "crm_auth": "/api/auth/login",
    }
