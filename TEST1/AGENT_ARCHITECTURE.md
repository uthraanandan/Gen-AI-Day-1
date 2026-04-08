# AI Agent Reasoning Loop - Technical Details

## Complete Request Flow

```
┌────────────────────────────────────────────────────────────────┐
│  FRONTEND: User asks "What's the latest news on AI?"           │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                    POST /ask
                    {question: "..."}
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│  BACKEND: reasonAndAnswer() function starts                     │
└────────────────────────┬─────────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼ STEP 1                         
┌──────────────────────────────────────────┐
│  Decision: Call OpenAI GPT-3.5          │
│  System Prompt:                          │
│  "Does this need web search?"            │
│  - YES: current events, recent data      │
│  - NO: general knowledge, math           │
│                                          │
│  Response: "YES"                         │
└────────────────────┬─────────────────────┘
                     │
        ┌────────────▼────────────┐
        │ needsSearch = true       │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │                         │
        ▼ STEP 2                 
┌──────────────────────────────────────────┐
│  Web Search: Call Tavily API             │
│  Query: "What's the latest news on AI?"  │
│                                          │
│  Results (up to 5):                      │
│  [                                       │
│    {                                     │
│      "title": "OpenAI Releases GPT-5",   │
│      "url": "https://...",               │
│      "snippet": "Today OpenAI..."        │
│    },                                    │
│    {                                     │
│      "title": "Google DeepMind...",      │
│      "url": "https://...",               │
│      "snippet": "Latest breakthrough..." │
│    },                                    │
│    ...                                   │
│  ]                                       │
└────────────────────┬─────────────────────┘
                     │
        ┌────────────▼────────────┐
        │ searchResults = [...]   │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │                         │
        ▼ STEP 3                 
┌──────────────────────────────────────────┐
│  Synthesis: Call OpenAI with context    │
│  System Prompt:                          │
│  "Answer accurately. Cite sources."      │
│                                          │
│  User Prompt:                            │
│  "Recent search results:                 │
│  - OpenAI Releases GPT-5                 │
│    Today OpenAI announced... [src]       │
│  - Google DeepMind...                    │
│    Latest breakthrough... [src]          │
│                                          │
│  Question: What's the latest...          │
│                                          │
│  Based on these, answer..."              │
│                                          │
│  Response:                               │
│  "The latest AI developments include    │
│   GPT-5 from OpenAI and breakthrough    │
│   from Google DeepMind..."               │
└────────────────────┬─────────────────────┘
                     │
        ┌────────────▼──────────────────┐
        │ answer = "The latest AI..."   │
        │ sources = [{...}, {...}, ...] │
        │ usedSearch = true             │
        └────────────┬──────────────────┘
                     │
                     ▼ STEP 4
┌──────────────────────────────────────────┐
│  Return Response to Frontend              │
│  {                                        │
│    "answer": "The latest AI...",         │
│    "sources": [                          │
│      {                                   │
│        "title": "OpenAI Releases...",    │
│        "url": "https://...",             │
│        "snippet": "Today..."             │
│      },                                  │
│      ...                                 │
│    ],                                    │
│    "usedSearch": true                    │
│  }                                       │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│  FRONTEND: Display Response               │
│  ┌─────────────────────────────────────┐ │
│  │ Answer                              │ │
│  │ The latest AI developments...       │ │
│  ├─────────────────────────────────────┤ │
│  │ Sources                             │ │
│  │ • OpenAI Releases GPT-5             │ │
│  │   Today OpenAI announced...         │ │
│  │   → Click link                      │ │
│  │                                     │ │
│  │ • Google DeepMind...                │ │
│  │   Latest breakthrough from...       │ │
│  │   → Click link                      │ │
│  └─────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## Code Walkthrough

### Backend: server.js

```javascript
// 1. REQUEST HANDLER
app.post('/ask', async (req, res) => {
  const { question } = req.body;  // "What's the latest AI news?"
  
  // 2. REASONING LOOP
  const result = await reasonAndAnswer(question);
  //   ├─ Decision: Does it need search?
  //   ├─ Search: Fetch results if YES
  //   ├─ Synthesis: Generate answer
  //   └─ Return: {answer, sources, usedSearch}
  
  res.json(result);  // Send response
});
```

### Step 1: Decision Logic
```javascript
// Ask GPT: "Does this question need web search?"
const decisionResponse = await openai.createChatCompletion({
  messages: [
    {
      role: 'system',
      content: `You are an AI reasoning agent...
        - YES: current events, recent data
        - NO: general knowledge, math`
    },
    {
      role: 'user',
      content: userQuestion  // "What's the latest AI news?"
    }
  ],
  temperature: 0.3  // Low = more decisive
});

// Extract decision: "YES" or "NO"
const needsSearch = decisionResponse.data.choices[0]
  .message.content.includes('YES');
```

### Step 2: Web Search (If Needed)
```javascript
async function performWebSearch(query) {
  const response = await axios.post(
    'https://api.tavily.com/search',
    {
      api_key: process.env.TAVILY_API_KEY,
      query: query,
      max_results: 5
    }
  );
  
  // Returns: [{title, url, snippet}, ...]
  return response.data.results;
}
```

### Step 3: Synthesis with Context
```javascript
// Combine search results + question for context
const finalPrompt = `
Recent search results:
${searchResults.map(r => 
  `- ${r.title}\n${r.snippet}\n(${r.url})`
).join('\n')}

User question: ${userQuestion}

Based on these results, provide an accurate answer...
`;

// Ask GPT to answer with this context
const answerResponse = await openai.createChatCompletion({
  messages: [
    {
      role: 'system',
      content: 'Answer accurately. Cite sources. Avoid hallucinations.'
    },
    {
      role: 'user',
      content: finalPrompt
    }
  ],
  temperature: 0.7  // Higher = more creative
});
```

### Step 4: Response Construction
```javascript
return {
  answer: answerResponse.data.choices[0].message.content,
  sources: searchResults,  // [{title, url, snippet}, ...]
  usedSearch: needsSearch  // true/false
};
```

---

## Prompt Engineering Decisions

### Why Two Separate API Calls?

1. **Decision Call** (temperature 0.3):
   - Low temperature = consistent, decisive
   - Must make binary choice (YES/NO)
   - Fast & cheap (small output)

2. **Answer Call** (temperature 0.7):
   - Higher temperature = more natural, varied
   - Generate detailed response
   - Incorporates search context

### System Prompts Design

**Decision Prompt:**
```
Enforce: Binary decision only (YES/NO)
Avoid: Rambling, uncertainty
Logic: Clear criteria for web search
```

**Answer Prompt:**
```
Enforce: Citation of sources
Avoid: Hallucinations, assumptions
Logic: Answer only what search proves
```

### Why This Prevents Hallucinations

1. **Explicit decision** about needing search
2. **Real search results** as context
3. **System prompt** forces source citations
4. **If no search** → GPT asked not to speculate

---

## Example Chains

### Chain 1: Knowledge-Based (No Search)
```
Question: "What is photosynthesis?"
├─ Decision: NO (general knowledge)
├─ Search: SKIPPED
├─ GPT: "Photosynthesis is the process..."
└─ usedSearch: false
```

### Chain 2: Real-Time (Web Search)
```
Question: "Bitcoin price today?"
├─ Decision: YES (current data)
├─ Search: Tavily returns latest price
├─ GPT: "Based on latest data: BTC is $X"
└─ usedSearch: true, sources: [{url, price}]
```

### Chain 3: Complex (Multi-Step Reasoning)
```
Question: "Compare latest iPhone and Samsung phones"
├─ Decision: YES (recent products)
├─ Search: Finds specs and reviews
├─ GPT: "Based on current models:
│   iPhone 15: [specs from search]
│   Samsung S24: [specs from search]
│   Comparison: ..."
└─ usedSearch: true, sources: [5 results]
```

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| Decision API latency | 0.5-1s | Quick yes/no |
| Search latency | 1-3s | Tavily API |
| Answer API latency | 2-5s | Full response generation |
| **Total (with search)** | **4-9s** | All three steps |
| **Total (no search)** | **2-5s** | Just decision + answer |
| Cost per query | ~$0.01 | GPT-3.5 pricing |

---

## Error Handling

```
Request → Valid? ─NO→ 400 "Question required"
         ├─ API Keys? ─NO→ 500 "Not configured"
         ├─ Decision ─FAIL→ 500 "Reasoning error"
         ├─ Search ─FAIL→ Continue (graceful)
         ├─ Answer ─FAIL→ 500 "Generation error"
         └─ Return ─OK→ 200 + response
```

---

## Debugging

Add logs to trace execution:
```javascript
console.log(`[Agent] Performing web search for: ${question}`);
console.log(`[Decision] needsSearch = ${needsSearch}`);
console.log(`[Search] Found ${searchResults.length} results`);
console.log(`[Answer] Generated ${answer.length} chars`);
```

Then check server console output to debug issue.
