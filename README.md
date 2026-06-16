<div align="center">

<img src="https://img.shields.io/badge/VoiceIntake-AI%20Patient%20Intake-0066FF?style=for-the-badge&logoColor=white" alt="VoiceIntake" height="40"/>

# VoiceIntake

### Patient speaks for 30 seconds. Form fills itself.

**The AI-powered intake system that eliminates clipboards, waiting, and manual data entry — forever.**

<br/>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Try%20it%20now-0066FF?style=for-the-badge)](https://voiceintake-blond.vercel.app/demo)
[![Staff Dashboard](https://img.shields.io/badge/📊%20Staff%20Login-Dashboard-6366F1?style=for-the-badge)](https://voiceintake-blond.vercel.app/dashboard)
[![Watch Demo](https://img.shields.io/badge/▶%20Watch%20Demo-YouTube-FF0000?style=for-the-badge&logo=youtube)](https://youtu.be/AbnuLlbKCQA)

<br/>

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Groq](https://img.shields.io/badge/Groq-Whisper%20+%20Llama%203.3-F55036?style=flat-square)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](LICENSE)
[![GDPR](https://img.shields.io/badge/GDPR-Compliant-0066FF?style=flat-square)](https://gdpr.eu)

<br/>

---

## ▶️ See it in action

[![VoiceIntake Demo Video](https://img.youtube.com/vi/AbnuLlbKCQA/maxresdefault.jpg)](https://youtu.be/AbnuLlbKCQA)

*Click to watch — full intake flow in under 4 minutes*

---

</div>

## 🧠 What is VoiceIntake?

Clinics lose **thousands of hours per year** to manual patient intake. Receptionists retype the same information from paper forms. Patients wait. Errors happen.

**VoiceIntake solves this in 30 seconds:**

```
Patient picks up a tablet  →  Speaks their details aloud  →  AI fills the form  →  Staff sees it instantly
```

No clipboards. No typing. No waiting. No errors.

---

## ⚡ The Numbers

| Before VoiceIntake | After VoiceIntake |
|---|---|
| 12 minutes per patient | **30 seconds** |
| Manual retyping by staff | **Zero — AI extracts everything** |
| Paper forms, illegible handwriting | **Structured digital record** |
| English only | **English, Arabic, German, French** |
| Errors on 1 in 5 forms | **Patient reviews before submitting** |

---

## 🔄 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   1. SPEAK        2. TRANSCRIBE      3. EXTRACT    4. REVIEW   │
│                                                                 │
│   Patient    →   Whisper Large   →   Llama 3.3  →   Patient   │
│   speaks         v3 via Groq        70B via         confirms   │
│   30 sec         (<2 sec)           Groq            fields     │
│                                     (<3 sec)                   │
│                                                                 │
│   5. SUBMIT       6. DASHBOARD                                  │
│                                                                 │
│   Record     →   Staff sees it                                  │
│   saved to       instantly in                                   │
│   Supabase       real time                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

```
voiceintake/
├── frontend/                  # React 19 + Vite + Tailwind
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Demo.jsx       # Patient-facing intake flow
│   │   │   └── Dashboard.jsx  # Staff session viewer
│   │   └── components/        # Shared UI components
│   └── vite.config.js
│
├── backend/                   # FastAPI (Python 3.11)
│   ├── main.py                # All API routes
│   ├── auth.py                # Supabase JWT middleware
│   └── requirements.txt
│
├── docs/                      # Documentation & marketing
│   └── marketing_homepage.html
│
├── .env.example               # Environment variable template
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS | Fast, modern, responsive |
| **Backend** | Python 3.11, FastAPI | Async, typed, auto-docs |
| **Speech-to-Text** | Groq — Whisper Large v3 | Fastest Whisper inference on the planet |
| **AI Extraction** | Groq — Llama 3.3 70B | Accurate structured extraction |
| **Database** | Supabase (PostgreSQL) | Realtime + Row Level Security |
| **Auth** | Supabase Auth (JWT) | Zero-config, secure |
| **Frontend Hosting** | Vercel | Free, instant deploys |
| **Backend Hosting** | Railway | Free tier, auto-deploy |
| **Total Cost** | **$0/month** | Built lean on purpose |

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- A [Groq](https://console.groq.com) API key (free)
- A [Supabase](https://supabase.com) project (free)

### 1. Clone & configure

```bash
git clone https://github.com/ahmedmajid22/voiceintake.git
cd voiceintake
cp .env.example .env
# Fill in your keys in .env
```

### 2. Start the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# → Running at http://localhost:8000
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
# → Running at http://localhost:5173
```

### 4. Open in browser

| URL | What |
|---|---|
| `http://localhost:5173/demo` | Patient intake flow |
| `http://localhost:5173/dashboard` | Staff dashboard |
| `http://localhost:8000/docs` | FastAPI auto-docs |

---

## 🔌 API Reference

**Base URL:** `https://your-backend.railway.app`

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/process` | Full pipeline: transcribe + extract + log |
| `POST` | `/transcribe` | Transcribe audio only |
| `POST` | `/extract` | Extract fields from transcript text |

### Protected Endpoints *(Bearer token required)*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/sessions?clinic_id=X` | Get all sessions for a clinic |
| `POST` | `/fill` | Trigger browser form fill |

### Example Request

```bash
curl -X POST https://your-backend.railway.app/process \
  -F "file=@recording.webm" \
  -F "language=en" \
  -F "clinic_id=your_clinic_id"
```

### Example Response

```json
{
  "success": true,
  "transcript": "My name is John Smith, I was born on the 5th of March 1990...",
  "extracted": {
    "full_name": "John Smith",
    "date_of_birth": "1990-03-05",
    "address": "42 Oak Street",
    "phone_number": "555-1234",
    "insurance_number": "448821",
    "symptoms": ["headache", "fever"],
    "emergency_contact": null
  },
  "session_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

---

## 🔒 Security

| Protection | Implementation |
|---|---|
| **Staff authentication** | Supabase JWT on all protected routes |
| **Audio privacy** | Processed in memory, never written to disk |
| **Patient consent** | GDPR consent screen before every recording |
| **CORS** | Restricted to known frontend origins only |
| **Secrets** | Environment variables, never in version control |
| **Data isolation** | Each clinic has its own ID and isolated records |

---

## 🌍 Language Support

| Language | Code | Status |
|---|---|---|
| English | `en` | ✅ Fully supported |
| Arabic | `ar` | ✅ Fully supported |
| German | `de` | ✅ Fully supported |
| French | `fr` | ✅ Fully supported |

---

## ☁️ Deployment

### Backend → Railway

```bash
# 1. Push to GitHub (already done)
# 2. Go to railway.app → New Project → Deploy from GitHub
# 3. Set root directory: backend
# 4. Add environment variables from .env
# 5. Railway auto-deploys on every push ✅
```

### Frontend → Vercel

```bash
# 1. Go to vercel.com/new → Import from GitHub
# 2. Set root directory: frontend
# 3. Add environment variables from .env
# 4. Vercel auto-deploys on every push ✅
```

> **Total hosting cost: $0/month**

---

## 🗺️ Roadmap

- [ ] EHR integration (Jane App, Cliniko)
- [ ] SMS/email confirmation to patient after submission
- [ ] Analytics dashboard (avg intake time, field accuracy per clinic)
- [ ] White-label option for clinic branding
- [ ] Offline mode with local Whisper fallback
- [ ] Mobile app (React Native)

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👤 Author

**Ahmed Majid**

[![Email](https://img.shields.io/badge/Email-voiceintake@inbox.lv-0066FF?style=flat-square&logo=gmail&logoColor=white)](mailto:voiceintake@inbox.lv)
[![Phone](https://img.shields.io/badge/Phone-+218%2094%207775488-25D366?style=flat-square&logo=whatsapp&logoColor=white)](tel:+218947775488)
[![Demo](https://img.shields.io/badge/Live%20Demo-voiceintake--blond.vercel.app-0066FF?style=flat-square)](https://voiceintake-blond.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-ahmedmajid22-181717?style=flat-square&logo=github)](https://github.com/ahmedmajid22)

---

<div>

## Links

| | URL |
|---|---|
| Marketing page | [voiceintake-blond.vercel.app/landing](https://voiceintake-blond.vercel.app/landing) |
| Live demo | [voiceintake-blond.vercel.app/demo](https://voiceintake-blond.vercel.app/demo) |
| Staff dashboard | [voiceintake-blond.vercel.app/dashboard](https://voiceintake-blond.vercel.app/dashboard) |
| Demo video | [youtu.be/AbnuLlbKCQA](https://youtu.be/AbnuLlbKCQA) |

</div>