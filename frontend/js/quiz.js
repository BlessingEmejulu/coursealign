document.addEventListener('DOMContentLoaded', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const courseCode = urlParams.get('code');
            const token = localStorage.getItem('token');
            
            if (!token) {
                window.location.href = 'login.html';
                return;
            }

            if (!courseCode) {
                document.getElementById('loadingContainer').innerHTML = "<p class='text-red-500 font-bold'>No course code provided.</p>";
                return;
            }

            document.getElementById('quizTitle').innerText = `AI Quiz: ${courseCode}`;
            document.getElementById('backBtn').href = `course-detail.html?code=${courseCode}`;

            let correctAnswers = [];

            try {
                const res = await fetch(CONFIG.API_BASE_URL + `/api/ai/quiz/${courseCode}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    let questionsStr = data.quiz;
                    // Try to clean up markdown if the AI includes it
                    if (questionsStr.startsWith('```json')) {
                        questionsStr = questionsStr.replace('```json', '').replace('```', '');
                    }
                    
                    const questions = JSON.parse(questionsStr);
                    correctAnswers = questions.map(q => q.answer);
                    
                    const container = document.getElementById('questionsContainer');
                    questions.forEach((q, index) => {
                        const qDiv = document.createElement('div');
                        qDiv.className = 'doodle-border p-6 bg-surface';
                        
                        let optionsHtml = '';
                        q.options.forEach((opt, optIndex) => {
                            optionsHtml += `
                            <label class="flex items-center gap-3 p-3 border-2 border-text rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                <input type="radio" name="q${index}" value="${opt.replace(/"/g, '&quot;')}" class="w-5 h-5 accent-primary" required>
                                <span>${opt}</span>
                            </label>
                            `;
                        });

                        qDiv.innerHTML = `
                            <h3 class="text-xl font-bold mb-4">${index + 1}. ${q.question}</h3>
                            <div class="space-y-3">
                                ${optionsHtml}
                            </div>
                        `;
                        container.appendChild(qDiv);
                    });

                    document.getElementById('loadingContainer').classList.add('hidden');
                    document.getElementById('quizForm').classList.remove('hidden');
                    document.getElementById('scoreDisplay').innerText = `0/${questions.length} Answered`;
                    
                    // Update score display on change
                    document.getElementById('quizForm').addEventListener('change', () => {
                        const formData = new FormData(document.getElementById('quizForm'));
                        let answeredCount = 0;
                        for(let pair of formData.entries()) {
                            answeredCount++;
                        }
                        document.getElementById('scoreDisplay').innerText = `${answeredCount}/${questions.length} Answered`;
                    });

                    document.getElementById('quizForm').addEventListener('submit', (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        let score = 0;
                        
                        questions.forEach((q, index) => {
                            const userAnswer = formData.get(`q${index}`);
                            if (userAnswer === q.answer) {
                                score++;
                            }
                        });

                        document.getElementById('quizForm').classList.add('hidden');
                        document.getElementById('resultsContainer').classList.remove('hidden');
                        document.getElementById('resultsText').innerText = `You scored ${score} out of ${questions.length}!`;
                    });

                } else {
                    document.getElementById('loadingContainer').innerHTML = "<p class='text-red-500 font-bold'>Failed to load quiz.</p>";
                }
            } catch (error) {
                console.error(error);
                document.getElementById('loadingContainer').innerHTML = "<p class='text-red-500 font-bold'>Error communicating with AI server.</p>";
            }
        });