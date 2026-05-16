'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface CompletedActivity {
  id: string;
  type: 'walk' | 'run' | 'cycle' | 'swim';
  distance: number;
  duration: number;
  avgSpeed: number;
  maxSpeed: number;
  elevationGain: number;
  piEarned: number;
  startTime: Date;
  endTime: Date;
  gpsRoute: Array<{ lat: number; lng: number; timestamp: number }>;
  image?: string;
}

interface ActivityHistoryContextType {
  activities: CompletedActivity[];
  addActivity: (activity: CompletedActivity) => void;
  getActivityById: (id: string) => CompletedActivity | undefined;
  deleteActivity: (id: string) => void;
}

const ActivityHistoryContext = createContext<ActivityHistoryContextType | undefined>(undefined);

export function ActivityHistoryProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<CompletedActivity[]>([]);

  const addActivity = (activity: CompletedActivity) => {
    setActivities((prev) => [activity, ...prev]);
  };

  const getActivityById = (id: string) => {
    return activities.find((a) => a.id === id);
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <ActivityHistoryContext.Provider value={{ activities, addActivity, getActivityById, deleteActivity }}>
      {children}
    </ActivityHistoryContext.Provider>
  );
}

export function useActivityHistory() {
  const context = useContext(ActivityHistoryContext);
  if (!context) {
    throw new Error('useActivityHistory must be used within ActivityHistoryProvider');
  }
  return context;
}
