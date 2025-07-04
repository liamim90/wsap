"""
인증 API 라우터

TDD 단계: GREEN - 최소 구현
목표: /signup 엔드포인트를 포함하는 FastAPI 라우터 생성
"""
from typing import Annotated
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.schemas import UserCreate, UserRead, Token
from src.auth.services import UserService
from src.core.database import get_async_session
from src.core.security import create_access_token
from src.core.config import settings

router = APIRouter()
user_service = UserService()


@router.post("/login", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db_session: AsyncSession = Depends(get_async_session),
):
    """
    OAuth2 호환 토큰 로그인을 제공합니다.
    """
    user = await user_service.authenticate_user(
        db_session, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def signup(
    user_create: UserCreate,
    db_session: AsyncSession = Depends(get_async_session),
):
    """
    사용자 회원가입 API
    - 이메일 중복 확인
    - 사용자 생성
    """
    existing_user = await user_service.get_user_by_email(db_session, user_create.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    new_user = await user_service.create_user(db_session, user_create)
    return new_user 