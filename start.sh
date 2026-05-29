#!/bin/bash

echo ""
echo "🏥 Starting VoiceIntake..."
echo ""

# Start backend
cd "$(dirname "$0")/backend"
source ../venv/bin/activate
uvicorn main:app --reload &
BACKEND_PID=$!
echo "✅ Backend running (PID $BACKEND_PID)"

# Wait for backend to be ready
sleep 3

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend running (PID $FRONTEND_PID)"

sleep 2
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎙️  VoiceIntake is ready!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:8000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop everything"
echo ""

# Open browser automatically
sleep 1
open http://localhost:5173

# Keep script alive, kill both on Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'VoiceIntake stopped.'; exit" INT
wait
