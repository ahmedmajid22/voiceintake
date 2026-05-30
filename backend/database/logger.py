import os
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

def log_session(transcript: str, extracted: dict, status: str = "completed") -> str:
    """
    Logs a patient intake session to Supabase.
    Returns the session ID.
    """
    try:
        data = {
            "transcript":       transcript,
            "full_name":        extracted.get("full_name"),
            "date_of_birth":    extracted.get("date_of_birth"),
            "address":          extracted.get("address"),
            "phone_number":     extracted.get("phone_number"),
            "insurance_number": extracted.get("insurance_number"),
            "symptoms":         extracted.get("symptoms", []),
            "emergency_contact":extracted.get("emergency_contact"),
            "extracted_data":   extracted,
            "status":           status,
        }

        result = supabase.table("sessions").insert(data).execute()
        session_id = result.data[0]["id"]
        print(f"✅ Session logged: {session_id}")
        return session_id

    except Exception as e:
        print(f"⚠️  Supabase logging failed (non-critical): {e}")
        return None
