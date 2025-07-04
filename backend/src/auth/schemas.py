"""
Pydantic 스키마 정의

TDD 단계: GREEN - 최소 구현
목표: 회원가입 API의 요청 및 응답 본문을 위한 Pydantic 모델 정의
"""
import uuid
from pydantic import BaseModel, EmailStr, Field
from pydantic import ConfigDict
from datetime import datetime


class UserBase(BaseModel):
    """사용자 기본 스키마"""
    email: EmailStr


class UserCreate(UserBase):
    """사용자 생성(회원가입) 요청 스키마"""
    password: str


class UserRead(UserBase):
    """사용자 정보 응답 스키마"""
    id: uuid.UUID

    class Config:
        from_attributes = True


class Token(BaseModel):
    """JWT 토큰 응답 스키마"""
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    """JWT 토큰 페이로드 스키마"""
    sub: str | None = None


# --- API Key Schemas ---


class APIKeyBase(BaseModel):
    """API 키 기본 스키마"""

    name: str = Field(..., min_length=1, max_length=100)


class APIKeyCreate(APIKeyBase):
    """API 키 생성 요청 스키마"""

    pass


class APIKeyRead(APIKeyBase):
    """API 키 조회 응답 스키마 (보안을 위해 실제 키 값은 제외)"""

    id: uuid.UUID
    key_prefix: str
    is_active: bool
    created_at: datetime
    last_used_at: datetime | None = None

    class Config:
        from_attributes = True


class APIKeyCreateResponse(APIKeyRead):
    """API 키 생성 후 응답 스키마 (생성 시에만 전체 키 값을 반환)"""

    access_token: str 