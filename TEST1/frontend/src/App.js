import React, { useState } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to get response');
      }

      const data = await res.json();
      setResponse(data);
      setQuestion('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🤖 AI Agent Search</h1>
        <p>Ask questions. Get answers with web search.</p>
      </header>

      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything..."
            disabled={loading}
            className="input"
          />
          <button type="submit" disabled={loading} className="button">
            {loading ? 'Searching...' : 'Ask'}
          </button>
        </div>
      </form>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Thinking and searching...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>❌ {error}</p>
        </div>
      )}

      {response && (
        <div className="response">
          <div className="answer">
            <h2>Answer</h2>
            <p>{response.answer}</p>
          </div>

          {response.usedSearch && response.sources.length > 0 && (
            <div className="sources">
              <h3>📚 Sources ({response.sources.length})</h3>
              <ul>
                {response.sources.map((source, idx) => (
                  <li key={idx}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.title}
                    </a>
                    <p>{source.snippet}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!response.usedSearch && (
            <p className="note">ℹ️ Answer based on general knowledge (no web search needed)</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
