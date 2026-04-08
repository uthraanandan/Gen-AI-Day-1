# Project Summary & File Reference

## Final Directory Structure

```
TEST1/
├── backend/
│   ├── server.js                 # 🔧 Main Express backend
│   │                             # • /ask endpoint
│   │                             # • OpenAI integration
│   │                             # • Tavily search
│   │                             # • Agent reasoning loop
│   │
│   ├── package.json              # 📦 Dependencies
│   │                             # express, cors, dotenv, openai, axios
│   │
│   └── .env.example              # 🔐 Configuration template
│                                 # (Copy to .env and add keys)
│
├── frontend/
│   ├── public/
│   │   └── index.html            # 📄 HTML entry point
│   │                             # Single <div id="root">
│   │
│   ├── src/
│   │   ├── App.js                # ⚛️  Main React component
│   │   │                         # • Input, button, display
│   │   │                         # • Loading state
│   │   │                         # • API integration
│   │   │
│   │   ├── App.css               # 🎨 Styling
│   │   │                         # • Gradient background
│   │   │                         # • Responsive design
│   │   │                         # • Loading spinner
│   │   │
│   │   └── index.js              # 🚀 React DOM render
│   │
│   └── package.json              # 📦 Frontend dependencies
│                                 # react, react-dom, react-scripts
│
├── QUICK_START.md                # ⚡ Start here! (1-minute setup)
├── README.md                     # 📖 Full documentation
├── AGENT_ARCHITECTURE.md         # 🧠 Deep dive on reasoning
├── setup.sh                      # 🐧 Linux/Mac setup script
└── setup.bat                     # 🪟 Windows setup script
```

---

## Key Files Explained

### Backend: server.js (115 lines)
**What it does:**
- Creates Express server on port 5000
- Handles POST `/ask` requests
- Implements 3-step reasoning loop
- Integrates with OpenAI API
- Integrates with Tavily Search API

**Key functions:**
- `reasonAndAnswer(question)` - Main agent logic
- `performWebSearch(query)` - Calls Tavily API
- `app.post('/ask', ...)` - Request handler

**Errors handled:**
- Missing API keys
- Invalid questions
- Failed API calls
- Malformed requests

### Frontend: App.js (85 lines)
**What it does:**
- React component with input form
- Displays loading spinner
- Shows response + sources
- Error handling UI
- Mobile responsive

**Key states:**
- `question` - Input text
- `response` - API response
- `loading` - Loading state
- `error` - Error message

**Features:**
- Real-time input
- Submit on Enter
- Disable input while loading
- Clear sources display
- Clickable source links

### Frontend: App.css (250 lines)
**What it does:**
- Beautiful gradient background
- Responsive layout
- Loading spinner animation
- Error styling
- Source card styling

---

## Configuration Files

### .env.example
```
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=tvly-...
PORT=5000
```

Copy to `.env` and add your actual API keys.

### package.json (backend)
```json
{
  "dependencies": {
    "express": "^4.18.2",      // Web framework
    "cors": "^2.8.5",          // CORS support
    "dotenv": "^16.0.3",       // Environment variables
    "openai": "^3.2.1",        // OpenAI API client
    "axios": "^1.4.0"          // HTTP client (Tavily)
  }
}
```

### package.json (frontend)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"   // Create React App
  },
  "proxy": "http://localhost:5000"  // Routes API calls to backend
}
```

---

## API Contracts

### POST /ask

**Request:**
```json
{
  "question": "What is the weather in NYC?"
}
```

**Response (with search):**
```json
{
  "answer": "Based on current data, it's 72°F and sunny...",
  "sources": [
    {
      "title": "Weather.com - NYC",
      "url": "https://weather.com/...",
      "snippet": "Current conditions show..."
    },
    {
      "title": "National Weather Service",
      "url": "https://weather.gov/...",
      "snippet": "Updated forecast..."
    }
  ],
  "usedSearch": true
}
```

**Response (no search):**
```json
{
  "answer": "The capital of France is Paris.",
  "sources": [],
  "usedSearch": false
}
```

**Error Response:**
```json
{
  "error": "Failed to process question",
  "message": "OpenAI API key not configured"
}
```

---

## Tech Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| Frontend | React 18 | Simple, component-based, fast |
| Styling | CSS3 | No dependencies, full control |
| Backend | Express.js | Lightweight, fast, minimal |
| AI Reasoning | OpenAI GPT-3.5 | Affordable, effective, reliable |
| Web Search | Tavily API | Free tier, accurate, simple |
| HTTP Client | Axios | Promise-based, error handling |
| Environment | dotenv | Secure API key management |

---

## Typical User Flow

```
1. User opens http://localhost:3000
   ↓
2. User types "What's Bitcoin price?"
   ↓
3. User clicks "Ask"
   ↓
4. Frontend shows loading spinner
   ↓
5. Frontend calls POST /ask via axios
   ↓
6. Backend decides: "YES, need search"
   ↓
7. Backend calls Tavily API
   ↓
8. Backend calls OpenAI with search results
   ↓
9. Backend returns answer + sources
   ↓
10. Frontend displays answer and 5 source links
    ↓
11. User clicks a source link to learn more
```

---

## Feature Matrix

| Feature | Status | Notes |
|---------|--------|-------|
| Input field | ✅ | Clear, large |
| Submit button | ✅ | Disables while loading |
| Loading state | ✅ | Spinner + message |
| Response display | ✅ | Full answer + formatting |
| Source citations | ✅ | Clickable links |
| Error handling | ✅ | User-friendly messages |
| Mobile responsive | ✅ | Works on all sizes |
| Styling | ✅ | Modern gradient + animations |
| Web search | ✅ | Tavily integration |
| AI reasoning | ✅ | OpenAI GPT-3.5 |
| Decision logic | ✅ | Determines search need |
| Multi-turn | ❌ | Each query is independent |
| Memory | ❌ | No conversation history |
| Authentication | ❌ | No user accounts |
| Database | ❌ | No persistence |

---

## Quick Reference: Commands

### Setup (One Time)
```bash
# Windows
setup.bat

# Linux/Mac
bash setup.sh
```

### Development (Every Session)
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### Build for Production
```bash
# Frontend
cd frontend
npm run build
# Creates optimized build/ folder

# Backend
# Just run: npm start (no build needed for Node.js)
```

---

## Performance Metrics

**Typical Response Time Breakdown:**
- Decision API call: 0.5-1s
- Web search: 1-3s
- Answer API call: 2-5s
- Network latency: 0.1-0.5s
- **Total (with search): 4-9 seconds**
- **Total (no search): 2.5-6 seconds**

**Cost per Query:**
- OpenAI (2 API calls): ~$0.008
- Tavily search: ~$0.001
- **Total: ~$0.009 per query**

---

## Extending the System

### Add Memory (Store Conversation History)
- Add SQLite/MongoDB
- Store questions + answers
- Modify `/ask` to include context
- Return previous questions

### Stream Responses
- Use Server-Sent Events (SSE)
- Send chunks as they arrive
- Reduce perceived latency

### Add More Tools
- Calculator tool
- Code executor tool
- Image generator tool
- File analyzer tool

### Improve Reasoning
- Add Chain-of-Thought prompting
- Implement reflection/verification
- Add uncertainty quantification

### Better Search
- Use multiple search providers
- Implement result ranking
- Add result caching

---

## Troubleshooting Checklist

- [ ] API keys added to `.env`?
- [ ] Backend running on port 5000?
- [ ] Frontend running on port 3000?
- [ ] CORS enabled in backend?
- [ ] npm install run in both folders?
- [ ] Firewall not blocking ports?
- [ ] API keys valid (not expired)?
- [ ] Internet connection working?

---

## Next Steps

1. **Follow QUICK_START.md** (5 minutes)
2. **Ask a few test questions**
3. **Read AGENT_ARCHITECTURE.md** (understand reasoning)
4. **Customize** styling or prompts
5. **Deploy** to production

---

## Support Resources

- [OpenAI Documentation](https://platform.openai.com/docs)
- [Tavily API Docs](https://docs.tavily.com)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)

---

**Built as a minimal prototype for AI agent + web search integration.**
