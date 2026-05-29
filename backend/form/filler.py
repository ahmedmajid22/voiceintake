import threading
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

FORM_PATH = Path(__file__).parent.parent.parent / "frontend" / "demo_form.html"

def _run_browser(extracted: dict):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=60)
        context = browser.new_context(viewport={"width": 1100, "height": 800})
        page = context.new_page()

        page.goto(f"file://{FORM_PATH}")
        page.wait_for_load_state("domcontentloaded")
        time.sleep(1)

        page.evaluate("""
            var bar = document.getElementById('status-bar');
            bar.innerHTML = '🤖 VoiceIntake AI is filling your form...';
            bar.style.borderColor = '#1565c0';
            bar.style.color = '#1565c0';
        """)
        time.sleep(0.5)

        text_fields = [
            ("full_name",         extracted.get("full_name")),
            ("date_of_birth",     extracted.get("date_of_birth")),
            ("address",           extracted.get("address")),
            ("phone_number",      extracted.get("phone_number")),
            ("insurance_number",  extracted.get("insurance_number")),
            ("emergency_contact", extracted.get("emergency_contact")),
        ]

        for field_id, value in text_fields:
            if value:
                page.evaluate(f"""
                    var el = document.getElementById('{field_id}');
                    el.style.backgroundColor = '#fff9c4';
                    el.style.borderColor = '#f9a825';
                    el.scrollIntoView({{behavior: 'smooth', block: 'center'}});
                """)
                time.sleep(0.4)
                page.fill(f"#{field_id}", str(value))
                page.evaluate(f"""
                    var el = document.getElementById('{field_id}');
                    el.style.backgroundColor = '#e8f5e9';
                    el.style.borderColor = '#4caf50';
                """)
                time.sleep(0.5)

        symptoms = extracted.get("symptoms", [])
        if symptoms:
            page.evaluate("""
                var el = document.getElementById('symptoms');
                el.style.backgroundColor = '#fff9c4';
                el.style.borderColor = '#f9a825';
                el.scrollIntoView({behavior: 'smooth', block: 'center'});
            """)
            time.sleep(0.4)
            page.fill("#symptoms", ", ".join(symptoms))
            page.evaluate("""
                var el = document.getElementById('symptoms');
                el.style.backgroundColor = '#e8f5e9';
                el.style.borderColor = '#4caf50';
            """)
            time.sleep(0.5)

        page.evaluate("""
            var bar = document.getElementById('status-bar');
            bar.innerHTML = '✅ AI filled your form. Please review and click Submit.';
            bar.style.background = '#e8f5e9';
            bar.style.borderColor = '#4caf50';
            bar.style.color = '#2e7d32';
        """)
        page.evaluate("window.scrollTo({top: 0, behavior: 'smooth'})")

        time.sleep(600)
        browser.close()

def fill_form(extracted: dict):
    thread = threading.Thread(target=_run_browser, args=(extracted,), daemon=True)
    thread.start()
