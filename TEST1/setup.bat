@echo off
REM Quick setup script for AI Agent project (Windows)
REM Usage: setup.bat

echo 🚀 Setting up AI Agent Backend + Frontend...

REM Backend setup
echo.
echo 📦 Setting up Backend...
cd backend
call npm install
echo ✅ Backend dependencies installed

REM Create .env if it doesn't exist
if not exist .env (
  copy .env.example .env
  echo ⚠️  Created .env file. Please add your API keys:
  echo    - OPENAI_API_KEY
  echo    - TAVILY_API_KEY
)

cd ..

REM Frontend setup
echo.
echo 📦 Setting up Frontend...
cd frontend
call npm install
echo ✅ Frontend dependencies installed

cd ..

echo.
echo ✨ Setup complete!
echo.
echo 📝 Next steps:
echo 1. Edit backend\.env with your API keys
echo 2. Start backend: cd backend ^&^& npm start
echo 3. Start frontend: cd frontend ^&^& npm start
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔌 Backend: http://localhost:5000
pause
