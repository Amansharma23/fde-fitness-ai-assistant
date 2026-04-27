# Technical Specification

## Runtime Versions

Observed on the current development machine:

- Node.js: `v23.11.0`
- npm: `11.6.0`
- Python: `3.13.6`

## Frontend

Location:

```text
frontend/
```

Main technologies:

- React `19.2.5`
- React DOM `19.2.5`
- Vite `8.0.10`
- TypeScript `~6.0.2`
- React Router DOM `7.14.2`
- Recharts `3.8.1`
- Lucide React `1.11.0`
- ESLint `10.2.1`

Important files:

- `frontend/src/main.tsx`: React entry point.
- `frontend/src/App.tsx`: routes and layout.
- `frontend/src/config.ts`: frontend API URL configuration.
- `frontend/src/context/AppContext.tsx`: app state and API calls.
- `frontend/src/context/appContextValue.ts`: React context definition and hook.
- `frontend/src/index.css`: global styling and layout system.

## Backend

Location:

```text
backend/
```

Main technologies:

- FastAPI `0.110.0`
- Uvicorn `0.29.0`
- Pydantic `2.6.4`
- SQLAlchemy `2.0.36`
- google-generativeai `0.4.1`
- python-dotenv `1.0.1`

Important files:

- `backend/main.py`: API routes and Gemini integration.
- `backend/config.py`: backend environment/config loading.
- `backend/database.py`: SQLAlchemy engine and session.
- `backend/models.py`: database models.
- `backend/crud.py`: database operations.
- `backend/seed_data.py`: default seed users and activities.
- `backend/init_db.py`: creates tables and seeds local data.

## Database

Default database:

```text
database/fitness.db
```

Database type:

```text
SQLite
```

Recommended editors:

- DB Browser for SQLite
- DBeaver with SQLite driver
- VS Code SQLite extension

## Environment Variables

Backend `.env` values:

```text
GEMINI_API_KEY
GEMINI_MODEL
DATABASE_URL
CORS_ORIGINS
SEED_MOCK_DATA
```

Frontend `.env` values:

```text
VITE_API_BASE_URL
```

Do not commit real `.env` files.

## Validation Commands

Frontend:

```powershell
cd frontend
npm run lint
npm run build
```

Backend syntax check:

```powershell
python -m compileall -q backend -x "backend\\venv"
```
