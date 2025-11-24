import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { badgeService } from '@/services/BadgeService';

export const useBadgeChecker = () => {
  const { user } = useAuth();

  const checkBadges = async () => {
    if (!user) return;

    try {
      const stats = await badgeService.calculateUserStats(user.id);
      await badgeService.checkAndAwardBadges(user.id, stats);
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  };

  useEffect(() => {
    if (user) {
      checkBadges();
    }
  }, [user]);

  return { checkBadges };
};
