import os
import requests
import json
import re
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_CHAT_URL = os.getenv("OLLAMA_CHAT_URL", "http://localhost:11434/api/chat")
MODEL_NAME = os.getenv("MODEL_NAME", "gemma2:2b")

def generate_ai_response(prompt: str, context: str = "") -> str:
    """
    Generates a response using local Ollama model (Gemma).
    """
    system_instruction = (
        "You are the CourseAlign AI Tutor, an expert assistant for Computer Science students at "
        "Chukwuemeka Odumegwu Ojukwu University (COOU). Be concise, helpful, and academically rigorous."
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
        return ai_message
    except Exception as e:
        return f"An error occurred while communicating with the AI: {str(e)}"

def generate_quiz(course_context: str, difficulty: str = "Medium", num_questions: int = 5, question_types: list = ["mcq"]) -> str:
    """
    Generates a JSON-formatted quiz based on the course outline/context.
    """
    types_str = " and ".join(question_types)
    prompt = (
        f"Generate a {num_questions}-question quiz based on this context:\n"
        f"{course_context}\n\n"
        f"Difficulty: {difficulty}\n"
        f"Question Types: {types_str}\n\n"
        "Return ONLY a valid JSON array of objects. Do not include any markdown backticks or explanation outside the JSON.\n"
        "Example Output Format:\n"
        "[\n"
        "  {\n"
        "    \"type\": \"mcq\",\n"
        "    \"question\": \"Question text here?\",\n"
        "    \"options\": [\"Option 1\", \"Option 2\", \"Option 3\", \"Option 4\"],\n"
        "    \"answer\": \"Option 1\",\n"
        "    \"explanation\": \"Detailed explanation here.\",\n"
        "    \"topic\": \"Specific sub-topic\"\n"
        "  }\n"
        "]\n"
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
    except requests.exceptions.RequestException as e:
        raise Exception(f"Unable to connect to Gemma 4 (Ollama): {str(e)}")
    except Exception as e:
        raise Exception(f"Unexpected error communicating with AI: {str(e)}")

def generate_quiz_feedback(course_code: str, score: int, total: int, incorrect_topics: list) -> str:
    """
    Generates personalized feedback based on quiz performance.
    """
    topics_str = ", ".join(incorrect_topics) if incorrect_topics else "None"
    prompt = (
        f"A student took a practice quiz for {course_code} and scored {score} out of {total}.\n"
        f"They answered questions incorrectly in the following topics: {topics_str}.\n\n"
        "Return ONLY a valid JSON object with the following keys. Do not include any markdown backticks.\n"
        "- 'feedback': string (a short, encouraging personalized feedback paragraph)\n"
        "- 'suggested_topics': array of strings (2-3 specific topics they should review)\n"
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
        return data.get("response", "{}")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Unable to connect to Gemma 4 (Ollama): {str(e)}")
    except Exception as e:
        raise Exception(f"Unexpected error communicating with AI: {str(e)}")
