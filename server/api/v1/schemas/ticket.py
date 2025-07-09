from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class TicketBase(SQLModel):
    user_id: int = Field(foreign_key="user.id")
    subject: str
    description: Optional[str] = None
    status: Optional[str] = "open"

class TicketCreate(TicketBase):
    pass

class TicketRead(TicketBase):
    id: int
    created_at: datetime
    updated_at: datetime

class TicketUpdate(SQLModel):
    subject: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None