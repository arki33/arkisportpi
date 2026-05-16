/**
 * GPS Tracking utility for accurate route mapping
 * Uses device's Geolocation API when available
 */

export interface GPSCoordinate {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export class GPSTracker {
  private watchId: number | null = null;
  private coordinates: GPSCoordinate[] = [];
  private onUpdate: ((coord: GPSCoordinate) => void) | null = null;
  private onError: ((error: string) => void) | null = null;

  /**
   * Start tracking GPS location
   */
  startTracking(
    onUpdate?: (coord: GPSCoordinate) => void,
    onError?: (error: string) => void
  ): void {
    this.onUpdate = onUpdate || null;
    this.onError = onError || null;

    if (!navigator.geolocation) {
      const error = 'Geolocation is not supported by your browser';
      this.onError?.(error);
      return;
    }

    // Use high accuracy GPS for fitness tracking
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coord: GPSCoordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        };

        this.coordinates.push(coord);
        this.onUpdate?.(coord);
      },
      (error) => {
        let errorMessage = 'Unknown GPS error';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'GPS location request timeout.';
            break;
        }
        this.onError?.(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  /**
   * Stop tracking GPS location
   */
  stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Get current GPS coordinates
   */
  getCurrentCoordinates(): GPSCoordinate[] {
    return [...this.coordinates];
  }

  /**
   * Clear all recorded coordinates
   */
  clearCoordinates(): void {
    this.coordinates = [];
  }

  /**
   * Calculate distance between two GPS points using Haversine formula
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Calculate total distance traveled
   */
  static calculateTotalDistance(coordinates: GPSCoordinate[]): number {
    if (coordinates.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const distance = this.calculateDistance(
        coordinates[i - 1].latitude,
        coordinates[i - 1].longitude,
        coordinates[i].latitude,
        coordinates[i].longitude
      );
      totalDistance += distance;
    }
    return totalDistance;
  }

  /**
   * Calculate elevation gain from GPS coordinates
   */
  static calculateElevationGain(coordinates: GPSCoordinate[]): number {
    if (coordinates.length < 2) return 0;

    let elevationGain = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const current = coordinates[i].altitude || 0;
      const previous = coordinates[i - 1].altitude || 0;
      const difference = current - previous;
      if (difference > 0) {
        elevationGain += difference;
      }
    }
    return elevationGain;
  }

  /**
   * Get average speed from coordinates
   */
  static calculateAverageSpeed(coordinates: GPSCoordinate[]): number {
    if (coordinates.length < 2) return 0;

    const speeds = coordinates
      .filter((c) => c.speed !== null)
      .map((c) => (c.speed || 0) * 3.6); // Convert m/s to km/h

    if (speeds.length === 0) return 0;
    return speeds.reduce((a, b) => a + b, 0) / speeds.length;
  }

  /**
   * Get max speed from coordinates
   */
  static getMaxSpeed(coordinates: GPSCoordinate[]): number {
    if (coordinates.length === 0) return 0;

    const speeds = coordinates
      .filter((c) => c.speed !== null)
      .map((c) => (c.speed || 0) * 3.6); // Convert m/s to km/h

    return Math.max(...speeds, 0);
  }
}

export default GPSTracker;
