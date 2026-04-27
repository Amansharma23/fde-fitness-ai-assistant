# Personal Fitness Tracker AI Assistant - Walkthrough

## Application Overview

FitLife AI is a React + FastAPI fitness tracker with:

- User profile management.
- Activity logging.
- Dashboard metrics and progress charts.
- Gemini-powered AI health, BMI, and weekly diet recommendations.
- Admin settings for AI system prompt and safety guardrails.
- SQLite persistence for users, profiles, activities, and system settings.

## Main Screens

### Dashboard
Shows the selected user's total workouts, weekly minutes, current goal, consistency, and recent activities.

### Activity Log
Lets the selected user log activity type, duration, intensity, feeling, notes, and date.

### AI Coach
Generates a structured AI report using the selected profile and recent activities. Reports are temporarily cached in browser `sessionStorage` by user ID so switching tabs or pages does not spend tokens again.

Diet display options:

- Both
- Veg
- Non Veg

### Progress
Shows a weekly activity chart and activity type breakdown.

### Profile
Lets the selected user's name, age, height, weight, goal, and activity level be edited.

### Sidebar User Management
The sidebar contains:

- Active user selector.
- Add User form.
- Theme toggle.

Adding a user requires:

- Unique `user_id`.
- Display name.

Names may repeat. User IDs must be unique and may contain lowercase letters, numbers, and underscores.

## How To Run

### Backend

```powershell
cd "f:\FDE Project\Project 25 Apr\Personal Fitness Tracker AI Assistant\fde-fitness-ai-assistant\backend"
.\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend URL:

```text
http://localhost:8000
```

### Frontend

```powershell
cd "f:\FDE Project\Project 25 Apr\Personal Fitness Tracker AI Assistant\fde-fitness-ai-assistant\frontend"
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Database

The local database is SQLite:

```text
database/fitness.db
```

Recommended DB tools:

- DBeaver using a SQLite connection
- VS Code SQLite extension

Stop the backend before manually editing SQLite data.

## Validation

Use these commands before sharing changes:

```powershell
cd frontend
npm run lint
npm run build
```

```powershell
cd ..
python -m compileall -q backend -x "backend\\venv"
```
