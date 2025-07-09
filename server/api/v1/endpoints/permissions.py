from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from db.session import get_session
from db.models import Permission
from api.v1.schemas.permission import PermissionCreate, PermissionRead, PermissionUpdate
from core.dependencies import get_current_active_admin

router = APIRouter()

@router.post("/", response_model=PermissionRead, status_code=status.HTTP_201_CREATED)
def create_permission(
    permission_in: PermissionCreate,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin)
):
    existing = session.exec(select(Permission).where(Permission.name == permission_in.name)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Permission name already exists")
    perm = Permission.from_orm(permission_in)
    session.add(perm)
    session.commit()
    session.refresh(perm)
    return perm

@router.get("/", response_model=List[PermissionRead])
def read_permissions(
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin)
):
    result = session.exec(select(Permission)).all()
    return result

@router.get("/{permission_id}", response_model=PermissionRead)
def read_permission(
    permission_id: int,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin)
):
    perm = session.get(Permission, permission_id)
    if not perm:
        raise HTTPException(status_code=404, detail="Permission not found")
    return perm

@router.put("/{permission_id}", response_model=PermissionRead)
def update_permission(
    permission_id: int,
    permission_in: PermissionUpdate,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin)
):
    perm = session.get(Permission, permission_id)
    if not perm:
        raise HTTPException(status_code=404, detail="Permission not found")
    perm_data = permission_in.dict(exclude_unset=True)
    for field, value in perm_data.items():
        setattr(perm, field, value)
    session.add(perm)
    session.commit()
    session.refresh(perm)
    return perm

@router.delete("/{permission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_permission(
    permission_id: int,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin)
):
    perm = session.get(Permission, permission_id)
    if not perm:
        raise HTTPException(status_code=404, detail="Permission not found")
    session.delete(perm)
    session.commit()
    return None
