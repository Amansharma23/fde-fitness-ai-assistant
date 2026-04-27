import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.5-flash')

system_prompt = "You are FitLife AI, a supportive, encouraging, and highly knowledgeable fitness coach. Your tone should be motivational, empathetic, and professional."
safety_guardrails = "SAFETY RULES:\n1. NEVER provide medical advice. If a user asks about pain, injury, or medical conditions, direct them to a doctor.\n2. NEVER recommend extreme dieting, caloric intake below 1200 kcal/day, or dangerous exercise regimens.\n3. ALWAYS remind users to stay hydrated and prioritize recovery."

mock_profile = {
    "age": 30,
    "goal": "Lose Weight",
    "activityLevel": "Intermediate",
    "height": 180,
    "weight": 85
}

mock_activities = [
    {"type": "Running", "duration": 30, "intensity": "High", "feeling": "Good"},
    {"type": "Yoga", "duration": 45, "intensity": "Low", "feeling": "Relaxed"}
]

prompt = f"""
{system_prompt}

{safety_guardrails}

USER CONTEXT:
Profile: Age {mock_profile['age']}, Goal: {mock_profile['goal']}, Activity Level: {mock_profile['activityLevel']}, Height: {mock_profile['height']}, Weight: {mock_profile['weight']}
Recent Activities: {len(mock_activities)} recent logged sessions. 
Details: {json.dumps(mock_activities)}

Task: Generate a comprehensive fitness report based on the user's profile and activities.
You MUST return exactly a valid JSON object matching this schema:
{{
  "bmi_and_health_report": {{
    "status": "string (e.g., Overweight, Normal, Underweight)",
    "target_difference": "string (e.g., Lose 5kg, Gain 2kg, Maintain weight)",
    "time_required": "string (e.g., 10 weeks at 0.5kg/week, N/A)"
  }},
  "weekly_diet_plan": {{
    "monday": {{"veg": "string", "non_veg": "string"}},
    "tuesday": {{"veg": "string", "non_veg": "string"}},
    "wednesday": {{"veg": "string", "non_veg": "string"}},
    "thursday": {{"veg": "string", "non_veg": "string"}},
    "friday": {{"veg": "string", "non_veg": "string"}},
    "saturday": {{"veg": "string", "non_veg": "string"}},
    "sunday": {{"veg": "string", "non_veg": "string"}}
  }},
  "general_tips": [
    "string", "string", "string"
  ]
}}
Do not include any markdown formatting, markdown code blocks, or extra text outside the JSON object.
"""

response = model.generate_content(prompt)
text = response.text.strip()
if text.startswith("```json"): text = text[7:]
if text.startswith("```"): text = text[3:]
if text.endswith("```"): text = text[:-3]

output = {
    "SENT_TO_GEMINI_PROMPT": prompt.strip(),
    "RECEIVED_FROM_GEMINI_RESPONSE": json.loads(text.strip())
}

print(json.dumps(output, indent=2))
