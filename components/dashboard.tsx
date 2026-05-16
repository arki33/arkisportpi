'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/language-context';
import { Activity, Zap, Target, Flame } from 'lucide-react';

interface Activity {
  type: 'walk' | 'run' | 'cycle' | 'swim';
  distance: number;
  time: number;
  pi: number;
  date: string;
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [steps, setSteps] = useState(8432);
  const [piBalance, setPiBalance] = useState(42.5);
  const [activities, setActivities] = useState<Activity[]>([
    { type: 'walk', distance: 5.2, time: 45, pi: 0.026, date: t('today') },
    { type: 'run', distance: 3.1, time: 28, pi: 0.0465, date: t('yesterday') },
  ]);

  // Simulate step counter and rewards
  useEffect(() => {
    const interval = setInterval(() => {
      setSteps((prev) => {
        const newSteps = prev + Math.floor(Math.random() * 5);
        // Award Pi for reaching milestones
        if (newSteps % 10000 < prev % 10000) {
          // Reached a 10k milestone
          setPiBalance((p) => p + 0.5);
        } else if (newSteps % 2000 < prev % 2000) {
          // Reached every 2k milestone after initial 10k
          setPiBalance((p) => p + 0.1);
        }
        return newSteps;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const dailyGoal = 10000;
  const progressPercent = (steps / dailyGoal) * 100;

  const activityRewards = {
    walk: 0.005,
    run: 0.015,
    cycle: 0.01,
    swim: 0.02,
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'walk':
        return '🚶';
      case 'run':
        return '🏃';
      case 'cycle':
        return '🚴';
      case 'swim':
        return '🏊';
      default:
        return '📍';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'walk':
        return t('walking');
      case 'run':
        return t('running');
      case 'cycle':
        return t('cycling');
      case 'swim':
        return t('swimming');
      default:
        return type;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Pi Balance Card */}
      <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm opacity-90">{t('piBalance')}</p>
            <h2 className="text-4xl font-bold">{piBalance.toFixed(2)} π</h2>
          </div>
          <Zap className="w-8 h-8" />
        </div>
        <p className="text-sm opacity-75">{t('keepMoving')}</p>
      </Card>

      {/* Step Tracker */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{t('todaySteps')}</h3>
          <Badge variant="secondary">{Math.floor(progressPercent)}%</Badge>
        </div>
        <div className="text-3xl font-bold mb-2">{steps.toLocaleString()}</div>
        <Progress value={Math.min(progressPercent, 100)} className="h-3 mb-3" />
        <p className="text-sm text-muted-foreground">
          {t('goal')}: {dailyGoal.toLocaleString()} steps
        </p>

        {/* Milestone Rewards */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="bg-accent/10 p-3 rounded-lg text-center">
            <Target className="w-5 h-5 mx-auto mb-1 text-accent" />
            <p className="text-xs font-medium">10K: 0.5π</p>
          </div>
          <div className="bg-accent/10 p-3 rounded-lg text-center">
            <Flame className="w-5 h-5 mx-auto mb-1 text-accent" />
            <p className="text-xs font-medium">+2K: 0.1π</p>
          </div>
          <div className="bg-accent/10 p-3 rounded-lg text-center">
            <Activity className="w-5 h-5 mx-auto mb-1 text-accent" />
            <p className="text-xs font-medium">{t('perKm')}</p>
          </div>
        </div>
      </Card>

      {/* Recent Activities */}
      <Card className="p-4">
        <h3 className="font-bold text-lg mb-3">{t('recentActivities')}</h3>
        <div className="space-y-3">
          {activities.map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className="font-medium capitalize">{getActivityLabel(activity.type)}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.distance} km · {activity.time} min
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{activity.pi.toFixed(4)} π</p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reward Breakdown */}
      <Card className="p-4 bg-secondary/5">
        <h3 className="font-bold text-lg mb-3">{t('exerciseRewards')}</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t('walking')} ({t('perKm')})</span>
            <span className="font-bold text-primary">{activityRewards.walk}π</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t('running')} ({t('perKm')})</span>
            <span className="font-bold text-primary">{activityRewards.run}π</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t('cycling')} ({t('perKm')})</span>
            <span className="font-bold text-primary">{activityRewards.cycle}π</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t('swimming')} ({t('perKm')})</span>
            <span className="font-bold text-primary">{activityRewards.swim}π</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
