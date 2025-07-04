"""
환경 설정 관리

TDD 단계: GREEN - 최소 구현
목표: 데이터베이스 연결에 필요한 설정 정의
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    """
    애플리케이션 설정을 관리하는 클래스
    .env 파일 또는 환경 변수에서 설정을 로드합니다.
    """
    # .env 파일 로드 설정
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # 프로젝트 정보
    PROJECT_NAME: str = "WSAP"
    PROJECT_VERSION: str = "0.1.0"

    # API 서버 설정
    API_V1_STR: str = "/api/v1"

    # 데이터베이스 설정
    DATABASE_URL: str

    # JWT 토큰 설정
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days


# 설정 인스턴스 생성
settings = Settings() 