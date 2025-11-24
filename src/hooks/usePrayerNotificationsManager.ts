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

export const usePrayerNotificationsManager = ({
  prayers,
  prayerStatuses,
  enabled,
}: UsePrayerNotificationsManagerProps) => {
  useEffect(() => {
    if (!prayers || prayers.length === 0 || !enabled) {
      return;
    }

    const scheduleNotifications = async () => {
      const hasPermission = await prayerNotificationService.checkPermissions();

      if (!hasPermission) {
        const granted = await prayerNotificationService.requestPermissions(true);
        if (!granted) {
          return;
        }
      }

      await prayerNotificationService.schedulePrayerNotifications(prayers, prayerStatuses);
    };

    scheduleNotifications();
  }, [prayers, prayerStatuses, enabled]);

  useEffect(() => {
    if (!enabled) {
      prayerNotificationService.cancelAllNotifications();
    }
  }, [enabled]);
};
