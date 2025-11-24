import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Prayer } from '@/hooks/usePrayerTimes';

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

  private constructor() {
    this.loadSettings();
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

  async requestPermissions(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    }

    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  async checkPermissions(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return 'Notification' in window && Notification.permission === 'granted';
    }

    try {
      const result = await LocalNotifications.checkPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  }

  updateSettings(settings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.saveSettings();
  }

  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  private parseTime(timeString: string): { hours: number; minutes: number } {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }

  private getDateTimeForPrayer(prayerTime: string): Date {
    const { hours, minutes } = this.parseTime(prayerTime);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    if (date < new Date()) {
      date.setDate(date.getDate() + 1);
    }

    return date;
  }

  async schedulePrayerNotifications(prayers: Prayer[], prayerStatuses: PrayerStatus): Promise<void> {
    if (!this.settings.prayerNotificationsEnabled) {
      return;
    }

    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      const granted = await this.requestPermissions();
      if (!granted) {
        return;
      }
    }

    await this.cancelAllNotifications();

    const notifications: ScheduleOptions[] = [];
    const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    for (let i = 0; i < prayers.length; i++) {
      const prayer = prayers[i];
      const prayerDate = this.getDateTimeForPrayer(prayer.time);

      if (prayerDate > new Date()) {
        notifications.push({
          id: i + 1,
          title: `${prayer.arabicName} - ${prayer.name}`,
          body: `C'est l'heure de la prière ${prayer.name}`,
          schedule: { at: prayerDate },
          sound: this.settings.adhanSoundEnabled ? 'adhan.mp3' : undefined,
          actionTypeId: 'PRAYER_NOTIFICATION',
          extra: {
            prayerName: prayer.name,
          },
        });

        if (i < prayers.length - 1) {
          const previousPrayerDone = prayerStatuses[prayerNames[i]];

          if (!previousPrayerDone) {
            const nextPrayer = prayers[i + 1];
            const nextPrayerDate = this.getDateTimeForPrayer(nextPrayer.time);
            const reminderDate = new Date(nextPrayerDate.getTime() - 30 * 60 * 1000);

            if (reminderDate > new Date()) {
              notifications.push({
                id: 100 + i + 1,
                title: 'Rappel de prière',
                body: `Vous n'avez pas encore accompli la prière ${prayer.name}. La prochaine prière (${nextPrayer.name}) est dans 30 minutes.`,
                schedule: { at: reminderDate },
                actionTypeId: 'REMINDER_NOTIFICATION',
                extra: {
                  previousPrayer: prayer.name,
                  nextPrayer: nextPrayer.name,
                },
              });
            }
          }
        }
      }
    }

    if (notifications.length === 0) {
      return;
    }

    if (Capacitor.isNativePlatform()) {
      try {
        await LocalNotifications.schedule({ notifications });
      } catch (error) {
        console.error('Error scheduling notifications:', error);
      }
    } else {
      console.log('Web: Would schedule notifications:', notifications);
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
      }
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  async updateNotificationsForPrayerStatus(
    prayers: Prayer[],
    prayerStatuses: PrayerStatus
  ): Promise<void> {
    await this.schedulePrayerNotifications(prayers, prayerStatuses);
  }
}

export const prayerNotificationService = PrayerNotificationService.getInstance();
