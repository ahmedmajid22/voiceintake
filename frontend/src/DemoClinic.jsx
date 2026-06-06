import Widget from "./Widget"

export default function DemoClinic() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "-apple-system, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", color: "white", padding: "20px 40px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700" }}>🏥 CityMed Clinic</h1>
        <p style={{ fontSize: "13px", opacity: 0.8, marginTop: "4px" }}>Patient Portal — Powered by VoiceIntake</p>
      </div>
      <div style={{ maxWidth: "560px", margin: "40px auto", padding: "0 20px" }}>
        <div style={{ background: "#dbeafe", borderRadius: "10px", padding: "12px 16px", marginBottom: "24px", fontSize: "13px", color: "#1e40af" }}>
          💡 <strong>Demo:</strong> This is what VoiceIntake looks like embedded in a clinic's website.
        </div>
        <Widget
          apiUrl="http://127.0.0.1:8000"
          clinicId="citymed_demo"
        />
      </div>
    </div>
  )
}