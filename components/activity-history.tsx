'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useActivityHistory, CompletedActivity } from '@/contexts/activity-history-context';
import { useLanguage } from '@/contexts/language-context';
import { MapPin, Share2, Trash2, Eye, Copy, Check } from 'lucide-react';

interface ShareModalProps {
  activity: CompletedActivity;
  onClose: () => void;
}

const ShareModal = ({ activity, onClose }: ShareModalProps) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const getActivityEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      walk: '🚶',
      run: '🏃',
      cycle: '🚴',
      swim: '🏊',
    };
    return emojis[type] || '📍';
  };

  const generateShareText = () => {
    return `${getActivityEmoji(activity.type)} Just completed a ${activity.type}! 🎉

Distance: ${activity.distance.toFixed(2)} km
Time: ${Math.floor(activity.duration / 60)}m ${activity.duration % 60}s
Avg Speed: ${activity.avgSpeed.toFixed(1)} km/h
Pi Earned: ${activity.piEarned.toFixed(4)} π

Join me on SPORTPI and earn rewards for your fitness! 💪🪙`;
  };

  const shareText = generateShareText();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    telegram: `https://t.me/share/url?url=sportpi.app&text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    instagram: 'instagram://share',
    tiktok: 'https://www.tiktok.com/',
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6 rounded-2xl">
        <h3 className="font-bold text-lg mb-4">Share Activity</h3>

        <div className="bg-muted/30 p-4 rounded-lg mb-4 text-sm max-h-48 overflow-y-auto">
          <p className="whitespace-pre-wrap text-xs">{shareText}</p>
        </div>

        <div className="space-y-2 mb-4">
          <button
            onClick={handleCopyToClipboard}
            className="w-full flex items-center justify-center gap-2 p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Text
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 bg-green-100 hover:bg-green-200 rounded-lg transition text-xs font-medium"
          >
            <span className="text-xl mb-1">💬</span>
            WhatsApp
          </a>
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition text-xs font-medium"
          >
            <span className="text-xl mb-1">👍</span>
            Facebook
          </a>
          <a
            href={socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 bg-sky-100 hover:bg-sky-200 rounded-lg transition text-xs font-medium"
          >
            <span className="text-xl mb-1">𝕏</span>
            Twitter
          </a>
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 bg-cyan-100 hover:bg-cyan-200 rounded-lg transition text-xs font-medium"
          >
            <span className="text-xl mb-1">✈️</span>
            Telegram
          </a>
          <a
            href={socialLinks.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-xs font-medium"
          >
            <span className="text-xl mb-1">🎵</span>
            TikTok
          </a>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'My SPORTPI Activity',
                  text: shareText,
                });
              }
            }}
            className="flex flex-col items-center justify-center p-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition text-xs font-medium"
          >
            <span className="text-xl mb-1">📤</span>
            More
          </button>
        </div>

        <Button onClick={onClose} className="w-full" variant="outline">
          Close
        </Button>
      </Card>
    </div>
  );
};

export default function ActivityHistory() {
  const { t } = useLanguage();
  const { activities } = useActivityHistory();
  const [selectedActivity, setSelectedActivity] = useState<CompletedActivity | null>(null);
  const [shareModal, setShareModal] = useState(false);

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

  if (activities.length === 0) {
    return (
      <div className="p-4 text-center">
        <Card className="p-8 text-center">
          <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="font-bold mb-2">No Activities Yet</h3>
          <p className="text-sm text-muted-foreground">Complete your first activity to see it here!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <h2 className="font-bold text-lg mb-4">Activity History</h2>

      {activities.map((activity) => (
        <Card key={activity.id} className="p-4 hover:shadow-md transition">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-3xl">{getActivityIcon(activity.type)}</span>
              <div className="flex-1">
                <h3 className="font-bold capitalize">{getActivityLabel(activity.type)}</h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.startTime).toLocaleDateString()} at{' '}
                  {new Date(activity.startTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Badge className="bg-primary/20 text-primary">
              {activity.piEarned.toFixed(4)} π
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
            <div className="bg-muted/30 p-2 rounded">
              <p className="text-xs text-muted-foreground">Distance</p>
              <p className="font-bold">{activity.distance.toFixed(2)} km</p>
            </div>
            <div className="bg-muted/30 p-2 rounded">
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-bold">
                {Math.floor(activity.duration / 60)}m {activity.duration % 60}s
              </p>
            </div>
            <div className="bg-muted/30 p-2 rounded">
              <p className="text-xs text-muted-foreground">Avg Speed</p>
              <p className="font-bold">{activity.avgSpeed.toFixed(1)} km/h</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSelectedActivity(activity);
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => {
                setSelectedActivity(activity);
                setShareModal(true);
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </Card>
      ))}

      {shareModal && selectedActivity && (
        <ShareModal activity={selectedActivity} onClose={() => setShareModal(false)} />
      )}
    </div>
  );
}
