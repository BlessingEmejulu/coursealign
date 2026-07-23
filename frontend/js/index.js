// Register Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('../sw.js')
                    .then(registration => console.log('SW registered:', registration))
                    .catch(error => console.error('SW registration failed:', error));
            });
        }

        // PWA Install Prompt Logic
        let deferredPrompt;
        const installBanner = document.getElementById('pwa-install-banner');
        const installBtn = document.getElementById('pwa-install-btn');
        const dismissBtn = document.getElementById('pwa-dismiss-btn');

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt = e;
            
            // Show the custom banner
            installBanner.classList.remove('hidden');
            // Small delay to allow the element to become visible before translating
            setTimeout(() => {
                installBanner.classList.remove('translate-y-full');
            }, 10);
        });

        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Show the browser prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                // We've used the prompt, and can't use it again, throw it away
                deferredPrompt = null;
            }
            // Hide the banner
            installBanner.classList.add('translate-y-full');
            setTimeout(() => installBanner.classList.add('hidden'), 300);
        });

        dismissBtn.addEventListener('click', () => {
            // Hide the banner without installing
            installBanner.classList.add('translate-y-full');
            setTimeout(() => installBanner.classList.add('hidden'), 300);
        });