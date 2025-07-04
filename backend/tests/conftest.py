"""
Pytest 설정 파일

TDD 단계: RED - 테스트 환경 구성
목표: 테스트에서 사용할 수 있는 비동기 데이터베이스 세션 픽스처 제공
"""
import asyncio
from typing import AsyncGenerator

import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
    async_sessionmaker,
)

from src.core.config import settings
from src.core.database import get_async_session, Base
from src.main import app
from src.models.user import User
from src.core.hashing import get_password_hash


@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    각 테스트 함수를 위한 독립적인 데이터베이스 세션 및 엔진을 제공하는 픽스처.
    테스트 격리를 위해 매번 새로운 엔진을 생성하고, 테스트 후 롤백 및 테이블 정리.
    """
    # 이 픽스처 내에서 직접 엔진 생성하여 이벤트 루프 문제를 해결
    engine = create_async_engine(settings.DATABASE_URL)

    # 모든 테이블 생성
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_maker = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )

    async with session_maker() as session:
        await session.begin_nested()
        try:
            yield session
        finally:
            await session.rollback()
            # 모든 테이블 삭제
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.drop_all)
            await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def test_client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """
    테스트용 `httpx.AsyncClient`를 생성하고,
    `get_async_session` 의존성을 테스트용 `db_session`으로 오버라이드합니다.
    """

    async def override_get_async_session() -> AsyncGenerator[AsyncSession, None]:
        yield db_session

    app.dependency_overrides[get_async_session] = override_get_async_session

    # TypeError 해결을 위해 ASGITransport를 명시적으로 사용
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client

    del app.dependency_overrides[get_async_session]


@pytest_asyncio.fixture
async def test_user(db_session: AsyncSession) -> User:
    """
    테스트용 사용자 픽스처.
    데이터베이스에 테스트 사용자를 생성하고 반환합니다.
    """
    user = User(
        email="test@example.com",
        hashed_password=get_password_hash("password123"),
        is_active=True,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def authorized_client(
    test_client: AsyncClient, test_user: User
) -> AsyncClient:
    """
    인증된 클라이언트 픽스처.
    테스트 사용자로 로그인하여 JWT 토큰이 포함된 클라이언트를 반환합니다.
    """
    response = await test_client.post(
        f"{settings.API_V1_STR}/auth/login",
        data={"username": "test@example.com", "password": "password123"},
    )
    assert response.status_code == 200, "로그인에 실패하여 authorized_client를 생성할 수 없습니다."
    token_data = response.json()
    access_token = token_data["access_token"]
    test_client.headers["Authorization"] = f"Bearer {access_token}"
    return test_client 