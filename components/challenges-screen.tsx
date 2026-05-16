'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { Trophy, Users, Clock } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'personal' | 'friend' | 'global';
  target: number;
  current: number;
  reward: number;
  topPlaces: string;
  participants?: number;
  endDate: string;
}

export default function ChallengesScreen() {
  const { t } = useLanguage();
  const [challenges] = useState<Challenge[]>([
    {
      id: '1',
      title: '10K Steps Challenge',
      description: 'Reach 10,000 steps today',
      type: 'personal',
      target: 10000,
      current: 8432,
      reward: 0.5,
      topPlaces: '1st: 0.5π',
      endDate: t('today'),
    },
    {
      id: '2',
      title: 'Marathon Week',
      description: 'Run 25 km this week',
      type: 'friend',
      target: 25,
      current: 12.3,
      reward: 2.0,
      topPlaces: '1st: 2π | 2nd: 1.5π | 3rd: 1π',
      participants: 5,
      endDate: 'In 4 days',
    },
    {
      id: '3',
      title: 'Speed Demon',
      description: 'Complete 5 runs this month',
      type: 'global',
      target: 5,
      current: 2,
      reward: 5.0,
      topPlaces: '1st: 5π | 2nd: 3.5π | 3rd: 2π',
      participants: 127,
      endDate: 'In 18 days',
    },
  ]);

  const getProgressPercent = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getChallengeColor = (type: string) => {
    switch (type) {
      case 'personal':
        return 'from-blue-500 to-blue-600';
      case 'friend':
        return 'from-purple-500 to-purple-600';
      case 'global':
        return 'from-orange-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'personal':
        return '📍';
      case 'friend':
        return '👥';
      case 'global':
        return '🌍';
      default:
        return '🎯';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-r from-accent to-secondary/50 text-foreground p-6 rounded-2xl">
        <Trophy className="w-8 h-8 mb-2" />
        <h2 className="text-2xl font-bold mb-1">{t('challenges')}</h2>
        <p className="text-sm opacity-80">Complete challenges to earn rewards!</p>
      </div>

      {/* Challenge Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Personal', 'Friends', 'Global'].map((tab) => (
          <Badge key={tab} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground px-4 py-2">
            {tab}
          </Badge>
        ))}
      </div>

      {/* Challenges List */}
      <div className="space-y-3">
        {challenges.map((challenge) => {
          const progress = getProgressPercent(challenge.current, challenge.target);
          return (
            <Card key={challenge.id} className="overflow-hidden">
              <div className={`bg-gradient-to-r ${getChallengeColor(challenge.type)} text-white p-4`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-2xl">{getChallengeIcon(challenge.type)}</span>
                    <h3 className="font-bold text-lg mt-1">{challenge.title}</h3>
                  </div>
                  <Badge className="bg-white/20 text-white">{challenge.reward.toFixed(2)} π</Badge>
                </div>
                <p className="text-sm opacity-90">{challenge.description}</p>
              </div>

              <div className="p-4 space-y-3">
                {/* Progress */}
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Progress</span>
                    <span className="font-bold">{challenge.current}/{challenge.target}</span>
                  </div>
                  <div className="bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Rewards */}
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Top 3 Rewards:</p>
                  <p className="text-xs font-medium">{challenge.topPlaces}</p>
                </div>

                {/* Footer Info */}
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex gap-2">
                    {challenge.participants && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {challenge.participants}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {challenge.endDate}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Join
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
