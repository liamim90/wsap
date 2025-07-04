"""
데이터베이스 연결 및 세션 관리

TDD 단계: REFACTOR
목표: session_manager를 제거하고 비동기 세션 생성 로직을 단순화하여,
      Auth API 구현(GREEN) 단계에서 발생한 순환 참조 및 임포트 오류 해결
"""
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

from src.core.config import settings

# 데이터베이스 엔진 생성
engine = create_async_engine(settings.DATABASE_URL, echo=False)

# 비동기 세션 메이커 생성
async_session_factory = async_sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)

# SQLAlchemy 모델의 기본 클래스
Base = declarative_base()


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI 의존성 주입을 위한 비동기 데이터베이스 세션 생성기
    """
    async with async_session_factory() as session:
        yield session 