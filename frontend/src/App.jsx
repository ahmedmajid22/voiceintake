import { useState, useRef } from "react"

const API_URL = "http://127.0.0.1:8000"

const FIELDS = [
  { key: "full_name", label: "Full Name" },
  { key: "date_of_birth", label: "Date of Birth" },
  { key: "address", label: "Address" },
  { key: "phone_number", label: "Phone Number" },
  { key: "insurance_number", label: "Insurance Number" },
  { key: "emergency_contact", label: "Emergency Contact" },
]

export default function App() {
  const [status, setStatus] = useState("idle")
  const [transcript, setTranscript] = useState("")
  const [extracted, setExtracted] = useState(null)
  const [error, setError] = useState("")
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const startRecording = async () => {
    setError("")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
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
    if (mediaRecorderRef.current) { mediaRecorderRef.current.stop(); setStatus("processing") }
  }

  const sendAudio = async (blob) => {
    try {
      const formData = new FormData()
      formData.append("file", blob, "recording.webm")
      const res = await fetch(`${API_URL}/process`, { method: "POST", body: formData })
      const data = await res.json()
      setTranscript(data.transcript)
      setExtracted(data.extracted)
      setStatus("confirm")
    } catch {
      setError("Error processing audio. Make sure the backend is running and try again.")
      setStatus("idle")
    }
  }

  const confirmAndFill = async () => {
    setStatus("filling")
    try {
      await fetch(`${API_URL}/fill`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(extracted) })
      setStatus("done")
    } catch {
      setError("Error filling form. Please try again.")
      setStatus("confirm")
    }
  }

  const reset = () => { setStatus("idle"); setTranscript(""); setExtracted(null); setError("") }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-8 py-5 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">🏥 VoiceIntake</h1>
          <p className="text-blue-200 text-sm mt-1">AI-powered patient intake — speak naturally, we handle the rest</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {status === "idle" && (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-md p-10 mb-6">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Patient Check-In</p>
              <button onClick={startRecording} className="w-40 h-40 rounded-full bg-blue-700 hover:bg-blue-800 text-white shadow-2xl flex items-center justify-center mx-auto transition-all duration-200 hover:scale-105 active:scale-95">
                <div className="text-center"><div className="text-5xl mb-2">🎙️</div><div className="text-xs font-bold tracking-widest">TAP TO START</div></div>
              </button>
              <p className="text-gray-400 text-sm mt-8 max-w-sm mx-auto leading-relaxed">Tap and speak your information naturally. Our AI will understand and fill your intake form automatically.</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-left">
              <p className="text-blue-700 text-sm font-bold mb-2">💡 Just speak naturally, for example:</p>
              <p className="text-blue-500 text-sm italic leading-relaxed">"My name is John Smith, I was born March 5th 1990, I live at 42 Oak Street, my insurance number is 448821, and I have a headache and fever."</p>
            </div>
          </div>
        )}

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
            </div>
          </div>
        )}

        {status === "processing" && (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-md p-12">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-700 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Processing your voice...</h2>
              <p className="text-gray-400 text-sm">Transcribing and extracting your information with AI.</p>
            </div>
          </div>
        )}

        {status === "confirm" && extracted && (
          <div>
            <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
              <h2 className="text-lg font-bold text-gray-800 mb-1">✅ Review Your Information</h2>
              <p className="text-gray-400 text-sm mb-5">Confirm everything looks correct before we fill your form.</p>
              {transcript && (
                <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">What we heard</p>
                  <p className="text-slate-600 text-sm italic leading-relaxed">"{transcript}"</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {FIELDS.map(({ key, label }) => extracted[key] ? (
                  <div key={key} className="bg-green-50 border border-green-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-gray-800 text-sm font-semibold">{extracted[key]}</p>
                  </div>
                ) : null)}
                {extracted.symptoms?.length > 0 && (
                  <div className="col-span-2 bg-green-50 border border-green-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">Symptoms</p>
                    <p className="text-gray-800 text-sm font-semibold">{extracted.symptoms.join(", ")}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={reset} className="py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all">🔄 Re-record</button>
              <button onClick={confirmAndFill} className="py-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-lg transition-all">✅ Confirm & Fill Form</button>
            </div>
          </div>
        )}

        {status === "filling" && (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-md p-12">
              <div className="text-6xl mb-5">🖥️</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Opening clinic form...</h2>
              <p className="text-gray-400 text-sm">Watch the browser window — every field is being filled automatically.</p>
            </div>
          </div>
        )}

        {status === "done" && (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-md p-12">
              <div className="text-6xl mb-5">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Filled!</h2>
              <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed">Check the browser window. Review the completed form and click Submit when ready.</p>
              <button onClick={reset} className="px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-lg transition-all">➕ Start New Patient</button>
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
