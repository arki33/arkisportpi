'use client';

import { useState } from 'react';
import Dashboard from '@/components/dashboard';
import ChallengesScreen from '@/components/challenges-screen';
import LeaderboardScreen from '@/components/leaderboard-screen';
import ProfileScreen from '@/components/profile-screen';
import ActivityTracker from '@/components/activity-tracker';
import ActivityHistory from '@/components/activity-history';

import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { PiAuthProvider } from '@/contexts/pi-auth-context';

import {
  Activity,
  History,
  Trophy,
  Users,
  User,
} from 'lucide-react';

function HomePageContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, language, setLanguage } = useLanguage();

  const tabs = [
    { id: 'dashboard', label: t('home'), icon: Activity },
    { id: 'activities', label: t('activities'), icon: Activity },
    { id: 'history', label: 'History', icon: History },
    { id: 'challenges', label: t('challenges'), icon: Trophy },
    { id: 'leaderboard', label: t('leaderboard'), icon: Users },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">

          <div className="flex-1">
            <h1 className="text-2xl font-bold">{t('sportpi')}</h1>
            <p className="text-xs opacity-90">{t('tagline')}</p>
          </div>

          {/* LANGUAGE */}
          <div className="relative group">
            <button className="px-3 py-1.5 rounded text-sm font-medium bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground">
              {language.toUpperCase()}
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible">
              {(['en','es','fr','de','it','pt','ja','ko','zh','ru','ar','hi','tr','vi'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className="w-full text-left px-4 py-2 hover:bg-muted text-sm"
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-md mx-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'activities' && <ActivityTracker />}
        {activeTab === 'history' && <ActivityHistory />}
        {activeTab === 'challenges' && <ChallengesScreen />}
        {activeTab === 'leaderboard' && <LeaderboardScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </main>

      {/* NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-md mx-auto flex overflow-x-auto">

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-3 text-xs ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                {tab.label}
              </button>
            );
          })}

        </div>
      </nav>

    </div>
  );
}

export default function HomePage() {
  return (
    <LanguageProvider>
      <PiAuthProvider>
        <HomePageContent />
      </PiAuthProvider>
    </LanguageProvider>
  );
}