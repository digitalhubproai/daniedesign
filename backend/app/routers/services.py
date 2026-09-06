"""Services router: the offerings list/detail pages plus admin CMS CRUD."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse

router = APIRouter(prefix="/services", tags=["Services"])

@router.get("", response_model=List[ServiceResponse], summary="Get all services")
def get_services(db: Session = Depends(get_db)):
    """GET /services — public list, ordered by the manual `order` field."""
    return db.query(Service).order_by(Service.order.asc(), Service.id.asc()).all()

@router.get("/{id_or_number}", response_model=ServiceResponse, summary="Get service")
def get_service(id_or_number: str, db: Session = Depends(get_db)):
    """GET /services/{id_or_number} — public detail lookup that accepts either
    the numeric database id or the display number string (e.g. "01");
    404 if neither matches a row."""
    if id_or_number.isdigit():
        # all-digit segments are resolved by primary key...
        service = db.query(Service).filter(Service.id == int(id_or_number)).first()
    else:
        # ...anything else is matched against the string `number` field
        service = db.query(Service).filter(Service.number == id_or_number).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    return service

@router.post("", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED, summary="Create service")
def create_service(service_in: ServiceCreate, db: Session = Depends(get_db)):
    """POST /services — creates a service (admin CMS use); returns 201 with
    the stored row."""
    service = Service(**service_in.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service

@router.put("/{service_id}", response_model=ServiceResponse, summary="Update service")
def update_service(service_id: int, service_in: ServiceUpdate, db: Session = Depends(get_db)):
    """PUT /services/{service_id} — partial update by numeric id (admin CMS
    use); 404 if not found. Only fields present in the payload are applied."""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")

    # exclude_unset keeps fields omitted from the request untouched (PATCH-like semantics)
    update_data = service_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(service, field, val)
        
    db.commit()
    db.refresh(service)
    return service

@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete service")
def delete_service(service_id: int, db: Session = Depends(get_db)):
    """DELETE /services/{service_id} — permanent delete by numeric id
    (admin CMS use); 404 if unknown id, 204 on success."""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    db.delete(service)
    db.commit()
    return None
