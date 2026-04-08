require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

// Web search function using Tavily API (free tier available)
async function performWebSearch(query) {
  try {
    const response = await axios.post(
      'https://api.tavily.com/search',
      {
        api_key: process.env.TAVILY_API_KEY,
        query: query,
        max_results: 5,
        include_answer: true,
      },
      { timeout: 10000 }
    );

    const results = response.data.results || [];
    return results.map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.snippet || r.content,
    }));
  } catch (error) {
    console.error('Web search error:', error.message);
    return [];
  }
}

// Agent reasoning loop
async function reasonAndAnswer(userQuestion) {
  try {
    // Step 1: Determine if web search is needed
    const decisionResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an AI reasoning agent. Analyze if the user's question requires current information, real-time data, or web search.
          Respond with ONLY "YES" or "NO".
          - YES: if the question asks about current events, recent news, live data, prices, weather, sports scores, or time-sensitive info
          - NO: if it's general knowledge, math, explanations, or historical facts`,
        },
        {
          role: 'user',
          content: userQuestion,
        },
      ],
      temperature: 0.3,
      max_tokens: 10,
    });

    const needsSearch = decisionResponse.data.choices[0].message.content
      .trim()
      .toUpperCase()
      .includes('YES');

    let searchResults = [];

    // Step 2: Perform web search if needed
    if (needsSearch) {
      console.log(`[Agent] Performing web search for: ${userQuestion}`);
      searchResults = await performWebSearch(userQuestion);
    } else {
      console.log('[Agent] Using knowledge base only');
    }

    // Step 3: Generate final answer with context
    const finalPrompt =
      searchResults.length > 0
        ? `
Recent search results:
${searchResults.map((r) => `- ${r.title}\n  ${r.snippet}\n  (Source: ${r.url})`).join('\n')}

User question: ${userQuestion}

Based on the above search results and your knowledge, provide a clear, accurate answer. Cite sources when applicable.`
        : userQuestion;

    const answerResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI assistant. Answer questions accurately and concisely.
          When search results are provided, use them to inform your answer and cite sources.
          Avoid hallucinations. If you're not sure, say so.`,
        },
        {
          role: 'user',
          content: finalPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return {
      answer: answerResponse.data.choices[0].message.content,
      sources: searchResults,
      usedSearch: needsSearch,
    };
  } catch (error) {
    console.error('Reasoning error:', error.message);
    throw error;
  }
}

// Main API endpoint
app.post('/ask', async (req, res) => {
  const { question } = req.body;

  if (!question || question.trim() === '') {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ error: 'OpenAI API key not configured' });
  }

  try {
    const result = await reasonAndAnswer(question);
    res.json(result);
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({
      error: 'Failed to process question',
      message: error.message,
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AI Agent Backend running on http://localhost:${PORT}`);
  console.log('Available endpoints: POST /ask, GET /health');
});
