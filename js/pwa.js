/**
 * PWA Controller & Mobile Installation Engine
 * Registers Service Worker, manages Install Prompts, and provides offline notifications.
 */

(function () {
  'use strict';

  let deferredInstallPrompt = null;

  // 1. Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered successfully with scope:', reg.scope);
          
          // Check for service worker updates
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] New version available. Refresh to update.');
                }
              };
            }
          };
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }

  // 2. Intercept beforeinstallprompt for native-feeling mobile install experience
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    console.log('[PWA] Install prompt intercepted and ready');

    // Display the custom install prompt banner if on mobile or not dismissed
    showInstallBanner();
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Application was successfully installed by user');
    deferredInstallPrompt = null;
    hideInstallBanner();
    if (window.showToast) {
      window.showToast('AMC Grievance Portal installed to your device!', 'success');
    }
  });

  // 3. Custom Install Banner Creation & Control
  function showInstallBanner() {
    if (sessionStorage.getItem('AMC_PWA_INSTALL_DISMISSED') === 'true') {
      return;
    }

    let banner = document.getElementById('pwa-install-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'pwa-install-banner';
      banner.className = 'pwa-install-shelf';
      banner.innerHTML = `
        <div class="pwa-install-card">
          <div class="pwa-install-icon">
            <img src="icons/icon-192.png" alt="AMC Emblem" width="36" height="36" style="border-radius: 8px;" />
          </div>
          <div class="pwa-install-text">
            <strong>Install AMC Grievance App</strong>
            <span>Add to home screen for faster civic reporting</span>
          </div>
          <div class="pwa-install-actions">
            <button type="button" id="pwa-install-btn" class="pwa-btn-install">
              <i class="fa-solid fa-download"></i> Install
            </button>
            <button type="button" id="pwa-dismiss-btn" class="pwa-btn-dismiss" title="Dismiss">✕</button>
          </div>
        </div>
      `;
      document.body.appendChild(banner);

      const installBtn = document.getElementById('pwa-install-btn');
      if (installBtn) {
        installBtn.addEventListener('click', triggerInstallPrompt);
      }

      const dismissBtn = document.getElementById('pwa-dismiss-btn');
      if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
          hideInstallBanner();
          sessionStorage.setItem('AMC_PWA_INSTALL_DISMISSED', 'true');
        });
      }
    }

    // Slide up banner
    requestAnimationFrame(() => {
      banner.classList.add('visible');
    });
  }

  function hideInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.classList.remove('visible');
    }
  }

  function triggerInstallPrompt() {
    if (!deferredInstallPrompt) {
      if (window.showToast) {
        window.showToast('To install, open browser menu and choose "Add to Home Screen".', 'info');
      }
      return;
    }

    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
      deferredInstallPrompt = null;
      hideInstallBanner();
    });
  }

  // Export install trigger globally
  window.triggerPwaInstall = triggerInstallPrompt;

  // 4. Online / Offline Connectivity Detection
  window.addEventListener('online', () => {
    if (window.showToast) {
      window.showToast('Back online! Syncing civic data...', 'success');
    }
  });

  window.addEventListener('offline', () => {
    if (window.showToast) {
      window.showToast('You are currently offline. Local tickets remain accessible.', 'info');
    }
  });

  // 5. PWA Shortcut Handling on Initial Load
  window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'report') {
      setTimeout(() => {
        const snapBtn = document.getElementById('sidebar-snap-report-btn') || document.getElementById('mobile-snap-btn');
        if (snapBtn) snapBtn.click();
      }, 500);
    } else if (params.get('view') === 'tracker') {
      setTimeout(() => {
        const trackerBtn = document.getElementById('nav-btn-tracker') || document.getElementById('mobile-nav-tracker');
        if (trackerBtn) trackerBtn.click();
      }, 500);
    }
  });
})();
