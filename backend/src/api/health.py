"""
Health Check API 라우터
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():
    """헬스체크 엔드포인트"""
    return {"status": "healthy"} 