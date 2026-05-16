'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/language-context';
import { usePiAuth } from '@/contexts/pi-wallet-context';
import { Settings, LogOut, Award, TrendingUp, Wallet } from 'lucide-react';
import WalletConnect from '@/components/wallet-connect';

export default function ProfileScreen() {
  const { t } = useLanguage();
  const { wallet } = usePiAuth();
  const [user] = useState({
    name: 'Athlete Champion',
    email: 'athlete@sportpi.com',
    totalSteps: 125430,
    totalPi: 452.3,
    currentStreak: 12,
    longestStreak: 25,
    level: 5,
    badges: ['First Steps', 'Week Warrior', 'Pi Collector', 'Running Enthusiast'],
    joinDate: 'Jan 2024',
  });

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first 1,000 steps', icon: '👣' },
    { id: 2, name: 'Week Warrior', description: 'Maintain 7-day streak', icon: '🔥' },
    { id: 3, name: 'Pi Collector', description: 'Earn 100 Pi tokens', icon: '🪙' },
    { id: 4, name: 'Running Enthusiast', description: 'Run 25 km in a month', icon: '🏃' },
    { id: 5, name: 'Social Butterfly', description: 'Win 5 friend challenges', icon: '🦋' },
    { id: 6, name: 'Marathon Master', description: 'Reach 1M steps', icon: '🏅' },
  ];

  const stats = [
    { label: 'Total Steps', value: user.totalSteps.toLocaleString(), icon: '👣' },
    { label: 'Pi Earned', value: user.totalPi.toFixed(1), suffix: 'π', icon: '🪙' },
    { label: 'Current Streak', value: user.currentStreak, suffix: 'days', icon: '🔥' },
    { label: 'Longest Streak', value: user.longestStreak, suffix: 'days', icon: '📈' },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Profile Header */}
      <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground p-6 rounded-2xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-5xl mb-2">💪</div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-sm opacity-80">{user.email}</p>
            <p className="text-xs opacity-60 mt-2">Member since {user.joinDate}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">Lvl {user.level}</div>
            <p className="text-sm opacity-80">Pro Member</p>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-4 text-center">
            <span className="text-3xl">{stat.icon}</span>
            <p className="font-bold mt-2 text-lg">
              {stat.value}
              {stat.suffix && <span className="text-sm ml-1">{stat.suffix}</span>}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-3 mt-4">
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => {
              const isEarned = user.badges.includes(achievement.name);
              return (
                <Card
                  key={achievement.id}
                  className={`p-4 text-center transition-all ${
                    isEarned
                      ? 'bg-accent/10 border-accent/50'
                      : 'bg-muted/30 opacity-50'
                  }`}
                >
                  <span className="text-3xl block mb-2">{achievement.icon}</span>
                  <p className="font-bold text-sm">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                  {isEarned && (
                    <Badge className="mt-2 bg-accent text-accent-foreground">Earned</Badge>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-3 mt-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Weekly Summary</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monday</span>
                <span className="font-bold">12.3 km</span>
              </div>
              <div className="w-full bg-muted rounded h-2">
                <div className="bg-primary h-2 rounded" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span>Tuesday</span>
                <span className="font-bold">9.8 km</span>
              </div>
              <div className="w-full bg-muted rounded h-2">
                <div className="bg-primary h-2 rounded" style={{ width: '80%' }} />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span>Wednesday</span>
                <span className="font-bold">15.2 km</span>
              </div>
              <div className="w-full bg-muted rounded h-2">
                <div className="bg-primary h-2 rounded" style={{ width: '100%' }} />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="space-y-3 mt-4">
          <WalletConnect />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-3 mt-4">
          <Card className="p-4">
            <button className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition">
              <span className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Notifications
              </span>
              <Badge variant="outline">On</Badge>
            </button>
            <button className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition">
              <span className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Rewards Settings
              </span>
              <span className="text-muted-foreground">&gt;</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition border-t">
              <span className="flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                Logout
              </span>
              <span className="text-muted-foreground">&gt;</span>
            </button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
