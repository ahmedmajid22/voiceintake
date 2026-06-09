# VoiceIntake
### AI-Powered Patient Intake — Speak Naturally, We Handle the Rest

<div align="center">

![VoiceIntake Demo](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=for-the-badge&logo=fastapi)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=for-the-badge&logo=supabase)

**[ Live Demo](https://voiceintake-app.netlify.app/demo) · [🎙️ Patient View](https://voiceintake-app.netlify.app) · [📊 Staff Dashboard](https://voiceintake-app.netlify.app/dashboard)**

</div>

---

## The Problem

Front desk staff at clinics spend **8–15 minutes per patient** typing intake forms manually. At 30 patients a day, that's up to **7 hours of pure admin work** — every single day. Errors happen. Staff burn out. Patients wait.

## The Solution

Patient speaks for **30 seconds**. VoiceIntake fills the entire intake form automatically.

```
Patient speaks → Whisper transcribes → Llama 3.3 extracts → Form fills instantly
```

No typing. No clipboards. No waiting.

---

##  Features

| Feature | Description |
|--------|-------------|
|  **Voice Intake** | Patient speaks naturally — AI understands and extracts all fields |
|  **4 Languages** | English, Arabic (العربية), German (Deutsch), French (Français) |
|  **AI Extraction** | Groq + Llama 3.3-70b extracts name, DOB, address, insurance, symptoms |
|  **GDPR Compliant** | Audio is never stored — only extracted data is saved |
|  **Multi-Clinic** | Each clinic gets its own ID — sessions are fully isolated |
|  **Staff Dashboard** | Real-time session log with authentication |
|  **Embeddable Widget** | One URL — any clinic can use it instantly |
|  **Inline Editing** | Patient reviews and corrects any field before submitting |
|  **Auth Protected** | Supabase Auth — staff must log in to access patient data |
|  **Consent Screen** | GDPR/HIPAA consent flow built in before any recording |

---

##  Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     PATIENT BROWSER                      │
│  React App (Netlify) → Records audio → Sends to backend  │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS POST /process
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  FASTAPI BACKEND (Railway)               │
│                                                         │
│  1. Groq Whisper API  →  Transcribe audio               │
│  2. Groq Llama 3.3    →  Extract patient fields         │
│  3. Supabase          →  Log session with clinic_id     │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE                             │
│  PostgreSQL DB  +  Auth (JWT)  +  Row-level security    │
└─────────────────────────────────────────────────────────┘
```

---

##  Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- [Groq API key](https://console.groq.com) (free)
- [Supabase project](https://supabase.com) (free)

### 1. Clone the repo

```bash
git clone https://github.com/ahmedmajid22/voiceintake.git
cd voiceintake
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_secret_key
```

Edit `frontend/.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://127.0.0.1:8000
```

### 3. Set up the database

Run this in your Supabase SQL editor:

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transcript TEXT,
  full_name TEXT,
  date_of_birth TEXT,
  address TEXT,
  phone_number TEXT,
  insurance_number TEXT,
  symptoms TEXT[],
  emergency_contact TEXT,
  extracted_data JSONB,
  status TEXT DEFAULT 'completed',
  clinic_id TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS clinic_id TEXT DEFAULT 'default';
CREATE INDEX IF NOT EXISTS sessions_clinic_id_idx ON sessions(clinic_id);
```

### 4. Start the backend

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd backend
uvicorn main:app --reload
```

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

### 6. Open the app

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | Patient intake view |
| `http://localhost:5173/dashboard` | Staff dashboard (login required) |
| `http://localhost:5173/demo` | Demo clinic landing page |
| `http://localhost:5173?clinic=your_clinic_id` | Clinic-specific intake |

---

##  Project Structure

```
voiceintake/
├── backend/
│   ├── main.py              # FastAPI app + all routes
│   ├── ai/
│   │   └── extractor.py     # Groq Llama 3.3 extraction
│   ├── stt/
│   │   └── transcriber.py   # Groq Whisper transcription
│   ├── database/
│   │   └── logger.py        # Supabase session logging
│   ├── form/
│   │   └── filler.py        # Form handler (frontend-based)
│   ├── Dockerfile           # Docker config for Railway
│   └── railway.toml         # Railway deployment config
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Patient intake flow
│   │   ├── Dashboard.jsx    # Staff dashboard + auth
│   │   ├── Widget.jsx       # Embeddable widget component
│   │   ├── DemoClinic.jsx   # Demo clinic landing page
│   │   └── supabase.js      # Supabase client
│   └── .env                 # Frontend environment variables
├── requirements.txt
└── README.md
```

---

## Deployment

### Backend → Railway (free tier)

1. Push to GitHub
2. Connect repo to [Railway](https://railway.app)
3. Set root directory to `backend`
4. Add environment variables in Railway dashboard
5. Railway auto-deploys on every push

### Frontend → Netlify (free tier)

1. Build: `cd frontend && npm run build`
2. Drag `frontend/dist` to [Netlify Drop](https://app.netlify.com)
3. Done — live in 30 seconds

**Total hosting cost: $0**

---

## API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/process` | Full pipeline: transcribe + extract + log |
| `POST` | `/transcribe` | Transcribe audio only |
| `POST` | `/extract` | Extract from transcript text |

### Protected Endpoints (requires Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/sessions?clinic_id=X` | Get sessions for a clinic |
| `POST` | `/fill` | Trigger form fill |

### Example: Process audio

```bash
curl -X POST https://your-backend.railway.app/process \
  -F "file=@recording.webm" \
  -F "language=en" \
  -F "clinic_id=your_clinic_id"
```

**Response:**

```json
{
  "success": true,
  "transcript": "My name is John Smith...",
  "extracted": {
    "full_name": "John Smith",
    "date_of_birth": "1990-03-05",
    "address": "42 Oak Street",
    "phone_number": "555-1234",
    "insurance_number": "448821",
    "symptoms": ["headache", "fever"],
    "emergency_contact": null
  },
  "session_id": "uuid-here"
}
```

---

## Security

- All staff routes protected with Supabase JWT authentication
- Patient audio is processed in memory and never persisted
- GDPR consent screen required before any recording
- CORS restricted to known frontend origins
- Environment variables never committed to version control

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS |
| **Backend** | Python 3.11, FastAPI |
| **Speech-to-Text** | Groq API — Whisper Large v3 |
| **AI Extraction** | Groq API — Llama 3.3 70B |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (JWT) |
| **Frontend Hosting** | Netlify (free) |
| **Backend Hosting** | Railway (free tier) |

---

## Roadmap

- [ ] EHR integration (Jane App, Cliniko)
- [ ] SMS/email confirmation to patient after submission
- [ ] Analytics dashboard (avg intake time, field accuracy)
- [ ] White-label option for clinic branding
- [ ] Offline mode with local Whisper fallback
- [ ] Mobile app (React Native)

---

## License

MIT License — free to use, modify, and distribute.

---

## Author

**Ahmed Al-Majid**
- [voiceintake-app.netlify.app](https://voiceintake-app.netlify.app)

---
