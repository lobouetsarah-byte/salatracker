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
  const lastStatusRef = useRef<string>('');

  useEffect(() => {
    if (!enabled) {
      prayerNotificationService.cancelAllNotifications();
      hasScheduledRef.current = false;
      lastStatusRef.current = '';
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
        lastStatusRef.current = JSON.stringify(prayerStatuses);
      };

      scheduleNotifications();
    } else {
      // Check if prayer status actually changed
      const currentStatus = JSON.stringify(prayerStatuses);
      if (currentStatus !== lastStatusRef.current) {
        lastStatusRef.current = currentStatus;

        // Debounce reschedule
        const timer = setTimeout(async () => {
          prayerNotificationService.forceReschedule();
          await prayerNotificationService.schedulePrayerNotifications(prayers, prayerStatuses);
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [prayers, prayerStatuses, enabled]);
};
