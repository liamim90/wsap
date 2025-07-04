import pytest
from httpx import AsyncClient
from starlette import status


@pytest.mark.asyncio
async def test_health_endpoint(test_client: AsyncClient):
    """
    헬스체크 엔드포인트 테스트
    - GET /api/v1/health
    - 응답 상태 코드 200 확인
    - 응답 content-type 확인
    - 응답 데이터 및 구조 확인
    """
    response = await test_client.get("/api/v1/health")
    assert response.status_code == status.HTTP_200_OK
    assert response.headers["content-type"] == "application/json"
    
    json_response = response.json()
    assert json_response == {"status": "healthy"} 