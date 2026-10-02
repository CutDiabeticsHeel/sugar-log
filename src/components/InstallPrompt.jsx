import React, { useState, useEffect } from 'react';

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  
  useEffect(() => {
    if (window.deferredInstallPrompt) {
        setDeferredPrompt(window.deferredInstallPrompt);
        setShowInstall(true);
    }
    const handler = () => {
        setDeferredPrompt(window.deferredInstallPrompt);
        setShowInstall(true);
    };
    window.addEventListener('pwa-install-available', handler);
    return () => window.removeEventListener('pwa-install-available', handler);
   }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User choice: ${outcome}`);
    
    if (outcome === 'accepted') {
      console.log('PWA installation completed!');
    } else {
      console.log('PWA installation cancelled');
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) {
    return null;
  }
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      <button
        onClick={handleInstall}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '15px 30px',
          border: 'none',
          borderRadius: '25px',
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        📱 Скачать приложение
      </button>
    </div>
  );
}

export default InstallPrompt;