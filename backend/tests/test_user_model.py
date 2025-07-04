"""
데이터베이스 모델 테스트

TDD 단계: RED - 실패하는 테스트 작성
목표: User 모델이 데이터베이스에 정상적으로 생성 및 조회되는지 확인
"""
import pytest
import pytest_asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_async_session
from src.models.user import User  # 아직 존재하지 않음


@pytest.mark.asyncio
async def test_create_and_get_user(db_session: AsyncSession):
    """
    T1.2.2: 사용자 생성 및 조회 테스트
    - 입력: 새로운 사용자 데이터
    - 검증: 데이터베이스에 저장된 후, 해당 사용자를 이메일로 조회했을 때 동일한 정보를 가짐
    """
    new_user = User(
        email="test@example.com",
        hashed_password="hashed_password_example"
    )
    db_session.add(new_user)
    await db_session.flush()
    await db_session.refresh(new_user)
    
    # 데이터베이스에서 사용자 다시 조회
    retrieved_user = await db_session.get(User, new_user.id)
    
    assert retrieved_user is not None
    assert retrieved_user.email == "test@example.com"
    assert retrieved_user.hashed_password == "hashed_password_example"
    assert retrieved_user.id is not None 