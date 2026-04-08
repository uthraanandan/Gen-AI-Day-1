import streamlit as st
import requests

st.title("Self-Reflecting Code Review Agent")

code = st.text_area("Paste your Python code here:", height=300)

if st.button("Review Code"):
    if code:
        response = requests.post("http://localhost:8000/review", json={"code": code})
        if response.status_code == 200:
            data = response.json()
            st.subheader("Detected Issues:")
            for issue in data["issues"]:
                st.write(f"- {issue['type']}: {issue['message']} (Line {issue.get('line', 'N/A')})")
            
            st.subheader("Explanation:")
            st.write(data["explanation"])
            
            st.subheader("Improved Code:")
            st.code(data["improved_code"], language="python")
        else:
            st.error("Error reviewing code.")
    else:
        st.warning("Please paste some code.")