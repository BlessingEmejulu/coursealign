# CourseAlign - Comprehensive Project Audit

**Role**: Senior Software Architect, Full-Stack Engineer, UI/UX Designer, QA, Security Engineer, Product Manager.

---

## 1. Project Understanding

**What this project does**: 
CourseAlign is an AI-powered Course Outline Management and Learning Support System. It acts as a centralized repository for academic course materials, augmented with an AI Tutor and AI-generated practice quizzes.

**Target Users**:
- Students (Computer Science Dept, COOU): Consume outlines, take practice quizzes, use the AI tutor.
- Lecturers: Upload and manage their course outlines and resources.
- Administrators: Manage global courses, oversee user roles, and monitor platform health.

**Main User Journey**:
1. Sign up/Login.
2. View Dashboard (recent courses, learning stats).
3. Browse course catalog and filter by level/semester.
4. View course details (objectives, weekly outlines, resources).
5. Interact with AI Tutor for explanations or generate AI-powered practice quizzes.

**Technologies Used**:
- **Frontend**: Vanilla HTML/JS, Tailwind CSS (via CDN), custom CSS for a hand-drawn "doodle" aesthetic.
- **Backend**: Python (FastAPI), raw SQLite (no ORM).
- **AI Engine**: Local Ollama server (`gemma4:2b`).
- **Deployment**: Docker, Docker Compose.

**Overall Architecture & Data Flow**:
The app follows a standard client-server architecture. The frontend consists of static HTML/JS files served by a basic HTTP server, which make REST API calls to the FastAPI backend. The backend interacts directly with a local SQLite database using raw SQL queries and communicates with a local Ollama instance over HTTP for AI features. Authentication is handled via stateless JWTs.

---

## 2. Feature Audit

| Feature | Status | Issues | Missing Parts | Recommendation |
|---------|--------|--------|---------------|----------------|
| **Authentication** | 🟡 Needs Improvement | Token stored in `localStorage` (XSS risk). No refresh token logic. | Password reset flow is incomplete (no email sent). | Move JWT to HttpOnly cookies. Implement refresh tokens. |
| **Dashboard (Student)** | ✅ Complete | Dynamic stats are implemented but relies on a basic query. | Activity graphs/charts. | Cache dashboard stats query to reduce DB load. |
| **Admin Workflow** | 🟡 Needs Improvement | Basic CRUD for courses. Admin can theoretically promote users, but UI for role management is very limited. | Bulk course upload, audit logs. | Enhance the user management table to allow easy role toggling. |
| **Lecturer Workflow** | 🟡 Needs Improvement | Lecturers can add courses, but outline management is clunky. | Version control for outlines. | Allow lecturers to edit existing outlines easily. |
| **Course Catalog (Browse)** | ✅ Complete | Filtering works via JS arrays. | Server-side pagination and filtering. | Move search and filtering to the backend for scale. |
| **Practice Quiz** | 🟡 Needs Improvement | AI can hallucinate JSON structures. Retry logic exists but can be brittle. | Quiz history/review past quizzes. | Enforce structured outputs in Ollama or use smaller rigid prompts. |
| **AI Tutor** | 🟡 Needs Improvement | Chat history is basic. Context window can fill up quickly. | Markdown rendering for AI code snippets. | Implement marked.js on frontend to parse AI markdown responses. |

---

## 3. User Flow Audit

**As a First-Time Visitor**:
- **Issue**: The landing page (`index.html`) immediately pushes to login/register if clicking anything.
- **Improvement**: Allow viewing the course catalog as a guest (read-only) to hook users before forcing registration.

**As a Registered Student**:
- **Issue**: The navigation is clear, but finding specific resources requires clicking into a course first.
- **Improvement**: Add a global search bar in the dashboard header that searches across all courses and resources instantly.

**As a Lecturer**:
- **Issue**: The flow to add a course outline requires the course to exist first. If an admin hasn't created the course, the lecturer is blocked.
- **Improvement**: Allow lecturers to suggest/create draft courses pending admin approval.

---

## 4. UI/UX Audit

> [!WARNING]
> **Mobile Responsiveness**: While Tailwind provides utilities, the sidebar on `admin-dashboard.html` and `dashboard.html` simply hides on mobile (`hidden md:flex`), relying on a hamburger menu that is sometimes clunky or missing in secondary pages.

- **Design System**: The "Doodle" theme is unique and engaging, but the heavy borders can clutter the screen when displaying dense tables (e.g., Admin manage users).
- **Typography**: The cursive font (`Delius Swash Caps`) is used for body text in some places, reducing readability for long descriptions or AI explanations.
- **Recommendation**: Restrict the doodle font to Headings and Buttons. Use a clean sans-serif (like Inter) for paragraphs and AI chat text.
- **Empty States**: Most pages (Courses, Bookmarks) now have decent empty states, but the AI Tutor chat starts completely blank. Provide "Suggested Prompts" to help users start.

---

## 5. Code Quality Audit

- **Frontend Architecture**: No bundler (Webpack/Vite) or framework (React/Vue). This leads to massive code duplication. `config.js` and `parseJwt` are duplicated or manually included everywhere.
- **Backend Architecture**: The use of raw SQLite `cursor.execute()` in routers creates tight coupling between the HTTP layer and the Database layer.
- **DRY Violations**: The frontend sidebar HTML is copy-pasted across 6 different HTML files. If a new link is added, it must be updated in 6 places.
- **Recommendation**: 
  - **Frontend**: Introduce a templating engine (like Handlebars) or migrate to a lightweight framework (Alpine.js or Vue) to componentize the sidebar and headers.
  - **Backend**: Implement the Repository Pattern. Move SQL queries out of `*_router.py` into `app/repositories/`.

---

## 6. Backend & Database Audit

- **Raw SQL**: The backend is highly vulnerable to maintainability issues due to raw SQL strings, though parameterized queries are used correctly to prevent SQLi.
- **Database Scalability**: SQLite is used. While fine for MVP, SQLite locks the entire database on writes. If multiple students take quizzes and chat with the AI simultaneously, the database will hit `database is locked` errors.
- **Missing Indexes**: There are no explicit indexes on `bookmarks(user_id, course_id)` or `chat_messages(session_id)`, which will cause slow queries as the tables grow.
- **Recommendation**: 
  - Add indexes to foreign keys in SQLite.
  - Migrate to PostgreSQL using SQLAlchemy or SQLModel for production.

---

## 7. Security Audit

> [!CAUTION]
> **JWT Storage (High Risk)**: The frontend stores JWT tokens in `localStorage`. This makes the application vulnerable to Cross-Site Scripting (XSS) attacks, which can easily exfiltrate tokens.
> **Fix**: Move the JWT to an `HttpOnly`, `Secure`, `SameSite=Strict` cookie.

- **SQL Injection (Low Risk)**: The backend correctly uses parameterized queries (e.g., `WHERE username = ?`).
- **CORS Configuration (Medium Risk)**: `allow_origins=["*"]` in `main.py` is overly permissive. Restrict this to the actual frontend domain.
- **Rate Limiting (High Risk)**: The `/api/ai/chat` and `/api/ai/quiz` endpoints have no rate limiting. A malicious user can spam these endpoints, overwhelming the local Ollama instance and causing a Denial of Service (DoS).

---

## 8. Performance Audit

- **Tailwind CDN**: The frontend uses the Tailwind Play CDN (`<script src="https://cdn.tailwindcss.com"></script>`). This forces the browser to compile CSS on the fly, adding ~200ms-500ms to every page load.
  - **Fix**: Install Tailwind via npm and build a static `style.css` file.
- **AI Processing**: LLM generation blocks the server if not handled asynchronously. `ollama.generate` is synchronous. 
  - **Fix**: Ensure the FastAPI endpoints for AI are strictly using `async def` and `await asyncio.to_thread(ollama.generate, ...)` to prevent starving the ASGI event loop.

---

## 9. Accessibility (a11y) Audit

- **Color Contrast**: The `bg-warning` (orange) with white text on the Bookmark button may fail WCAG AA contrast ratios.
- **Focus Indicators**: The custom `.doodle-button` classes override default browser outlines but do not provide an explicit `:focus-visible` state. Keyboard navigation is difficult.
- **Semantic HTML**: Good use of `<main>`, `<aside>`, and `<header>`, but some interactive icons (like the bookmark SVG) lack `aria-label` attributes.

---

## 10. Production Readiness Checklist

- `[ ]` **Environment Variables**: Hardcoded URLs in `config.js` (`localhost:8000`). Needs `.env` parsing for frontend builds. ❌ Missing
- `[ ]` **Logging & Monitoring**: No structured logging or APM (e.g., Sentry). Errors are just `print()` statements. ❌ Missing
- `[ ]` **Database Migrations**: No Alembic or migration scripts. Changes to schemas require wiping the DB. ❌ Missing
- `[ ]` **Docker Readiness**: A `docker-compose.yml` exists, but the frontend needs an Nginx container rather than relying on `python -m http.server`. 🟡 Needs Work
- `[x]` **CORS Handling**: Handled in FastAPI, but needs strict origins. 🟡 Needs Work

---

## 11. Final Scores

- **UI/UX**: 70/100 (Creative, but lacks consistency and accessibility)
- **Frontend Architecture**: 40/100 (No componentization, heavy duplication)
- **Backend Architecture**: 65/100 (Clean routers, but raw SQL in controllers)
- **Security**: 50/100 (Token in localStorage, no rate limiting)
- **Performance**: 60/100 (Tailwind CDN, synchronous AI calls)
- **Production Readiness**: 45/100 (MVP state, not ready for scale)

**OVERALL SCORE: 55 / 100** (Solid Prototype / Alpha Stage)

---

## 12. Prioritized Action Plan

### Immediate (Critical - Do before any release)
1. **Remove Tailwind CDN**: Build the CSS statically to fix load times and layout shifts. *(Medium Effort)*
2. **Implement Rate Limiting**: Protect the AI endpoints using `slowapi` to prevent server crashing. *(Small Effort)*
3. **Fix JWT Storage**: Move authentication from `localStorage` to `HttpOnly` cookies. *(Medium Effort)*

### Short-term (High Value)
1. **Frontend Componentization**: Migrate the HTML files to a basic templating engine (like Jinja2, EJS, or Alpine.js) to share the Sidebar and Navbar code. *(Medium Effort)*
2. **Database Indexes**: Add indexes to `user_id` and `course_id` across all relational tables. *(Small Effort)*
3. **Markdown Parser**: Add `marked.js` to the AI Tutor page so responses format code blocks and bold text properly instead of showing raw markdown asterisks. *(Small Effort)*

### Medium-term
1. **Migration to PostgreSQL**: Swap raw SQLite queries for SQLAlchemy and connect to a Postgres database to support concurrent quiz takers without database locking. *(Large Effort)*
2. **Admin User Interface**: Build out the tables in the Admin dashboard to actually allow editing users and promoting them to lecturers. *(Medium Effort)*

### Long-term
1. **Streaming AI Responses**: Update the FastAPI backend and frontend to use Server-Sent Events (SSE) so the AI Tutor types out answers in real-time like ChatGPT, improving perceived performance. *(Large Effort)*

---

## Executive Summary

**CourseAlign** is a highly creative and functionally impressive prototype. The integration of a local Gemma 4 model for privacy-first AI tutoring is a massive selling point and works surprisingly well. 

However, the project is **not currently production-ready**. 

The biggest risks are the **frontend architecture** (which is highly repetitive and relies on runtime CSS compilation), the **security posture** (localStorage JWTs and zero rate-limiting on expensive AI endpoints), and the **database choice** (SQLite will buckle under concurrent writes during exam season).

By executing the immediate action plan—specifically securing the AI endpoints, moving away from the Tailwind CDN, and securing the JWTs—this project can safely transition from an Alpha prototype to a Beta release for a small cohort of students.
