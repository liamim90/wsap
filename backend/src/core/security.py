from datetime import datetime, timedelta, timezone
from typing import Any, Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.schemas import TokenPayload
from src.auth.services import UserService
from src.core.config import settings
from src.core.database import get_async_session
from src.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

ALGORITHM = "HS256"


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    주어진 데이터를 기반으로 JWT 액세스 토큰을 생성합니다.

    - `data`: 토큰에 포함될 데이터 딕셔너리.
    - `expires_delta`: 토큰 만료 시간 (기본값: 15분).
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_async_session)],
) -> User:
    """
    JWT 토큰을 검증하고 데이터베이스에서 해당 사용자를 찾아 반환합니다.

    - 토큰이 유효하지 않거나 사용자를 찾을 수 없으면 401 Unauthorized 예외를 발생시킵니다.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        if token_data.sub is None:
            raise credentials_exception
    except (JWTError, ValidationError):
        raise credentials_exception

    user_service = UserService()
    user = await user_service.get_user_by_email(db, email=token_data.sub)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """
    현재 사용자가 활성 상태인지 확인합니다.

    - 비활성 사용자일 경우 400 Bad Request 예외를 발생시킵니다.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user 