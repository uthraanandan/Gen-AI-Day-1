# Quick Start Guide

## 1-Minute Setup

### Step 1: Get API Keys
- **OpenAI**: https://platform.openai.com/api-keys (free $5 credit)
- **Tavily**: https://tavily.com (free search tier)

### Step 2: Configure Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your API keys
```

**Example .env:**
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxx
TAVILY_API_KEY=tvly-xxxxxxxxxxxxxxxx
PORT=5000
```

### Step 3: Install & Start

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
```
✅ Runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```
✅ Runs on http://localhost:3000

## You're Done! 🎉

Open http://localhost:3000 and start asking questions!

---

## Example Prompts to Try

### Searches the Web
- "What is the Bitcoin price right now?"
- "What are the latest tech news?"
- "What's the weather in San Francisco today?"

### Uses Knowledge Base
- "What is the capital of France?"
- "How does photosynthesis work?"
- "Explain quantum computing"

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 3000/5000 already in use | Kill process or use different port |
| API key errors | Double-check `.env` file has correct keys |
| Backend won't start | Run `npm install` first |
| Network errors | Ensure both backend and frontend are running |

---

## Architecture at a Glance

```
User Input
    ↓
React Frontend (http://localhost:3000)
    ↓
Express Server (http://localhost:5000)
    ├─ Calls GPT: "Does this need search?"
    ├─ If YES → Calls Tavily Search API
    └─ Calls GPT: "Generate answer with search results"
    ↓
Response with Sources
    ↓
Display in React UI
```

---

## Next Steps

- 📖 Read [README.md](../README.md) for detailed documentation
- 🛠️ Customize styling in [frontend/src/App.css](../frontend/src/App.css)
- 🔌 Change API providers or add new features
- 🚀 Deploy to production (Vercel + Heroku)
