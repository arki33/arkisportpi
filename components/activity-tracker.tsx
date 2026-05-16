'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { useActivityHistory } from '@/contexts/activity-history-context';
import { MapPin, Play, Pause, Check, Gauge, Zap, Clock, AlertCircle } from 'lucide-react';
import { GPSTracker, GPSCoordinate } from '@/lib/gps-tracker';

interface GPSPoint {
  lat: number;
  lng: number;
  timestamp: number;
  elevation: number;
}

interface ActivityStats {
  distance: number;
  time: number;
  avgSpeed: number;
  currentSpeed: number;
  maxSpeed: number;
  elevation: number;
  elevationGain: number;
  piEarned: number;
}

export default function ActivityTracker() {
  const { t } = useLanguage();
  const { addActivity } = useActivityHistory();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activityType, setActivityType] = useState<'walk' | 'run' | 'cycle' | 'swim'>('run');
  const [useRealGPS, setUseRealGPS] = useState(true);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [stats, setStats] = useState<ActivityStats>({
    distance: 0,
    time: 0,
    avgSpeed: 0,
    currentSpeed: 0,
    maxSpeed: 0,
    elevation: 0,
    elevationGain: 0,
    piEarned: 0,
  });

  const [gpsPoints, setGpsPoints] = useState<GPSPoint[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);
  const gpsTrackerRef = useRef<GPSTracker | null>(null);
  const gpsCoordinatesRef = useRef<GPSCoordinate[]>([]);

  const rewardRates = {
    walk: 0.005,
    run: 0.015,
    cycle: 0.01,
    swim: 0.02,
  };

  const activityIcons = {
    walk: '🚶',
    run: '🏃',
    cycle: '🚴',
    swim: '🏊',
  };

  // Simulate GPS tracking and activity
  useEffect(() => {
    if (!isActive || isPaused) return;

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      setStartTime(new Date());
    }

    simulationRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current!) / 1000;
      setStats((prev) => {
        // Simulate varied speeds
        const baseSpeed =
          activityType === 'walk'
            ? 5
            : activityType === 'run'
              ? 12
              : activityType === 'cycle'
                ? 25
                : 4;
        const variation = (Math.sin(elapsed / 10) + 1) * 0.5;
        const currentSpeed = baseSpeed * (0.8 + variation * 0.4);

        const newDistance = prev.distance + (currentSpeed / 3600) * 1;
        const avgSpeed = newDistance / (elapsed / 3600 || 1);
        const maxSpeed = Math.max(prev.maxSpeed, currentSpeed);
        const elevationGain =
          prev.elevationGain + (Math.random() * 0.5 - 0.2) * (newDistance - prev.distance);
        const piEarned = newDistance * rewardRates[activityType];

        // Simulate GPS points
        const lastPoint = gpsPoints[gpsPoints.length - 1] || {
          lat: 40.4168,
          lng: -3.7038,
          elevation: 600,
        };

        const newLat = lastPoint.lat + (Math.random() - 0.5) * 0.001;
        const newLng = lastPoint.lng + (Math.random() - 0.5) * 0.001;
        const newElevation = lastPoint.elevation + (Math.random() - 0.5) * 10;

        setGpsPoints((prev) => [
          ...prev.slice(-99),
          {
            lat: newLat,
            lng: newLng,
            timestamp: Date.now(),
            elevation: newElevation,
          },
        ]);

        return {
          ...prev,
          distance: newDistance,
          time: Math.floor(elapsed),
          avgSpeed,
          currentSpeed,
          maxSpeed,
          elevation: newElevation,
          elevationGain: Math.max(0, elevationGain),
          piEarned,
        };
      });
    }, 1000);

    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, [isActive, isPaused, activityType, gpsPoints]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setGpsError(null);
    startTimeRef.current = Date.now() - pausedTimeRef.current;

    // Initialize GPS tracking if available and enabled
    if (useRealGPS && navigator.geolocation) {
      gpsTrackerRef.current = new GPSTracker();
      gpsTrackerRef.current.startTracking(
        (coord) => {
          gpsCoordinatesRef.current.push(coord);
          // Update GPS points from real coordinates
          setGpsPoints((prev) => [
            ...prev.slice(-99),
            {
              lat: coord.latitude,
              lng: coord.longitude,
              timestamp: coord.timestamp,
              elevation: coord.altitude || 0,
            },
          ]);
        },
        (error) => {
          setGpsError(error);
          setUseRealGPS(false); // Fall back to simulation
        }
      );
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    pausedTimeRef.current = (Date.now() - startTimeRef.current!) + pausedTimeRef.current;
  };

  const handleResume = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now() - pausedTimeRef.current;
  };

  const handleFinish = () => {
    setIsActive(false);
    setIsPaused(false);

    // Stop GPS tracking
    if (gpsTrackerRef.current) {
      gpsTrackerRef.current.stopTracking();
    }

    // Save activity to history
    if (stats.distance > 0 && startTime) {
      const newActivity = {
        id: `activity_${Date.now()}`,
        type: activityType,
        distance: stats.distance,
        duration: stats.time,
        avgSpeed: stats.avgSpeed,
        maxSpeed: stats.maxSpeed,
        elevationGain: stats.elevationGain,
        piEarned: stats.piEarned,
        startTime,
        endTime: new Date(),
        gpsRoute: gpsPoints,
      };

      addActivity(newActivity);
    }

    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    setGpsPoints([]);
    gpsCoordinatesRef.current = [];
    setStartTime(null);
    setStats({
      distance: 0,
      time: 0,
      avgSpeed: 0,
      currentSpeed: 0,
      maxSpeed: 0,
      elevation: 0,
      elevationGain: 0,
      piEarned: 0,
    });
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Simple map visualization using SVG
  const MapVisualization = () => {
    if (gpsPoints.length < 2) {
      return (
        <div className="w-full h-48 bg-muted/30 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{t('route')}</p>
          </div>
        </div>
      );
    }

    const minLat = Math.min(...gpsPoints.map((p) => p.lat));
    const maxLat = Math.max(...gpsPoints.map((p) => p.lat));
    const minLng = Math.min(...gpsPoints.map((p) => p.lng));
    const maxLng = Math.max(...gpsPoints.map((p) => p.lng));

    const width = 300;
    const height = 200;
    const padding = 10;

    const getX = (lng: number) => {
      return ((lng - minLng) / (maxLng - minLng || 1)) * (width - padding * 2) + padding;
    };

    const getY = (lat: number) => {
      return height - (((lat - minLat) / (maxLat - minLat || 1)) * (height - padding * 2) + padding);
    };

    const pathD = gpsPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.lng)} ${getY(p.lat)}`)
      .join(' ');

    return (
      <svg width={width} height={height} className="w-full border border-border rounded-lg bg-muted/20">
        {/* Grid */}
        <g stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3">
          {[...Array(5)].map((_, i) => (
            <line key={`h${i}`} x1="0" x2={width} y1={(i * height) / 4} y2={(i * height) / 4} />
          ))}
          {[...Array(5)].map((_, i) => (
            <line key={`v${i}`} x1={(i * width) / 4} x2={(i * width) / 4} y1="0" y2={height} />
          ))}
        </g>
        {/* Route */}
        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.7" />
        {/* End point */}
        {gpsPoints.length > 0 && (
          <circle
            cx={getX(gpsPoints[gpsPoints.length - 1].lng)}
            cy={getY(gpsPoints[gpsPoints.length - 1].lat)}
            r="4"
            fill="#ef4444"
          />
        )}
        {/* Start point */}
        {gpsPoints.length > 0 && (
          <circle cx={getX(gpsPoints[0].lng)} cy={getY(gpsPoints[0].lat)} r="4" fill="#22c55e" />
        )}
      </svg>
    );
  };

  return (
    <div className="p-4 space-y-4">
      {!isActive ? (
        // Activity Selector
        <Card className="p-4">
          <h3 className="font-bold text-lg mb-4">{t('activeChallenge')}</h3>

          {/* GPS Status */}
          {gpsError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-yellow-800">GPS Not Available</p>
                <p className="text-xs text-yellow-700">{gpsError}</p>
                <p className="text-xs text-yellow-700 mt-1">Using simulated GPS tracking</p>
              </div>
            </div>
          )}

          {!gpsError && useRealGPS && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-green-700">Real GPS tracking enabled for accurate route mapping</p>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2 mb-4">
            {(['walk', 'run', 'cycle', 'swim'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActivityType(type)}
                className={`p-3 rounded-lg transition-all ${
                  activityType === type
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                    : 'bg-muted hover:bg-muted/70'
                }`}
              >
                <span className="text-2xl block mb-1">{activityIcons[type]}</span>
                <span className="text-xs capitalize font-medium">{type}</span>
              </button>
            ))}
          </div>
          <Button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold py-3"
          >
            <Play className="w-4 h-4 mr-2" />
            {t('startActivity')}
          </Button>
        </Card>
      ) : (
        <>
          {/* Timer */}
          <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground p-6 rounded-2xl shadow-lg">
            <div className="text-center mb-4">
              <Clock className="w-6 h-6 mx-auto mb-2 opacity-80" />
              <p className="text-sm opacity-90 mb-2">{t('elapsed')}</p>
              <h2 className="text-5xl font-bold font-mono">{formatTime(stats.time)}</h2>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-90">{t('distance')}</p>
              <p className="text-3xl font-bold">{stats.distance.toFixed(2)} km</p>
            </div>
          </Card>

          {/* Map */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">{t('route')}</h3>
              {useRealGPS && !gpsError && <Badge className="bg-green-600">Live GPS</Badge>}
            </div>
            <MapVisualization />
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-accent" />
                <p className="text-xs text-muted-foreground">{t('currentSpeed')}</p>
              </div>
              <p className="text-2xl font-bold">{stats.currentSpeed.toFixed(1)} km/h</p>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-accent" />
                <p className="text-xs text-muted-foreground">{t('avgSpeed')}</p>
              </div>
              <p className="text-2xl font-bold">{stats.avgSpeed.toFixed(1)} km/h</p>
            </Card>

            <Card className="p-3">
              <p className="text-xs text-muted-foreground mb-1">{t('maxSpeed')}</p>
              <p className="text-2xl font-bold">{stats.maxSpeed.toFixed(1)} km/h</p>
            </Card>

            <Card className="p-3">
              <p className="text-xs text-muted-foreground mb-1">{t('elevation')}</p>
              <p className="text-2xl font-bold">+{stats.elevationGain.toFixed(0)} m</p>
            </Card>

            <Card className="p-3 col-span-2">
              <p className="text-xs text-muted-foreground mb-1">Pi Earned</p>
              <p className="text-2xl font-bold text-primary">{stats.piEarned.toFixed(4)} π</p>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            {isPaused ? (
              <Button
                onClick={handleResume}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Play className="w-4 h-4 mr-2" />
                {t('resume')}
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                variant="outline"
                className="flex-1"
              >
                <Pause className="w-4 h-4 mr-2" />
                {t('pause')}
              </Button>
            )}

            <Button
              onClick={handleFinish}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              {t('finishActivity')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
