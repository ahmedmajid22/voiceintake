import whisper
import tempfile
import os

# Load the small model — fast, accurate, free
model = whisper.load_model("small")

def transcribe_audio(audio_bytes: bytes, filename: str = "audio.webm") -> str:
    """
    Takes raw audio bytes and returns a transcript string.
    """
    # Save audio to a temp file so Whisper can read it
    with tempfile.NamedTemporaryFile(suffix=os.path.splitext(filename)[1], delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        result = model.transcribe(tmp_path)
        return result["text"].strip()
    finally:
        os.unlink(tmp_path)  # Clean up temp file
