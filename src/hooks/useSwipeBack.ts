import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

export const useSwipeBack = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping = touchStartX < 50;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwiping) return;

      const touchCurrentX = e.touches[0].clientX;
      const touchCurrentY = e.touches[0].clientY;
      const deltaX = touchCurrentX - touchStartX;
      const deltaY = Math.abs(touchCurrentY - touchStartY);

      if (deltaX > 100 && deltaY < 50) {
        const canGoBack = window.history.length > 1 &&
                         location.pathname !== '/' &&
                         location.pathname !== '/onboarding';

        if (canGoBack) {
          navigate(-1);
          isSwiping = false;
        }
      }
    };

    const handleTouchEnd = () => {
      isSwiping = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigate, location]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const handleBackButton = () => {
      const canGoBack = window.history.length > 1 &&
                       location.pathname !== '/' &&
                       location.pathname !== '/onboarding';

      if (canGoBack) {
        navigate(-1);
      } else {
        (window as any).navigator.app?.exitApp();
      }
    };

    document.addEventListener('backbutton', handleBackButton);

    return () => {
      document.removeEventListener('backbutton', handleBackButton);
    };
  }, [navigate, location]);
};
