#!/bin/bash

# 에러 발생 시 즉시 스크립트 종료
set -e

echo "⏳ Waiting for the database to be ready..."
# 실제로는 wait-for-it.sh 같은 스크립트를 사용하는 것이 더 좋지만,
# 지금은 간단하게 5초 대기합니다.
sleep 5

echo "🚀 Running tests..."
# pytest 실행
pytest 