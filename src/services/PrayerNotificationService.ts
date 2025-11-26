import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Prayer } from '@/hooks/usePrayerTimes';
import { permissionService } from './PermissionService';

interface NotificationSettings {
  prayerNotificationsEnabled: boolean;
  adhanSoundEnabled: boolean;
}

interface PrayerStatus {
  [key: string]: boolean;
}

class PrayerNotificationService {
  private static instance: PrayerNotificationService;
  private settings: NotificationSettings = {
    prayerNotificationsEnabled: true,
    adhanSoundEnabled: true,
  };
  private lastScheduledDate: string = '';
  private isScheduling: boolean = false;

  private constructor() {
    this.loadSettings();
    this.lastScheduledDate = localStorage.getItem('last_notification_schedule_date') || '';
  }

  static getInstance(): PrayerNotificationService {
    if (!PrayerNotificationService.instance) {
      PrayerNotificationService.instance = new PrayerNotificationService();
    }
    return PrayerNotificationService.instance;
  }

  private loadSettings(): void {
    const stored = localStorage.getItem('prayer_notification_settings');
    if (stored) {
      try {
        this.settings = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to load notification settings:', e);
      }
    }
  }

  private saveSettings(): void {
    localStorage.setItem('prayer_notification_settings', JSON.stringify(this.settings));
  }

  async requestPermissions(showExplanation = false): Promise<boolean> {
    const result = await permissionService.requestNotificationPermission(showExplanation);
    return result.granted;
  }

  async checkPermissions(): Promise<boolean> {
    const result = await permissionService.checkNotificationPermission();
    return result.granted;
  }

  updateSettings(settings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.saveSettings();
    // Force reschedule when settings change
    this.lastScheduledDate = '';
    localStorage.removeItem('last_notification_schedule_date');
  }

  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  private parseTime(timeString: string): { hours: number; minutes: number } {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }

  private getDateTimeForPrayer(prayerTime: string, forToday = true): Date {
    const { hours, minutes } = this.parseTime(prayerTime);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    if (forToday && date < new Date()) {
      // Skip if already passed today
      return date;
    }

    return date;
  }

  async schedulePrayerNotifications(prayers: Prayer[], prayerStatuses: PrayerStatus): Promise<void> {
    if (!this.settings.prayerNotificationsEnabled) {
      await this.cancelAllNotifications();
      return;
    }

    // Prevent concurrent scheduling
    if (this.isScheduling) {
      console.log('Already scheduling, skipping...');
      return;
    }

    // Only schedule once per day
    const today = new Date().toISOString().split('T')[0];
    if (this.lastScheduledDate === today) {
      console.log('Already scheduled for today:', today);
      return;
    }

    this.isScheduling = true;

    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        console.log('No notification permission');
        this.isScheduling = false;
        return;
      }

      // Cancel all existing notifications first
      await this.cancelKnownNotifications();

      const notifications: ScheduleOptions[] = [];
      const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      const now = new Date();
      const nowPlus5Min = new Date(now.getTime() + 5 * 60 * 1000); // Add 5 min buffer

      // Schedule prayer time notifications (IDs 1-5)
      for (let i = 0; i < prayers.length && i < 5; i++) {
        const prayer = prayers[i];
        const prayerDate = this.getDateTimeForPrayer(prayer.time, true);

        // Only schedule if in the future (with buffer)
        if (prayerDate > nowPlus5Min) {
          const notificationConfig: any = {
            id: i + 1,
            title: `${prayer.arabicName} - ${prayer.name}`,
            body: `C'est l'heure de la prière ${prayer.name}`,
            schedule: { at: prayerDate },
            actionTypeId: 'PRAYER_NOTIFICATION',
            extra: {
              prayerName: prayer.name,
            },
          };

          // Add sound with correct platform-specific format
          if (this.settings.adhanSoundEnabled) {
            // iOS uses the filename without extension, Android needs full filename
            if (Capacitor.getPlatform() === 'ios') {
              notificationConfig.sound = 'adhan.wav';
            } else if (Capacitor.getPlatform() === 'android') {
              notificationConfig.sound = 'adhan.wav';
            }
          }

          notifications.push(notificationConfig);
        }
      }

      // Schedule reminder notifications (IDs 101-104) - only if previous prayer not done
      for (let i = 0; i < prayers.length - 1 && i < 4; i++) {
        const previousPrayerDone = prayerStatuses[prayerNames[i]];

        if (!previousPrayerDone) {
          const nextPrayer = prayers[i + 1];
          const nextPrayerDate = this.getDateTimeForPrayer(nextPrayer.time, true);
          const reminderDate = new Date(nextPrayerDate.getTime() - 30 * 60 * 1000);

          // Only schedule if in the future (with buffer)
          if (reminderDate > nowPlus5Min) {
            notifications.push({
              id: 101 + i,
              title: 'Rappel de prière',
              body: `Vous n'avez pas encore accompli la prière ${prayers[i].name}. La prochaine prière (${nextPrayer.name}) est dans 30 minutes.`,
              schedule: { at: reminderDate },
              actionTypeId: 'REMINDER_NOTIFICATION',
              extra: {
                previousPrayer: prayers[i].name,
                nextPrayer: nextPrayer.name,
              },
            });
          }
        }
      }

      if (notifications.length === 0) {
        console.log('No future notifications to schedule for today');
        this.lastScheduledDate = today;
        localStorage.setItem('last_notification_schedule_date', today);
        this.isScheduling = false;
        return;
      }

      if (Capacitor.isNativePlatform()) {
        try {
          await LocalNotifications.schedule({ notifications });
          console.log(`Scheduled ${notifications.length} notifications for today:`, notifications.map(n => n.id));
          this.lastScheduledDate = today;
          localStorage.setItem('last_notification_schedule_date', today);
        } catch (error) {
          console.error('Error scheduling notifications:', error);
        }
      } else {
        console.log('Web: Would schedule notifications:', notifications.map(n => ({ id: n.id, time: n.schedule })));
        this.lastScheduledDate = today;
        localStorage.setItem('last_notification_schedule_date', today);
      }
    } finally {
      this.isScheduling = false;
    }
  }

  private async cancelKnownNotifications(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      // Cancel known IDs: 1-5 (prayers) and 101-104 (reminders)
      const idsToCancel = [1, 2, 3, 4, 5, 101, 102, 103, 104];
      const notifications = idsToCancel.map(id => ({ id }));
      await LocalNotifications.cancel({ notifications });
      console.log('Cancelled known notification IDs:', idsToCancel);
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        const ids = pending.notifications.map(n => ({ id: n.id }));
        await LocalNotifications.cancel({ notifications: ids });
        console.log('Cancelled all pending notifications');
      }
      this.lastScheduledDate = '';
      localStorage.removeItem('last_notification_schedule_date');
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  forceReschedule(): void {
    this.lastScheduledDate = '';
    localStorage.removeItem('last_notification_schedule_date');
  }
}

export const prayerNotificationService = PrayerNotificationService.getInstance();
