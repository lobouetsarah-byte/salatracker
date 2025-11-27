import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Prayer } from '@/hooks/usePrayerTimes';
import { permissionService } from './PermissionService';

interface PrayerStatus {
  [key: string]: boolean;
}

/**
 * Prayer Notification Service
 *
 * Rules:
 * 1. ONE notification per prayer at exact prayer time with Adhan sound
 * 2. ONE reminder 30 min before next prayer ONLY if previous prayer not marked done
 * 3. Schedule ONCE per day (not on every render/page change)
 * 4. Single toggle in Settings to enable/disable all notifications
 */
class PrayerNotificationService {
  private static instance: PrayerNotificationService;
  private lastScheduledDate: string = '';
  private isScheduling: boolean = false;

  // Notification IDs (fixed to prevent duplicates)
  private readonly PRAYER_NOTIFICATION_IDS = {
    Fajr: 1,
    Dhuhr: 2,
    Asr: 3,
    Maghrib: 4,
    Isha: 5,
  };

  private readonly REMINDER_NOTIFICATION_IDS = {
    Fajr: 101,
    Dhuhr: 102,
    Asr: 103,
    Maghrib: 104,
    Isha: 105,
  };

  private constructor() {
    this.lastScheduledDate = localStorage.getItem('last_notification_schedule_date') || '';
  }

  static getInstance(): PrayerNotificationService {
    if (!PrayerNotificationService.instance) {
      PrayerNotificationService.instance = new PrayerNotificationService();
    }
    return PrayerNotificationService.instance;
  }

  /**
   * Check if notifications are enabled
   */
  areNotificationsEnabled(): boolean {
    const enabled = localStorage.getItem('notifications_enabled');
    return enabled === 'true';
  }

  /**
   * Enable or disable all notifications
   */
  async setNotificationsEnabled(enabled: boolean): Promise<void> {
    localStorage.setItem('notifications_enabled', enabled.toString());

    if (!enabled) {
      // Cancel all notifications when disabled
      await this.cancelAllNotifications();
    }
  }

  /**
   * Check if we have notification permissions
   */
  async checkPermissions(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return true; // Web doesn't need explicit permission check
    }

    try {
      const result = await LocalNotifications.checkPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(showExplanation: boolean = false): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return true;
    }

    try {
      if (showExplanation) {
        const granted = await permissionService.requestNotificationPermission();
        return granted;
      }

      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      // Get all pending notifications
      const pending = await LocalNotifications.getPending();

      if (pending.notifications.length > 0) {
        const ids = pending.notifications.map(n => n.id);
        await LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });
        console.log('Cancelled all notifications:', ids);
      }

      // Clear last scheduled date
      this.lastScheduledDate = '';
      localStorage.removeItem('last_notification_schedule_date');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
    }
  }

  /**
   * Force reschedule (clear cache)
   */
  forceReschedule(): void {
    this.lastScheduledDate = '';
    localStorage.removeItem('last_notification_schedule_date');
  }

  /**
   * Main scheduling function
   * Only schedules if:
   * - Notifications are enabled
   * - Not already scheduled today
   * - Has permissions
   */
  async schedulePrayerNotifications(
    prayers: Prayer[],
    prayerStatuses: PrayerStatus
  ): Promise<void> {
    // Check if notifications are enabled
    if (!this.areNotificationsEnabled()) {
      console.log('Notifications disabled, skipping schedule');
      return;
    }

    // Prevent concurrent scheduling
    if (this.isScheduling) {
      console.log('Already scheduling, skipping...');
      return;
    }

    // Check if already scheduled today
    const today = new Date().toDateString();
    if (this.lastScheduledDate === today) {
      console.log('Already scheduled for today:', today);
      return;
    }

    this.isScheduling = true;

    try {
      // Check permissions
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        console.log('No notification permission');
        this.isScheduling = false;
        return;
      }

      if (!Capacitor.isNativePlatform()) {
        console.log('Not on native platform, skipping native notifications');
        this.isScheduling = false;
        return;
      }

      console.log('Scheduling notifications for today:', today);

      // Cancel existing notifications first
      await this.cancelAllNotifications();

      const notifications: any[] = [];
      const now = new Date();
      const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

      // Schedule prayer time notifications (one per prayer)
      for (let i = 0; i < prayers.length && i < 5; i++) {
        const prayer = prayers[i];
        const prayerName = prayerNames[i];
        const prayerTime = this.parseTime(prayer.time);

        // Only schedule if time is in the future
        if (prayerTime > now) {
          const notification = {
            id: this.PRAYER_NOTIFICATION_IDS[prayerName as keyof typeof this.PRAYER_NOTIFICATION_IDS],
            title: `${prayer.arabicName} - ${prayer.name}`,
            body: `C'est l'heure de la prière ${prayer.name}`,
            schedule: { at: prayerTime },
            sound: 'adhan.mp3', // Will work on both iOS and Android
            actionTypeId: 'PRAYER_TIME',
            extra: {
              prayerName: prayer.name,
            },
          };

          notifications.push(notification);
          console.log(`Scheduled ${prayerName} prayer at ${prayerTime.toLocaleTimeString()}`);
        }
      }

      // Schedule reminder notifications (30 min before next prayer, only if previous not done)
      for (let i = 0; i < prayers.length - 1 && i < 4; i++) {
        const nextPrayer = prayers[i + 1];
        const currentPrayerName = prayerNames[i];
        const nextPrayerName = prayerNames[i + 1];

        // Check if current prayer is NOT done
        const isPrayerDone = prayerStatuses[currentPrayerName];

        if (!isPrayerDone) {
          const nextPrayerTime = this.parseTime(nextPrayer.time);
          const reminderTime = new Date(nextPrayerTime.getTime() - 30 * 60 * 1000); // 30 min before

          // Only schedule if reminder time is in the future
          if (reminderTime > now) {
            const notification = {
              id: this.REMINDER_NOTIFICATION_IDS[nextPrayerName as keyof typeof this.REMINDER_NOTIFICATION_IDS],
              title: `Rappel - ${nextPrayer.name}`,
              body: `La prière ${currentPrayerName} n'a pas été enregistrée. Prochaine prière dans 30 minutes.`,
              schedule: { at: reminderTime },
              sound: undefined, // No Adhan for reminders
              actionTypeId: 'PRAYER_REMINDER',
              extra: {
                prayerName: nextPrayer.name,
              },
            };

            notifications.push(notification);
            console.log(`Scheduled reminder for ${nextPrayerName} at ${reminderTime.toLocaleTimeString()}`);
          }
        }
      }

      // Schedule all notifications
      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
        console.log(`Successfully scheduled ${notifications.length} notifications`);
      }

      // Mark as scheduled for today
      this.lastScheduledDate = today;
      localStorage.setItem('last_notification_schedule_date', today);
    } catch (error) {
      console.error('Error scheduling prayer notifications:', error);
    } finally {
      this.isScheduling = false;
    }
  }

  /**
   * Parse time string (HH:MM) to Date object for today
   */
  private parseTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
}

export const prayerNotificationService = PrayerNotificationService.getInstance();
