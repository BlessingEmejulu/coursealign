document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseCode = urlParams.get('code');
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    if (!courseCode) {
        document.getElementById('settingsContainer').innerHTML = "<p class='text-red-500 font-bold'>No course code provided.</p>";
        return;
    }

    document.getElementById('quizTitle').innerText = `AI Quiz: ${courseCode}`;
    document.getElementById('backBtn').href = `course-detail.html?code=${courseCode}`;

    const settingsForm = document.getElementById('settingsForm');
    const typeError = document.getElementById('typeError');
    let generatedQuestions = [];

    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const difficulty = document.getElementById('difficulty').value;
        const numQuestions = parseInt(document.getElementById('numQuestions').value);
        
        const types = [];
        if (document.getElementById('type-mcq').checked) types.push('mcq');
        if (document.getElementById('type-tf').checked) types.push('tf');

        if (types.length === 0) {
            typeError.classList.remove('hidden');
            return;
        }
        typeError.classList.add('hidden');

        document.getElementById('settingsContainer').classList.add('hidden');
        document.getElementById('loadingContainer').classList.remove('hidden');

        try {
            const res = await fetch(CONFIG.API_BASE_URL + `/api/ai/quiz/generate`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    course_code: courseCode,
                    difficulty: difficulty,
                    num_questions: numQuestions,
                    question_types: types
                })
            });

            if (res.ok) {
                const data = await res.json();
                let questionsStr = data.quiz;
                if (typeof questionsStr === 'string' && questionsStr.startsWith('```json')) {
                    questionsStr = questionsStr.replace('```json', '').replace('```', '');
                }
                
                try {
                    let parsed = typeof questionsStr === 'string' ? JSON.parse(questionsStr) : questionsStr;
                    
                    // Normalize: If the AI wrapped the array in an object (e.g., {"questions": [...]})
                    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                        // Check if it's a single question object
                        const fuzzyFind = (obj, keys) => {
                            for (const key of keys) {
                                const foundKey = Object.keys(obj).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === key.toLowerCase().replace(/[^a-z0-9]/g, ''));
                                if (foundKey && obj[foundKey] !== undefined) return true;
                            }
                            return false;
                        };
                        
                        if (fuzzyFind(parsed, ['question', 'text', 'prompt', 'q']) && fuzzyFind(parsed, ['options', 'choices', 'answer'])) {
                            parsed = [parsed];
                        } else if (Array.isArray(parsed.questions)) {
                            parsed = parsed.questions;
                        } else if (Array.isArray(parsed.quiz)) {
                            parsed = parsed.quiz;
                        } else {
                            const firstArrayKey = Object.keys(parsed).find(key => Array.isArray(parsed[key]));
                            if (firstArrayKey) {
                                parsed = parsed[firstArrayKey];
                            } else {
                                throw new Error("AI returned invalid JSON structure (missing array).");
                            }
                        }
                    }
                    
                    if (!Array.isArray(parsed)) {
                        throw new Error("Parsed quiz data is not an array.");
                    }
                    generatedQuestions = parsed;
                } catch(e) {
                    console.error("Parse Error Detail:", e, "\nRaw String:", questionsStr);
                    throw new Error("Failed to parse quiz data from AI.");
                }
                
                renderQuiz(generatedQuestions);
                
                document.getElementById('loadingContainer').classList.add('hidden');
                document.getElementById('quizForm').classList.remove('hidden');
                document.getElementById('scoreDisplay').innerText = `0/${generatedQuestions.length} Answered`;
            } else {
                let errorMsg = "Failed to load quiz. Please try again.";
                if (res.status === 405) {
                    errorMsg = "API endpoint mismatch (405). Please completely restart your backend server to apply recent changes.";
                } else if (res.status === 500) {
                    try {
                        const errData = await res.json();
                        errorMsg = errData.detail || "Internal server error occurred while connecting to AI.";
                    } catch(e) {
                        errorMsg = "Internal server error occurred.";
                    }
                } else if (res.status === 404) {
                    errorMsg = "Course not found.";
                }
                document.getElementById('loadingContainer').innerHTML = `<p class='text-red-500 font-bold'>${errorMsg}</p>`;
            }
        } catch (error) {
            console.error(error);
            document.getElementById('loadingContainer').innerHTML = `<p class='text-red-500 font-bold'>Error communicating with AI server: ${error.message}</p>`;
        }
    });

    function renderQuiz(questions) {
        const container = document.getElementById('questionsContainer');
        container.innerHTML = '';
        
        // Filter out completely broken questions just in case, or fix them up
        const validQuestions = questions.map(q => {
            // Helper to find a value by possible keys (case-insensitive)
            const findVal = (keys) => {
                for (const key of keys) {
                    const foundKey = Object.keys(q).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === key.toLowerCase().replace(/[^a-z0-9]/g, ''));
                    if (foundKey && q[foundKey] !== undefined) return q[foundKey];
                }
                return undefined;
            };

            const normalizedQ = {
                question: findVal(['question', 'text', 'prompt', 'q']),
                answer: findVal(['answer', 'correctanswer', 'correct', 'a']),
                options: findVal(['options', 'choices', 'answers', 'possibleanswers']),
                explanation: findVal(['explanation', 'reason', 'feedback', 'rationale', 'description', 'details', 'info', 'context']),
                type: findVal(['type', 'questiontype']),
                topic: findVal(['topic', 'subject', 'category'])
            };
            
            let opts = normalizedQ.options;
            
            // If it's a True/False question and options are missing, default them
            if (!opts && normalizedQ.type && normalizedQ.type.toLowerCase() === 'tf') {
                opts = ['True', 'False'];
            }
            
            // If still no options, provide a fallback to prevent crash
            if (!Array.isArray(opts)) {
                opts = [normalizedQ.answer || 'Option A', 'Option B']; 
            }
            
            return { ...normalizedQ, options: opts };
        });

        validQuestions.forEach((q, index) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'doodle-border p-6 bg-surface';
            
            let optionsHtml = '';
            q.options.forEach((opt) => {
                optionsHtml += `
                <label class="flex items-center gap-3 p-3 border-2 border-text rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input type="radio" name="q${index}" value="${String(opt).replace(/"/g, '&quot;')}" class="w-5 h-5 accent-primary" required>
                    <span>${opt}</span>
                </label>
                `;
            });

            qDiv.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold">${index + 1}. ${q.question || 'Missing Question Text'}</h3>
                    <span class="text-xs font-bold text-white bg-secondary px-2 py-1 rounded doodle-border shadow-none">${q.type ? q.type.toUpperCase() : 'Q'}</span>
                </div>
                <div class="space-y-3">
                    ${optionsHtml}
                </div>
            `;
            container.appendChild(qDiv);
        });
        
        // Update the global reference to match the normalized questions
        generatedQuestions = validQuestions;
    }

    document.getElementById('quizForm').addEventListener('change', () => {
        const formData = new FormData(document.getElementById('quizForm'));
        let answeredCount = 0;
        for(let pair of formData.entries()) {
            answeredCount++;
        }
        document.getElementById('scoreDisplay').innerText = `${answeredCount}/${generatedQuestions.length} Answered`;
    });

    document.getElementById('quizForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        let score = 0;
        let incorrectTopics = new Set();
        
        const reviewContainer = document.getElementById('answersReviewContainer');
        reviewContainer.innerHTML = '<h3 class="text-2xl font-bold text-secondary mb-4 border-b-2 border-dashed border-gray-300 pb-2">Questions Review</h3>';

        generatedQuestions.forEach((q, index) => {
            const userAnswer = formData.get(`q${index}`);
            const isCorrect = userAnswer === q.answer;
            
            if (isCorrect) {
                score++;
            } else if (q.topic) {
                incorrectTopics.add(q.topic);
            }

            // Render review item
            const reviewDiv = document.createElement('div');
            reviewDiv.className = `p-5 doodle-border ${isCorrect ? 'bg-green-50 border-success' : 'bg-red-50 border-danger'}`;
            reviewDiv.innerHTML = `
                <h4 class="font-bold text-lg mb-2">${index + 1}. ${q.question}</h4>
                <p class="mb-1"><strong>Your Answer:</strong> <span class="${isCorrect ? 'text-success' : 'text-danger'}">${userAnswer || 'No answer'}</span></p>
                ${!isCorrect ? `<p class="mb-3 text-success"><strong>Correct Answer:</strong> ${q.answer}</p>` : ''}
                <div class="mt-3 p-3 bg-white rounded border border-gray-200">
                    <p class="text-sm text-gray-700"><strong>AI Explanation:</strong> ${q.explanation || 'No explanation provided.'}</p>
                </div>
            `;
            reviewContainer.appendChild(reviewDiv);
        });

        const total = generatedQuestions.length;
        const percentage = Math.round((score / total) * 100);

        document.getElementById('quizForm').classList.add('hidden');
        document.getElementById('scoreDisplay').classList.add('hidden');
        document.getElementById('resultsContainer').classList.remove('hidden');
        
        document.getElementById('resultsText').innerText = `${score} out of ${total} (${percentage}%)`;
        document.getElementById('resultsStats').innerText = `${score} Correct | ${total - score} Incorrect`;

        // Fetch feedback
        fetchFeedback(score, total, Array.from(incorrectTopics));
    });

    async function fetchFeedback(score, total, incorrectTopics) {
        try {
            const res = await fetch(CONFIG.API_BASE_URL + `/api/ai/quiz/feedback`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    course_code: courseCode,
                    score: score,
                    total: total,
                    incorrect_topics: incorrectTopics
                })
            });

            if (res.ok) {
                const data = await res.json();
                document.getElementById('feedbackLoading').classList.add('hidden');
                document.getElementById('feedbackContent').classList.remove('hidden');
                
                document.getElementById('feedbackText').innerText = data.feedback || "Great job completing the quiz!";
                
                const topicsList = document.getElementById('suggestedTopics');
                if (data.suggested_topics && data.suggested_topics.length > 0) {
                    data.suggested_topics.forEach(t => {
                        const li = document.createElement('li');
                        li.innerText = t;
                        topicsList.appendChild(li);
                    });
                } else {
                    topicsList.innerHTML = "<li>No specific topics to review. You're doing great!</li>";
                }
            } else {
                document.getElementById('feedbackLoading').innerText = "Failed to load personalized feedback.";
            }
        } catch (error) {
            console.error(error);
            document.getElementById('feedbackLoading').innerText = "Error loading feedback.";
        }
    }
});