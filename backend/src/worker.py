import os
from celery import Celery

# .env 파일에 정의된 환경 변수를 직접 사용하여 Celery 앱을 설정합니다.
# 이 방식은 가장 명확하며, Docker 환경에서 안정적으로 동작합니다.
celery_app = Celery(
    "worker",
    broker=os.getenv("CELERY_BROKER_URL"),
    backend=os.getenv("CELERY_RESULT_BACKEND_URL"),
    include=["src.tasks"],
)

celery_app.conf.update(
    task_track_started=True,
    # 컨테이너 시작 시 Redis가 준비될 때까지 연결을 재시도합니다.
    broker_connection_retry_on_startup=True,
) 