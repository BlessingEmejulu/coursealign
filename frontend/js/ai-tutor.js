document.addEventListener('DOMContentLoaded', async () => {
            const token = localStorage.getItem('token');
            if (!token) window.location.href = 'login.html';

            // Fetch courses to populate dropdown
            try {
                const res = await fetch(CONFIG.API_BASE_URL + '/api/courses/');
                if (res.ok) {
                    const courses = await res.json();
                    const select = document.getElementById('courseContext');
                    courses.forEach(c => {
                        const opt = document.createElement('option');
                        opt.value = c.id;
                        opt.textContent = c.code;
                        select.appendChild(opt);
                    });
                }
            } catch(e) {
                console.error("Failed to fetch courses for context", e);
            }
        });

        document.getElementById('chatForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = e.target.querySelector('input');
            const userText = input.value.trim();
            const courseId = document.getElementById('courseContext').value;
            
            if (userText) {
                const main = document.querySelector('main');
                const html = `
                    <div class="flex items-start gap-4 w-full flex-row-reverse mt-4 animate-fade-in">
                        <div class="w-10 h-10 rounded-full bg-secondary flex-shrink-0 border-2 border-text flex items-center justify-center font-bold text-white">Me</div>
                        <div class="doodle-border p-4 bg-blue-50 max-w-[80%]">
                            <p>${userText}</p>
                        </div>
                    </div>
                `;
                main.insertAdjacentHTML('beforeend', html);
                input.value = '';
                main.scrollTop = main.scrollHeight;
                
                // Add loading indicator
                const loaderId = 'loader-' + Date.now();
                const loadingHtml = `
                <div id="${loaderId}" class="flex items-start gap-4 w-full mt-4">
                    <div class="w-10 h-10 rounded-full bg-primary flex-shrink-0 border-2 border-text flex items-center justify-center font-bold text-white">AI</div>
                    <div class="doodle-border p-4 bg-surface max-w-[80%] text-gray-500 italic">
                        Thinking...
                    </div>
                </div>`;
                main.insertAdjacentHTML('beforeend', loadingHtml);
                main.scrollTop = main.scrollHeight;

                try {
                    const token = localStorage.getItem('token');
                    const payload = {
                        content: userText,
                        course_id: courseId ? parseInt(courseId) : null
                    };
                    
                    const res = await fetch(CONFIG.API_BASE_URL + '/api/ai/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(payload)
                    });
                    
                    document.getElementById(loaderId).remove();
                    
                    if (res.ok) {
                        const data = await res.json();
                        const aiHtml = `
                        <div class="flex items-start gap-4 w-full mt-4">
                            <div class="w-10 h-10 rounded-full bg-primary flex-shrink-0 border-2 border-text flex items-center justify-center font-bold text-white">AI</div>
                            <div class="doodle-border p-4 bg-surface max-w-[80%] whitespace-pre-wrap">
                                ${data.content}
                            </div>
                        </div>
                        `;
                        main.insertAdjacentHTML('beforeend', aiHtml);
                    } else {
                        const err = await res.json();
                        alert(err.detail || "Error communicating with AI");
                    }
                } catch (error) {
                    console.error("AI chat error", error);
                    document.getElementById(loaderId)?.remove();
                    alert("Failed to connect to the backend.");
                }
                
                main.scrollTop = main.scrollHeight;
            }
        });