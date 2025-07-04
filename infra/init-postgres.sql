-- PostgreSQL 초기화 스크립트

-- 'wsap_user'는 docker-compose.yml의 환경 변수에 의해 이미 생성됩니다.
-- 이 스크립트는 데이터베이스와 확장 기능만 설정합니다.

\c postgres;

-- 기존 연결을 종료하여 데이터베이스를 안전하게 삭제할 수 있도록 합니다.
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'wsap_db';
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'wsap_test_db';

DROP DATABASE IF EXISTS wsap_db;
DROP DATABASE IF EXISTS wsap_test_db;

-- 데이터베이스 생성 및 소유자 할당
CREATE DATABASE wsap_db OWNER wsap_user;
CREATE DATABASE wsap_test_db OWNER wsap_user;

-- wsap_user에게 모든 권한 부여
GRANT ALL PRIVILEGES ON DATABASE wsap_db TO wsap_user;
GRANT ALL PRIVILEGES ON DATABASE wsap_test_db TO wsap_user;

-- 각 데이터베이스에 연결하여 확장 설치
\c wsap_db;
CREATE EXTENSION IF NOT EXISTS vector;

\c wsap_test_db;
CREATE EXTENSION IF NOT EXISTS vector; 