import { useState, useRef } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import DemoClinic from "./DemoClinic"

const API_URL = import.meta.env.VITE_API_URL

const FIELDS = [
  { key: "full_name",         label: "Full Name",         type: "text" },
  { key: "date_of_birth",     label: "Date of Birth",     type: "text" },
  { key: "address",           label: "Address",           type: "text" },
  { key: "phone_number",      label: "Phone Number",      type: "text" },
  { key: "insurance_number",  label: "Insurance Number",  type: "text" },
  { key: "emergency_contact", label: "Emergency Contact", type: "text" },
]

function PatientView() {
  const [status, setStatus]         = useState("consent")
  const [transcript, setTranscript] = useState("")
  const [extracted, setExtracted]   = useState(null)
  const [edited, setEdited]         = useState(null)
  const [error, setError]           = useState("")
  const [consented, setConsented]   = useState(false)
  const [language, setLanguage]     = useState("en")
  const clinicId = new URLSearchParams(window.location.search).get("clinic") || "default"
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
      formData.append("language", language)
      formData.append("clinic_id", clinicId)
      const res  = await fetch(`${API_URL}/process`, { method: "POST", body: formData })
      const data = await res.json()
      setTranscript(data.transcript)
      setExtracted(data.extracted)
      setEdited(data.extracted)
      setStatus("confirm")
    } catch {
      setError("Error processing audio. Make sure the backend is running and try again.")
      setStatus("idle")
    }
  }

  const submitForm = async () => {
    setStatus("processing")
    try {
      await fetch(`${API_URL}/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, clinic_id: clinicId, extracted: edited }),
      })
    } catch {
      // non-critical, session already saved — just proceed
    }
    setStatus("done")
  }

  const reset = () => {
    setStatus("consent")
    setTranscript("")
    setExtracted(null)
    setEdited(null)
    setError("")
    setConsented(false)
    setLanguage("en")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-8 py-5 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">🏥 VoiceIntake</h1>
            <p className="text-blue-200 text-sm mt-1">AI-powered patient intake — speak naturally, we handle the rest</p>
          </div>
          <a href="/dashboard" className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-sm font-bold transition-all">
            Staff Dashboard →
          </a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* CONSENT */}
        {status === "consent" && (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-md p-10 mb-6">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Before We Begin</h2>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                Your voice will be processed by AI to extract your intake information.
                No audio is stored — only the extracted details are saved securely.
              </p>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left mb-6">
                <ul className="text-blue-700 text-sm space-y-2">
                  <li>✓ Your audio is never stored</li>
                  <li>✓ Only your intake details are saved</li>
                  <li>✓ Data is encrypted and secure</li>
                  <li>✓ You can request deletion at any time</li>
                </ul>
              </div>
              <label className="flex items-center gap-3 cursor-pointer justify-center mb-6">
                <input
                  type="checkbox"
                  checked={consented}
                  onChange={(e) => setConsented(e.target.checked)}
                  className="w-4 h-4 accent-blue-700"
                />
                <span className="text-gray-600 text-sm">I agree to my information being processed by AI</span>
              </label>
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Your Language</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { code: "en", label: "🇬🇧 English" },
                    { code: "de", label: "🇩🇪 Deutsch" },
                    { code: "fr", label: "🇫🇷 Français" },
                    { code: "ar", label: "🇸🇦 العربية" },
                  ].map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => setLanguage(code)}
                      className={`py-2 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                        language === code
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-600 hover:border-blue-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>


              <button
                onClick={() => setStatus("idle")}
                disabled={!consented}
                className="px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Check-In →
              </button>
            </div>
          </div>
        )}

        {/* IDLE */}
        {status === "idle" && (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-md p-10 mb-6">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Patient Check-In</p>
              <button onClick={startRecording} className="w-40 h-40 rounded-full bg-blue-700 hover:bg-blue-800 text-white shadow-2xl flex items-center justify-center mx-auto transition-all duration-200 hover:scale-105 active:scale-95">
                <div className="text-center">
                  <div className="text-5xl mb-2">🎙️</div>
                  <div className="text-xs font-bold tracking-widest">TAP TO START</div>
                </div>
              </button>
              <p className="text-gray-400 text-sm mt-8 max-w-sm mx-auto leading-relaxed">Tap and speak your information naturally. Our AI will understand and fill your intake form automatically.</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-left">
              <p className="text-blue-700 text-sm font-bold mb-2">💡 Just speak naturally, for example:</p>
              <p className="text-blue-500 text-sm italic leading-relaxed">"My name is John Smith, I was born March 5th 1990, I live at 42 Oak Street, my insurance number is 448821, and I have a headache and fever."</p>
            </div>
          </div>
        )}

        {/* RECORDING */}
        {status === "recording" && (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-md p-10">
              <div className="relative inline-flex items-center justify-center mb-8">
                <div className="absolute w-48 h-48 rounded-full bg-red-300 animate-ping opacity-20"></div>
                <div className="absolute w-44 h-44 rounded-full bg-red-400 animate-pulse opacity-20"></div>
                <button onClick={stopRecording} className="relative w-40 h-40 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl flex items-center justify-center transition-all duration-200">
                  <div className="text-center"><div className="text-5xl mb-2">⏹️</div><div className="text-xs font-bold tracking-widest">TAP TO STOP</div></div>
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-red-600 font-bold text-sm tracking-widest">RECORDING</span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">Speak clearly. Include your name, date of birth, address, insurance number, and symptoms.</p>
            </div>
          </div>
        )}

        {/* PROCESSING */}
        {status === "processing" && (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-md p-12">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-700 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Processing your voice...</h2>
              <p className="text-gray-400 text-sm">Transcribing with Whisper, then extracting your information with AI.</p>
            </div>
          </div>
        )}

        {/* CONFIRM + INLINE EDITABLE FORM */}
        {status === "confirm" && edited && (
          <div>
            <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
              <h2 className="text-lg font-bold text-gray-800 mb-1">✅ Review & Edit Your Information</h2>
              <p className="text-gray-400 text-sm mb-5">AI filled your form — review each field and correct anything before submitting.</p>

              {transcript && (
                <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">What we heard</p>
                  <p className="text-slate-600 text-sm italic leading-relaxed">"{transcript}"</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-3">
                {FIELDS.map(({ key, label }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
                    <input
                      type="text"
                      value={edited[key] || ""}
                      onChange={(e) => setEdited({ ...edited, [key]: e.target.value })}
                      className="px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-blue-50"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Symptoms</label>
                <input
                  type="text"
                  value={edited.symptoms?.join(", ") || ""}
                  onChange={(e) => setEdited({ ...edited, symptoms: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                  className="px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-blue-50"
                  placeholder="e.g. headache, fever, cough"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={reset} className="py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all">
                🔄 Re-record
              </button>
              <button onClick={submitForm} className="py-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-lg transition-all">
                ✅ Submit Form
              </button>
            </div>
          </div>
        )}

        {/* DONE */}
        {status === "done" && (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-md p-12">
              <div className="text-6xl mb-5">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Submitted!</h2>
              <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                Your information has been received. Please let the front desk know you have checked in.
              </p>
              <button onClick={reset} className="px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-lg transition-all">
                ➕ Start New Patient
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<PatientView />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/demo" element={<DemoClinic />} />
      </Routes>
    </BrowserRouter>
  )
}