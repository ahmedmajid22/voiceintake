#!/bin/bash

echo ""
echo "🏥 Starting VoiceIntake..."
echo ""

# Kill anything on our ports first
lsof -ti:8000,5173,5174,5175 | xargs kill -9 2>/dev/null
sleep 1

# Start backend
cd "$(dirname "$0")/backend"
source ../venv/bin/activate
uvicorn main:app --reload &
BACKEND_PID=$!
echo "✅ Backend running (PID $BACKEND_PID)"

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

open http://localhost:5173

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'VoiceIntake stopped.'; exit" INT
wait