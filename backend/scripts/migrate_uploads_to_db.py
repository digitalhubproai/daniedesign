"""One-off migration: move local-disk uploads into the database (and fix URLs).

Run from the backend/ directory, against the SAME Neon database production
uses (backend/.env points at it):

    python -m scripts.migrate_uploads_to_db --base-url https://your-backend.vercel.app [--dry-run]

1. Copies every allowed file in backend/uploads/ into the stored_files table
   (skipping filenames already present, so it's re-runnable).
2. Rewrites image/video URL columns that still point at
   http://localhost:8000/uploads/ (or 127.0.0.1) to {base-url}/uploads/.
"""

import argparse
import mimetypes
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))  # allow `python scripts/...` too

from app.database import SessionLocal, engine, Base  # noqa: E402  (loads .env via app.config)
from app.models import (  # noqa: E402
    Project, BlogPost, Service, CreativeItem, Client, TeamMember, StudioGalleryImage, StoredFile,
)

# extension allowlist mirroring routers/upload.py
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".mp4", ".webm"}
# URL prefixes that were produced by the old disk-backed local server
OLD_PREFIXES = ("http://localhost:8000/uploads/", "http://127.0.0.1:8000/uploads/")

# model -> URL-storing string columns; projects also has a JSON gallery list
URL_COLUMNS = [
    (Project, ["image", "video"]),
    (BlogPost, ["image"]),
    (Service, ["image", "video"]),
    (CreativeItem, ["image"]),
    (Client, ["logo"]),
    (TeamMember, ["image"]),
    (StudioGalleryImage, ["src"]),
]


def import_files(dry_run: bool) -> int:
    upload_dir = Path(__file__).resolve().parent.parent / "uploads"
    if not upload_dir.is_dir():
        print(f"No uploads directory found ({upload_dir}) — skipping file import.")
        return 0

    db = SessionLocal()
    try:
        existing = {row.filename for row in db.query(StoredFile.filename).all()}
        imported = 0
        for entry in sorted(upload_dir.iterdir()):
            if not entry.is_file() or entry.suffix.lower() not in ALLOWED_EXTENSIONS:
                continue
            if entry.name in existing:
                continue
            contents = entry.read_bytes()
            if len(contents) > 0:
                print(f"  {'[dry-run] ' if dry_run else ''}import {entry.name} ({len(contents)} bytes)")
                if not dry_run:
                    db.add(StoredFile(
                        filename=entry.name,
                        content_type=mimetypes.guess_type(entry.name)[0] or "application/octet-stream",
                        size=len(contents),
                        data=contents,
                    ))
                imported += 1
        if not dry_run:
            db.commit()
        return imported
    finally:
        db.close()


def rewrite_urls(base_url: str, dry_run: bool) -> int:
    new_prefix = f"{base_url.rstrip('/')}/uploads/"
    db = SessionLocal()
    changed = 0
    try:
        for model, columns in URL_COLUMNS:
            for row in db.query(model).all():
                for col in columns:
                    value = getattr(row, col, None)
                    if isinstance(value, str) and value.startswith(OLD_PREFIXES):
                        updated = new_prefix + value.split("/uploads/", 1)[1]
                        print(f"  {'[dry-run] ' if dry_run else ''}{model.__tablename__}.{col}#{row.id}: {value} -> {updated}")
                        if not dry_run:
                            setattr(row, col, updated)
                        changed += 1
                # projects.gallery is a JSON list of URLs — replace in place
                gallery = getattr(row, "gallery", None) if model is Project else None
                if isinstance(gallery, list):
                    new_gallery = [
                        new_prefix + str(g).split("/uploads/", 1)[1]
                        if isinstance(g, str) and g.startswith(OLD_PREFIXES) else g
                        for g in gallery
                    ]
                    if new_gallery != gallery:
                        print(f"  {'[dry-run] ' if dry_run else ''}projects.gallery#{row.id}: {len(gallery)} entries rewritten")
                        if not dry_run:
                            row.gallery = new_gallery
                        changed += 1
        if not dry_run:
            db.commit()
        return changed
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", required=True, help="Deployed backend origin, e.g. https://daniedesign-backend.vercel.app")
    parser.add_argument("--dry-run", action="store_true", help="Print what would change without writing")
    args = parser.parse_args()

    # make sure stored_files exists before inserting
    Base.metadata.create_all(bind=engine)

    print(f"Importing local uploads into stored_files (dry_run={args.dry_run})...")
    n_files = import_files(args.dry_run)
    print(f"  -> {n_files} file(s) {'to import' if args.dry_run else 'imported'}")

    print(f"Rewriting localhost upload URLs to {args.base_url}...")
    n_urls = rewrite_urls(args.base_url, args.dry_run)
    print(f"  -> {n_urls} url field(s) {'to rewrite' if args.dry_run else 'rewritten'}")

    if args.dry_run:
        print("Dry run only — nothing was written. Re-run without --dry-run to apply.")


if __name__ == "__main__":
    main()
