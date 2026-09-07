import { JobOfferTemplate } from '../types';

const OFFER_TEMPLATES_KEY = 'jobia_offer_templates';

export const DEFAULT_OFFER_TEMPLATES: JobOfferTemplate[] = [
  {
    id: 'tpl-standard',
    title: 'Standart Tam Ştat Əmək Təklifi (Standart)',
    department: 'Əməliyyat və İnzibati',
    probationPeriod: '3 (üç) ay',
    workingSchedule: 'Bazar ertəsi - Cümə, 09:00 - 18:00',
    annualLeave: '21 təqvim günü əsas məzuniyyət',
    benefits: [
      'Könüllü tibbi sığorta təminatı',
      'Korporativ mobil nömrə və rabitə limiti',
      'Təlim və peşəkar inkişaf dəstəyi',
    ],
    additionalTerms: 'İşçi sınaq müddətini uğurla başa vurduqdan sonra illik fəaliyyət qiymətləndirməsi əsasında bonus proqramına daxil edilir.',
    language: 'az',
  },
  {
    id: 'tpl-it',
    title: 'İT & Rəqəmsal İnkişaf Təklifi (Hibrid/Remote)',
    department: 'Texnologiya & Proqramlaşdırma',
    probationPeriod: '3 (üç) ay',
    workingSchedule: 'Çevik qrafik (Flexible hours) / Hibrid',
    annualLeave: '24 təqvim günü məzuniyyət',
    benefits: [
      'Genişləndirilmiş Ailəvi Tibbi Sığorta',
      'Müasir texniki avadanlıq (MacBook Pro / ThinkPad)',
      'İllik konfrans və beynəlxalq sertifikasiya büdcəsi (1500 AZN)',
      'İdman zalı və sağlamlıq kompensasiyası',
    ],
    additionalTerms: 'Uzaqdan (Remote) iş rejimi çərçivəsində bütün avadanlıq və lisenziya xərcləri şirkət tərəfindən qarşılanır.',
    language: 'az',
  },
];

export function getOfferTemplates(): JobOfferTemplate[] {
  try {
    const raw = localStorage.getItem(OFFER_TEMPLATES_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(OFFER_TEMPLATES_KEY, JSON.stringify(DEFAULT_OFFER_TEMPLATES));
    return DEFAULT_OFFER_TEMPLATES;
  } catch {
    return DEFAULT_OFFER_TEMPLATES;
  }
}

export function saveOfferTemplates(templates: JobOfferTemplate[]): void {
  try {
    localStorage.setItem(OFFER_TEMPLATES_KEY, JSON.stringify(templates));
  } catch (e) {
    console.error('Failed to save offer templates', e);
  }
}
