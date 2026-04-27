# Design Document

## Purpose

FitLife AI is a personal fitness tracker and AI coaching assistant. It stores user profiles and activity logs, then uses those records to generate structured health, BMI, and diet guidance.

## High-Level Architecture

```text
Browser React App
  -> FastAPI REST API
    -> SQLite database
    -> Gemini API
```

## Frontend Design

The frontend is a Vite React application.

Key responsibilities:

- Render pages and navigation.
- Manage active user selection.
- Create users through the API.
- Submit profile and activity changes.
- Request AI reports.
- Cache generated AI reports temporarily in `sessionStorage`.

Frontend app configuration is centralized here:

```text
frontend/src/config.ts
```

To add a production URL, update one of these:

1. Preferred deployment setting:

```text
VITE_API_BASE_URL
```

2. Host-based fallback map:

```text
frontend/src/config.ts
```

The host-based map is useful when the same build is opened from known hosts and should choose an API URL automatically.

## Backend Design

The backend is a FastAPI application.

Key responsibilities:

- Serve REST endpoints.
- Validate request payloads.
- Persist users, profiles, activities, and settings.
- Load runtime configuration.
- Call Gemini.
- Provide safe fallback AI report data if parsing fails.

Backend configuration is centralized here:

```text
backend/config.py
```

For production/UAT, update environment variables rather than source code:

```text
DATABASE_URL
CORS_ORIGINS
GEMINI_API_KEY
GEMINI_MODEL
SEED_MOCK_DATA
```

## Hardcoded Configuration Locations

These are the places intentionally containing defaults or host mappings:

- `frontend/src/config.ts`
  - Host-based API URL mapping.
  - `VITE_API_BASE_URL` override.
- `backend/config.py`
  - Default `DATABASE_URL`.
  - Default `CORS_ORIGINS`.
  - Default `GEMINI_MODEL`.
  - Default `SEED_MOCK_DATA`.
- `backend/.env.example`
  - Example backend environment values.
- `frontend/.env.example`
  - Example frontend environment values.

## Production URL Setup

Frontend production API URL:

```text
frontend/.env.production
VITE_API_BASE_URL=https://your-api-domain.example.com/api
```

Backend allowed frontend origins:

```text
backend/.env
CORS_ORIGINS=https://your-frontend-domain.example.com
```

Backend database:

```text
backend/.env
DATABASE_URL=<production database connection string>
```

Backend Gemini:

```text
backend/.env
GEMINI_API_KEY=<production key>
GEMINI_MODEL=gemini-2.5-flash
```

Disable seed data in production:

```text
backend/.env
SEED_MOCK_DATA=false
```

## User Management Rules

- User ID is unique and stable.
- User ID supports lowercase letters, numbers, and underscores.
- Profile name can repeat.
- New users are created with default goal/activity level.
- User data is fetched when active user changes.

## AI Report Cache

AI reports are cached in browser `sessionStorage` by user ID:

```text
fitlife-ai-report:<user_id>
```

This avoids repeated token usage when switching tabs or navigating away and back during the same browser session.

## Security Notes

Current project intentionally has no login/authentication. Before production, add:

- Authentication.
- Authorization for admin settings.
- Server-side user permissions.
- Secure secret management.
- HTTPS-only deployment.
