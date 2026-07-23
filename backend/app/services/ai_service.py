import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_CHAT_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "gemma4:2b"

def generate_ai_response(prompt: str, context: str = "") -> str:
    """
    Generates a response using local Ollama model.
    """
    system_instruction = (
        "You are the CourseAlign AI Tutor, an expert assistant for Computer Science students at "
        "Chukwuemeka Odumegwu Ojukwu University (COOU). Be concise, helpful, and academically rigorous. "
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
        response = requests.post(OLLAMA_CHAT_URL, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        return data.get("message", {}).get("content", "Error parsing response.")
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
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        return data.get("response", "[]")
    except Exception as e:
        return f'{{"error": "{str(e)}"}}'
