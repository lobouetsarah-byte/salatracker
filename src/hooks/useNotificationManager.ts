import { useEffect, useRef } from 'react';
import { notificationManager } from '@/lib/notificationManager';
import { Prayer } from './usePrayerTimes';

interface UseNotificationManagerProps {
  prayers: Prayer[] | null;
  prayerStatuses: { [key: string]: boolean };
  enabled: boolean;
}

/**
 * Unified notification hook
 *
 * This is the ONLY hook that should handle notifications.
 * All other notification hooks should be removed to prevent loops.
 */
export const useNotificationManager = ({
  prayers,
  prayerStatuses,
  enabled,
}: UseNotificationManagerProps) => {
  const previousEnabled = useRef(enabled);

  // Handle enable/disable toggle
  useEffect(() => {
    const handleToggle = async () => {
      // User just turned ON
      if (enabled && !previousEnabled.current) {
        const success = await notificationManager.enable();

        if (success && prayers) {
          // Schedule immediately after enabling
          await notificationManager.schedulePrayerNotifications(prayers, prayerStatuses);
        }
      }

      // User just turned OFF
      if (!enabled && previousEnabled.current) {
        await notificationManager.disable();
      }

      previousEnabled.current = enabled;
    };

    handleToggle();
  }, [enabled]);

  // Schedule notifications when prayers or statuses change (if enabled)
  useEffect(() => {
    const scheduleIfNeeded = async () => {
      if (!enabled) {
        return; // Don't schedule if disabled
      }

      if (!prayers || prayers.length === 0) {
        return; // No prayers yet
      }

      // Try to schedule (manager handles "already scheduled" check)
      await notificationManager.schedulePrayerNotifications(prayers, prayerStatuses);
    };

    scheduleIfNeeded();
  }, [prayers, prayerStatuses, enabled]);

  return {
    enable: () => notificationManager.enable(),
    disable: () => notificationManager.disable(),
    forceReschedule: () => notificationManager.forceReschedule(),
    isEnabled: () => notificationManager.isEnabled(),
  };
};
