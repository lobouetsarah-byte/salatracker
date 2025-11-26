import { useEffect, useRef } from 'react';
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

export const usePrayerNotificationsManager = ({
  prayers,
  prayerStatuses,
  enabled,
}: UsePrayerNotificationsManagerProps) => {
  const hasScheduledRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      prayerNotificationService.cancelAllNotifications();
      hasScheduledRef.current = false;
      return;
    }

    if (!prayers || prayers.length === 0) {
      return;
    }

    // Only schedule once when prayers become available
    if (!hasScheduledRef.current) {
      const scheduleNotifications = async () => {
        const hasPermission = await prayerNotificationService.checkPermissions();

        if (!hasPermission) {
          const granted = await prayerNotificationService.requestPermissions(true);
          if (!granted) {
            return;
          }
        }

        await prayerNotificationService.schedulePrayerNotifications(prayers, prayerStatuses);
        hasScheduledRef.current = true;
      };

      scheduleNotifications();
    }
  }, [prayers, enabled]); // Removed prayerStatuses from dependencies to prevent re-scheduling

  // Separate effect for when prayer status changes - force reschedule
  useEffect(() => {
    if (!enabled || !prayers || prayers.length === 0) {
      return;
    }

    // When a prayer status changes, force a reschedule
    const reschedule = async () => {
      prayerNotificationService.forceReschedule();
      await prayerNotificationService.schedulePrayerNotifications(prayers, prayerStatuses);
    };

    // Debounce to avoid too many reschedules
    const timer = setTimeout(reschedule, 1000);
    return () => clearTimeout(timer);
  }, [prayerStatuses]);
};
