import Widget from "./Widget"

export default function DemoClinic() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Clinic Header */}
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #1e3a5f, #2563eb)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "20px" }}>🏥</div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "18px", color: "#1e293b" }}>CityMed Clinic</div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>Modern Healthcare for Everyone</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "24px", fontSize: "14px", color: "#475569" }}>
          <span style={{ cursor: "pointer" }}>Home</span>
          <span style={{ cursor: "pointer" }}>Services</span>
          <span style={{ cursor: "pointer" }}>Doctors</span>
          <span style={{ cursor: "pointer", color: "#2563eb", fontWeight: "600" }}>Patient Portal</span>
          <span style={{ cursor: "pointer" }}>Contact</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", color: "white", padding: "60px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "12px" }}>Patient Check-In Portal</h1>
        <p style={{ fontSize: "16px", opacity: 0.85, maxWidth: "500px", margin: "0 auto", lineHeight: "1.6" }}>
          Skip the paperwork. Speak naturally and our AI fills your intake form in seconds.
        </p>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 20px", display: "grid", gridTemplateColumns: "1fr 420px", gap: "48px", alignItems: "start" }}>

        {/* Left — clinic info */}
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", marginBottom: "20px" }}>How It Works</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
            {[
              { icon: "🎙️", title: "Speak Naturally", desc: "Tell us your name, date of birth, insurance number and symptoms in your own words." },
              { icon: "🤖", title: "AI Understands", desc: "Our AI instantly transcribes and extracts your information with high accuracy." },
              { icon: "✅", title: "Review & Submit", desc: "Check the pre-filled form, make any corrections, and submit in one click." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "48px", height: "48px", background: "#eff6ff", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>{title}</div>
                  <div style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.5" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "20px" }}>
            <h3 style={{ fontWeight: "700", color: "#166534", marginBottom: "12px" }}>📍 Clinic Information</h3>
            <div style={{ fontSize: "14px", color: "#166534", lineHeight: "2" }}>
              <div>📞 +49 30 1234 5678</div>
              <div>📧 info@citymed-clinic.de</div>
              <div>📍 Friedrichstraße 123, 10117 Berlin</div>
              <div>🕐 Mon–Fri: 8:00 AM – 6:00 PM</div>
            </div>
          </div>
        </div>

        {/* Right — widget */}
        <div>
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px", fontSize: "13px", color: "#1e40af" }}>
            🤖 <strong>AI-Powered Intake</strong> — Powered by VoiceIntake
          </div>
          <Widget
            apiUrl={import.meta.env.VITE_API_URL}
            clinicId="citymed_demo"
          />
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#1e293b", color: "#94a3b8", padding: "24px 40px", textAlign: "center", fontSize: "13px" }}>
        © 2026 CityMed Clinic · Patient intake powered by <strong style={{ color: "white" }}>VoiceIntake AI</strong>
      </div>
    </div>
  )
}