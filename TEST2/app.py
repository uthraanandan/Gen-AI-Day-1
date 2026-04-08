from flask import Flask, request, jsonify
import sympy as sp

app = Flask(__name__)

def solve_linear(problem):
    try:
        # Assume problem is like "2*x + 3 = 7"
        if '=' in problem:
            left_str, right_str = problem.split('=', 1)
            left = sp.sympify(left_str.strip())
            right = sp.sympify(right_str.strip())
            eq = sp.Eq(left, right)
        else:
            eq = sp.sympify(problem)
            left = eq
            right = 0
        
        x = sp.Symbol('x')
        sol = sp.solve(eq, x)
        if not sol:
            return ["No solution found"], None
        
        answer = sol[0]
        
        # Generate steps
        steps = [f"Equation: {eq}"]
        if right != 0:
            new_eq = left - right
            steps.append(f"Bring all terms to one side: {new_eq} = 0")
        else:
            new_eq = left
        
        # Assume linear
        poly = sp.Poly(new_eq, x)
        coeffs = poly.all_coeffs()
        if len(coeffs) == 2:
            a, b = coeffs
            steps.append(f"Coefficient of x: {a}, constant term: {b}")
            steps.append(f"x = {-b}/{a} = {answer}")
        else:
            steps.append(f"Solution: x = {answer}")
        
        return steps, str(answer)
    except Exception as e:
        return [f"Error: {str(e)}"], None

@app.route('/solve', methods=['POST'])
def solve():
    data = request.get_json()
    problem = data['problem']
    steps, answer = solve_linear(problem)
    return jsonify({'steps': steps, 'answer': answer})

@app.route('/')
def index():
    return '''
<!DOCTYPE html>
<html>
<head>
    <title>Math Solver</title>
</head>
<body>
    <h1>Math Problem Solver</h1>
    <input type="text" id="problem" placeholder="Enter math problem, e.g., 2*x + 3 = 7">
    <button onclick="solve()">Solve</button>
    <div id="result"></div>
    <script>
        async function solve() {
            const problem = document.getElementById('problem').value;
            const response = await fetch('/solve', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({problem})
            });
            const data = await response.json();
            let html = '<h2>Steps:</h2><ol>';
            data.steps.forEach(step => html += '<li>' + step + '</li>');
            html += '</ol><h2>Answer:</h2><p>' + data.answer + '</p>';
            document.getElementById('result').innerHTML = html;
        }
    </script>
</body>
</html>
'''

if __name__ == '__main__':
    app.run(debug=True)