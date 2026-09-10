"""Vercel function entrypoint: exposes the FastAPI app from the app package.

Vercel's Python runtime turns every .py file in /api into a function that
exports `app` (ASGI). vercel.json rewrites route all traffic here, so the full
FastAPI router tree (/, /docs, /api/*, /uploads/*) is served by this function.
"""

import pathlib
import sys

# Ensure the backend project root is importable regardless of the function's cwd
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))

from app.main import app  # noqa: E402,F401
