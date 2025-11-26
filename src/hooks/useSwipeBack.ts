import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';

export const useSwipeBack = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // iOS edge swipe gesture
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
      // Only detect swipes from left edge (first 50px)
      isSwiping = touchStartX < 50;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwiping) return;

      const touchCurrentX = e.touches[0].clientX;
      const touchCurrentY = e.touches[0].clientY;
      const deltaX = touchCurrentX - touchStartX;
      const deltaY = Math.abs(touchCurrentY - touchStartY);

      // Horizontal swipe of at least 100px, with minimal vertical movement
      if (deltaX > 100 && deltaY < 50) {
        const canGoBack = window.history.length > 1 &&
                         location.pathname !== '/' &&
                         location.pathname !== '/onboarding' &&
                         location.pathname !== '/auth';

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

  // Android hardware back button
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let backButtonListener: any;

    const setupBackButton = async () => {
      try {
        backButtonListener = await CapApp.addListener('backButton', () => {
          const canGoBack = window.history.length > 1 &&
                           location.pathname !== '/' &&
                           location.pathname !== '/onboarding' &&
                           location.pathname !== '/auth';

          if (canGoBack) {
            navigate(-1);
          } else {
            // At root - exit app
            CapApp.exitApp();
          }
        });
      } catch (error) {
        console.log('Back button listener not available:', error);
      }
    };

    setupBackButton();

    return () => {
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, [navigate, location]);
};
