from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from db.session import get_session
from db.models import User
from api.v1.schemas.user import UserCreate, UserRead, UserUpdate
from core.dependencies import get_current_active_user, get_current_active_admin
from core.security import get_password_hash

router = APIRouter()

@router.get("/me", response_model=UserRead)
def read_current_user(
    current_user: User = Depends(get_current_active_user)
):
    return current_user

@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(
    user_create: UserCreate,
    session: Session = Depends(get_session),
    _: User = Depends(get_current_active_admin)
):
    existing = session.exec(select(User).where(User.email == user_create.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=user_create.email,
        full_name=user_create.full_name,
        position=user_create.position,
        department=user_create.department,
        phone=user_create.phone,
        status="active",
        password_hash=get_password_hash(user_create.password),
        role_id=user_create.role_id
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.get("/", response_model=List[UserRead])
def read_users(
    session: Session = Depends(get_session),
    _: User = Depends(get_current_active_admin)
):
    users = session.exec(select(User)).all()
    return users

@router.get("/{user_id}", response_model=UserRead)
def read_user(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if current_user.role.name.lower() != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return user

@router.put("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if current_user.role.name.lower() != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    session: Session = Depends(get_session),
    _: User = Depends(get_current_active_admin)
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
    return None

@router.post("/{user_id}/reset-password", status_code=status.HTTP_200_OK)
def reset_password(
    user_id: int,
    session: Session = Depends(get_session),
    _: User = Depends(get_current_active_admin)
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.password_hash = get_password_hash("password")
    session.add(user)
    session.commit()
    return {"msg": "Password reset successfully"}
