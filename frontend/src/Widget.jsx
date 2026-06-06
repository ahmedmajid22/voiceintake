import { useState, useRef } from "react"

const FIELDS = [
  { key: "full_name",         label: "Full Name" },
  { key: "date_of_birth",     label: "Date of Birth" },
  { key: "address",           label: "Address" },
  { key: "phone_number",      label: "Phone Number" },
  { key: "insurance_number",  label: "Insurance Number" },
  { key: "emergency_contact", label: "Emergency Contact" },
]

export default function Widget({ apiUrl = import.meta.env.VITE_API_URL, clinicId = "default" }) {
  const [status, setStatus]       = useState("consent")
  const [transcript, setTranscript] = useState("")
  const [edited, setEdited]       = useState(null)
  const [error, setError]         = useState("")
  const [consented, setConsented] = useState(false)
  const [language, setLanguage]   = useState("en")

  const mediaRecorderRef = useRef(null)
  const chunksRef        = useRef([])

  const startRecording = async () => {
    setError("")
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        await sendAudio(new Blob(chunksRef.current, { type: "audio/webm" }))
      }
      mediaRecorderRef.current = recorder
      recorder.start()
      setStatus("recording")
    } catch {
      setError("Microphone access denied. Please allow microphone access and try again.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setStatus("processing")
    }
  }

  const sendAudio = async (blob) => {
    try {
      const formData = new FormData()
      formData.append("file", blob, "recording.webm")
      formData.append("clinic_id", clinicId)
      formData.append("language", language)
      const res  = await fetch(`${apiUrl}/process`, { method: "POST", body: formData })
      const data = await res.json()
      setTranscript(data.transcript)
      setEdited(data.extracted)
      setStatus("confirm")
    } catch {
      setError("Error processing audio. Make sure the backend is running.")
      setStatus("idle")
    }
  }

  const reset = () => {
    setStatus("consent")
    setTranscript("")
    setEdited(null)
    setError("")
    setConsented(false)
    setLanguage("en")
  }

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", maxWidth: "480px", margin: "0 auto" }}>

      {status === "consent" && (
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔒</div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px", color: "#1e293b" }}>Before We Begin</h2>
          <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px", lineHeight: "1.6" }}>
            Your voice will be processed by AI. No audio is stored — only your intake details are saved securely.
          </p>
          <div style={{ background: "#eff6ff", borderRadius: "10px", padding: "14px", textAlign: "left", marginBottom: "20px" }}>
            {["Your audio is never stored", "Only intake details are saved", "Data is encrypted and secure", "You can request deletion anytime"].map(item => (
              <div key={item} style={{ fontSize: "13px", color: "#1d4ed8", marginBottom: "6px" }}>✓ {item}</div>
            ))}
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginBottom: "20px", cursor: "pointer" }}>
            <input type="checkbox" checked={consented} onChange={(e) => setConsented(e.target.checked)} />
            <span style={{ fontSize: "13px", color: "#475569" }}>I agree to my information being processed by AI</span>
          </label>
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Select Language</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                { code: "en", label: "🇬🇧 English" },
                { code: "de", label: "🇩🇪 Deutsch" },
                { code: "fr", label: "🇫🇷 Français" },
                { code: "ar", label: "🇸🇦 العربية" },
              ].map(({ code, label }) => (
                <button key={code} onClick={() => setLanguage(code)} style={{
                  padding: "8px", borderRadius: "8px", border: language === code ? "2px solid #3b82f6" : "2px solid #e2e8f0",
                  background: language === code ? "#eff6ff" : "white", color: language === code ? "#1d4ed8" : "#475569",
                  fontSize: "13px", fontWeight: "600", cursor: "pointer"
                }}>{label}</button>
              ))}
            </div>
          </div>
          <button onClick={() => setStatus("idle")} disabled={!consented} style={{
            width: "100%", padding: "12px", borderRadius: "10px", border: "none",
            background: consented ? "#1d4ed8" : "#cbd5e1", color: "white",
            fontWeight: "700", fontSize: "14px", cursor: consented ? "pointer" : "not-allowed"
          }}>Continue to Check-In →</button>
        </div>
      )}

      {status === "idle" && (
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "24px" }}>Patient Check-In</p>
          <button onClick={startRecording} style={{
            width: "140px", height: "140px", borderRadius: "50%", background: "#1d4ed8",
            border: "none", color: "white", cursor: "pointer", display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 24px"
          }}>
            <span style={{ fontSize: "40px" }}>🎙️</span>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.05em" }}>TAP TO START</span>
          </button>
          <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" }}>Speak your name, date of birth, address, insurance number, and symptoms.</p>
        </div>
      )}

      {status === "recording" && (
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <button onClick={stopRecording} style={{
            width: "140px", height: "140px", borderRadius: "50%", background: "#dc2626",
            border: "none", color: "white", cursor: "pointer", display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 24px"
          }}>
            <span style={{ fontSize: "40px" }}>⏹️</span>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.05em" }}>TAP TO STOP</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#dc2626" }}></div>
            <span style={{ color: "#dc2626", fontWeight: "700", fontSize: "13px", letterSpacing: "0.1em" }}>RECORDING</span>
          </div>
        </div>
      )}

      {status === "processing" && (
        <div style={{ background: "white", borderRadius: "16px", padding: "48px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>Processing your voice...</div>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>Transcribing and extracting your information with AI.</div>
        </div>
      )}

      {status === "confirm" && edited && (
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>✅ Review & Edit Your Information</h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>Correct anything before submitting.</p>
          {transcript && (
            <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px", marginBottom: "16px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>What we heard</p>
              <p style={{ fontSize: "13px", color: "#475569", fontStyle: "italic" }}>"{transcript}"</p>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            {FIELDS.map(({ key, label }) => (
              <div key={key}>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>{label}</label>
                <input type="text" value={edited[key] || ""} onChange={(e) => setEdited({ ...edited, [key]: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", boxSizing: "border-box", background: "#eff6ff" }}
                  placeholder={label} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Symptoms</label>
            <input type="text" value={edited.symptoms?.join(", ") || ""}
              onChange={(e) => setEdited({ ...edited, symptoms: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
              style={{ width: "100%", padding: "8px 10px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", boxSizing: "border-box", background: "#eff6ff" }}
              placeholder="e.g. headache, fever" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button onClick={reset} style={{ padding: "12px", borderRadius: "10px", border: "2px solid #e2e8f0", background: "white", color: "#475569", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>🔄 Re-record</button>
            <button onClick={() => setStatus("done")} style={{ padding: "12px", borderRadius: "10px", border: "none", background: "#1d4ed8", color: "white", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>✅ Submit</button>
          </div>
        </div>
      )}

      {status === "done" && (
        <div style={{ background: "white", borderRadius: "16px", padding: "48px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>Form Submitted!</h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>Your information has been received. Please let the front desk know you have checked in.</p>
          <button onClick={reset} style={{ padding: "12px 24px", borderRadius: "10px", border: "none", background: "#1d4ed8", color: "white", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>➕ New Patient</button>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px" }}>
          <p style={{ fontSize: "13px", color: "#dc2626" }}>⚠️ {error}</p>
        </div>
      )}
    </div>
  )
}