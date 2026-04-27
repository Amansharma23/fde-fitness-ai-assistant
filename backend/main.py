from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Literal
import uvicorn
import google.generativeai as genai
import json

from database import get_db, engine
import models
import crud
from config import settings
from seed_data import seed_mock_data

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="FitLife AI Assistant API", description="Backend for the Personal Fitness Tracker")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini Setup
if settings.gemini_api_key and settings.gemini_api_key != "YOUR_API_KEY_HERE":
    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel(settings.gemini_model)
else:
    model = None

# Pydantic Models
class Profile(BaseModel):
    name: str
    age: int | None = None
    height: float | None = None
    weight: float | None = None
    goal: Literal["Lose Weight", "Build Strength", "Stay Active", "Improve Endurance"]
    activityLevel: Literal["Beginner", "Intermediate", "Advanced"]

class Activity(BaseModel):
    id: str
    type: Literal["Walking", "Running", "Gym", "Yoga", "Cycling", "Custom"]
    duration: int
    intensity: Literal["Low", "Medium", "High"]
    feeling: Literal["Easy", "Normal", "Hard"]
    notes: str
    date: str

class RecommendationRequest(BaseModel):
    profile: Profile
    activities: List[Activity]

class SettingsUpdate(BaseModel):
    system_prompt: str
    safety_guardrails: str

class CreateUserRequest(BaseModel):
    user_id: str = Field(min_length=3, max_length=40, pattern=r"^[a-z0-9_]+$")
    name: str = Field(min_length=1, max_length=80)
    age: int | None = None
    height: float | None = None
    weight: float | None = None
    goal: Literal["Lose Weight", "Build Strength", "Stay Active", "Improve Endurance"] = "Stay Active"
    activityLevel: Literal["Beginner", "Intermediate", "Advanced"] = "Beginner"

def empty_meals(label: str):
    return {
        "breakfast": label,
        "lunch": label,
        "dinner": label,
        "snacks": label,
    }

def fallback_recommendations():
    return {
        "bmi_and_health_report": {
            "status": "Unknown",
            "target_difference": "N/A",
            "time_required": "N/A"
        },
        "weekly_diet_plan": {
            day: {
                "veg": empty_meals("Standard vegetarian meal"),
                "non_veg": empty_meals("Standard non-vegetarian meal"),
            }
            for day in ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        },
        "general_tips": [
            "Stay consistent with your routine.",
            "Remember to hydrate.",
            "Take an active recovery day when needed.",
        ]
    }

@app.on_event("startup")
def seed_defaults():
    if not settings.seed_mock_data:
        return
    db = next(get_db())
    try:
        seed_mock_data(db)
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to FitLife AI Assistant API"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "ai_configured": model is not None, "seed_mock_data": settings.seed_mock_data}

@app.get("/api/settings")
def get_settings(db: Session = Depends(get_db)):
    settings = crud.get_settings(db)
    return {
        "system_prompt": settings.system_prompt,
        "safety_guardrails": settings.safety_guardrails
    }

@app.put("/api/settings")
def update_settings(settings: SettingsUpdate, db: Session = Depends(get_db)):
    crud.update_settings(db, settings.system_prompt, settings.safety_guardrails)
    return {"status": "success"}

@app.get("/api/users")
def get_all_users(db: Session = Depends(get_db)):
    users = crud.get_all_users(db)
    result = []
    for u in users:
        profile = crud.get_profile(db, u.id)
        result.append({
            "id": u.id,
            "profile": {
                "name": profile.name if profile and profile.name is not None else "",
                "age": profile.age if profile and profile.age is not None else "",
                "height": profile.height if profile and profile.height is not None else "",
                "weight": profile.weight if profile and profile.weight is not None else "",
                "goal": profile.goal if profile and profile.goal is not None else "Stay Active",
                "activityLevel": profile.activityLevel if profile and profile.activityLevel is not None else "Beginner"
            }
        })
    return result

@app.post("/api/users", status_code=201)
def create_app_user(req: CreateUserRequest, db: Session = Depends(get_db)):
    if crud.get_user(db, req.user_id):
        raise HTTPException(status_code=409, detail="User ID already exists.")

    crud.create_user(db, req.user_id)
    crud.update_profile(db, req.user_id, {
        "name": req.name,
        "age": req.age,
        "height": req.height,
        "weight": req.weight,
        "goal": req.goal,
        "activityLevel": req.activityLevel,
    })
    return {"status": "success", "id": req.user_id}

@app.get("/api/users/{user_id}/profile")
def get_user_profile(user_id: str, db: Session = Depends(get_db)):
    profile = crud.get_profile(db, user_id)
    if not profile:
        return {}
    return {
        "name": profile.name if profile.name is not None else "",
        "age": profile.age if profile.age is not None else "",
        "height": profile.height if profile.height is not None else "",
        "weight": profile.weight if profile.weight is not None else "",
        "goal": profile.goal if profile.goal is not None else "Stay Active",
        "activityLevel": profile.activityLevel if profile.activityLevel is not None else "Beginner"
    }

@app.put("/api/users/{user_id}/profile")
def update_user_profile(user_id: str, profile: Profile, db: Session = Depends(get_db)):
    profile_dict = profile.model_dump()
    crud.update_profile(db, user_id, profile_dict)
    return {"status": "success"}

@app.get("/api/users/{user_id}/activities")
def get_user_activities(user_id: str, db: Session = Depends(get_db)):
    activities = crud.get_activities(db, user_id)
    return [{
        "id": a.id,
        "type": a.type,
        "duration": a.duration,
        "intensity": a.intensity,
        "feeling": a.feeling,
        "notes": a.notes,
        "date": a.date
    } for a in activities]

@app.post("/api/users/{user_id}/activities")
def add_user_activity(user_id: str, activity: Activity, db: Session = Depends(get_db)):
    crud.create_activity(db, user_id, activity.model_dump())
    return {"status": "success"}

@app.post("/api/coach/recommendations")
def get_recommendations(req: RecommendationRequest, db: Session = Depends(get_db)):
    if not model:
        raise HTTPException(status_code=500, detail="Gemini API Key is missing or invalid in the backend.")

    try:
        # Take only the 3 most recent activities to save context and focus on current state
        recent_activities = req.activities[:3]
        
        settings = crud.get_settings(db)
        
        # Construct the prompt
        prompt = f"""
{settings.system_prompt}

{settings.safety_guardrails}

USER CONTEXT:
Profile: Age {req.profile.age}, Goal: {req.profile.goal}, Activity Level: {req.profile.activityLevel}, Height: {req.profile.height}, Weight: {req.profile.weight}
Recent Activities: {len(recent_activities)} recent logged sessions. 
Details: {json.dumps([{'type': a.type, 'duration': a.duration, 'intensity': a.intensity, 'feeling': a.feeling} for a in recent_activities])}

Task: Generate a comprehensive fitness report based on the user's profile and activities.
You MUST return exactly a valid JSON object matching this schema:
{{
  "bmi_and_health_report": {{
    "status": "string (e.g., Overweight, Normal, Underweight)",
    "target_difference": "string (e.g., Lose 5kg, Gain 2kg, Maintain weight)",
    "time_required": "string (e.g., 10 weeks at 0.5kg/week, N/A)"
  }},
  "weekly_diet_plan": {{
    "monday": {{"veg": {{"breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string"}}, "non_veg": {{"breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string"}}}},
    "tuesday": {{"veg": {{"breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string"}}, "non_veg": {{"breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string"}}}},
    "wednesday": {{"veg": {{"breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string"}}, "non_veg": {{"breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string"}}}},
    "thursday": {{"veg": {{"breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string"}}, "non_veg": {{"breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string"}}}},
    "friday": {{"veg": {{"breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string"}}, "non_veg": {{"breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string"}}}},
    "saturday": {{"veg": {{"breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string"}}, "non_veg": {{"breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string"}}}},
    "sunday": {{"veg": {{"breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string"}}, "non_veg": {{"breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string"}}}}
  }},
  "general_tips": [
    "string", "string", "string"
  ]
}}
Do not include any markdown formatting, markdown code blocks, or extra text outside the JSON object.
"""
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean up if the model wrapped it in markdown code blocks
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        text = text.strip()
        
        tips = json.loads(text)
        
        if not isinstance(tips, dict) or "bmi_and_health_report" not in tips:
            tips = fallback_recommendations()
            
        return {"recommendations": tips}
        
    except Exception as e:
        print(f"Error generating content: {e}")
        return {"recommendations": fallback_recommendations()}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
