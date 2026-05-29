from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from ai.extractor import extract_patient_data
from stt.transcriber import transcribe_audio
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

@app.get("/")
def root():
    return {"status": "VoiceIntake backend is running"}

@app.get("/health")
def health():
    api_key = os.getenv("GROQ_API_KEY")
    return {
        "status": "healthy",
        "groq_key_loaded": bool(api_key)
    }

# Endpoint 1: Extract from text transcript
@app.post("/extract")
def extract(request: TranscriptRequest):
    result = extract_patient_data(request.transcript)
    return {
        "success": True,
        "transcript": request.transcript,
        "extracted": result
    }

# Endpoint 2: Transcribe audio file only
@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    transcript = transcribe_audio(audio_bytes, file.filename)
    return {
        "success": True,
        "transcript": transcript
    }

# Endpoint 3: Full pipeline — audio in, structured data out
@app.post("/process")
async def process(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    transcript = transcribe_audio(audio_bytes, file.filename)
    extracted = extract_patient_data(transcript)
    return {
        "success": True,
        "transcript": transcript,
        "extracted": extracted
    }
