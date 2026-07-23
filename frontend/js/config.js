// Global Configuration
const CONFIG = {
    API_BASE_URL: 'http://localhost:8000'
};

// Global Toast System
window.showToast = function(message, type = 'error') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 p-4 rounded shadow-[4px_4px_0_#111827] border-2 border-[#111827] z-[100] transition-opacity duration-300 ${type === 'error' ? 'bg-[#DC2626] text-white' : 'bg-[#16A34A] text-white'}`;
    toast.innerHTML = `<p class="font-bold font-sans">${message}</p>`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Override native alert for seamless integration
window.alert = window.showToast;
