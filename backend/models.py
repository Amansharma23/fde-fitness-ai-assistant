from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True) # e.g. "admin", "user_test"
    
    profile = relationship("Profile", back_populates="user", uselist=False)
    activities = relationship("Activity", back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String)
    age = Column(Integer, nullable=True)
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    goal = Column(String)
    activityLevel = Column(String)
    
    user = relationship("User", back_populates="profile")

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    type = Column(String)
    duration = Column(Integer)
    intensity = Column(String)
    feeling = Column(String)
    notes = Column(String)
    date = Column(String)
    
    user = relationship("User", back_populates="activities")

class SystemSettings(Base):
    __tablename__ = "system_settings"
    
    id = Column(String, primary_key=True, index=True) # e.g. "global"
    system_prompt = Column(String)
    safety_guardrails = Column(String)
