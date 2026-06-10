import os
import json
import logging
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)
client = Groq(api_key=os.getenv("GROQ_API_KEY").strip())

EMPTY_RESULT = {
    "full_name": None,
    "date_of_birth": None,
    "address": None,
    "phone_number": None,
    "insurance_number": None,
    "symptoms": [],
    "emergency_contact": None
}

def extract_patient_data(transcript: str) -> dict:
    if not transcript or not transcript.strip():
        logger.warning("Empty transcript received")
        return EMPTY_RESULT

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

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            timeout=30,
        )

        raw = response.choices[0].message.content.strip()

        # Strip markdown code blocks if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        result = json.loads(raw)

        # Ensure all expected keys exist
        for key in EMPTY_RESULT:
            if key not in result:
                result[key] = EMPTY_RESULT[key]

        logger.info(f"Extraction successful: full_name={result.get('full_name')}")
        return result

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error from Groq response: {e} | raw: {raw[:200]}")
        return EMPTY_RESULT
    except Exception as e:
        logger.error(f"Extraction failed: {e}")
        return EMPTY_RESULT