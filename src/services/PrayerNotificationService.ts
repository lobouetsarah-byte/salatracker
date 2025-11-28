import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Prayer } from '@/hooks/usePrayerTimes';
import { permissionService } from './PermissionService';

interface PrayerStatus {
  [key: string]: boolean;
}

/**
 * Service de notifications pour les prières
 *
 * Règles:
 * 1. UNE notification par prière à l'heure exacte avec son d'adhan
 * 2. UN rappel 30 min avant la prochaine prière SI la précédente n'est pas faite
 * 3. Planification UNE FOIS par jour (pas à chaque render)
 * 4. Un seul toggle dans Paramètres pour activer/désactiver
 */
class PrayerNotificationService {
  private static instance: PrayerNotificationService;
  private lastScheduledDate: string = '';
  private isScheduling: boolean = false;

  // IDs fixes pour éviter les doublons
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
   * Vérifie si les notifications sont activées
   */
  areNotificationsEnabled(): boolean {
    const enabled = localStorage.getItem('notifications_enabled');
    return enabled === 'true';
  }

  /**
   * Active ou désactive toutes les notifications
   */
  async setNotificationsEnabled(enabled: boolean): Promise<void> {
    const wasEnabled = this.areNotificationsEnabled();
    localStorage.setItem('notifications_enabled', enabled.toString());

    // Si on désactive, annuler toutes les notifications
    if (!enabled && wasEnabled) {
      await this.cancelAllNotifications();
    }
  }

  /**
   * Vérifie si on a les permissions pour les notifications
   */
  async checkPermissions(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return true; // Web n'a pas besoin de permission explicite
    }

    try {
      const result = await LocalNotifications.checkPermissions();
      return result.display === 'granted';
    } catch (error) {
      // Silent - ce n'est pas une erreur critique
      return false;
    }
  }

  /**
   * Demande les permissions de notification
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
      console.error('Erreur lors de la demande de permission pour les notifications:', error);
      return false;
    }
  }

  /**
   * Annule toutes les notifications planifiées
   */
  async cancelAllNotifications(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      const pending = await LocalNotifications.getPending();

      if (pending.notifications.length > 0) {
        const ids = pending.notifications.map(n => n.id);
        await LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });
      }

      // Réinitialiser la date de planification
      this.lastScheduledDate = '';
      localStorage.removeItem('last_notification_schedule_date');
    } catch (error) {
      console.error('Erreur lors de l\'annulation des notifications:', error);
    }
  }

  /**
   * Force une nouvelle planification (efface le cache)
   */
  forceReschedule(): void {
    this.lastScheduledDate = '';
    localStorage.removeItem('last_notification_schedule_date');
  }

  /**
   * Fonction principale de planification
   *
   * Planifie uniquement si:
   * - Les notifications sont activées
   * - Pas déjà planifiées aujourd'hui
   * - Les permissions sont accordées
   */
  async schedulePrayerNotifications(
    prayers: Prayer[],
    prayerStatuses: PrayerStatus
  ): Promise<void> {
    // Vérifier si les notifications sont activées
    if (!this.areNotificationsEnabled()) {
      return; // Silencieux si désactivées
    }

    // Empêcher la planification concurrente
    if (this.isScheduling) {
      return;
    }

    // Vérifier si déjà planifiées aujourd'hui
    const today = new Date().toDateString();
    if (this.lastScheduledDate === today) {
      return; // Déjà fait, pas besoin de log répétitif
    }

    this.isScheduling = true;

    try {
      // Vérifier les permissions
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        this.isScheduling = false;
        return;
      }

      // Plateforme native uniquement
      if (!Capacitor.isNativePlatform()) {
        this.isScheduling = false;
        return;
      }

      // Log unique: début de planification
      console.log(`📅 Planification des notifications de prière pour ${today}`);

      // Annuler les notifications existantes d'abord
      await this.cancelAllNotifications();

      const notifications: any[] = [];
      const now = new Date();
      const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

      // Planifier les notifications de prière (une par prière)
      for (let i = 0; i < prayers.length && i < 5; i++) {
        const prayer = prayers[i];
        const prayerName = prayerNames[i];
        const prayerTime = this.parseTime(prayer.time);

        // Planifier uniquement si l'heure est dans le futur
        if (prayerTime > now) {
          const notification = {
            id: this.PRAYER_NOTIFICATION_IDS[prayerName as keyof typeof this.PRAYER_NOTIFICATION_IDS],
            title: `${prayer.arabicName} - ${prayer.name}`,
            body: `C'est l'heure de la prière ${prayer.name}`,
            schedule: { at: prayerTime },
            sound: 'adhan.mp3',
            actionTypeId: 'PRAYER_TIME',
            extra: {
              prayerName: prayer.name,
            },
          };

          notifications.push(notification);
        }
      }

      // Planifier les rappels (30 min avant la prochaine prière, seulement si la précédente n'est pas faite)
      for (let i = 0; i < prayers.length - 1 && i < 4; i++) {
        const nextPrayer = prayers[i + 1];
        const currentPrayerName = prayerNames[i];
        const nextPrayerName = prayerNames[i + 1];

        // Vérifier si la prière actuelle n'est PAS faite
        const isPrayerDone = prayerStatuses[currentPrayerName];

        if (!isPrayerDone) {
          const nextPrayerTime = this.parseTime(nextPrayer.time);
          const reminderTime = new Date(nextPrayerTime.getTime() - 30 * 60 * 1000);

          // Planifier uniquement si l'heure du rappel est dans le futur
          if (reminderTime > now) {
            const notification = {
              id: this.REMINDER_NOTIFICATION_IDS[nextPrayerName as keyof typeof this.REMINDER_NOTIFICATION_IDS],
              title: `Rappel - ${nextPrayer.name}`,
              body: `La prière ${currentPrayerName} n'a pas été enregistrée. Prochaine prière dans 30 minutes.`,
              schedule: { at: reminderTime },
              sound: undefined, // Pas d'adhan pour les rappels
              actionTypeId: 'PRAYER_REMINDER',
              extra: {
                prayerName: nextPrayer.name,
              },
            };

            notifications.push(notification);
          }
        }
      }

      // Planifier toutes les notifications
      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
        console.log(`✅ ${notifications.length} notifications planifiées avec succès`);
      } else {
        console.log('ℹ️ Aucune notification à planifier (toutes les prières sont passées)');
      }

      // Marquer comme planifiées pour aujourd'hui
      this.lastScheduledDate = today;
      localStorage.setItem('last_notification_schedule_date', today);
    } catch (error) {
      console.error('❌ Erreur lors de la planification des notifications:', error);
    } finally {
      this.isScheduling = false;
    }
  }

  /**
   * Parse une heure (HH:MM) en objet Date pour aujourd'hui
   */
  private parseTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
}

export const prayerNotificationService = PrayerNotificationService.getInstance();
