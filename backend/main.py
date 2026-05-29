from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from ai.extractor import extract_patient_data
from stt.transcriber import transcribe_audio
from form.filler import fill_form
from typing import Optional, List
import os

load_dotenv()

app = FastAPI(title="VoiceIntake API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranscriptRequest(BaseModel):
    transcript: str

class FillRequest(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    insurance_number: Optional[str] = None
    symptoms: List[str] = []
    emergency_contact: Optional[str] = None

@app.get("/")
def root():
    return {"status": "VoiceIntake backend is running"}

@app.get("/health")
def health():
    api_key = os.getenv("GROQ_API_KEY")
    return {"status": "healthy", "groq_key_loaded": bool(api_key)}

@app.post("/extract")
def extract(request: TranscriptRequest):
    result = extract_patient_data(request.transcript)
    return {"success": True, "transcript": request.transcript, "extracted": result}

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    transcript = transcribe_audio(audio_bytes, file.filename)
    return {"success": True, "transcript": transcript}

@app.post("/fill")
def fill(request: FillRequest):
    fill_form(request.dict())
    return {"success": True, "message": "Browser opened — check the Chromium window"}

@app.post("/process")
async def process(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    transcript = transcribe_audio(audio_bytes, file.filename)
    extracted = extract_patient_data(transcript)
    return {"success": True, "transcript": transcript, "extracted": extracted}

@app.post("/process-and-fill")
async def process_and_fill(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    transcript = transcribe_audio(audio_bytes, file.filename)
    extracted = extract_patient_data(transcript)
    fill_form(extracted)
    return {
        "success": True,
        "transcript": transcript,
        "extracted": extracted,
        "message": "Browser opened — check the Chromium window"
    }
