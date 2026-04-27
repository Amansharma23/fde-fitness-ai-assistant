import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=api_key)

models_to_test = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-pro',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
]
for m in models_to_test:
    print(f"Testing {m}...")
    try:
        model = genai.GenerativeModel(m)
        prompt = 'Respond with exactly {"test": "success"}'
        response = model.generate_content(prompt)
        print('Response:', response.text)
        print(f"Model {m} SUCCESS")
        break
    except Exception as e:
        print(f"Model {m} failed: {e}")
