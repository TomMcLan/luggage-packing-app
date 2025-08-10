#!/bin/bash

# Luggage Packing Assistant - Development Startup Script

echo "🧳 Starting Luggage Packing Assistant Development Environment"
echo "============================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
echo "✅ Node.js version: $NODE_VERSION"

# Function to check if dependencies are installed
check_deps() {
    if [ ! -d "$1/node_modules" ]; then
        echo "📦 Installing dependencies for $1..."
        cd "$1"
        npm install
        cd ..
    else
        echo "✅ Dependencies already installed for $1"
    fi
}

# Install dependencies
check_deps "frontend"
check_deps "backend"

# Check environment files
echo ""
echo "🔧 Checking environment configuration..."

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Copy .env.example to .env and configure:"
    echo "   cd backend && cp .env.example .env"
    echo ""
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  Frontend .env.local file not found. Copy .env.local.example to .env.local:"
    echo "   cd frontend && cp .env.local.example .env.local"
    echo ""
fi

# Start development servers
echo "🚀 Starting development servers..."
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
echo ""

# Use trap to handle Ctrl+C
trap 'echo ""; echo "🛑 Shutting down development servers..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT

# Start backend in background
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend in background
echo "Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for both processes
echo ""
echo "✅ Both servers started successfully!"
echo "🌐 Open http://localhost:3000 to use the application"
echo ""
echo "Press Ctrl+C to stop both servers"
wait