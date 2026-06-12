import { useState, useEffect } from "react"
import { supabase } from "./supabase"

const API_URL = import.meta.env.VITE_API_URL

const CLINICS = [
  { id: "default",      name: "Default Clinic" },
  { id: "citymed_demo", name: "CityMed Clinic" },
]
function Login({ onLogin }) {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  const handleLogin = async () => {
    if (!supabase) {
      setError("Authentication is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.")
      return
    }
    setError("")
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    onLogin(data.session)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">🏥 VoiceIntake</h1>
          <p className="text-gray-400 text-sm mt-1">Staff Dashboard — Sign In</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm">⚠️ {error}</p>
            </div>
          )}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [session, setSession]     = useState(null)
  const [sessions, setSessions]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState(null)
  const [error, setError]         = useState("")
  const [clinicId, setClinicId]   = useState("default")

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (session) fetchSessions(clinicId)
  }, [session, clinicId])

  const fetchSessions = async (cId = clinicId) => {
    try {
      setLoading(true)
      const res  = await fetch(`${API_URL}/sessions?clinic_id=${cId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      })
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch {
      setError("Could not load sessions. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut()
    setSession(null)
    setSessions([])
  }

  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const formatDate = (ts) => new Date(ts).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })

  if (loading && !session) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-700 rounded-full animate-spin"></div>
    </div>
  )

  if (!session) return <Login onLogin={setSession} />

  const today = sessions.filter(s => new Date(s.created_at).toDateString() === new Date().toDateString())

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-8 py-5 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">🏥 VoiceIntake</h1>
            <p className="text-blue-200 text-sm mt-1">Staff Dashboard — Session Log</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-blue-200 text-xs uppercase tracking-widest">Today</p>
              <p className="text-2xl font-bold">{today.length}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-xs uppercase tracking-widest">Total</p>
              <p className="text-2xl font-bold">{sessions.length}</p>
            </div>
            <select
              value={clinicId}
              onChange={(e) => { setClinicId(e.target.value); setSelected(null) }}
              className="px-3 py-2 bg-blue-800 border border-blue-600 text-white rounded-lg text-sm font-bold focus:outline-none"
            >
              {CLINICS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button onClick={fetchSessions} className="ml-4 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-sm font-bold transition-all">
              🔄 Refresh
            </button>
            <a href="/" className="px-4 py-2 bg-white text-blue-900 rounded-lg text-sm font-bold hover:bg-blue-50 transition-all">
              🎙️ Patient View
            </a>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-all">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
          </div>
        )}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-700 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500 font-semibold">No sessions yet</p>
            <p className="text-gray-400 text-sm mt-1">Sessions will appear here after patients complete intake</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">All Sessions</h2>
              <div className="space-y-2">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selected?.id === s.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-transparent bg-white hover:border-blue-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-gray-800 text-sm truncate">{s.full_name || "Unknown Patient"}</p>
                      <span className="text-xs text-gray-400 ml-2 shrink-0">{formatTime(s.created_at)}</span>
                    </div>
                    <p className="text-xs text-gray-400">{formatDate(s.created_at)}</p>
                    {s.symptoms?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {s.symptoms.slice(0, 2).map((sym, i) => (
                          <span key={i} className="text-xs bg-red-50 text-red-500 border border-red-100 rounded-full px-2 py-0.5">{sym}</span>
                        ))}
                        {s.symptoms.length > 2 && <span className="text-xs text-gray-400">+{s.symptoms.length - 2}</span>}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              {selected ? (
                <div>
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Session Detail</h2>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{selected.full_name || "Unknown Patient"}</h3>
                        <p className="text-gray-400 text-sm mt-0.5">{formatDate(selected.created_at)} at {formatTime(selected.created_at)}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-xs font-bold uppercase">
                        {selected.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        ["Date of Birth",     selected.date_of_birth],
                        ["Address",           selected.address],
                        ["Phone",             selected.phone_number],
                        ["Insurance #",       selected.insurance_number],
                        ["Emergency Contact", selected.emergency_contact],
                      ].filter(([, v]) => v).map(([label, value]) => (
                        <div key={label} className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                          <p className="text-gray-800 text-sm font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                    {selected.symptoms?.length > 0 && (
                      <div className="bg-red-50 rounded-xl p-4 mb-5">
                        <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Symptoms</p>
                        <div className="flex flex-wrap gap-2">
                          {selected.symptoms.map((sym, i) => (
                            <span key={i} className="bg-white text-red-600 border border-red-100 rounded-full px-3 py-1 text-sm font-semibold">{sym}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selected.transcript && (
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Voice Transcript</p>
                        <p className="text-slate-600 text-sm italic leading-relaxed">"{selected.transcript}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <div className="text-4xl mb-3">👈</div>
                    <p className="text-gray-400 text-sm">Select a session to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
