from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from db.session import get_session
from db.models import Message, Ticket, User
from api.v1.schemas.message import MessageCreate, MessageRead, MessageUpdate
from core.dependencies import get_current_active_user, get_current_active_admin

router = APIRouter()

@router.post("/", response_model=MessageRead, status_code=status.HTTP_201_CREATED)
def create_message(
    message_in: MessageCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    ticket = session.get(Ticket, message_in.ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if current_user.role.name.lower() != "admin" and ticket.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions to post message")
    message = Message(
        ticket_id=message_in.ticket_id,
        sender_type=message_in.sender_type,
        body=message_in.body
    )
    session.add(message)
    session.commit()
    session.refresh(message)
    return message

@router.get("/", response_model=List[MessageRead])
def read_messages(
    ticket_id: Optional[int] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    query = select(Message)
    if ticket_id:
        query = query.where(Message.ticket_id == ticket_id)
    messages = session.exec(query).all()
    # permission check on retrieval
    if not current_user.role.name.lower() == "admin":
        # ensure all messages belong to user's tickets
        for msg in messages:
            ticket = session.get(Ticket, msg.ticket_id)
            if ticket and ticket.user_id != current_user.id:
                raise HTTPException(status_code=403, detail="Not enough permissions to view messages")
    return messages

@router.put("/{message_id}", response_model=MessageRead)
def update_message(
    message_id: int,
    message_update: MessageUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    message = session.get(Message, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    ticket = session.get(Ticket, message.ticket_id)
    if current_user.role.name.lower() != "admin" and ticket.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions to update message")
    update_data = message_update.dict(exclude_unset=True)
    for key, val in update_data.items():
        setattr(message, key, val)
    session.add(message)
    session.commit()
    session.refresh(message)
    return message

@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(
    message_id: int,
    session: Session = Depends(get_session),
    _: User = Depends(get_current_active_admin)
):
    message = session.get(Message, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    session.delete(message)
    session.commit()
    return None