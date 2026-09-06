"""Creative Wall router: assorted creative items shown on the studio page."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.creative import CreativeItem
from app.schemas.creative import CreativeCreate, CreativeResponse

router = APIRouter(prefix="/creative", tags=["Creative Wall"])

@router.get("", response_model=List[CreativeResponse], summary="Get all creative items")
def get_creative_items(db: Session = Depends(get_db)):
    """GET /creative — public list, ordered by the manual `order` field."""
    return db.query(CreativeItem).order_by(CreativeItem.order.asc(), CreativeItem.id.asc()).all()

@router.post("", response_model=CreativeResponse, status_code=status.HTTP_201_CREATED, summary="Add creative item")
def create_creative_item(item_in: CreativeCreate, db: Session = Depends(get_db)):
    """POST /creative — adds an item (admin CMS use); returns 201 with the
    stored row."""
    item = CreativeItem(**item_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete creative item")
def delete_creative_item(item_id: int, db: Session = Depends(get_db)):
    """DELETE /creative/{item_id} — permanent delete (admin CMS use);
    404 if unknown id, 204 on success."""
    item = db.query(CreativeItem).filter(CreativeItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    db.delete(item)
    db.commit()
    return None
