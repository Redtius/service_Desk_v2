from typing import Optional
import datetime
from sqlmodel import SQLModel, Field

class UserBase(SQLModel):
    email: str = Field(..., index=True)
    full_name: str
    position: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role_id: Optional[int] = None

class UserRead(UserBase):
    id: int
    status: str
    role_id: Optional[int] = None
    last_login: Optional[datetime.datetime] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        orm_mode = True

class UserUpdate(SQLModel):
    full_name: Optional[str] = None
    position: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None
    role_id: Optional[int] = None
