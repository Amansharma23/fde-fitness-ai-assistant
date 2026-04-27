# Project Summary

## What Is Built

FitLife AI is a full-stack personal fitness tracker with a React frontend and FastAPI backend.

Core capabilities:

- Multi-user profile selection.
- Proper Add User UI with unique user ID validation.
- SQLite-backed users, profiles, activities, and global AI settings.
- Activity logging.
- Progress charts using Recharts.
- Gemini-powered AI Coach.
- Temporary AI report cache in browser `sessionStorage`.
- Veg, Non Veg, and Both diet display modes.
- Admin page for prompt and guardrail management.
- Environment-driven frontend and backend configuration.

## Current Backend

The backend is not just a placeholder. It provides:

- `GET /api/health`
- `GET /api/users`
- `POST /api/users`
- `GET /api/users/{user_id}/profile`
- `PUT /api/users/{user_id}/profile`
- `GET /api/users/{user_id}/activities`
- `POST /api/users/{user_id}/activities`
- `GET /api/settings`
- `PUT /api/settings`
- `POST /api/coach/recommendations`

## Current AI Flow

1. Frontend sends the selected user's profile and recent activities to the backend.
2. Backend loads system prompt and safety guardrails from the database.
3. Backend sends a structured prompt to Gemini.
4. Backend parses the JSON response.
5. Frontend displays BMI, health report, diet plan, and tips.
6. Frontend stores the generated report in `sessionStorage` per user to avoid repeat token usage while navigating.

## Data Model

SQLite tables:

- `users`
- `profiles`
- `activities`
- `system_settings`

`users.id` is the unique user ID. Profile `name` can repeat.

## Configuration

Backend runtime settings live in:

```text
backend/config.py
```

Frontend API URL selection lives in:

```text
frontend/src/config.ts
```

Environment examples:

```text
backend/.env.example
frontend/.env.example
```
