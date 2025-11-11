// PWA Service Worker Registration and Install Prompt
class CourseAlignPWA {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupInstallButton();
    }

    // Register Service Worker
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });
                
                console.log('CourseAlign PWA: ServiceWorker registered successfully:', registration.scope);
                
                // Handle service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('CourseAlign PWA: New service worker found');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('CourseAlign PWA: New content is available, refresh to update');
                            this.showUpdatePrompt();
                        }
                    });
                });

            } catch (error) {
                console.error('CourseAlign PWA: ServiceWorker registration failed:', error);
            }
        } else {
            console.log('CourseAlign PWA: Service Worker not supported');
        }
    }

    // Setup Install Prompt
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('CourseAlign PWA: Install prompt triggered');
            
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            
            // Show custom install prompt
            this.showInstallPrompt();
        });

        // Handle successful installation
        window.addEventListener('appinstalled', () => {
            console.log('CourseAlign PWA: App installed successfully');
            this.hideInstallPrompt();
            this.deferredPrompt = null;
        });
    }

    // Setup Install Button
    setupInstallButton() {
        const installBtn = document.getElementById('installBtn');
        const dismissBtn = document.getElementById('dismissBtn');

        if (installBtn) {
            installBtn.addEventListener('click', () => {
                this.installApp();
            });
        }

        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                this.hideInstallPrompt();
            });
        }
    }

    // Show Install Prompt
    showInstallPrompt() {
        const installPrompt = document.getElementById('installPrompt');
        if (installPrompt) {
            installPrompt.style.display = 'flex';
            installPrompt.classList.add('show');
        }
    }

    // Hide Install Prompt
    hideInstallPrompt() {
        const installPrompt = document.getElementById('installPrompt');
        if (installPrompt) {
            installPrompt.classList.remove('show');
            setTimeout(() => {
                installPrompt.style.display = 'none';
            }, 300);
        }
    }

    // Install App
    async installApp() {
        if (!this.deferredPrompt) {
            console.log('CourseAlign PWA: No install prompt available');
            return;
        }

        // Show the install prompt
        this.deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`CourseAlign PWA: User response to install prompt: ${outcome}`);

        // Clear the deferredPrompt
        this.deferredPrompt = null;
        this.hideInstallPrompt();
    }

    // Show Update Prompt
    showUpdatePrompt() {
        if (confirm('New version of CourseAlign is available! Refresh to update?')) {
            window.location.reload();
        }
    }

    // Check if app is installed
    isInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true;
    }

    // Get installation status
    getInstallationStatus() {
        if (this.isInstalled()) {
            return 'installed';
        } else if (this.deferredPrompt) {
            return 'installable';
        } else {
            return 'not-installable';
        }
    }

    // Request persistent storage (for offline data)
    async requestPersistentStorage() {
        if ('storage' in navigator && 'persist' in navigator.storage) {
            try {
                const isPersistent = await navigator.storage.persist();
                console.log(`CourseAlign PWA: Persistent storage: ${isPersistent}`);
                return isPersistent;
            } catch (error) {
                console.error('CourseAlign PWA: Persistent storage request failed:', error);
                return false;
            }
        }
        return false;
    }

    // Get storage quota
    async getStorageQuota() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate();
                console.log('CourseAlign PWA: Storage estimate:', estimate);
                return estimate;
            } catch (error) {
                console.error('CourseAlign PWA: Storage estimate failed:', error);
                return null;
            }
        }
        return null;
    }
}

// Initialize PWA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const courseAlignPWA = new CourseAlignPWA();
    
    // Make PWA instance globally available
    window.courseAlignPWA = courseAlignPWA;
});

// Add CSS for install prompt
const installPromptCSS = `
.install-prompt {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.install-prompt.show {
    opacity: 1;
}

.install-content {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    max-width: 400px;
    margin: 1rem;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.install-content h3 {
    color: #0097DC;
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.install-content p {
    color: #666;
    margin-bottom: 1.5rem;
    line-height: 1.5;
}

.install-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.install-btn, .dismiss-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 25px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.install-btn {
    background: linear-gradient(135deg, #0097DC, #00bcd4);
    color: white;
}

.install-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 151, 220, 0.3);
}

.dismiss-btn {
    background: #f5f5f5;
    color: #666;
}

.dismiss-btn:hover {
    background: #e0e0e0;
}

@media (max-width: 480px) {
    .install-buttons {
        flex-direction: column;
    }
    
    .install-btn, .dismiss-btn {
        width: 100%;
    }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = installPromptCSS;
document.head.appendChild(style);