# Visual Guides & Diagrams

## Complete System Diagram

```
╔════════════════════════════════════════════════════════════════════════════╗
║                     AI AGENT WITH WEB SEARCH - FULL SYSTEM                 ║
╚════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────┐
│                          BROWSER (http://localhost:3000)                 │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         REACT FRONTEND                          │   │
│  │                                                                 │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │                      INPUT SECTION                       │  │   │
│  │  │  ┌────────────────────────────────────────────────────┐ │  │   │
│  │  │  │ "Ask me anything..." [              ] [Ask Button] │ │  │   │
│  │  │  └────────────────────────────────────────────────────┘ │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  │                                │                              │   │
│  │                          (on submit)                          │   │
│  │                                ▼                              │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │                  LOADING STATE (if waiting)              │  │   │
│  │  │                  ┌──────────────┐                        │  │   │
│  │  │                  │     ⟳        │  Thinking...           │  │   │
│  │  │                  └──────────────┘                        │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  │                                │                              │   │
│  │                            (response)                         │   │
│  │                                ▼                              │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │               RESPONSE DISPLAY SECTION                   │  │   │
│  │  │                                                          │  │   │
│  │  │  Answer:                                                │  │   │
│  │  │  Based on current data, Bitcoin is trading at...        │  │   │
│  │  │                                                          │  │   │
│  │  │  Sources:                                               │  │   │
│  │  │  • 📌 CoinMarketCap - Bitcoin Price                     │  │   │
│  │  │    Latest trading price and market cap...              │  │   │
│  │  │    → https://coinmarketcap.com/...                     │  │   │
│  │  │                                                          │  │   │
│  │  │  • 📌 CoinBase - BTC Trading                           │  │   │
│  │  │    Real-time market data...                            │  │   │
│  │  │    → https://coinbase.com/...                          │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│                          axios.post('/ask', ...)                        │
│                                │                                        │
└────────────────────────────────┼────────────────────────────────────────┘
                                 │
                    HTTP POST (JSON request)
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVER (Port 5000)                        │
│                      (Node.js + Express)                               │
│                                                                        │
│  app.post('/ask', async (req, res) => {                              │
│                                                                        │
│    ┌──────────────────────────────────────────────────────────────┐  │
│    │              STEP 1: DECISION PHASE                          │  │
│    │  ┌────────────────────────────────────────────────────────┐ │  │
│    │  │ Input: "What's Bitcoin price?"                        │ │  │
│    │  │                                                        │ │  │
│    │  │ Call OpenAI API (gpt-3.5-turbo):                      │ │  │
│    │  │ System: "Does this need web search? YES or NO"        │ │  │
│    │  │ Temp: 0.3 (decisive)                                 │ │  │
│    │  │                                                        │ │  │
│    │  │ Output: "YES"                                         │ │  │
│    │  │ Cost: ~$0.001                                         │ │  │
│    │  │ Time: 0.5-1s                                          │ │  │
│    │  └────────────────────────────────────────────────────────┘ │  │
│    └──────────────────────────┬───────────────────────────────────┘  │
│                               │                                      │
│                    Decision = YES → Search                           │
│                               │                                      │
│    ┌──────────────────────────┴───────────────────────────────────┐  │
│    │              STEP 2: SEARCH PHASE                            │  │
│    │  ┌────────────────────────────────────────────────────────┐ │  │
│    │  │ Input: "What's Bitcoin price?"                        │ │  │
│    │  │                                                        │ │  │
│    │  │ Call Tavily Search API:                               │ │  │
│    │  │ Query: "Bitcoin price"                               │ │  │
│    │  │ Max Results: 5                                        │ │  │
│    │  │                                                        │ │  │
│    │  │ Output: [                                             │ │  │
│    │  │   {                                                   │ │  │
│    │  │     title: "Bitcoin Price - CoinMarketCap",           │ │  │
│    │  │     url: "https://coinmarketcap.com/...",             │ │  │
│    │  │     snippet: "BTC trading at $43,250..."              │ │  │
│    │  │   },                                                  │ │  │
│    │  │   { ... 4 more results ... }                          │ │  │
│    │  │ ]                                                     │ │  │
│    │  │ Cost: ~$0.001                                         │ │  │
│    │  │ Time: 1-3s                                            │ │  │
│    │  └────────────────────────────────────────────────────────┘ │  │
│    └──────────────────────────┬───────────────────────────────────┘  │
│                               │                                      │
│    ┌──────────────────────────▼───────────────────────────────────┐  │
│    │            STEP 3: SYNTHESIS PHASE                           │  │
│    │  ┌────────────────────────────────────────────────────────┐ │  │
│    │  │ Input: Question + 5 Search Results                    │ │  │
│    │  │                                                        │ │  │
│    │  │ Call OpenAI API (gpt-3.5-turbo):                      │ │  │
│    │  │ System: "Answer accurately. Cite sources."            │ │  │
│    │  │ User: "Based on search:                              │ │  │
│    │  │         - Bitcoin trading at $43,250                 │ │  │
│    │  │         - Volume increased 15%                       │ │  │
│    │  │         [... 3 more results ...]                     │ │  │
│    │  │        Question: What's Bitcoin price?"              │ │  │
│    │  │ Temp: 0.7 (natural)                                  │ │  │
│    │  │                                                        │ │  │
│    │  │ Output: "Based on current market data, Bitcoin        │ │  │
│    │  │          is trading at $43,250. Trading volume        │ │  │
│    │  │          has increased 15% today. [Source 1]          │ │  │
│    │  │          This represents a 2% increase from..."       │ │  │
│    │  │ Cost: ~$0.006                                         │ │  │
│    │  │ Time: 2-5s                                            │ │  │
│    │  └────────────────────────────────────────────────────────┘ │  │
│    └──────────────────────────┬───────────────────────────────────┘  │
│                               │                                      │
│    ┌──────────────────────────▼───────────────────────────────────┐  │
│    │             STEP 4: RESPONSE CONSTRUCTION                    │  │
│    │  ┌────────────────────────────────────────────────────────┐ │  │
│    │  │ Return to Frontend:                                   │ │  │
│    │  │ {                                                     │ │  │
│    │  │   answer: "Based on current...",                      │ │  │
│    │  │   sources: [                                          │ │  │
│    │  │     {                                                 │ │  │
│    │  │       title: "Bitcoin Price - CoinMarketCap",         │ │  │
│    │  │       url: "https://...",                             │ │  │
│    │  │       snippet: "BTC trading at $43,250..."            │ │  │
│    │  │     },                                                │ │  │
│    │  │     ... 4 more sources ...                            │ │  │
│    │  │   ],                                                  │ │  │
│    │  │   usedSearch: true                                    │ │  │
│    │  │ }                                                     │ │  │
│    │  └────────────────────────────────────────────────────────┘ │  │
│    └──────────────────────────────────────────────────────────────┘  │
│  })                                                                    │
│                                                                        │
└────────────────────────────┬───────────────────────────────────────────┘
                             │
                    HTTP Response (JSON)
                             │
                             ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    BROWSER - DISPLAY RESPONSE                          │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                    ANSWER SECTION                               ││
│  │  Based on current market data, Bitcoin is trading at $43,250... ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                    SOURCES SECTION                              ││
│  │  • Bitcoin Price - CoinMarketCap                               ││
│  │    BTC trading at $43,250... → [Link]                          ││
│  │                                                                 ││
│  │  • Bitcoin News Today - Reuters                                ││
│  │    Market surge following... → [Link]                          ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

EXTERNAL APIs:
┌─────────────────────────────┐    ┌─────────────────────────────┐
│     OpenAI API              │    │     Tavily Search API       │
│ (gpt-3.5-turbo)             │    │                             │
│                             │    │ • performWebSearch()        │
│ • Decision: YES/NO          │    │ • Returns: 5 results        │
│ • Answer synthesis          │    │ • Includes: URL + snippet   │
│ • Cost: ~$0.007/query       │    │ • Cost: Free (100/mo)       │
│ • Model: GPT-3.5-turbo      │    │ • Timeout: 10s              │
└─────────────────────────────┘    └─────────────────────────────┘
```

---

## State Flow Diagram

```
USER INPUT
    │
    ▼
┌─────────────┐
│ question    │ (empty string)
│ loading     │ (false)
│ response    │ (null)
│ error       │ (null)
└─────────────┘
    │
    │ User types + clicks "Ask"
    │
    ▼
┌─────────────┐
│ loading     │ = true
│ error       │ = null
│ response    │ = null
└─────────────┘
    │
    │ Show: Loading spinner
    │
    ▼ (fetch /ask completes)
┌─────────────┐
│ loading     │ = false
│ response    │ = { answer, sources, usedSearch }
│ question    │ = "" (cleared)
└─────────────┘
    │
    │ Show: Answer + sources
    │
    ▼ (user types new question)
[Back to step 3]

ERROR PATH:
┌─────────────┐
│ loading     │ = true
└─────────────┘
    │
    │ fetch /ask fails
    │
    ▼
┌─────────────┐
│ loading     │ = false
│ error       │ = "Failed to process question"
└─────────────┘
    │
    │ Show: Red error box
    │ Keep: Input field (user can retry)
    │
    ▼
```

---

## Decision Tree

```
Question: "What's the Bitcoin price right now?"
    │
    ▼
┌─────────────────────────────────────────┐
│ Call GPT: "Does this need search?"      │
│ Temperature: 0.3 (decisive)             │
│ Response: "YES"                         │
└─────────────┬───────────────────────────┘
              │
    ┌─────────▴─────────┐
    │                   │
    ▼                   ▼
 YES              ┌─────────────────────┐
    │             │ Search: NO SEARCH   │
    │             │ Answer: Use         │
    │             │ knowledge only      │
    │             └─────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ Call Tavily Search API          │
│ Query: "Bitcoin price right now"│
│ Max: 5 results                  │
│ Results: [5 current prices]     │
└─────────────┬───────────────────┘
              │
              ▼
    ┌─────────────────────────┐
    │ Search returned results?│
    └──────────┬──────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼ YES        ▼ NO (timeout/error)
    Continue with   Continue without
    search results  search results
        │             │
        └──────┬──────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Call GPT: "Answer question"  │
    │ Input: Search results +      │
    │        User question         │
    │ Temperature: 0.7 (creative)  │
    │ Response: Full answer        │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Return: {                    │
    │   answer: "BTC at $43,250",  │
    │   sources: [...],            │
    │   usedSearch: true/false     │
    │ }                            │
    └──────────────────────────────┘
```

---

## Component Tree (React)

```
<App>
  ├─ State:
  │  ├─ question (string)
  │  ├─ response (object | null)
  │  ├─ loading (boolean)
  │  └─ error (string | null)
  │
  ├─ <header className="header">
  │  └─ "🤖 AI Agent Search"
  │
  ├─ <form onSubmit={handleSubmit}>
  │  └─ <input>
  │     <button>Ask</button>
  │
  ├─ {loading && <Loading spinner />}
  │
  ├─ {error && <ErrorBox message={error} />}
  │
  └─ {response && (
       <ResponseBox>
         ├─ <AnswerSection answer={response.answer} />
         └─ {response.usedSearch && 
              <SourcesSection sources={response.sources} />
           }
       </ResponseBox>
     )}
```

---

## File Size Reference

```
backend/
  ├─ server.js              115 lines (~3.2 KB)   - Core logic
  ├─ package.json           18 lines  (~0.5 KB)   - Dependencies
  └─ .env.example           3 lines   (~0.1 KB)   - Config

frontend/src/
  ├─ App.js                 85 lines  (~2.8 KB)   - React component
  ├─ App.css                250 lines (~8.2 KB)   - Styling
  └─ index.js               10 lines  (~0.3 KB)   - Entry

Documentation:
  ├─ README.md              400 lines (~15 KB)    - Full guide
  ├─ QUICK_START.md         80 lines  (~3 KB)     - Fast setup
  ├─ AGENT_ARCHITECTURE.md  300 lines (~12 KB)    - Deep dive
  ├─ IMPLEMENTATION_GUIDE.md 400 lines (~16 KB)   - Best practices
  └─ PROJECT_SUMMARY.md     250 lines (~10 KB)    - Reference

TOTAL: ~470 lines of actual code, ~60 KB documentation
```

---

## API Response Time Breakdown

```
User clicks "Ask"
    │ 0ms
    ▼
┌─────────────────────────────┐
│ Frontend: sendRequest()     │ 0-10ms
└─────────────────────────────┘
    │
    ├─ Network latency: 10-50ms
    │
    ▼
┌─────────────────────────────┐
│ Backend: /ask handler       │ 0ms
└─────────────────────────────┘
    │
    ├─ Decision API call: 500-1000ms
    │
    ▼
┌─────────────────────────────┐
│ Check: needsSearch?         │ 10ms
└─────────────────────────────┘
    │
    ├─ Web Search API call: 1000-3000ms (if needed)
    │
    ▼
┌─────────────────────────────┐
│ Answer API call: 2000-5000ms│
└─────────────────────────────┘
    │
    ├─ Response construction: 10ms
    │
    ▼
┌─────────────────────────────┐
│ Backend: send response      │ 0-10ms
└─────────────────────────────┘
    │
    ├─ Network latency: 10-50ms
    │
    ▼
┌─────────────────────────────┐
│ Frontend: display response  │ 0-100ms
└─────────────────────────────┘

TOTAL: 4000-9000ms (4-9 seconds)
   - With search: 5-9s
   - Without search: 3-6s
```

---

## Error Handling Flow

```
Frontend: handleSubmit()
    │
    ▼
fetch('/ask', {...})
    │
    ├─ Network fails
    │  └─ setError("Network error")
    │     └─ Display red box
    │
    ├─ Response: 400 (Bad Request)
    │  └─ setError(data.error)
    │     └─ "Question is required"
    │
    ├─ Response: 500 (Server Error)
    │  └─ setError(data.error)
    │     └─ "Failed to process question"
    │
    └─ Response: 200 (Success)
       └─ setResponse(data)
          └─ Display answer + sources
```

---

This visualizes the complete flow from user input to final response!
