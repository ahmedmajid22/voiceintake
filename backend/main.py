from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from ai.extractor import extract_patient_data
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
    api_key = os.getenv("ANTHROPIC_API_KEY")
    return {
        "status": "healthy",
        "claude_key_loaded": bool(api_key and api_key != "your_claude_api_key_here")
    }

@app.post("/extract")
def extract(request: TranscriptRequest):
    result = extract_patient_data(request.transcript)
    return {
        "success": True,
        "transcript": request.transcript,
        "extracted": result
    }
