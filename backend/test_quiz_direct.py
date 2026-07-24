from app.services.ai_service import generate_quiz

def test():
    print("Generating quiz...")
    context = "CIS 101 Introduction to Computing. Topics: Hardware, Software, Networking."
    result = generate_quiz(context, "Easy", 3, ["mcq"])
    print("RAW AI OUTPUT:")
    print(repr(result))

if __name__ == "__main__":
    test()
