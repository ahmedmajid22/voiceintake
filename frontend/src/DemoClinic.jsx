import Widget from "./Widget"

const CLINIC_NAME = "MedLife Clinic"
const CLINIC_TAGLINE = "Advanced Healthcare in the Heart of Tripoli"
const CLINIC_PHONE = "+218 94 7775488"
const CLINIC_EMAIL = "info@medlife-clinic.ly"
const CLINIC_ADDRESS = "Omar Al-Mukhtar Street, Tripoli, Libya"
const CLINIC_HOURS = "Sun – Thu: 8:00 AM – 6:00 PM"

export default function DemoClinic() {
  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

      {/* Top bar */}
      <div style={{ background: "#0f4c81", color: "#bfdbfe", fontSize: "13px", padding: "8px 40px", display: "flex", justifyContent: "space-between" }}>
        <span>📞 {CLINIC_PHONE}</span>
        <span>✉️ {CLINIC_EMAIL}</span>
        <span>🕐 {CLINIC_HOURS}</span>
      </div>

      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "0 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "44px", height: "44px", background: "#0f4c81", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🏥</div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "18px", color: "#0f172a" }}>{CLINIC_NAME}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Tripoli, Libya</div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: "32px", fontSize: "14px", color: "#475569" }}>
            {["Home", "Services", "Doctors", "About"].map(item => (
              <span key={item} style={{ cursor: "pointer", transition: "color 0.2s" }}
                onMouseOver={e => e.target.style.color = "#0f4c81"}
                onMouseOut={e => e.target.style.color = "#475569"}>
                {item}
              </span>
            ))}
            <span style={{ background: "#0f4c81", color: "white", padding: "6px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Patient Portal</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0f4c81 0%, #1e6fb5 100%)", color: "white", padding: "80px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", marginBottom: "20px", letterSpacing: "0.05em" }}>
          AI-POWERED PATIENT INTAKE
        </div>
        <h1 style={{ fontSize: "42px", fontWeight: "800", marginBottom: "16px", lineHeight: "1.2" }}>
          Check In Without<br />the Paperwork
        </h1>
        <p style={{ fontSize: "17px", opacity: 0.85, maxWidth: "520px", margin: "0 auto 32px", lineHeight: "1.7" }}>
          Speak naturally for 30 seconds. Our AI understands and fills your intake form automatically — in English, Arabic, German, or French.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          {["🇱🇾 Arabic", "🇬🇧 English", "🇩🇪 Deutsch", "🇫🇷 Français"].map(lang => (
            <span key={lang} style={{ background: "rgba(255,255,255,0.15)", borderRadius: "20px", padding: "6px 14px", fontSize: "13px" }}>{lang}</span>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: "#0f4c81", color: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center", padding: "24px 40px", gap: "20px" }}>
          {[
            { num: "30s", label: "Average intake time" },
            { num: "99%", label: "Accuracy rate" },
            { num: "4", label: "Languages supported" },
            { num: "0", label: "Forms to fill manually" },
          ].map(({ num, label }) => (
            <div key={label}>
              <div style={{ fontSize: "28px", fontWeight: "800" }}>{num}</div>
              <div style={{ fontSize: "13px", opacity: 0.75, marginTop: "4px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 20px", display: "grid", gridTemplateColumns: "1fr 440px", gap: "60px", alignItems: "start" }}>

        {/* Left */}
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>How It Works</h2>
          <p style={{ color: "#64748b", marginBottom: "36px", lineHeight: "1.6" }}>Three simple steps — no typing, no forms, no waiting.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "28px", marginBottom: "48px" }}>
            {[
              { num: "01", icon: "🎙️", title: "Speak naturally", desc: "Say your name, date of birth, insurance number, and symptoms in any of our supported languages. No scripted phrases needed." },
              { num: "02", icon: "🤖", title: "AI extracts your info", desc: "Powered by Whisper AI, our system transcribes and understands your speech instantly — accurately identifying every detail." },
              { num: "03", icon: "✅", title: "Review and submit", desc: "Your intake form is pre-filled. Check each field, make any corrections, and submit with one tap. Done." },
            ].map(({ num, icon, title, desc }) => (
              <div key={num} style={{ display: "flex", gap: "20px" }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: "52px", height: "52px", background: "#eff6ff", borderRadius: "14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#0f4c81", letterSpacing: "0.05em" }}>{num}</span>
                    <span style={{ fontSize: "20px" }}>{icon}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: "700", color: "#0f172a", marginBottom: "6px", fontSize: "16px" }}>{title}</div>
                  <div style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Clinic info card */}
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
            <div style={{ fontWeight: "700", color: "#0f172a", marginBottom: "16px", fontSize: "15px" }}>📍 Find Us</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: "📍", text: CLINIC_ADDRESS },
                { icon: "📞", text: CLINIC_PHONE },
                { icon: "✉️", text: CLINIC_EMAIL },
                { icon: "🕐", text: CLINIC_HOURS },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "14px", color: "#475569" }}>
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { icon: "🔒", title: "GDPR Compliant", desc: "Your data is encrypted and never sold" },
              { icon: "🎙️", title: "Audio not stored", desc: "Only extracted info is saved" },
              { icon: "🌍", title: "Multilingual", desc: "Arabic, English, German, French" },
              { icon: "⚡", title: "Instant processing", desc: "Results in under 5 seconds" },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "20px", marginBottom: "6px" }}>{icon}</div>
                <div style={{ fontWeight: "600", color: "#0f172a", fontSize: "13px", marginBottom: "2px" }}>{title}</div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — widget */}
        <div style={{ position: "sticky", top: "24px" }}>
          <div style={{ background: "#0f4c81", color: "white", borderRadius: "16px 16px 0 0", padding: "16px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "8px", height: "8px", background: "#4ade80", borderRadius: "50%" }}></div>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Patient Check-In — Live</span>
            <span style={{ marginLeft: "auto", fontSize: "12px", opacity: 0.7 }}>Powered by VoiceIntake AI</span>
          </div>
          <div style={{ background: "white", borderRadius: "0 0 16px 16px", border: "1px solid #e2e8f0", borderTop: "none", padding: "24px" }}>
            <Widget
              apiUrl={import.meta.env.VITE_API_URL}
              clinicId="citymed_demo"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#0f172a", color: "#64748b", padding: "40px", marginTop: "40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "40px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={{ fontSize: "20px" }}>🏥</span>
              <span style={{ fontWeight: "700", color: "white", fontSize: "16px" }}>{CLINIC_NAME}</span>
            </div>
            <p style={{ fontSize: "14px", lineHeight: "1.7", maxWidth: "300px" }}>Modern, AI-powered healthcare in Tripoli. Patient intake reimagined for the digital age.</p>
          </div>
          <div>
            <div style={{ color: "white", fontWeight: "600", marginBottom: "12px", fontSize: "14px" }}>Quick Links</div>
            {["Home", "Services", "Doctors", "Patient Portal", "Contact"].map(link => (
              <div key={link} style={{ fontSize: "14px", marginBottom: "8px", cursor: "pointer" }}
                onMouseOver={e => e.target.style.color = "white"}
                onMouseOut={e => e.target.style.color = "#64748b"}>
                {link}
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: "white", fontWeight: "600", marginBottom: "12px", fontSize: "14px" }}>Contact</div>
            <div style={{ fontSize: "14px", lineHeight: "2" }}>
              <div>{CLINIC_PHONE}</div>
              <div>{CLINIC_EMAIL}</div>
              <div style={{ marginTop: "8px" }}>{CLINIC_ADDRESS}</div>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "1100px", margin: "32px auto 0", borderTop: "1px solid #1e293b", paddingTop: "24px", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
          <span>© 2026 {CLINIC_NAME}. All rights reserved.</span>
          <span>Patient intake powered by <span style={{ color: "white", fontWeight: "600" }}>VoiceIntake AI</span></span>
        </div>
      </div>
    </div>
  )
}