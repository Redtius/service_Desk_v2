from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class MessageBase(SQLModel):
    ticket_id: int = Field(foreign_key="ticket.id", index=True)
    sender_type: str  # "user" or "agent"
    body: str

class MessageCreate(MessageBase):
    pass

class MessageRead(MessageBase):
    id: int
    timestamp: datetime

class MessageUpdate(SQLModel):
    body: Optional[str] = None
    sender_type: Optional[str] = None