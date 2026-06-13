---

## Deployment

### Backend → Railway (free tier)

1. Push to GitHub
2. Connect repo to [Railway](https://railway.app)
3. Set root directory to `backend`
4. Add environment variables in Railway dashboard
5. Railway auto-deploys on every push

### Frontend → Vercel (free tier)

1. Push to GitHub
2. Import repo at [Vercel](https://vercel.com/new)
3. Set root directory to `frontend`
4. Add environment variables in Vercel dashboard
5. Vercel auto-deploys on every push

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
| **Frontend Hosting** | Vercel (free) |
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
- [voiceintake-app.vercel.app](https://voiceintake-blond.vercel.app)

---