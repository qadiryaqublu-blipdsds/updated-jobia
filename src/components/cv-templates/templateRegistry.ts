export interface CVTemplateMeta {
  id: string;
  name: string;
  category: 'Sadə' | 'Rəhbər' | 'Xidmət & Texniki' | 'Modern' | 'Klassik' | 'ATS' | 'Kreativ' | 'Texnoloji' | 'Akademik' | string;
  badge?: string;
  description: string;
  accentColor: string;
  colorTheme?: string;
  tags: string[];
}

export const CV_TEMPLATES: CVTemplateMeta[] = [
  {
    id: 'horizon',
    name: 'Horizon Professional',
    category: 'Modern',
    badge: 'Populyar',
    description: 'Yuxarı başlıqlı, zərif mavi qradiyentli, hər iki sütunlu müasir korporativ tərtibat.',
    accentColor: '#1d4ed8',
    tags: ['Korporativ', 'Texnologiya', 'Maliyyə'],
  },
  {
    id: 'nordic',
    name: 'Nordic Clean & Minimal',
    category: 'Sadə',
    badge: 'Skandinav',
    description: 'Ağ-boz zərif tonlar, geniş sətirarası məsafə və yüksək oxunma asanlığı.',
    accentColor: '#0f172a',
    tags: ['Minimalist', 'Skandinav', 'Dizayn'],
  },
  {
    id: 'modern-emerald',
    name: 'Emerald Executive',
    category: 'Rəhbər',
    badge: 'Premium',
    description: 'Zümrüd yaşılı vurğular, güclü rəhbərlik profili və ölçülə bilən nailiyyətlər üçün ideal struktur.',
    accentColor: '#059669',
    tags: ['Menecment', 'Rəhbər', 'Bankçılıq'],
  },
  {
    id: 'ats-standard',
    name: 'ATS Ultra-Scanner',
    category: 'ATS',
    badge: 'ATS 99%',
    description: 'Süni intellekt və ATS skanerləri üçün 100% təmiz mətn iyerarxiyası və sıfır xəta formatı.',
    accentColor: '#2563eb',
    tags: ['ATS Uyğun', 'Xarici Şirkətlər', 'Skaner'],
  },
  {
    id: 'tech-slate',
    name: 'Tech Stack Slate',
    category: 'Texnoloji',
    badge: 'İT Seçimi',
    description: 'Proqramçılar, data analitiklər və mühəndislər üçün layihələr və texnoloji bacarıqlar ön planda.',
    accentColor: '#0284c7',
    tags: ['Frontend', 'Backend', 'DevOps'],
  },
  {
    id: 'creative-amber',
    name: 'Creative Amber Studio',
    category: 'Kreativ',
    badge: 'Kreativ',
    description: 'Dizaynerlər, marketoloqlar və media mütəxəssisləri üçün isti sarı vurğulu portfel stili.',
    accentColor: '#d97706',
    tags: ['Dizayn', 'Marketinq', 'SMM'],
  },
];
