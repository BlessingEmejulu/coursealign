import requests

def test():
    # Login to get token using form data
    login_res = requests.post("http://localhost:8000/api/auth/login", data={
        "username": "student_johndoe",
        "password": "password123"
    })
    
    if login_res.status_code != 200:
        print("Login failed:", login_res.text)
        return
        
    token = login_res.json()["access_token"]
    
    # Generate quiz
    res = requests.post("http://localhost:8000/api/ai/quiz/generate", json={
        "course_code": "CIS 101",
        "difficulty": "Easy",
        "num_questions": 2,
        "question_types": ["mcq"]
    }, headers={"Authorization": f"Bearer {token}"})
    
    print(res.status_code)
    print("Raw output:", repr(res.text))

if __name__ == "__main__":
    test()
