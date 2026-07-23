import os
import requests
import json
import re
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_CHAT_URL = os.getenv("OLLAMA_CHAT_URL", "http://localhost:11434/api/chat")
MODEL_NAME = "gemma:2b"

def generate_ai_response(prompt: str, context: str = "") -> str:
    """
    Generates a response using local Ollama model (Gemma) and E2B for code execution.
    """
    system_instruction = (
        "You are the CourseAlign AI Tutor, an expert assistant for Computer Science students at "
        "Chukwuemeka Odumegwu Ojukwu University (COOU). Be concise, helpful, and academically rigorous. "
        "If the user asks you to execute Python code, calculate something, or run an algorithm, you should "
        "output the Python code inside a markdown block like this:\n"
        "```python\n"
        "print('Hello World')\n"
        "```\n"
        "I will automatically execute it for you and provide the output back to the user."
    )
    if context:
        system_instruction += f"\nHere is the relevant course context:\n{context}"
        
    messages = [
        {"role": "system", "content": system_instruction},
        {"role": "user", "content": prompt}
    ]
    
    payload = {
        "model": MODEL_NAME,
        "messages": messages,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_CHAT_URL, json=payload, timeout=120)
        response.raise_for_status()
        data = response.json()
        ai_message = data.get("message", {}).get("content", "Error parsing response.")
        
        # Check if AI outputted any python code
        python_blocks = re.findall(r"```python\n(.*?)\n```", ai_message, re.DOTALL)
        
        if python_blocks:
            from app.services.local_sandbox import run_local_code
            ai_message += "\n\n**Executing Local Code Sandbox...**\n"
            for code in python_blocks:
                output = run_local_code(code)
                ai_message += f"\n```text\n{output}\n```\n"
            
        return ai_message
    except Exception as e:
        return f"An error occurred while communicating with the AI: {str(e)}"

def generate_quiz(course_context: str, num_questions: int = 5) -> str:
    """
    Generates a JSON-formatted quiz based on the course outline/context.
    """
    prompt = (
        f"Generate a {num_questions}-question multiple choice quiz based on this context:\n"
        f"{course_context}\n\n"
        "Return ONLY a valid JSON array of objects with keys: 'question', 'options' (array of 4 strings), 'answer' (string). "
        "Do not include any markdown backticks or explanation. Just the raw JSON array."
    )
    
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "format": "json"
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=120)
        response.raise_for_status()
        data = response.json()
        return data.get("response", "[]")
    except Exception as e:
        return f'{{"error": "{str(e)}"}}'
