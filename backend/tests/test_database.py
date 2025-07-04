import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text


@pytest.mark.asyncio
async def test_database_connection_query(db_session: AsyncSession):
    """
    데이터베이스 연결 및 기본 쿼리 실행 테스트
    - 입력: SELECT 1 쿼리 실행
    - 검증: 쿼리 성공 및 결과 반환
    """
    result = await db_session.execute(text("SELECT 1"))
    value = result.scalar()
    assert value == 1