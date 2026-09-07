import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Language, LanguageOption, SUPPORTED_LANGUAGES, TranslationDictionary } from '../i18n/types';

export const DICTIONARIES: Record<Language, TranslationDictionary> = {
  az: {
    nav: {
      jobs: 'Vakansiyalar',
      cvBuilder: 'CV Tərtibatçısı',
      cvAnalyzer: 'AI CV Analizatoru',
      nearbyJobs: 'Xəritədə İşlər (Evimə Yaxın)',
      salaryTrends: 'Maaş İcmalı & Trendlər',
      myApplications: 'Müraciətlərim',
      calculia: 'Salaria & Vacatia',
      googleChat: 'Google Chat Əlaqə',
      candidate: 'Namizəd',
      employer: 'İşəgötürən',
      admin: 'Admin Panel',
      pricing: 'VIP Abunəliklər',
      login: 'Daxil ol',
      logout: 'Çıxış',
      postJob: 'Yeni Vakansiya Elan Et',
    },
    jobAlerts: {
      title: 'İzləmə & Bildirişlər',
      manage: 'Bildirişləri İdarə Et',
      active: 'Aktiv Bildirişlər',
    },
    profile: {
      profileTitle: 'Tənzimləmələr & Profil',
      settings: 'Hesab Tənzimləmələri',
      notifications: 'Bildiriş Seçimləri',
    },
    header: {
      searchPlaceholder: 'Vəzifə, şirkət və ya açar söz...',
      notificationsTitle: 'Bildirişlər',
      roleSwitcher: 'Rol Seçimi',
    },
    cv: {
      title: 'Peşəkar CV',
      create: 'Yeni CV Yarat',
      download: 'PDF Yüklə',
    },
    auth: {
      loginTitle: 'Hesaba Daxil Ol',
      registerTitle: 'Qeydiyyatdan Keç',
      email: 'E-poçt ünvanı',
      password: 'Şifrə',
    },
    common: {
      apply: 'Müraciət et',
      cancel: 'İmtina',
      save: 'Yadda saxla',
      close: 'Bağla',
      loading: 'Yüklənir...',
    },
  },
  en: {
    nav: {
      jobs: 'Vacancies',
      cvBuilder: 'CV Builder',
      cvAnalyzer: 'AI CV Analyzer',
      nearbyJobs: 'Nearby Jobs (Map)',
      salaryTrends: 'Salary Trends',
      myApplications: 'My Applications',
      calculia: 'Salaria & Vacatia',
      googleChat: 'Google Chat Hub',
      candidate: 'Job Seeker',
      employer: 'Employer',
      admin: 'Admin Panel',
      pricing: 'VIP Pricing',
      login: 'Sign In',
      logout: 'Sign Out',
      postJob: 'Post New Vacancy',
    },
    jobAlerts: {
      title: 'Job Alerts & Notifications',
      manage: 'Manage Alerts',
      active: 'Active Subscriptions',
    },
    profile: {
      profileTitle: 'Settings & Profile',
      settings: 'Account Settings',
      notifications: 'Notification Preferences',
    },
    header: {
      searchPlaceholder: 'Position, company or keyword...',
      notificationsTitle: 'Notifications',
      roleSwitcher: 'Switch Role',
    },
    cv: {
      title: 'Professional CV',
      create: 'Create CV',
      download: 'Download PDF',
    },
    auth: {
      loginTitle: 'Sign In to Jobia',
      registerTitle: 'Create an Account',
      email: 'Email address',
      password: 'Password',
    },
    common: {
      apply: 'Apply Now',
      cancel: 'Cancel',
      save: 'Save',
      close: 'Close',
      loading: 'Loading...',
    },
  },
  ru: {
    nav: {
      jobs: 'Вакансии',
      cvBuilder: 'Конструктор резюме',
      cvAnalyzer: 'AI Анализатор резюме',
      nearbyJobs: 'Работа на карте',
      salaryTrends: 'Обзор зарплат',
      myApplications: 'Мои отклики',
      calculia: 'Salaria & Vacatia',
      googleChat: 'Google Chat Hub',
      candidate: 'Соискатель',
      employer: 'Работодатель',
      admin: 'Панель администратора',
      pricing: 'VIP Тарифы',
      login: 'Войти',
      logout: 'Выйти',
      postJob: 'Разместить вакансию',
    },
    jobAlerts: {
      title: 'Оповещения и подписки',
      manage: 'Управление подписками',
      active: 'Активные уведомления',
    },
    profile: {
      profileTitle: 'Настройки и профиль',
      settings: 'Настройки аккаунта',
      notifications: 'Уведомления',
    },
    header: {
      searchPlaceholder: 'Должность, компания или навык...',
      notificationsTitle: 'Уведомления',
      roleSwitcher: 'Сменить роль',
    },
    cv: {
      title: 'Профессиональное резюме',
      create: 'Создать резюме',
      download: 'Скачать PDF',
    },
    auth: {
      loginTitle: 'Вход в аккаунт',
      registerTitle: 'Регистрация',
      email: 'Эл. почта',
      password: 'Пароль',
    },
    common: {
      apply: 'Откликнуться',
      cancel: 'Отмена',
      save: 'Сохранить',
      close: 'Закрыть',
      loading: 'Загрузка...',
    },
  },
  tr: {
    nav: {
      jobs: 'İş İlanları',
      cvBuilder: 'Özgeçmiş Oluşturucu',
      cvAnalyzer: 'AI CV Analizörü',
      nearbyJobs: 'Haritada İşler',
      salaryTrends: 'Maaş Eğilimleri',
      myApplications: 'Başvurularım',
      calculia: 'Salaria & Vacatia',
      googleChat: 'Google Chat İletişim',
      candidate: 'İş Arayan',
      employer: 'İşveren',
      admin: 'Yönetici Paneli',
      pricing: 'VIP Planlar',
      login: 'Giriş Yap',
      logout: 'Çıkış',
      postJob: 'İlan Yayınla',
    },
    jobAlerts: {
      title: 'İlan Alarmları',
      manage: 'Alarmları Yönet',
      active: 'Aktif Bildirimler',
    },
    profile: {
      profileTitle: 'Ayarlar ve Profil',
      settings: 'Hesap Ayarları',
      notifications: 'Bildirim Tercihleri',
    },
    header: {
      searchPlaceholder: 'Pozisyon, şirket veya anahtar kelime...',
      notificationsTitle: 'Bildirimler',
      roleSwitcher: 'Rol Değiştir',
    },
    cv: {
      title: 'Profesyonel Özgeçmiş',
      create: 'CV Oluştur',
      download: 'PDF İndir',
    },
    auth: {
      loginTitle: 'Giriş Yap',
      registerTitle: 'Kayıt Ol',
      email: 'E-posta adresi',
      password: 'Şifre',
    },
    common: {
      apply: 'Başvur',
      cancel: 'İptal',
      save: 'Kaydet',
      close: 'Kapat',
      loading: 'Yükleniyor...',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentLangOption: LanguageOption;
  dict: TranslationDictionary;
  brandAcronym: string;
  brandAcronymFull: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('jobia_lang') as Language;
      if (saved && ['az', 'en', 'ru', 'tr'].includes(saved)) {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return 'az';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('jobia_lang', lang);
    } catch (e) {
      // ignore
    }
  };

  const currentLangOption = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  const dict = useMemo(() => {
    return DICTIONARIES[language] || DICTIONARIES.az;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLangOption,
        dict,
        brandAcronym: 'JOBIA',
        brandAcronymFull: 'Job Intelligence & Automation',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return safe fallback if used outside provider
    const fallbackLangOption = SUPPORTED_LANGUAGES[0];
    return {
      language: 'az',
      setLanguage: () => {},
      currentLangOption: fallbackLangOption,
      dict: DICTIONARIES.az,
      brandAcronym: 'JOBIA',
      brandAcronymFull: 'Job Intelligence & Automation',
    };
  }
  return context;
};
