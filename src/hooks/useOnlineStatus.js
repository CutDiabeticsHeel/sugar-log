import { useState, useEffect } from 'react';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      console.log('Internet connection restored!');
    }

    function handleOffline() {
      setIsOnline(false);
      console.log('Internet connection lost.');
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}

export default useOnlineStatus;