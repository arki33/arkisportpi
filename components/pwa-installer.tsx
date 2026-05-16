'use client';

import { useEffect } from 'react';

export function PWAInstaller() {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
      });
    }

    // Handle PWA installation
    let deferredPrompt: any;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;

      // You can show an install button here if needed
      // For now, PWA will install silently
    });

    window.addEventListener('appinstalled', () => {
      console.log('SPORTPI PWA installed successfully');
      deferredPrompt = null;
    });
  }, []);

  return null;
}
