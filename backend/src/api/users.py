from typing import Annotated
import uuid

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.schemas import (
    UserRead,
    APIKeyCreate,
    APIKeyCreateResponse,
    APIKeyRead,
)
from src.core.database import get_async_session
from src.core.security import get_current_active_user
from src.models.user import User
from src.auth.services import UserService

router = APIRouter()
user_service = UserService()


@router.get("/me", response_model=UserRead)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    """
    현재 로그인된 사용자의 정보를 가져옵니다.
    JWT 토큰으로 인증된 요청일 경우, 해당 사용자의 정보를 반환합니다.
    """
    return current_user


@router.get("/me/api-keys", response_model=list[APIKeyRead])
async def get_api_keys_for_user(
    current_user: Annotated[User, Depends(get_current_active_user)],
    db_session: Annotated[AsyncSession, Depends(get_async_session)],
):
    """
    현재 로그인된 사용자의 모든 API 키 목록을 가져옵니다.
    """
    return await user_service.get_api_keys_for_user(
        db_session=db_session, user=current_user
    )


@router.delete("/me/api-keys/{api_key_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_api_key_for_user(
    api_key_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db_session: Annotated[AsyncSession, Depends(get_async_session)],
):
    """
    현재 로그인된 사용자의 특정 API 키를 삭제합니다.
    """
    api_key = await user_service.delete_api_key(
        db_session=db_session, api_key_id=api_key_id, user=current_user
    )
    if not api_key:
        raise HTTPException(status_code=404, detail="API Key not found")


@router.post(
    "/me/api-keys",
    response_model=APIKeyCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_api_key_for_user(
    key_in: APIKeyCreate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db_session: Annotated[AsyncSession, Depends(get_async_session)],
):
    """
    현재 로그인된 사용자를 위해 새로운 API 키를 생성합니다.
    """
    api_key_obj, plain_key = await user_service.create_api_key(
        db_session=db_session, key_in=key_in, user=current_user
    )

    return APIKeyCreateResponse(
        **api_key_obj.__dict__, access_token=plain_key
    ) 