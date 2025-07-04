"""
Auth API TDD 테스트

TDD 단계: RED - 실패하는 테스트 작성
목표: /auth/signup 엔드포인트에 대한 테스트 케이스 정의
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import settings
from src.models.user import User


@pytest.mark.asyncio
async def test_signup_success(test_client: AsyncClient, db_session: AsyncSession):
    """
    회원가입 성공 테스트
    - GIVEN: 유효한 사용자 이메일과 비밀번호
    - WHEN: /auth/signup 에 POST 요청
    - THEN: 201 Created 응답을 받고, 데이터베이스에 사용자가 생성되어야 함
    """
    # GIVEN
    user_data = {"email": "test@example.com", "password": "password123"}

    # WHEN
    response = await test_client.post("/api/v1/auth/signup", json=user_data)

    # THEN
    assert response.status_code == 201
    
    response_data = response.json()
    assert response_data["email"] == user_data["email"]

    # 응답으로 받은 id를 사용하여 DB에서 사용자를 조회합니다.
    created_user = await db_session.get(User, response_data["id"])
    assert created_user is not None
    assert created_user.email == user_data["email"]


@pytest.mark.asyncio
async def test_login_success(test_client: AsyncClient, db_session: AsyncSession):
    """
    로그인 성공 테스트
    - GIVEN: 회원가입이 완료된 사용자
    - WHEN: 올바른 이메일과 비밀번호로 /api/v1/auth/login 에 POST 요청
    - THEN: 200 OK 응답과 함께 access_token을 반환해야 함
    """
    # GIVEN: 사용자 생성
    user_data = {"email": "testlogin@example.com", "password": "password123"}
    await test_client.post("/api/v1/auth/signup", json=user_data)

    # WHEN
    login_data = {"username": user_data["email"], "password": user_data["password"]}
    response = await test_client.post("/api/v1/auth/login", data=login_data)

    # THEN
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_failure_wrong_password(test_client: AsyncClient, db_session: AsyncSession):
    """
    로그인 실패 테스트 (잘못된 비밀번호)
    - GIVEN: 회원가입이 완료된 사용자
    - WHEN: 잘못된 비밀번호로 로그인 시도
    - THEN: 401 Unauthorized 응답을 반환해야 함
    """
    # GIVEN: 사용자 생성
    user_data = {"email": "testlogin2@example.com", "password": "password123"}
    await test_client.post("/api/v1/auth/signup", json=user_data)

    # WHEN
    login_data = {"username": user_data["email"], "password": "wrongpassword"}
    response = await test_client.post("/api/v1/auth/login", data=login_data)

    # THEN
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


@pytest.mark.asyncio
async def test_login_failure_user_not_found(test_client: AsyncClient):
    """
    로그인 실패 테스트 (존재하지 않는 사용자)
    - GIVEN: 존재하지 않는 사용자 이메일
    - WHEN: 해당 이메일로 로그인 시도
    - THEN: 401 Unauthorized 응답을 반환해야 함
    """
    # WHEN
    login_data = {"username": "nosuchuser@example.com", "password": "password123"}
    response = await test_client.post("/api/v1/auth/login", data=login_data)

    # THEN
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


@pytest.mark.asyncio
async def test_signup_duplicate_email(test_client: AsyncClient, db_session: AsyncSession):
    """
    중복 이메일 회원가입 실패 테스트
    - GIVEN: 데이터베이스에 이미 존재하는 이메일
    - WHEN: 같은 이메일로 /auth/signup 에 POST 요청
    - THEN: 400 Bad Request 응답을 받고, 에러 메시지를 반환해야 함
    """
    # GIVEN
    existing_user_data = {"email": "test@example.com", "password": "password123"}
    # 먼저 사용자를 하나 생성
    response = await test_client.post("/api/v1/auth/signup", json=existing_user_data)
    assert response.status_code == 201

    # WHEN
    duplicate_user_data = {"email": "test@example.com", "password": "anotherpassword"}
    response = await test_client.post("/api/v1/auth/signup", json=duplicate_user_data)

    # THEN
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]


@pytest.mark.asyncio
async def test_login_for_access_token_wrong_password(
    test_client: AsyncClient, test_user: User
):
    response = await test_client.post(
        f"{settings.API_V1_STR}/auth/login",
        data={"username": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect email or password"}


@pytest.mark.asyncio
async def test_get_current_user_success(
    authorized_client: AsyncClient, test_user: User
):
    """
    인증된 사용자가 자신의 정보를 성공적으로 가져오는지 테스트합니다.
    """
    response = await authorized_client.get(f"{settings.API_V1_STR}/users/me")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email
    assert "id" in data
    assert "hashed_password" not in data


@pytest.mark.asyncio
async def test_get_current_user_unauthorized(test_client: AsyncClient):
    """
    인증되지 않은 사용자가 /users/me에 접근할 수 없는지 테스트합니다.
    """
    response = await test_client.get(f"{settings.API_V1_STR}/users/me")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"} 