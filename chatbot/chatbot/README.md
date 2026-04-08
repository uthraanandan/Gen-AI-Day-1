# Customer Support Chatbot

A simple, production-ready customer support chatbot web app built with Node.js and Express.
**No API key required!** Uses rule-based responses for instant deployment.

## Features

- Rule-based customer support responses (no AI needed)
- Handles common FAQs, order issues, and technical problems
- Clean chat UI with loading indicators
- Instant responses without external dependencies
- Error handling and user-friendly messages

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the application:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - Start chatting with the support bot!

**No API key setup required!** 🚀
   ```
   npm start
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - Start chatting with the support bot!

## Project Structure

- `server.js` - Express server with OpenAI integration
- `public/index.html` - Frontend chat interface
- `package.json` - Project dependencies and scripts
- `.env` - Environment variables (API key)

## API Endpoint

- `POST /chat` - Send a message and receive a bot response
  - Request: `{ "message": "Your question here" }`
  - Response: `{ "response": "Bot's answer" }`

## Technologies Used

- Backend: Node.js, Express
- AI: OpenAI GPT-3.5-turbo
- Frontend: HTML, CSS, Vanilla JavaScript