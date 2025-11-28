import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Prayer } from '@/hooks/usePrayerTimes';

/**
 * Centralized Notification Manager
 *
 * Handles ALL notification logic in one place:
 * - Permission requests (once only)
 * - Scheduling (once per day)
 * - Cancellation
 * - State management
 *
 * NO MORE LOOPS!
 */

interface NotificationState {
  lastScheduledDate: string;
  notificationsEnabled: boolean;
  permissionGranted: boolean | null;
}

class NotificationManager {
  private static instance: NotificationManager;
  private state: NotificationState;
  private permissionRequested = false;
  private isScheduling = false;

  private constructor() {
    // Load state from localStorage
    const saved = localStorage.getItem('notification_state');
    this.state = saved ? JSON.parse(saved) : {
      lastScheduledDate: '',
      notificationsEnabled: false,
      permissionGranted: null,
    };
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  /**
   * Save state to localStorage
   */
  private saveState() {
    localStorage.setItem('notification_state', JSON.stringify(this.state));
  }

  /**
   * Check if we're on a native platform
   */
  private isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Check permission status (doesn't ask, just checks)
   */
  async checkPermission(): Promise<boolean> {
    if (!this.isNative()) {
      return true; // Web doesn't need explicit permission
    }

    try {
      const result = await LocalNotifications.checkPermissions();
      const granted = result.display === 'granted';
      this.state.permissionGranted = granted;
      this.saveState();
      return granted;
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      return false;
    }
  }

  /**
   * Request permission (ONCE only, not in loops)
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isNative()) {
      return true;
    }

    // Don't ask again if already requested
    if (this.permissionRequested) {
      return this.state.permissionGranted || false;
    }

    // Check current status first
    const hasPermission = await this.checkPermission();
    if (hasPermission) {
      this.permissionRequested = true;
      return true;
    }

    try {
      this.permissionRequested = true;
      const result = await LocalNotifications.requestPermissions();
      const granted = result.display === 'granted';

      this.state.permissionGranted = granted;
      this.saveState();

      console.log(granted ? '✅ Permissions accordées' : '❌ Permissions refusées');
      return granted;
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  }

  /**
   * Enable notifications (user toggle)
   */
  async enable(): Promise<boolean> {
    console.log('📲 Activation des notifications...');

    // Request permission if needed
    const hasPermission = await this.requestPermission();

    if (!hasPermission) {
      console.log('❌ Permissions refusées - notifications restent désactivées');
      this.state.notificationsEnabled = false;
      this.saveState();
      return false;
    }

    this.state.notificationsEnabled = true;
    this.saveState();
    console.log('✅ Notifications activées');
    return true;
  }

  /**
   * Disable notifications (user toggle)
   */
  async disable(): Promise<void> {
    console.log('🔕 Désactivation des notifications...');

    this.state.notificationsEnabled = false;
    this.state.lastScheduledDate = ''; // Reset scheduling
    this.saveState();

    // Cancel all scheduled notifications
    await this.cancelAll();
    console.log('✅ Notifications désactivées');
  }

  /**
   * Check if notifications are enabled
   */
  isEnabled(): boolean {
    return this.state.notificationsEnabled;
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAll(): Promise<void> {
    if (!this.isNative()) {
      return;
    }

    try {
      const pending = await LocalNotifications.getPending();

      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({
          notifications: pending.notifications.map(n => ({ id: n.id }))
        });
        console.log(`🗑️ ${pending.notifications.length} notifications annulées`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation des notifications:', error);
    }
  }

  /**
   * Schedule adhkar notifications
   * - Morning adhkar at 7 AM
   * - Evening adhkar at 6 PM
   */
  async scheduleAdhkarNotifications(): Promise<void> {
    if (!this.state.notificationsEnabled || !this.isNative()) {
      return;
    }

    const now = new Date();

    // Morning adhkar at 7 AM
    const morningTime = new Date();
    morningTime.setHours(7, 0, 0, 0);

    if (morningTime > now) {
      await LocalNotifications.schedule({
        notifications: [{
          id: 200,
          title: '☀️ Adhkar du Matin',
          body: '✨ C\'est le moment de faire vos adhkar du matin. Qu\'Allah vous récompense ! 🤲',
          schedule: { at: morningTime },
          sound: undefined,
          actionTypeId: 'ADHKAR_MORNING',
        }]
      });
    }

    // Evening adhkar at 6 PM
    const eveningTime = new Date();
    eveningTime.setHours(18, 0, 0, 0);

    if (eveningTime > now) {
      await LocalNotifications.schedule({
        notifications: [{
          id: 201,
          title: '🌙 Adhkar du Soir',
          body: '✨ C\'est le moment de faire vos adhkar du soir. Masha\'Allah ! 🤲',
          schedule: { at: eveningTime },
          sound: undefined,
          actionTypeId: 'ADHKAR_EVENING',
        }]
      });
    }
  }

  /**
   * Schedule prayer notifications for today
   * ONLY if:
   * - Notifications are enabled
   * - Not already scheduled today
   * - Has permission
   */
  async schedulePrayerNotifications(
    prayers: Prayer[],
    prayerStatuses: { [key: string]: boolean }
  ): Promise<void> {
    // Guard: Not enabled
    if (!this.state.notificationsEnabled) {
      return;
    }

    // Guard: Not native platform
    if (!this.isNative()) {
      return;
    }

    // Guard: No prayers
    if (!prayers || prayers.length === 0) {
      return;
    }

    // Guard: Already scheduling (prevent race conditions)
    if (this.isScheduling) {
      return;
    }

    // Guard: Already scheduled today
    const today = new Date().toDateString();
    if (this.state.lastScheduledDate === today) {
      return; // Silent - already done
    }

    // Guard: No permission
    const hasPermission = await this.checkPermission();
    if (!hasPermission) {
      console.log('⚠️ Pas de permission - planification ignorée');
      return;
    }

    this.isScheduling = true;

    try {
      console.log(`📅 Planification des notifications de prière pour ${today}`);

      // Cancel old notifications first
      await this.cancelAll();

      const notifications: any[] = [];
      const now = new Date();
      const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      const prayerEmojis = ['🌙', '☀️', '🌤️', '🌅', '🌃'];

      // Schedule prayer time notifications (with Adhan and emojis)
      for (let i = 0; i < Math.min(prayers.length, 5); i++) {
        const prayer = prayers[i];
        const prayerName = prayerNames[i];
        const emoji = prayerEmojis[i];
        const [hours, minutes] = prayer.time.split(':').map(Number);

        const prayerTime = new Date();
        prayerTime.setHours(hours, minutes, 0, 0);

        // Only schedule future prayers
        if (prayerTime > now) {
          notifications.push({
            id: i + 1,
            title: `${emoji} ${prayer.arabicName} - ${prayer.name}`,
            body: `🕌 C'est l'heure de la prière ${prayer.name}. Qu'Allah accepte votre prière ! 🤲`,
            schedule: { at: prayerTime },
            sound: 'adhan.mp3',
            actionTypeId: 'PRAYER_TIME',
            extra: { prayerName: prayer.name },
          });
        }
      }

      // Schedule reminders (30 min before next prayer, only if previous not done)
      for (let i = 0; i < Math.min(prayers.length - 1, 4); i++) {
        const currentPrayerName = prayerNames[i];
        const nextPrayer = prayers[i + 1];
        const nextPrayerName = prayerNames[i + 1];

        // Check if current prayer is NOT done
        const isPrayerDone = prayerStatuses[currentPrayerName];

        if (!isPrayerDone) {
          const [nextHours, nextMinutes] = nextPrayer.time.split(':').map(Number);
          const reminderTime = new Date();
          reminderTime.setHours(nextHours, nextMinutes - 30, 0, 0);

          // Only schedule future reminders
          if (reminderTime > now) {
            notifications.push({
              id: 100 + i + 1,
              title: `⏰ Rappel - ${nextPrayer.name}`,
              body: `La prière ${currentPrayerName} n'a pas été enregistrée. Prochaine prière dans 30 minutes. 🕌`,
              schedule: { at: reminderTime },
              sound: undefined,
              actionTypeId: 'PRAYER_REMINDER',
              extra: { prayerName: nextPrayer.name },
            });
          }
        }
      }

      // Schedule all notifications
      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
        console.log(`✅ ${notifications.length} prayer notifications planifiées`);
      } else {
        console.log('ℹ️ Aucune prayer notification à planifier (toutes passées)');
      }

      // Schedule adhkar notifications
      await this.scheduleAdhkarNotifications();
      console.log('✅ Adhkar notifications planifiées');

      // Mark as scheduled
      this.state.lastScheduledDate = today;
      this.saveState();
    } catch (error) {
      console.error('❌ Erreur lors de la planification:', error);
    } finally {
      this.isScheduling = false;
    }
  }

  /**
   * Force reschedule (when location or settings change)
   */
  forceReschedule(): void {
    this.state.lastScheduledDate = '';
    this.saveState();
  }

  /**
   * Get current state (for debugging)
   */
  getState(): NotificationState {
    return { ...this.state };
  }
}

// Export singleton instance
export const notificationManager = NotificationManager.getInstance();
