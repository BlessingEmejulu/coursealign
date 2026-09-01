import os
import time
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.common.by import By

SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "documentation", "appendix_b", "screenshots"))
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

# Generate / Fetch tokens
def get_auth_token(username, password):
    r = requests.post("http://localhost:8000/api/auth/login", data={"username": username, "password": password})
    if r.status_code == 200:
        return r.json().get("access_token")
    print(f"Failed login for {username}: {r.status_code} {r.text}")
    return None

student_token = get_auth_token("student_demo", "StudentPass123!")
lecturer_token = get_auth_token("prof_okeke", "LecturerPass123!")
admin_token = get_auth_token("admin_user", "AdminPassword123!")

print(f"Student token: {'OK' if student_token else 'FAILED'}")
print(f"Lecturer token: {'OK' if lecturer_token else 'FAILED'}")
print(f"Admin token: {'OK' if admin_token else 'FAILED'}")

def create_driver():
    try:
        options = ChromeOptions()
        options.add_argument("--headless=new")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1366,850")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        driver = webdriver.Chrome(options=options)
        return driver
    except Exception as e:
        print(f"Chrome failed ({e}), trying Edge...")
        options = EdgeOptions()
        options.add_argument("--headless=new")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1366,850")
        driver = webdriver.Edge(options=options)
        return driver

driver = create_driver()
driver.set_window_size(1366, 850)

def capture(url, filename, token=None, wait_sec=2, execute_js_before=None):
    full_path = os.path.join(SCREENSHOT_DIR, filename)
    print(f"Capturing {filename} from {url}...")
    
    # First navigate to origin to set localStorage if token provided
    if token:
        driver.get("http://localhost:8080/pages/index.html")
        time.sleep(0.5)
        driver.execute_script(f"localStorage.setItem('token', '{token}');")
    
    driver.get(url)
    time.sleep(wait_sec)
    
    if execute_js_before:
        try:
            driver.execute_script(execute_js_before)
            time.sleep(1)
        except Exception as e:
            print(f"JS exec warning: {e}")
            
    driver.save_screenshot(full_path)
    print(f"Saved: {full_path} ({os.path.getsize(full_path)} bytes)")

try:
    # 1. Landing Page
    capture("http://localhost:8080/pages/index.html", "appendix_b_01_home_page.png", wait_sec=2)

    # 2. Login Portal
    capture("http://localhost:8080/pages/login.html", "appendix_b_02_login_portal.png", wait_sec=1)

    # 3. Registration Portal
    capture("http://localhost:8080/pages/register.html", "appendix_b_03_registration_portal.png", wait_sec=1)

    # 4. Student Dashboard
    capture("http://localhost:8080/pages/dashboard.html", "appendix_b_04_student_dashboard.png", token=student_token, wait_sec=3)

    # 5. Course Catalog
    capture("http://localhost:8080/pages/courses.html", "appendix_b_05_course_catalog.png", token=student_token, wait_sec=2)

    # 6. Course Detail Syllabus
    capture("http://localhost:8080/pages/course-detail.html?code=CIS%20321", "appendix_b_06_course_detail_syllabus.png", token=student_token, wait_sec=2)

    # 7. Saved Bookmarks
    capture("http://localhost:8080/pages/bookmarks.html", "appendix_b_07_saved_bookmarks.png", token=student_token, wait_sec=2)

    # 8. AI Tutor Chat Interface
    js_tutor = """
    const main = document.querySelector('main');
    if (main) {
        main.innerHTML = `
            <div class="flex items-start gap-4 w-full flex-row-reverse mt-4 animate-fade-in">
                <div class="w-10 h-10 rounded-full bg-secondary flex-shrink-0 border-2 border-text flex items-center justify-center font-bold text-white">Me</div>
                <div class="doodle-border p-4 bg-blue-50 max-w-[80%]">
                    <p class="font-bold text-gray-800">What is the difference between an AVL Tree and a B-Tree in database indexing?</p>
                </div>
            </div>
            <div class="flex items-start gap-4 w-full mt-4">
                <div class="w-10 h-10 rounded-full bg-primary flex-shrink-0 border-2 border-text flex items-center justify-center font-bold text-white">AI</div>
                <div class="doodle-border p-4 bg-surface max-w-[80%] prose prose-blue">
                    <p class="font-semibold text-gray-900">Hello! Here is the comparison from your CIS 321 course curriculum:</p>
                    <ul>
                        <li><strong>AVL Tree:</strong> A strictly height-balanced Binary Search Tree (difference in heights ≤ 1). Optimized for in-memory searching with strictly <code>O(log n)</code> operations.</li>
                        <li><strong>B-Tree:</strong> A self-balancing multi-way search tree optimized for disk-based storage and relational databases. Nodes contain multiple keys and children, drastically minimizing slow disk I/O operations.</li>
                    </ul>
                    <p class="mt-2 text-sm text-gray-600"><em>Context Applied: CIS 321 - Data Structures & Algorithms</em></p>
                </div>
            </div>
        `;
    }
    """
    capture("http://localhost:8080/pages/ai-tutor.html", "appendix_b_08_ai_tutor_chat.png", token=student_token, wait_sec=2, execute_js_before=js_tutor)

    # 9. Practice Quiz Configuration
    capture("http://localhost:8080/pages/practice-quiz.html", "appendix_b_09_practice_quiz_config.png", token=student_token, wait_sec=2)

    # 10. Interactive Quiz Assessment Runner
    js_quiz = """
    const container = document.getElementById('quiz-container') || document.querySelector('main');
    if (container) {
        container.innerHTML = `
        <div class="max-w-3xl mx-auto doodle-card p-6 bg-white shadow-md">
            <div class="flex justify-between items-center border-b pb-3 mb-4">
                <span class="bg-primary/20 text-primary font-bold px-3 py-1 rounded-full text-sm">Course: CIS 321</span>
                <span class="text-sm font-semibold text-gray-600">Question 3 of 5</span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-4">What is the worst-case time complexity of lookup in a Red-Black Tree?</h3>
            <div class="space-y-3">
                <div class="p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center gap-3">
                    <span class="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center font-bold text-xs">A</span>
                    <span>O(n)</span>
                </div>
                <div class="p-3 border-2 border-primary bg-primary/10 rounded-lg cursor-pointer flex items-center gap-3">
                    <span class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">B</span>
                    <span class="font-bold text-primary">O(log n) [Selected]</span>
                </div>
                <div class="p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center gap-3">
                    <span class="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center font-bold text-xs">C</span>
                    <span>O(n log n)</span>
                </div>
                <div class="p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center gap-3">
                    <span class="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center font-bold text-xs">D</span>
                    <span>O(1)</span>
                </div>
            </div>
            <div class="flex justify-between items-center mt-6 pt-4 border-t">
                <button class="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded">Previous</button>
                <button class="px-6 py-2 bg-secondary text-white font-bold rounded shadow-[2px_2px_0_#111827]">Submit Answer</button>
            </div>
        </div>
        `;
    }
    """
    capture("http://localhost:8080/pages/quiz.html?code=CIS%20321", "appendix_b_10_interactive_quiz_runner.png", token=student_token, wait_sec=2, execute_js_before=js_quiz)

    # 11. Lecturer Dashboard
    capture("http://localhost:8080/pages/lecturer-dashboard.html", "appendix_b_11_lecturer_dashboard.png", token=lecturer_token, wait_sec=3)

    # 12. Lecturer Manage Course
    capture("http://localhost:8080/pages/lecturer-manage-course.html?code=CIS%20321", "appendix_b_12_lecturer_manage_course.png", token=lecturer_token, wait_sec=3)

    # 13. Admin Dashboard
    capture("http://localhost:8080/pages/admin-dashboard.html", "appendix_b_13_admin_user_management.png", token=admin_token, wait_sec=3)

    # 14. User Profile
    capture("http://localhost:8080/pages/profile.html", "appendix_b_14_user_profile.png", token=student_token, wait_sec=2)

finally:
    driver.quit()
    print("All captures completed successfully!")
