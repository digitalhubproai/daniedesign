"""Team members router for the studio 'team' section."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.team import TeamMember
from app.schemas.creative import TeamCreate, TeamResponse

router = APIRouter(prefix="/team", tags=["Team"])

@router.get("", response_model=List[TeamResponse], summary="Get all team members")
def get_team(db: Session = Depends(get_db)):
    """GET /team — public list, ordered by the manual `order` field."""
    return db.query(TeamMember).order_by(TeamMember.order.asc(), TeamMember.id.asc()).all()

@router.post("", response_model=TeamResponse, status_code=status.HTTP_201_CREATED, summary="Add team member")
def create_team_member(team_in: TeamCreate, db: Session = Depends(get_db)):
    """POST /team — adds a member (admin CMS use); returns 201 with the
    stored row."""
    member = TeamMember(**team_in.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete team member")
def delete_team_member(member_id: int, db: Session = Depends(get_db)):
    """DELETE /team/{member_id} — permanent delete (admin CMS use);
    404 if unknown id, 204 on success."""
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team member not found")
    db.delete(member)
    db.commit()
    return None
