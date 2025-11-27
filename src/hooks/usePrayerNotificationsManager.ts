import { useEffect } from 'react';
import { prayerNotificationService } from '@/services/PrayerNotificationService';
import { Prayer } from './usePrayerTimes';

interface PrayerStatus {
  [key: string]: boolean;
}

interface UsePrayerNotificationsManagerProps {
  prayers: Prayer[] | null;
  prayerStatuses: PrayerStatus;
  enabled: boolean;
}

/**
 * Hook to manage prayer notifications
 *
 * This hook ensures notifications are:
 * - Scheduled ONCE per day
 * - Only when enabled
 * - With proper permissions
 * - Never on loop
 */
export const usePrayerNotificationsManager = ({
  prayers,
  prayerStatuses,
  enabled,
}: UsePrayerNotificationsManagerProps) => {
  useEffect(() => {
    const scheduleNotifications = async () => {
      // Update enabled state in service
      await prayerNotificationService.setNotificationsEnabled(enabled);

      // Only schedule if enabled and prayers available
      if (!enabled) {
        console.log('Notifications disabled');
        return;
      }

      if (!prayers || prayers.length === 0) {
        console.log('No prayers available yet');
        return;
      }

      // Check permissions first
      const hasPermission = await prayerNotificationService.checkPermissions();

      if (!hasPermission) {
        // Request permission with explanation
        const granted = await prayerNotificationService.requestPermissions(true);
        if (!granted) {
          console.log('Notification permission not granted');
          return;
        }
      }

      // Schedule notifications (service handles once-per-day logic)
      await prayerNotificationService.schedulePrayerNotifications(prayers, prayerStatuses);
    };

    scheduleNotifications();
  }, [prayers, prayerStatuses, enabled]);
};
