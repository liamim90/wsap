"""
User 모델 정의

TDD 단계: GREEN - 최소 구현
목표: User 모델을 정의하여 'src.models' 관련 ModuleNotFoundError 해결
"""
import uuid
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from typing import TYPE_CHECKING

from src.core.database import Base

if TYPE_CHECKING:
    from src.models.api_key import APIKey


class User(Base):
    """사용자 정보를 저장하는 테이블"""
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    api_keys: Mapped[list["APIKey"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, email={self.email!r}, is_active={self.is_active!r})" 