"""
FastAPI 애플리케이션의 메인 파일
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from src.core.config import settings
from src.api.health import router as health_router
from src.auth.router import router as auth_router
from src.api import users as users_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    애플리케이션의 시작과 종료 시에 실행될 로직을 정의합니다.
    (현재는 특별한 로직 없음)
    """
    yield


# FastAPI 앱 인스턴스 생성
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Workflow based Agentic AI Service",
    version=settings.PROJECT_VERSION,
    lifespan=lifespan,
)


@app.get("/")
def read_root():
    """루트 엔드포인트"""
    return {"message": "Welcome to the WSAP API"}


# API 라우터 포함
app.include_router(health_router, prefix=settings.API_V1_STR, tags=["health"])
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(
    users_router.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"]
) 