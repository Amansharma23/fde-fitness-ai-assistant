from pathlib import Path
from typing import List
import os

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

load_dotenv(BASE_DIR / ".env")
load_dotenv(PROJECT_ROOT / ".env")


def _csv(value: str) -> List[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings:
    raw_database_url: str = os.getenv("DATABASE_URL", "sqlite:///database/fitness.db")
    database_url: str = raw_database_url
    cors_origins: List[str] = _csv(
        os.getenv("CORS_ORIGINS", "http://localhost:5173")
    )
    gemini_api_key: str | None = os.getenv("GEMINI_API_KEY")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    seed_mock_data: bool = os.getenv("SEED_MOCK_DATA", "true").lower() in {
        "1",
        "true",
        "yes",
        "on",
    }


settings = Settings()

if settings.database_url.startswith("sqlite:///"):
    sqlite_path = settings.database_url.replace("sqlite:///", "", 1)
    path = Path(sqlite_path)
    if not path.is_absolute():
        settings.database_url = f"sqlite:///{(PROJECT_ROOT / path).as_posix()}"
