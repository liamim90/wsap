import uuid

import pytest
from httpx import AsyncClient

from src.core.config import settings
from src.models.user import User


@pytest.mark.asyncio
async def test_create_api_key(authorized_client: AsyncClient, test_user: User):
    """
    API 키 생성 성공 테스트
    - GIVEN: 인증된 사용자
    - WHEN: /users/me/api-keys 에 POST 요청
    - THEN: 201 Created 응답과 함께, 접두사가 'wsap_'로 시작하는 전체 API 키를 반환해야 함
    """
    # GIVEN
    key_name = "My Test Key"
    response = await authorized_client.post(
        f"{settings.API_V1_STR}/users/me/api-keys",
        json={"name": key_name},
    )

    # THEN
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == key_name
    assert "access_token" in data
    assert data["access_token"].startswith("wsap_")
    assert "key_prefix" in data
    assert data["is_active"] is True


@pytest.mark.asyncio
async def test_get_api_keys(authorized_client: AsyncClient, test_user: User):
    """
    API 키 목록 조회 성공 테스트
    - GIVEN: 인증된 사용자가 2개의 API 키를 생성
    - WHEN: /users/me/api-keys 에 GET 요청
    - THEN: 200 OK 응답과 함께, 2개의 API 키 목록을 반환해야 함 (access_token 제외)
    """
    # GIVEN
    await authorized_client.post(
        f"{settings.API_V1_STR}/users/me/api-keys", json={"name": "Key 1"}
    )
    await authorized_client.post(
        f"{settings.API_V1_STR}/users/me/api-keys", json={"name": "Key 2"}
    )

    # WHEN
    response = await authorized_client.get(f"{settings.API_V1_STR}/users/me/api-keys")

    # THEN
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] == "Key 1"
    assert "access_token" not in data[0]


@pytest.mark.asyncio
async def test_delete_api_key(authorized_client: AsyncClient, test_user: User):
    """
    API 키 삭제 성공 테스트
    - GIVEN: 인증된 사용자가 1개의 API 키를 생성
    - WHEN: 생성된 키의 ID로 /users/me/api-keys/{key_id} 에 DELETE 요청
    - THEN: 204 No Content 응답을 반환해야 함
    """
    # GIVEN
    create_response = await authorized_client.post(
        f"{settings.API_V1_STR}/users/me/api-keys", json={"name": "Key to Delete"}
    )
    key_id = create_response.json()["id"]

    # WHEN
    delete_response = await authorized_client.delete(
        f"{settings.API_V1_STR}/users/me/api-keys/{key_id}"
    )

    # THEN
    assert delete_response.status_code == 204 