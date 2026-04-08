#!/bin/bash

# Quick setup script for AI Agent project
# Usage: bash setup.sh

echo "🚀 Setting up AI Agent Backend + Frontend..."

# Backend setup
echo ""
echo "📦 Setting up Backend..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Create .env if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠️  Created .env file. Please add your API keys:"
  echo "   - OPENAI_API_KEY"
  echo "   - TAVILY_API_KEY"
fi

cd ..

# Frontend setup
echo ""
echo "📦 Setting up Frontend..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"

cd ..

echo ""
echo "✨ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit backend/.env with your API keys"
echo "2. Start backend: cd backend && npm start"
echo "3. Start frontend: cd frontend && npm start"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend: http://localhost:5000"
