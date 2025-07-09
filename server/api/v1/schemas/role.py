from typing import List, Optional
from sqlmodel import SQLModel, Field
from .permission import PermissionRead

class RoleBase(SQLModel):
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    permission_ids: Optional[List[int]] = []

class RoleRead(RoleBase):
    id: int
    permissions: List[PermissionRead] = []

class RoleUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    permission_ids: Optional[List[int]] = None
