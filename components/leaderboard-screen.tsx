'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language-context';
import { Medal } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  steps: number;
  pi: number;
  streak: number;
  avatar: string;
}

export default function LeaderboardScreen() {
  const { t } = useLanguage();
  const leaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      name: 'Alex Runner',
      steps: 45230,
      pi: 125.5,
      streak: 15,
      avatar: '🏃',
    },
    {
      rank: 2,
      name: 'Maria Cyclist',
      steps: 42100,
      pi: 118.2,
      streak: 12,
      avatar: '🚴',
    },
    {
      rank: 3,
      name: 'John Walker',
      steps: 38950,
      pi: 105.8,
      streak: 8,
      avatar: '🚶',
    },
    {
      rank: 4,
      name: 'You',
      steps: 8432,
      pi: 42.5,
      streak: 3,
      avatar: '💪',
    },
    {
      rank: 5,
      name: 'Sarah Swimmer',
      steps: 35200,
      pi: 98.3,
      streak: 21,
      avatar: '🏊',
    },
    {
      rank: 6,
      name: 'Mike Trainer',
      steps: 31500,
      pi: 89.1,
      streak: 5,
      avatar: '⛹️',
    },
  ];

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-500';
      case 2:
        return 'text-gray-400';
      case 3:
        return 'text-orange-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 15) return 'bg-red-100 text-red-700';
    if (streak >= 10) return 'bg-orange-100 text-orange-700';
    if (streak >= 5) return 'bg-yellow-100 text-yellow-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-6 rounded-2xl">
        <Medal className="w-8 h-8 mb-2" />
        <h2 className="text-2xl font-bold mb-1">{t('leaderboard')}</h2>
        <p className="text-sm opacity-80">See where you rank!</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">4th</p>
          <p className="text-xs text-muted-foreground mt-1">Your Rank</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-accent">250</p>
          <p className="text-xs text-muted-foreground mt-1">Places to 1st</p>
        </Card>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {leaderboard.map((entry, idx) => (
          <Card
            key={idx}
            className={`p-4 ${
              entry.rank === 4 ? 'border-2 border-primary bg-primary/5' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Rank Medal */}
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                {entry.rank <= 3 ? (
                  <span className={`text-2xl ${getMedalColor(entry.rank)}`}>
                    {'🥇🥈🥉'[entry.rank - 1]}
                  </span>
                ) : (
                  <span className="font-bold text-lg text-muted-foreground">
                    #{entry.rank}
                  </span>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{entry.avatar}</span>
                  <h3 className={`font-bold truncate ${entry.rank === 4 ? 'text-primary' : ''}`}>
                    {entry.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{entry.steps.toLocaleString()} steps</span>
                  <Badge variant="outline" className={getStreakColor(entry.streak)}>
                    🔥 {entry.streak} days
                  </Badge>
                </div>
              </div>

              {/* Pi Earned */}
              <div className="flex-shrink-0 text-right">
                <p className="font-bold text-primary">{entry.pi.toFixed(1)} π</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tips Section */}
      <Card className="p-4 bg-accent/10 border-accent/20">
        <h3 className="font-bold mb-2 text-sm">💡 Tips to Climb the Ranks</h3>
        <ul className="text-xs space-y-1 text-muted-foreground">
          <li>• Complete daily challenges to earn bonus Pi</li>
          <li>• Maintain a streak for multiplier rewards</li>
          <li>• Join friend challenges for faster Pi growth</li>
          <li>• Different exercises reward different amounts</li>
        </ul>
      </Card>
    </div>
  );
}
