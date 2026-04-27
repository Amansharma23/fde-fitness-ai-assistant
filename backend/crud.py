from sqlalchemy.orm import Session
from sqlalchemy import desc
import models
import uuid

def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_all_users(db: Session):
    return db.query(models.User).all()

def create_user(db: Session, user_id: str):
    db_user = models.User(id=user_id)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_profile(db: Session, user_id: str):
    return db.query(models.Profile).filter(models.Profile.user_id == user_id).first()

def update_profile(db: Session, user_id: str, profile_data: dict):
    if not get_user(db, user_id):
        create_user(db, user_id)

    db_profile = get_profile(db, user_id)
    if db_profile:
        for key, value in profile_data.items():
            setattr(db_profile, key, value)
    else:
        db_profile = models.Profile(user_id=user_id, **profile_data)
        db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def get_activities(db: Session, user_id: str, limit: int = 100):
    return db.query(models.Activity).filter(models.Activity.user_id == user_id).order_by(desc(models.Activity.date)).limit(limit).all()

def create_activity(db: Session, user_id: str, activity_data: dict):
    data = activity_data.copy()
    activity_id = data.pop("id", str(uuid.uuid4()))
    db_activity = models.Activity(id=activity_id, user_id=user_id, **data)
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

def get_settings(db: Session):
    settings = db.query(models.SystemSettings).filter(models.SystemSettings.id == "global").first()
    if not settings:
        settings = models.SystemSettings(
            id="global",
            system_prompt="You are FitLife AI, a supportive, encouraging, and highly knowledgeable fitness coach. Your tone should be motivational, empathetic, and professional.",
            safety_guardrails="SAFETY RULES:\n1. NEVER provide medical advice. If a user asks about pain, injury, or medical conditions, direct them to a doctor.\n2. NEVER recommend extreme dieting, caloric intake below 1200 kcal/day, or dangerous exercise regimens.\n3. ALWAYS remind users to stay hydrated and prioritize recovery."
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

def update_settings(db: Session, system_prompt: str, safety_guardrails: str):
    settings = get_settings(db)
    settings.system_prompt = system_prompt
    settings.safety_guardrails = safety_guardrails
    db.commit()
    db.refresh(settings)
    return settings
