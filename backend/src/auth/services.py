"""
인증 관련 비즈니스 로직

TDD 단계: REFACTOR - 코드 품질 개선
목표: 비밀번호를 안전하게 해싱하여 저장하도록 로직 수정
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import secrets
import uuid
from sqlalchemy.orm import selectinload

from src.auth.schemas import UserCreate, APIKeyCreate
from src.core.hashing import get_password_hash, verify_password
from src.models.api_key import APIKey
from src.models.user import User


class UserService:
    """사용자 관련 비즈니스 로직을 처리하는 서비스 클래스"""

    async def authenticate_user(
        self, db_session: AsyncSession, email: str, password: str
    ) -> User | None:
        """
        이메일과 비밀번호로 사용자를 인증합니다.
        """
        user = await self.get_user_by_email(db_session, email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    async def get_user_by_email(self, db_session: AsyncSession, email: str) -> User | None:
        """이메일로 사용자를 조회합니다."""
        result = await db_session.execute(select(User).filter_by(email=email))
        return result.scalars().first()

    async def create_user(self, db_session: AsyncSession, user_create: UserCreate) -> User:
        """
        새로운 사용자를 생성하고, 비밀번호를 해싱하여 저장합니다.
        """
        hashed_password = get_password_hash(user_create.password)
        db_user = User(
            email=user_create.email,
            hashed_password=hashed_password
        )
        db_session.add(db_user)
        await db_session.commit()
        await db_session.refresh(db_user)
        return db_user

    async def get_api_keys_for_user(
        self, db_session: AsyncSession, user: User
    ) -> list[APIKey]:
        """사용자의 모든 API 키 목록을 가져옵니다."""
        # Eager loading을 사용하여 user.api_keys 접근 시 추가 쿼리를 방지합니다.
        result = await db_session.execute(
            select(User)
            .options(selectinload(User.api_keys))
            .filter_by(id=user.id)
        )
        user_with_keys = result.scalars().first()
        return user_with_keys.api_keys if user_with_keys else []

    async def delete_api_key(
        self, db_session: AsyncSession, api_key_id: uuid.UUID, user: User
    ) -> APIKey | None:
        """사용자의 특정 API 키를 삭제합니다."""
        result = await db_session.execute(
            select(APIKey).filter_by(id=api_key_id, user_id=user.id)
        )
        api_key = result.scalars().first()
        if api_key:
            await db_session.delete(api_key)
            await db_session.commit()
        return api_key

    async def create_api_key(
        self, db_session: AsyncSession, key_in: APIKeyCreate, user: User
    ) -> tuple[APIKey, str]:
        """사용자를 위해 새로운 API 키를 생성합니다."""
        api_key_service = APIKeyService()
        plain_key, hashed_key = api_key_service.generate_key()
        key_prefix = plain_key.split("_")[1][:8]

        db_api_key = APIKey(
            name=key_in.name,
            hashed_key=hashed_key,
            key_prefix=key_prefix,
            user_id=user.id,
        )
        db_session.add(db_api_key)
        await db_session.commit()
        await db_session.refresh(db_api_key)

        return db_api_key, plain_key


class APIKeyService:
    """API 키 관련 비즈니스 로직을 처리하는 서비스 클래스"""

    def generate_key(self, prefix: str = "wsap") -> tuple[str, str]:
        """API 키와 해시된 키를 생성합니다."""
        api_key = f"{prefix}_{secrets.token_urlsafe(32)}"
        hashed_key = get_password_hash(api_key)
        return api_key, hashed_key 