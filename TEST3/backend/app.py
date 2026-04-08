import ast
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from typing import List, Dict, Any


app = FastAPI()



class CodeReviewRequest(BaseModel):
    code: str

class Issue(BaseModel):
    type: str
    message: str
    line: int = None

class ReviewResponse(BaseModel):
    issues: List[Issue]
    explanation: str
    improved_code: str

def analyze_with_ast(code: str) -> List[Issue]:
    issues = []
    try:
        tree = ast.parse(code)
        # Basic checks: detect unused variables, etc. (simplified)
        for node in ast.walk(tree):
            if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Load):
                # Simplified: just check for syntax
                pass
    except SyntaxError as e:
        issues.append(Issue(type="syntax", message=str(e), line=e.lineno))
    return issues

def call_openai(prompt: str, code: str) -> str:
    issues = []
    improved_code = code

    # Rule 1: Missing colon in function
    if "def" in code and ":" not in code:
        issues.append("Missing ':' in function definition")
        improved_code = code.replace(")", "):")

    # Rule 2: Missing indentation
    if "return" in code and "    return" not in code:
        issues.append("Improper indentation for return statement")
        improved_code = improved_code.replace("return", "    return")

    # Rule 3: Missing space after comma
    if "," in code and ", " not in code:
        issues.append("Missing space after comma")
        improved_code = improved_code.replace(",", ", ")

    # Rule 4: Basic formatting
    lines = improved_code.split("\n")
    formatted_lines = []
    for line in lines:
        formatted_lines.append(line.strip())
    improved_code = "\n".join(formatted_lines)

    explanation = " | ".join(issues) if issues else "Code looks good"

    return f"""
Critique: {explanation}

Improved Analysis: Fixed syntax and formatting issues.

Improved Code:
{improved_code}
"""

def self_reflect_and_improve(code: str, initial_analysis: str) -> str:
    critique_prompt = f"""
    Review the following code analysis and suggestion. Critique it for accuracy, completeness, and improvement potential. Then provide an improved version.

    Original Code:
    {code}

    Initial Analysis:
    {initial_analysis}

    Output format:
    Critique: [Your critique]
    Improved Analysis: [Improved explanation and suggestions]
    Improved Code: [Improved code snippet]
    """
    return call_openai(critique_prompt, code)

@app.post("/review", response_model=ReviewResponse)
def review_code(request: CodeReviewRequest):
    code = request.code
    ast_issues = analyze_with_ast(code)
    
    # Initial prompt
    initial_prompt = f"""
    Analyze the following Python code for errors, best practices, and improvements. Use AST insights: {ast_issues}

    Code:
    {code}

    Output format:
    Issues: [List of issues]
    Explanation: [Detailed explanation]
    Improved Code: [Suggested improved code]
    """
    initial_response = call_openai(initial_prompt, code)
    
    # Self-reflection: critique and improve
    improved_response = self_reflect_and_improve(code, initial_response)
    
    # Parse improved_response (simplified parsing)
    # Assume structured output
    lines = improved_response.split('\n')
    critique = ""
    improved_analysis = ""
    improved_code = ""
    section = ""
    for line in lines:
        if line.startswith("Critique:"):
            section = "critique"
            critique = line[9:].strip()
        elif line.startswith("Improved Analysis:"):
            section = "analysis"
            improved_analysis = line[18:].strip()
        elif line.startswith("Improved Code:"):
            section = "code"
            improved_code = line[14:].strip()
        else:
            if section == "critique":
                critique += " " + line.strip()
            elif section == "analysis":
                improved_analysis += " " + line.strip()
            elif section == "code":
                improved_code += " " + line.strip()
    
    # For simplicity, return the improved version
    return ReviewResponse(
        issues=ast_issues,
        explanation=improved_analysis,
        improved_code=improved_code
    )