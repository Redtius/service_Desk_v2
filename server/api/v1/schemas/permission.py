from typing import Optional
from sqlmodel import SQLModel, Field

class PermissionBase(SQLModel):
    name: str
    description: Optional[str] = None

class PermissionCreate(PermissionBase):
    pass

class PermissionRead(PermissionBase):
    id: int

class PermissionUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
