from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from db.session import get_session
from db.models import Ticket, User
from api.v1.schemas.ticket import TicketCreate, TicketRead, TicketUpdate
from core.dependencies import get_current_active_user, get_current_active_admin

router = APIRouter()

@router.post("/", response_model=TicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket_in: TicketCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    ticket = Ticket(
        user_id=current_user.id,
        subject=ticket_in.subject,
        description=ticket_in.description,
        status=ticket_in.status
    )
    session.add(ticket)
    session.commit()
    session.refresh(ticket)
    return ticket

@router.get("/", response_model=List[TicketRead])
def read_tickets(
    session: Session = Depends(get_session),
    _: User = Depends(get_current_active_admin)
):
    tickets = session.exec(select(Ticket)).all()
    return tickets

@router.get("/{ticket_id}", response_model=TicketRead)
def read_ticket(
    ticket_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    ticket = session.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if current_user.role.name.lower() != "admin" and ticket.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return ticket

@router.put("/{ticket_id}", response_model=TicketRead)
def update_ticket(
    ticket_id: int,
    ticket_update: TicketUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    ticket = session.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if current_user.role.name.lower() != "admin" and ticket.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    update_data = ticket_update.dict(exclude_unset=True)
    for key, val in update_data.items():
        setattr(ticket, key, val)
    session.add(ticket)
    session.commit()
    session.refresh(ticket)
    return ticket

@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ticket(
    ticket_id: int,
    session: Session = Depends(get_session),
    _: User = Depends(get_current_active_admin)
):
    ticket = session.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    session.delete(ticket)
    session.commit()
    return None