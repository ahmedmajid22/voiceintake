from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from ai.extractor import extract_patient_data
from stt.transcriber import transcribe_audio
from form.filler import fill_form
from database.logger import log_session
from typing import Optional, List
import os

load_dotenv()

from database.logger import supabase

app = FastAPI(title="VoiceIntake API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth ────────────────────────────────────────────────────────────────────

def verify_token(authorization: str = Header(...)):
    try:
        token = authorization.replace("Bearer ", "")
        user  = supabase.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user.user
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# ── Models ──────────────────────────────────────────────────────────────────

class TranscriptRequest(BaseModel):
    transcript: str
    clinic_id: Optional[str] = "default"

class FillRequest(BaseModel):
    full_name:         Optional[str] = None
    date_of_birth:     Optional[str] = None
    address:           Optional[str] = None
    phone_number:      Optional[str] = None
    insurance_number:  Optional[str] = None
    symptoms:          List[str] = []
    emergency_contact: Optional[str] = None

# ── Public routes ───────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "VoiceIntake backend is running"}

@app.get("/health")
def health():
    return {
        "status":             "healthy",
        "groq_key_loaded":    bool(os.getenv("GROQ_API_KEY")),
        "supabase_connected": bool(os.getenv("SUPABASE_URL"))
    }

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    transcript  = transcribe_audio(audio_bytes, file.filename)
    return {"success": True, "transcript": transcript}

@app.post("/extract")
def extract(request: TranscriptRequest):
    result = extract_patient_data(request.transcript)
    return {"success": True, "transcript": request.transcript, "extracted": result}

@app.post("/process")
async def process(file: UploadFile = File(...), clinic_id: str = "default", language: str = "en"):
    audio_bytes = await file.read()
    transcript  = transcribe_audio(audio_bytes, file.filename, language=language)
    extracted   = extract_patient_data(transcript)
    session_id  = log_session(transcript, extracted, clinic_id=clinic_id)
    return {
        "success":    True,
        "transcript": transcript,
        "extracted":  extracted,
        "session_id": session_id
    }

# ── Protected routes (staff only) ───────────────────────────────────────────

@app.post("/fill")
def fill(request: FillRequest, user=Depends(verify_token)):
    fill_form(request.dict())
    return {"success": True, "message": "Form filled"}

@app.get("/sessions")
def get_sessions(user=Depends(verify_token), clinic_id: str = "default"):
    result = supabase.table("sessions")\
        .select("*")\
        .eq("clinic_id", clinic_id)\
        .order("created_at", desc=True)\
        .limit(50)\
        .execute()
    return {"success": True, "sessions": result.data}

@app.post("/process-and-fill")
async def process_and_fill(file: UploadFile = File(...), user=Depends(verify_token)):
    audio_bytes = await file.read()
    transcript  = transcribe_audio(audio_bytes, file.filename)
    extracted   = extract_patient_data(transcript)
    session_id  = log_session(transcript, extracted)
    fill_form(extracted)
    return {
        "success":    True,
        "transcript": transcript,
        "extracted":  extracted,
        "session_id": session_id,
        "message":    "Form filled"
    }