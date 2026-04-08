# AI Agent with Web Search - Full Stack Application

A minimal, working React-based AI agent system that answers user questions by reasoning and performing web searches using OpenAI API + Tavily Search API.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 3000)                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Input Box → Submit Button → Response Display + Sources │ │
│  │ • Loading state with spinner                           │ │
│  │ • Error handling                                       │ │
│  │ • Source citations                                     │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬──────────────────────────────────────┘
                         │ HTTP POST /ask
                         ↓
┌─────────────────────────────────────────────────────────────┐
│            Express Backend (Port 5000)                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           /ask Endpoint (Request Handler)              │ │
│  │  1. Reason: Does question need web search?            │ │
│  │  2. Search: Fetch results if needed (Tavily API)      │ │
│  │  3. Answer: Generate response with OpenAI             │ │
│  │  4. Return: Answer + sources                          │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬──────────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              ↓                     ↓
        ┌──────────────┐    ┌──────────────┐
        │ OpenAI API   │    │  Tavily API  │
        │ (gpt-3.5)    │    │  (Search)    │
        └──────────────┘    └──────────────┘
```

## Key Components

### Backend Agent Logic

**Step-by-step reasoning:**
1. **Decision Phase**: Ask GPT "Does this question need web search?"
2. **Search Phase**: If YES, call Tavily API to get search results
3. **Synthesis Phase**: Combine search results + reasoning to generate answer
4. **Response**: Return answer with citations

**System Prompt** (prevents hallucinations):
- Forces step-by-step reasoning
- Encourages tool (search) usage when needed
- Requires source citations
- Fails gracefully if unsure

### Frontend

- Clean UI: input box, submit button, response display
- Real-time loading state with spinner
- Error handling with user-friendly messages
- Source citations with clickable links
- Mobile-responsive design

## Project Structure

```
TEST1/
├── backend/
│   ├── server.js                 # Main Express server
│   ├── package.json             # Backend dependencies
│   └── .env.example             # Environment variables template
│
├── frontend/
│   ├── public/
│   │   └── index.html           # HTML entry point
│   ├── src/
│   │   ├── App.js               # React main component
│   │   ├── App.css              # Styling
│   │   └── index.js             # React DOM render
│   └── package.json             # Frontend dependencies
│
└── README.md                    # This file
```

## Setup & Installation

### Prerequisites

- Node.js 14+ and npm
- OpenAI API key (get from https://platform.openai.com/api-keys)
- Tavily API key (get free key from https://tavily.com)

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your API keys:
   ```
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
   TAVILY_API_KEY=tvly-xxxxxxxxxxxxxxxx
   PORT=5000
   ```

5. Start backend server:
   ```bash
   npm start
   ```
   Backend will run at http://localhost:5000

### Frontend Setup

1. Open new terminal, navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start React dev server:
   ```bash
   npm start
   ```
   Frontend will open at http://localhost:3000

## API Endpoint

### POST /ask

**Request:**
```json
{
  "question": "What is the weather in New York today?"
}
```

**Response:**
```json
{
  "answer": "Based on current weather data...",
  "sources": [
    {
      "title": "Weather.com - New York",
      "url": "https://weather.com/...",
      "snippet": "Current conditions..."
    }
  ],
  "usedSearch": true
}
```

## How It Works

### Example: "What is the current Bitcoin price?"

1. **Frontend**: User types question, clicks "Ask"
2. **Backend Decision**: GPT determines "YES, needs web search" (current data)
3. **Backend Search**: Tavily API returns: BTC price, source URLs
4. **Backend Synthesis**: GPT combines search results into natural answer
5. **Frontend Display**: Shows answer + clickable sources

### Example: "What is the capital of France?"

1. **Frontend**: User types question, clicks "Ask"
2. **Backend Decision**: GPT determines "NO, general knowledge"
3. **Backend Search**: Skips search API call (faster)
4. **Backend Synthesis**: GPT answers from training data
5. **Frontend Display**: Shows answer, notes no search was needed

## Configuration Details

### OpenAI Model
- **Model**: `gpt-3.5-turbo` (fast, cheap)
- **Decision Temperature**: 0.3 (decisive)
- **Answer Temperature**: 0.7 (balanced)
- **Max Tokens**: 1000 (for detailed answers)

### Web Search (Tavily)
- **Results**: 5 per query
- **Timeout**: 10 seconds
- **Free tier**: Available (perfect for prototyping)

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| `OpenAI API key not configured` | Missing `.env` setup | Add OPENAI_API_KEY to `.env` |
| `500: Failed to process question` | API rate limit or service issue | Retry after 60 seconds |
| Network error | Backend not running | Ensure backend running on 5000 |
| `Tavily API error` | Invalid API key or rate limit | Check TAVILY_API_KEY in `.env` |

## Customization

### Change Search Provider
Replace Tavily with Google Search API:
```javascript
// In server.js, replace performWebSearch() function
async function performWebSearch(query) {
  const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
    params: {
      q: query,
      key: process.env.GOOGLE_API_KEY,
      cx: process.env.SEARCH_ENGINE_ID,
    },
  });
  // Parse and return results
}
```

### Add More Sophisticated Reasoning
Enhance the decision prompt to support multiple reasoning paths:
```javascript
// Supports: general knowledge, web search, calculations, etc.
const reasoningPrompt = `
Classify this question:
- KNOWLEDGE: General facts (use knowledge base)
- SEARCH: Current events, prices, news (use web search)
- MATH: Calculations (compute)
- ...
`;
```

### Change Frontend Styling
Modify [frontend/src/App.css](frontend/src/App.css) for custom theme.

## Limitations & Future Enhancements

### Current Limitations
- ❌ No persistent memory between questions
- ❌ No authentication
- ❌ No database for query history
- ❌ Simple reasoning (single decision point)
- ❌ No streaming responses (waits for full completion)

### Potential Enhancements
- ✅ Add streaming responses (chunked output)
- ✅ Multi-turn conversations with memory
- ✅ Image analysis and generation
- ✅ Document upload and analysis
- ✅ Custom knowledge base (RAG)
- ✅ Chain of thought visualizer
- ✅ Query history and bookmarking

## Troubleshooting

**Q: Frontend can't connect to backend?**
A: Ensure backend is running (`npm start` on port 5000) and CORS is enabled in server.js.

**Q: OpenAI API errors?**
A: Check API key validity, account balance, and rate limits at https://platform.openai.com/account/rate-limits.

**Q: Tavily search not working?**
A: Verify API key, ensure plan allows API access, check network connectivity.

**Q: Slow responses?**
A: GPT-3.5 typically responds in 2-5 seconds. Use GPT-4 for better reasoning (slower, more expensive).

## Running on Production

For a production deployment:

1. Use a reverse proxy (nginx) to serve both frontend and backend
2. Add authentication (JWT tokens)
3. Implement rate limiting (express-rate-limit)
4. Add logging (winston, morgan)
5. Use environment variables properly
6. Set up HTTPS/SSL certificates
7. Deploy on cloud (Vercel for frontend, Heroku/AWS for backend)

## License

MIT

## Credits

Built as a minimal prototype for AI agent + web search integration.
