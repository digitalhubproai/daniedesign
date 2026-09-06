"""Client logos/testimonials router for the 'trusted by' section."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.client import Client
from app.schemas.creative import ClientCreate, ClientResponse

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.get("", response_model=List[ClientResponse], summary="Get all clients")
def get_clients(db: Session = Depends(get_db)):
    """GET /clients — public list, ordered by the manual `order` field."""
    return db.query(Client).order_by(Client.order.asc(), Client.id.asc()).all()

@router.post("", response_model=ClientResponse, status_code=status.HTTP_201_CREATED, summary="Add client")
def create_client(client_in: ClientCreate, db: Session = Depends(get_db)):
    """POST /clients — adds a client (admin CMS use); returns 201 with the
    stored row."""
    client = Client(**client_in.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete client")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    """DELETE /clients/{client_id} — permanent delete (admin CMS use);
    404 if unknown id, 204 on success."""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    db.delete(client)
    db.commit()
    return None
