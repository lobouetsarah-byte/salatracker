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

/**
 * Hook to manage prayer notifications
 *
 * Flow:
 * 1. When enabled changes to TRUE: Request permission once, then schedule
 * 2. When enabled changes to FALSE: Cancel all notifications
 * 3. When prayers update: Re-schedule if enabled (service prevents duplicates)
 * 4. Never loops - uses debouncing and service-level caching
 */
export const usePrayerNotificationsManager = ({
  prayers,
  prayerStatuses,
  enabled,
}: UsePrayerNotificationsManagerProps) => {
  const permissionRequested = useRef(false);
  const lastEnabled = useRef(enabled);

  useEffect(() => {
    const manageNotifications = async () => {
      // Update enabled state in service (always sync)
      await prayerNotificationService.setNotificationsEnabled(enabled);

      // If disabled, stop here (service already canceled notifications)
      if (!enabled) {
        permissionRequested.current = false; // Reset for next enable
        lastEnabled.current = false;
        return;
      }

      // If no prayers yet, wait
      if (!prayers || prayers.length === 0) {
        return;
      }

      // Check if we need to request permission (only once when first enabled)
      const hasPermission = await prayerNotificationService.checkPermissions();

      if (!hasPermission && !permissionRequested.current) {
        permissionRequested.current = true;

        // Request permission with French explanation
        const granted = await prayerNotificationService.requestPermissions(true);

        if (!granted) {
          return; // User denied, stop here
        }
      }

      // Schedule notifications
      // Service handles: once-per-day logic, duplicate prevention, etc.
      await prayerNotificationService.schedulePrayerNotifications(prayers, prayerStatuses);

      lastEnabled.current = enabled;
    };

    manageNotifications();
  }, [prayers, prayerStatuses, enabled]);
};
