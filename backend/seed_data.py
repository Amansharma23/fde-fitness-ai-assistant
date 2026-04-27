from datetime import datetime, timedelta

import crud


DEFAULT_USERS = [
    {
        "id": "admin",
        "profile": {
            "name": "Admin User",
            "age": None,
            "height": None,
            "weight": None,
            "goal": "Build Strength",
            "activityLevel": "Beginner",
        },
        "activities": [],
    },
    {
        "id": "user_active",
        "profile": {
            "name": "Active Alex",
            "age": 28,
            "height": 180.0,
            "weight": 75.0,
            "goal": "Stay Active",
            "activityLevel": "Advanced",
        },
        "activities": [
            ("Running", 40, "High", "Normal", "Tempo run", 0),
            ("Cycling", 55, "Medium", "Easy", "Road ride", 1),
            ("Gym", 50, "High", "Hard", "Upper body strength", 3),
        ],
    },
    {
        "id": "user_moderate",
        "profile": {
            "name": "Moderate Mike",
            "age": 35,
            "height": 170.0,
            "weight": 70.0,
            "goal": "Improve Endurance",
            "activityLevel": "Intermediate",
        },
        "activities": [
            ("Walking", 35, "Low", "Easy", "Brisk walk", 0),
            ("Running", 25, "Medium", "Normal", "Intervals", 2),
            ("Yoga", 30, "Low", "Easy", "Mobility", 4),
        ],
    },
    {
        "id": "user_obese",
        "profile": {
            "name": "Oliver Reed",
            "age": 40,
            "height": 165.0,
            "weight": 100.0,
            "goal": "Lose Weight",
            "activityLevel": "Beginner",
        },
        "activities": [
            ("Walking", 20, "Low", "Normal", "Starter walk", 0),
            ("Cycling", 18, "Low", "Normal", "Stationary bike", 2),
        ],
    },
    {
        "id": "user_underweight",
        "profile": {
            "name": "Uma Singh",
            "age": 22,
            "height": 185.0,
            "weight": 60.0,
            "goal": "Build Strength",
            "activityLevel": "Beginner",
        },
        "activities": [
            ("Gym", 35, "Medium", "Normal", "Full body basics", 1),
            ("Yoga", 25, "Low", "Easy", "Recovery flow", 3),
        ],
    },
    {
        "id": "user_hardworker",
        "profile": {
            "name": "Harry Kumar",
            "age": 29,
            "height": 175.0,
            "weight": 72.0,
            "goal": "Build Strength",
            "activityLevel": "Advanced",
        },
        "activities": [
            ("Gym", 70, "High", "Hard", "Heavy compound lifts", 0),
            ("Running", 30, "Medium", "Normal", "Conditioning run", 1),
            ("Cycling", 45, "Medium", "Normal", "Zone 2 ride", 2),
            ("Yoga", 20, "Low", "Easy", "Cooldown mobility", 4),
        ],
    },
]


def seed_mock_data(db):
    now = datetime.now()

    for user_data in DEFAULT_USERS:
        user_id = user_data["id"]
        if not crud.get_user(db, user_id):
            crud.create_user(db, user_id)

        crud.update_profile(db, user_id, user_data["profile"])

        if crud.get_activities(db, user_id, limit=1):
            continue

        for index, activity in enumerate(user_data["activities"], start=1):
            activity_type, duration, intensity, feeling, notes, days_ago = activity
            crud.create_activity(
                db,
                user_id,
                {
                    "id": f"{user_id}-{index}",
                    "type": activity_type,
                    "duration": duration,
                    "intensity": intensity,
                    "feeling": feeling,
                    "notes": notes,
                    "date": (now - timedelta(days=days_ago)).isoformat(),
                },
            )
