import os
import asyncio
from logging.config import fileConfig

from sqlalchemy.ext.asyncio import async_engine_from_config
from sqlalchemy import pool

from alembic import context

# --- 프로젝트별 설정 추가 ---
# 1. alembic.ini에서 DATABASE_URL을 가져오기 위해
from src.core.config import settings

# 2. 모델 메타데이터를 인식시키기 위해
from src.core.database import Base
from src.models import *  # 여기에 모든 모델 파일을 임포트해야 합니다.

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# --- 프로젝트별 설정 수정 ---
# alembic.ini 파일에 설정된 DATABASE_URL을 사용하도록 설정
# 이 부분이 없으면 alembic.ini의 sqlalchemy.url = ${DATABASE_URL} 설정이 동작하지 않습니다.
if settings.DATABASE_URL:
    config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
# --- 프로젝트별 설정 수정 ---
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    """실제 마이그레이션을 실행하는 동기 함수"""
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """'online' 모드에서 마이그레이션을 실행합니다."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
