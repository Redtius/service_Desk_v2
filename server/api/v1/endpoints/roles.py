from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from db.session import get_session
from db.models import Role, Permission
from api.v1.schemas.role import RoleCreate, RoleRead, RoleUpdate
from core.dependencies import get_current_active_admin

router = APIRouter()

@router.post("/", response_model=RoleRead, status_code=status.HTTP_201_CREATED)
def create_role(
    role_in: RoleCreate,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin)
):
    existing = session.exec(select(Role).where(Role.name == role_in.name)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Role name already exists")
    role = Role(name=role_in.name, description=role_in.description)
    if role_in.permission_ids:
        perms = session.exec(select(Permission).where(Permission.id.in_(role_in.permission_ids))).all()
        role.permissions = perms
    session.add(role)
    session.commit()
    session.refresh(role)
    return role

@router.get("/", response_model=List[RoleRead])
def read_roles(
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin)
):
    roles = session.exec(select(Role)).all()
    return roles

@router.get("/{role_id}", response_model=RoleRead)
def read_role(
    role_id: int,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin)
):
    role = session.get(Role, role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role

@router.put("/{role_id}", response_model=RoleRead)
def update_role(
    role_id: int,
    role_in: RoleUpdate,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin)
):
    role = session.get(Role, role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    data = role_in.dict(exclude_unset=True)
    if "name" in data:
        role.name = data["name"]
    if "description" in data:
        role.description = data["description"]
    if "permission_ids" in data:
        perms = session.exec(select(Permission).where(Permission.id.in_(data["permission_ids"]))).all()
        role.permissions = perms
    session.add(role)
    session.commit()
    session.refresh(role)
    return role

@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_role(
    role_id: int,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin)
):
    role = session.get(Role, role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    session.delete(role)
    session.commit()
    return None
