# Self-Reflecting Code Review Agent

A lightweight tool for reviewing Python code using AST analysis and iterative OpenAI improvements.

## Setup

1. Install backend dependencies: `pip install -r backend/requirements.txt`
2. Install frontend dependencies: `pip install -r frontend/requirements.txt`
3. Set OpenAI API key: `export OPENAI_API_KEY=your_key_here`
4. Run backend: `uvicorn backend.app:app --reload`
5. Run frontend: `streamlit run frontend/app.py`

## Architecture

- **Backend (FastAPI)**: Handles code parsing with AST, calls OpenAI for analysis and self-reflection.
- **Frontend (Streamlit)**: Simple UI for input and output display.
- **Prompt Strategy**: Initial analysis followed by self-critique and improvement loop.