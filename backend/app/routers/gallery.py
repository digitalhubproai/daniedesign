"""Studio gallery router: images displayed in the studio photo gallery."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.gallery import StudioGalleryImage
from app.schemas.creative import GalleryCreate, GalleryResponse

router = APIRouter(prefix="/gallery", tags=["Gallery"])

@router.get("", response_model=List[GalleryResponse], summary="Get all gallery images")
def get_gallery_images(db: Session = Depends(get_db)):
    """GET /gallery — public list, ordered by the manual `order` field."""
    return db.query(StudioGalleryImage).order_by(StudioGalleryImage.order.asc(), StudioGalleryImage.id.asc()).all()

@router.post("", response_model=GalleryResponse, status_code=status.HTTP_201_CREATED, summary="Add gallery image")
def create_gallery_image(image_in: GalleryCreate, db: Session = Depends(get_db)):
    """POST /gallery — registers an already-uploaded image (admin CMS use);
    returns 201 with the stored row."""
    image = StudioGalleryImage(**image_in.model_dump())
    db.add(image)
    db.commit()
    db.refresh(image)
    return image

@router.delete("/{image_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete gallery image")
def delete_gallery_image(image_id: int, db: Session = Depends(get_db)):
    """DELETE /gallery/{image_id} — removes the DB row only (the file on
    disk is left in place); 404 if unknown id, 204 on success."""
    image = db.query(StudioGalleryImage).filter(StudioGalleryImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")
    db.delete(image)
    db.commit()
    return None
