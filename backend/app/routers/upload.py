"""File upload router: accepts media files and returns public URLs."""
import os
import mimetypes
import uuid
from datetime import datetime, timezone
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Query, status, Request
from typing import List
from app.config import settings
from app.schemas.stat import UploadResponse, MultipleUploadResponse, MediaFileItem, MediaListResponse

router = APIRouter(prefix="/upload", tags=["Uploads & Media"])

# extension allowlist used to reject anything that is not an image or web video format
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".mp4", ".webm"}

def get_file_url(request: Request, filename: str) -> str:
    """Build the publicly reachable URL for a stored file from the current
    request's base URL (so it works behind any host/port)."""
    base_url = str(request.base_url).rstrip("/")
    return f"{base_url}/uploads/{filename}"

@router.post("/image", response_model=UploadResponse, summary="Upload single image or media file")
async def upload_single_image(request: Request, file: UploadFile = File(...)):
    """POST /upload/image — uploads one image/video file (admin CMS use);
    returns 201 by default via the UploadResponse payload, 400 for bad
    extension or oversize, 500 on disk write failure."""
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file extension '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # store under a random UUID name to prevent collisions and path traversal
    # via attacker-supplied filenames
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    dest_path = settings.upload_path / unique_filename

    try:
        contents = await file.read()
        file_size = len(contents)

        # enforce the size limit after reading (UploadFile has no reliable pre-size)
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if file_size > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB"
            )

        with open(dest_path, "wb") as f:
            f.write(contents)

        url = get_file_url(request, unique_filename)
        return UploadResponse(
            filename=unique_filename,
            url=url,
            content_type=file.content_type or "application/octet-stream",
            size=file_size
        )
    except HTTPException:
        # let deliberate validation errors pass through untouched
        raise
    except Exception as e:
        # collapse any unexpected I/O failure into a 500 with the error text
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )
    finally:
        # always release the spooled upload temp file
        await file.close()

@router.post("/multiple", response_model=MultipleUploadResponse, summary="Upload multiple gallery images")
async def upload_multiple_images(request: Request, files: List[UploadFile] = File(...)):
    """POST /upload/multiple — batch upload for gallery images (admin CMS
    use). Best-effort: files with a disallowed extension or that fail to
    write are silently skipped, and the response lists only what succeeded."""
    uploaded_files: List[UploadResponse] = []

    for file in files:
        ext = Path(file.filename or "").suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            continue  # skip bad file, keep processing the rest of the batch
        
        unique_filename = f"{uuid.uuid4().hex}{ext}"
        dest_path = settings.upload_path / unique_filename
        
        try:
            contents = await file.read()
            file_size = len(contents)
            
            with open(dest_path, "wb") as f:
                f.write(contents)
                
            url = get_file_url(request, unique_filename)
            uploaded_files.append(UploadResponse(
                filename=unique_filename,
                url=url,
                content_type=file.content_type or "application/octet-stream",
                size=file_size
            ))
        except Exception:
            continue
        finally:
            await file.close()

    return MultipleUploadResponse(uploaded=uploaded_files)

@router.get("/media", response_model=MediaListResponse, summary="List previously uploaded media files")
async def list_media(
    request: Request,
    kind: str = Query("all", pattern="^(all|image|video)$"),
    limit: int = Query(200, ge=1, le=1000),
):
    """GET /upload/media — returns files already stored in the uploads dir,
    newest first, so admin forms can pick from the library instead of
    re-uploading. `kind=image` filters to still images, `kind=video` to mp4/webm."""
    image_exts = {".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"}
    video_exts = {".mp4", ".webm"}

    upload_dir = settings.upload_path
    items: List[MediaFileItem] = []
    for entry in os.scandir(upload_dir):
        if not entry.is_file():
            continue
        ext = Path(entry.name).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            continue
        if kind == "image" and ext not in image_exts:
            continue
        if kind == "video" and ext not in video_exts:
            continue
        stat = entry.stat()
        items.append(MediaFileItem(
            filename=entry.name,
            url=get_file_url(request, entry.name),
            content_type=mimetypes.guess_type(entry.name)[0] or "application/octet-stream",
            size=stat.st_size,
            modified_at=datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc),
        ))

    items.sort(key=lambda m: m.modified_at, reverse=True)
    return MediaListResponse(files=items[:limit], total=len(items))
