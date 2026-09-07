export type Language = 'az' | 'en' | 'ru' | 'tr';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'az', label: 'AZ', nativeName: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'en', label: 'EN', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'RU', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'tr', label: 'TR', nativeName: 'Türkçe', flag: '🇹🇷' },
];

export interface TranslationDictionary {
  nav: {
    jobs: string;
    cvBuilder: string;
    cvAnalyzer: string;
    nearbyJobs: string;
    salaryTrends: string;
    myApplications: string;
    calculia: string;
    googleChat: string;
    candidate: string;
    employer: string;
    admin: string;
    pricing: string;
    login: string;
    logout: string;
    postJob: string;
  };
  cvPreview?: {
    title?: string;
    subtitle?: string;
    zoomOut?: string;
    zoomIn?: string;
    fitToScreen?: string;
    changeTemplate?: string;
    preparingPdf?: string;
    downloadPdf?: string;
    [key: string]: any;
  };
  jobAlerts?: {
    title: string;
    manage: string;
    active: string;
  };
  profile?: {
    profileTitle: string;
    settings: string;
    notifications: string;
  };
  header?: {
    searchPlaceholder: string;
    notificationsTitle: string;
    roleSwitcher: string;
  };
  cv?: {
    title: string;
    create: string;
    download: string;
  };
  auth?: {
    loginTitle: string;
    registerTitle: string;
    email: string;
    password: string;
  };
  common?: {
    apply: string;
    cancel: string;
    save: string;
    close: string;
    loading: string;
  };
  [key: string]: any;
}
