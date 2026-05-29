import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_patient_data(transcript: str) -> dict:
    prompt = f"""You are a medical intake assistant. A patient just spoke the following:

"{transcript}"

Extract all patient information and return ONLY a valid JSON object with these fields:
- full_name (string or null)
- date_of_birth (string or null, format: YYYY-MM-DD if possible)
- address (string or null)
- phone_number (string or null)
- insurance_number (string or null)
- symptoms (list of strings, empty list if none)
- emergency_contact (string or null)

Return ONLY the JSON object, no explanation, no markdown, no extra text.

JSON:"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    return json.loads(raw)
