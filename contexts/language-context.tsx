'use client';

import { createContext, useContext, useState } from 'react';

export type Language =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'ja'
  | 'ko'
  | 'zh'
  | 'ru'
  | 'ar'
  | 'hi'
  | 'tr'
  | 'vi';

const translations = {
  en: {
    sportpi: 'SPORTPI',
    tagline: 'Earn Pi, Stay Fit',
    home: 'Home',
    activities: 'Activities',
    challenges: 'Challenges',
    leaderboard: 'Leaderboard',
    profile: 'Profile',
    piBalance: 'Pi Balance',
  },
  es: {
    sportpi: 'SPORTPI',
    tagline: 'Gana Pi, Mantente en Forma',
    home: 'Inicio',
    activities: 'Actividades',
    challenges: 'Retos',
    leaderboard: 'Ranking',
    profile: 'Perfil',
    piBalance: 'Saldo de Pi',
  },
  fr: {
    sportpi: 'SPORTPI',
    tagline: 'Gagnez Pi, Restez en Forme',
    home: 'Accueil',
    activities: 'Activités',
    challenges: 'Défis',
    leaderboard: 'Classement',
    profile: 'Profil',
    piBalance: 'Solde Pi',
  },
  de: {
    sportpi: 'SPORTPI',
    tagline: 'Verdiene Pi, Bleibe Fit',
    home: 'Startseite',
    activities: 'Aktivitäten',
    challenges: 'Herausforderungen',
    leaderboard: 'Rangliste',
    profile: 'Profil',
    piBalance: 'Pi-Guthaben',
  },
  it: {
    sportpi: 'SPORTPI',
    tagline: 'Guadagna Pi, Resta in Forma',
    home: 'Home',
    activities: 'Attività',
    challenges: 'Sfide',
    leaderboard: 'Classifica',
    profile: 'Profilo',
    piBalance: 'Saldo Pi',
  },
  pt: {
    sportpi: 'SPORTPI',
    tagline: 'Ganhe Pi, Mantenha-se Fit',
    home: 'Início',
    activities: 'Atividades',
    challenges: 'Desafios',
    leaderboard: 'Placar',
    profile: 'Perfil',
    piBalance: 'Saldo de Pi',
  },
  ja: {
    sportpi: 'SPORTPI',
    tagline: 'Piを稼ぐ、健康を維持',
    home: 'ホーム',
    activities: 'アクティビティ',
    challenges: 'チャレンジ',
    leaderboard: 'ランキング',
    profile: 'プロフィール',
    piBalance: 'Pi残高',
  },
  ko: {
    sportpi: 'SPORTPI',
    tagline: 'Pi를 벌고 건강하게',
    home: '홈',
    activities: '활동',
    challenges: '도전',
    leaderboard: '순위',
    profile: '프로필',
    piBalance: 'Pi 잔액',
  },
  zh: {
    sportpi: 'SPORTPI',
    tagline: '赚取Pi，保持健康',
    home: '首页',
    activities: '活动',
    challenges: '挑战',
    leaderboard: '排行榜',
    profile: '档案',
    piBalance: 'Pi余额',
  },
  ru: {
    sportpi: 'SPORTPI',
    tagline: 'Зарабатывайте Pi',
    home: 'Главная',
    activities: 'Активности',
    challenges: 'Вызовы',
    leaderboard: 'Лидеры',
    profile: 'Профиль',
    piBalance: 'Баланс Pi',
  },
  ar: {
    sportpi: 'SPORTPI',
    tagline: 'اكسب Pi',
    home: 'الرئيسية',
    activities: 'الأنشطة',
    challenges: 'التحديات',
    leaderboard: 'لوحة الصدارة',
    profile: 'الملف الشخصي',
    piBalance: 'رصيد Pi',
  },
  hi: {
    sportpi: 'SPORTPI',
    tagline: 'Pi कमाएँ',
    home: 'होम',
    activities: 'गतिविधियाँ',
    challenges: 'चुनौतियाँ',
    leaderboard: 'लीडरबोर्ड',
    profile: 'प्रोफाइल',
    piBalance: 'Pi बैलेंस',
  },
  tr: {
    sportpi: 'SPORTPI',
    tagline: 'Pi Kazan',
    home: 'Anasayfa',
    activities: 'Aktiviteler',
    challenges: 'Zorluklar',
    leaderboard: 'Sıralama',
    profile: 'Profil',
    piBalance: 'Pi Bakiyesi',
  },
  vi: {
    sportpi: 'SPORTPI',
    tagline: 'Kiếm Pi',
    home: 'Trang Chủ',
    activities: 'Hoạt Động',
    challenges: 'Thách Thức',
    leaderboard: 'Bảng Xếp Hạng',
    profile: 'Hồ Sơ',
    piBalance: 'Số Dư Pi',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}