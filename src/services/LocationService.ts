import { Capacitor } from '@capacitor/core';

interface Position {
  lat: number;
  lng: number;
}

class LocationService {
  private static instance: LocationService;
  private permissionRequested: boolean = false;
  private permissionGranted: boolean | null = null;
  private cachedPosition: Position | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (this.permissionRequested && this.permissionGranted !== null) {
      return this.permissionGranted;
    }

    this.permissionRequested = true;

    try {
      if (Capacitor.isNativePlatform()) {
        const { Geolocation } = await import('@capacitor/geolocation');

        const permission = await Geolocation.checkPermissions();

        if (permission.location === 'granted') {
          this.permissionGranted = true;
          return true;
        }

        if (permission.location === 'denied') {
          this.permissionGranted = false;
          return false;
        }

        const result = await Geolocation.requestPermissions();
        this.permissionGranted = result.location === 'granted';
        return this.permissionGranted;
      } else {
        if (!navigator.geolocation) {
          this.permissionGranted = false;
          return false;
        }

        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        this.permissionGranted = result.state === 'granted';
        return this.permissionGranted;
      }
    } catch (error) {
      console.error('Location permission error:', error);
      this.permissionGranted = false;
      return false;
    }
  }

  async getCurrentPosition(): Promise<Position | null> {
    const now = Date.now();
    if (this.cachedPosition && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.cachedPosition;
    }

    const hasPermission = await this.requestPermission();

    if (!hasPermission) {
      return null;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        const { Geolocation } = await import('@capacitor/geolocation');

        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        });

        this.cachedPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.cacheTimestamp = now;

        return this.cachedPosition;
      } else {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.cachedPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              this.cacheTimestamp = now;
              resolve(this.cachedPosition);
            },
            (error) => {
              console.error('Error getting position:', error);
              reject(null);
            },
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 300000,
            }
          );
        });
      }
    } catch (error) {
      console.error('Error getting position:', error);
      return null;
    }
  }

  getCachedPosition(): Position | null {
    const now = Date.now();
    if (this.cachedPosition && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.cachedPosition;
    }
    return null;
  }

  hasPermission(): boolean | null {
    return this.permissionGranted;
  }

  clearCache(): void {
    this.cachedPosition = null;
    this.cacheTimestamp = 0;
  }
}

export const locationService = LocationService.getInstance();
