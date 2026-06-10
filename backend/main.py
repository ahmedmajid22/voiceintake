import os
import logging
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from ai.extractor import extract_patient_data
from stt.transcriber import transcribe_audio
from database.logger import log_session
from typing import Optional, List

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

from database.logger import supabase

# ── Rate limiter ─────────────────────────────────────────────────────────────

limiter = Limiter(key_func=get_remote_address, default_limits=["100/hour"])

app = FastAPI(title="VoiceIntake API", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://voiceintake-app.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth ─────────────────────────────────────────────────────────────────────

def verify_token(authorization: str = Header(...)):
    try:
        token = authorization.replace("Bearer ", "").strip()
        user  = supabase.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user.user
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# ── Models ────────────────────────────────────────────────────────────────────

class TranscriptRequest(BaseModel):
    transcript: str
    clinic_id: Optional[str] = "default"

# ── Constants ─────────────────────────────────────────────────────────────────

MAX_AUDIO_SIZE = 25 * 1024 * 1024  # 25MB

# ── Public routes ─────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "VoiceIntake API is running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {
        "status":             "healthy",
        "groq_key_loaded":    bool(os.getenv("GROQ_API_KEY")),
        "supabase_connected": bool(os.getenv("SUPABASE_URL")),
        "version":            "1.0.0"
    }

@app.post("/transcribe")
@limiter.limit("20/minute")
async def transcribe(request: Request, file: UploadFile = File(...)):
    audio_bytes = await file.read()
    if len(audio_bytes) > MAX_AUDIO_SIZE:
        raise HTTPException(status_code=413, detail="Audio file too large. Max 25MB.")
    transcript = transcribe_audio(audio_bytes, file.filename)
    logger.info(f"Transcribed {len(audio_bytes)} bytes")
    return {"success": True, "transcript": transcript}

@app.post("/extract")
@limiter.limit("20/minute")
def extract(request: Request, req: TranscriptRequest):
    result = extract_patient_data(req.transcript)
    return {"success": True, "transcript": req.transcript, "extracted": result}

@app.post("/process")
@limiter.limit("10/minute")
async def process(
    request: Request,
    file: UploadFile = File(...),
    clinic_id: str = Form("default"),
    language: str = Form("en")
):
    audio_bytes = await file.read()

    if len(audio_bytes) > MAX_AUDIO_SIZE:
        raise HTTPException(status_code=413, detail="Audio file too large. Max 25MB.")

    if len(audio_bytes) < 1000:
        raise HTTPException(status_code=400, detail="Audio file too small or empty.")

    logger.info(f"Processing: clinic_id={clinic_id}, language={language}, size={len(audio_bytes)}")

    transcript = transcribe_audio(audio_bytes, file.filename, language=language)
    extracted  = extract_patient_data(transcript)
    session_id = log_session(transcript, extracted, clinic_id=clinic_id)

    logger.info(f"Session logged: {session_id}, patient={extracted.get('full_name')}")

    return {
        "success":    True,
        "transcript": transcript,
        "extracted":  extracted,
        "session_id": session_id
    }

# ── Protected routes (staff only) ────────────────────────────────────────────

@app.get("/sessions")
def get_sessions(user=Depends(verify_token), clinic_id: str = "default"):
    logger.info(f"Sessions requested: clinic_id={clinic_id}, user={user.id}")
    result = supabase.table("sessions")\
        .select("*")\
        .eq("clinic_id", clinic_id)\
        .order("created_at", desc=True)\
        .limit(50)\
        .execute()
    return {"success": True, "sessions": result.data}

@app.delete("/sessions/{session_id}")
def delete_session(session_id: str, user=Depends(verify_token)):
    try:
        supabase.table("sessions").delete().eq("id", session_id).execute()
        logger.info(f"Session deleted: {session_id} by user={user.id}")
        return {"success": True, "message": "Session deleted"}
    except Exception as e:
        logger.error(f"Delete failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete session")