import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { notify } from '@/lib/notifications';

export type PermissionType = 'notifications' | 'location';

export interface PermissionResult {
  granted: boolean;
  denied: boolean;
  shouldShowRationale: boolean;
}

class PermissionService {
  private static instance: PermissionService;
  private notificationPermissionRequested = false;
  private locationPermissionRequested = false;

  private constructor() {}

  static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  async requestNotificationPermission(showExplanation = true): Promise<PermissionResult> {
    if (this.notificationPermissionRequested) {
      return this.checkNotificationPermission();
    }

    if (showExplanation) {
      return new Promise((resolve) => {
        notify.info(
          'Autorisation requise',
          'Autorisez les notifications pour recevoir les horaires de prière et les rappels.',
          {
            duration: 5000,
            action: {
              label: 'Autoriser',
              onClick: async () => {
                const result = await this.doRequestNotificationPermission();
                resolve(result);
              },
            },
          }
        );
      });
    }

    return this.doRequestNotificationPermission();
  }

  private async doRequestNotificationPermission(): Promise<PermissionResult> {
    this.notificationPermissionRequested = true;

    try {
      if (!Capacitor.isNativePlatform()) {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          return {
            granted: permission === 'granted',
            denied: permission === 'denied',
            shouldShowRationale: false,
          };
        }
        return { granted: false, denied: true, shouldShowRationale: false };
      }

      const result = await LocalNotifications.requestPermissions();
      const granted = result.display === 'granted';

      if (!granted) {
        notify.warning(
          'Notifications désactivées',
          'Vous pouvez activer les notifications dans les réglages de votre appareil pour ne manquer aucune prière.',
          { duration: 6000 }
        );
      }

      return {
        granted,
        denied: result.display === 'denied',
        shouldShowRationale: false,
      };
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return { granted: false, denied: false, shouldShowRationale: false };
    }
  }

  async checkNotificationPermission(): Promise<PermissionResult> {
    try {
      if (!Capacitor.isNativePlatform()) {
        if ('Notification' in window) {
          return {
            granted: Notification.permission === 'granted',
            denied: Notification.permission === 'denied',
            shouldShowRationale: false,
          };
        }
        return { granted: false, denied: true, shouldShowRationale: false };
      }

      const result = await LocalNotifications.checkPermissions();
      return {
        granted: result.display === 'granted',
        denied: result.display === 'denied',
        shouldShowRationale: false,
      };
    } catch (error) {
      console.error('Error checking notification permission:', error);
      return { granted: false, denied: false, shouldShowRationale: false };
    }
  }

  async requestLocationPermission(showExplanation = true): Promise<PermissionResult> {
    if (this.locationPermissionRequested) {
      return { granted: true, denied: false, shouldShowRationale: false };
    }

    if (showExplanation) {
      return new Promise((resolve) => {
        notify.info(
          'Localisation requise',
          'Autorisez l\'accès à la localisation pour calculer des horaires de prière précis selon votre position.',
          {
            duration: 5000,
            action: {
              label: 'Autoriser',
              onClick: async () => {
                const result = await this.doRequestLocationPermission();
                resolve(result);
              },
            },
          }
        );
      });
    }

    return this.doRequestLocationPermission();
  }

  private async doRequestLocationPermission(): Promise<PermissionResult> {
    this.locationPermissionRequested = true;

    try {
      if (!Capacitor.isNativePlatform()) {
        if (!navigator.geolocation) {
          return { granted: false, denied: true, shouldShowRationale: false };
        }

        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        const granted = result.state === 'granted';

        if (result.state === 'denied') {
          notify.warning(
            'Localisation désactivée',
            'L\'accès à la localisation est désactivé. Activez-le dans les réglages pour des horaires précis.',
            { duration: 6000 }
          );
        }

        return {
          granted,
          denied: result.state === 'denied',
          shouldShowRationale: false,
        };
      }

      const { Geolocation } = await import('@capacitor/geolocation');

      const permission = await Geolocation.checkPermissions();

      if (permission.location === 'granted') {
        return { granted: true, denied: false, shouldShowRationale: false };
      }

      if (permission.location === 'denied') {
        notify.warning(
          'Localisation désactivée',
          'L\'accès à la localisation est désactivé. Activez-le dans les réglages pour des horaires précis.',
          { duration: 6000 }
        );
        return { granted: false, denied: true, shouldShowRationale: false };
      }

      const result = await Geolocation.requestPermissions();
      const granted = result.location === 'granted';

      if (!granted) {
        notify.warning(
          'Localisation désactivée',
          'L\'accès à la localisation est désactivé. Activez-le dans les réglages pour des horaires précis.',
          { duration: 6000 }
        );
      }

      return {
        granted,
        denied: result.location === 'denied',
        shouldShowRationale: false,
      };
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return { granted: false, denied: false, shouldShowRationale: false };
    }
  }

  showPermissionDeniedMessage(type: PermissionType): void {
    if (type === 'notifications') {
      notify.warning(
        'Notifications désactivées',
        'Les notifications sont désactivées. Activez-les dans les réglages de votre appareil pour ne manquer aucune prière.',
        { duration: 6000 }
      );
    } else {
      notify.warning(
        'Localisation désactivée',
        'L\'accès à la localisation est désactivé. Activez-le dans les réglages pour des horaires précis.',
        { duration: 6000 }
      );
    }
  }

  reset(): void {
    this.notificationPermissionRequested = false;
    this.locationPermissionRequested = false;
  }
}

export const permissionService = PermissionService.getInstance();
