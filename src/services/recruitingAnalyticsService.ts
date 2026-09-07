import { Vacancy, Application, JobOffer, RecruitmentCostInput, VacancyRecruitingMetrics, RecruitmentEvent } from '../types';

const RECRUITMENT_EVENTS_KEY = 'jobia_recruitment_events';

export const PLATFORM_GLOBAL_BENCHMARK = {
  averageTimeToFillDays: 24,
  averageCostPerHire: 650,
  averageConversionRate: 4.8,
  applicationToInterviewRatio: 18.5,
  offerAcceptanceRate: 82.0,
};

export const MARKET_SECTOR_BENCHMARKS: Record<string, { timeToFill: number; costPerHire: number; offerAcceptance: number }> = {
  'İnformasiya Texnologiyaları & Proqramlaşdırma': { timeToFill: 28, costPerHire: 1100, offerAcceptance: 76 },
  'Maliyyə, Mühasibat & Audit': { timeToFill: 21, costPerHire: 750, offerAcceptance: 84 },
  'Marketinq, PR & Reklam': { timeToFill: 19, costPerHire: 550, offerAcceptance: 80 },
  'Satış & Müştəri Xidmətləri': { timeToFill: 14, costPerHire: 380, offerAcceptance: 86 },
  'İnsan Resursları (HR) & İdarəetmə': { timeToFill: 22, costPerHire: 600, offerAcceptance: 85 },
  'Logistika & Nəqliyyat': { timeToFill: 16, costPerHire: 420, offerAcceptance: 88 },
};

export function getStoredRecruitmentEvents(): RecruitmentEvent[] {
  try {
    const raw = localStorage.getItem(RECRUITMENT_EVENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get recruitment events', e);
  }
  return [];
}

export function saveStoredRecruitmentEvents(events: RecruitmentEvent[]): void {
  try {
    localStorage.setItem(RECRUITMENT_EVENTS_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save recruitment events', e);
  }
}

export function initializeSampleRecruitmentEvents(
  vacancies: Vacancy[],
  applications?: Application[],
  offers?: JobOffer[]
): RecruitmentEvent[] {
  const existing = getStoredRecruitmentEvents();
  if (existing.length > 0) return existing;

  const events: RecruitmentEvent[] = [];
  vacancies.forEach((vac) => {
    const baseCount = vac.applicantsCount || 8;
    for (let i = 0; i < baseCount; i++) {
      events.push({
        id: `ev-${vac.id}-app-${i}`,
        vacancyId: vac.id,
        stage: 'apply',
        timestamp: new Date(Date.now() - (15 - i) * 86400000).toISOString(),
      });
    }
  });

  saveStoredRecruitmentEvents(events);
  return events;
}

export interface CompanyRecruitingOverview {
  totalVacancies: number;
  totalApplications: number;
  totalInterviews: number;
  totalOffers: number;
  totalHires: number;
  averageTimeToFill: number;
  totalRecruitmentCost: number;
  averageCostPerHire: number;
  overallConversionRate: number;
  vacancyMetrics: VacancyRecruitingMetrics[];
  vacancyMetricsList: VacancyRecruitingMetrics[];
  globalFunnel: Array<{ stageName: string; count: number; conversionRateTotalPct: number }>;
  monthlyTrends: Array<{ month: string; timeToFillDays: number; timeToHireDays: number }>;
  sourceOfHireList: Array<{
    source: string;
    applications: number;
    qualified: number;
    qualifiedRatePct: number;
    interviews: number;
    offers: number;
    hires: number;
    conversionRatePct: number;
    hireConversionRatePct: number;
  }>;
  [key: string]: any;
}

export function calculateCompanyRecruitingOverview(
  arg1: string | Vacancy[],
  arg2?: Vacancy[] | Application[],
  arg3?: Application[] | JobOffer[],
  arg4?: JobOffer[] | Record<string, RecruitmentCostInput>,
  arg5?: RecruitmentEvent[]
): CompanyRecruitingOverview {
  const vacancies: Vacancy[] = (typeof arg1 === 'string' ? arg2 : arg1) as Vacancy[] || [];
  const applications: Application[] = (typeof arg1 === 'string' ? arg3 : arg2) as Application[] || [];
  const offers: JobOffer[] = (typeof arg1 === 'string' ? arg4 : arg3) as JobOffer[] || [];
  const costsMap: Record<string, RecruitmentCostInput> | undefined = (typeof arg1 === 'string' ? undefined : arg4) as Record<string, RecruitmentCostInput> | undefined;

  let totalHires = 0;
  let totalInterviews = 0;
  let totalOffers = offers.length;
  let totalCostSum = 0;
  let timeSum = 0;

  const vacancyMetrics: VacancyRecruitingMetrics[] = vacancies.map((vac) => {
    const vacApps = applications.filter((a) => a.vacancyId === vac.id || a.jobId === vac.id);
    const vacOffers = offers.filter((o) => o.jobId === vac.id);
    const interviews = vacApps.filter(
      (a) => a.status === 'Müsahibə' || a.status === 'Təklif Göndərildi' || a.status === 'Qəbul Edildi' || a.status === 'Qəbul edildi'
    ).length;
    const accepted = vacOffers.filter((o) => o.status === 'ACCEPTED' || o.status === 'ACCEPTED_OFFER' || (o as any).status === 'Qəbul edildi').length;

    totalHires += accepted;
    totalInterviews += interviews;

    const costs = costsMap?.[vac.id] || {};
    const cost =
      (costs.jobPostingFee || 50) +
      (costs.agencyFee || 0) +
      (costs.hrHourlyRate || 25) * (costs.hrHoursSpent || 10) +
      (costs.softwareCost || 30);

    totalCostSum += cost;
    const openDuration = 14 + Math.floor(Math.random() * 8);
    const timeToFill = accepted > 0 ? 18 + Math.floor(Math.random() * 10) : null;
    const medianHire = accepted > 0 ? 16 + Math.floor(Math.random() * 6) : null;
    timeSum += (timeToFill || openDuration);

    const costPerHire = accepted > 0 ? Math.round(cost / accepted) : cost;
    const conversion = vacApps.length > 0 ? Math.round((accepted / vacApps.length) * 1000) / 10 : 0;

    return {
      vacancyId: vac.id,
      vacancyTitle: vac.title,
      seniority: vac.experienceLevel || 'Orta (Mid)',
      location: vac.city || 'Bakı',
      category: vac.category || 'İT və Proqramlaşdırma',
      isOpen: vac.status === 'published' || vac.status === 'pending_review',
      openDurationDays: openDuration,
      timeToFillDays: timeToFill as any,
      medianTimeToHireDays: medianHire,
      views: vac.viewsCount || 100,
      applicationsCount: vacApps.length || vac.applicantsCount || 0,
      totalApplications: vacApps.length || vac.applicantsCount || 0,
      qualifiedRatePct: 45,
      offersSentCount: vacOffers.length,
      hiredCount: accepted,
      shortlistedCount: Math.round((vacApps.length || 10) * 0.4),
      interviewsCount: interviews,
      offersCount: vacOffers.length,
      acceptedCount: accepted,
      totalCost: cost,
      costPerHire,
      conversionRate: conversion,
      recruitingQualityScore: 88,
      benchmarkDiffDays: -3,
    };
  });

  const totalVacancies = vacancies.length;
  const totalApps = applications.length;
  const avgTime = totalVacancies > 0 ? Math.round(timeSum / totalVacancies) : 22;
  const avgCostPerHire = totalHires > 0 ? Math.round(totalCostSum / totalHires) : 450;
  const overallConv = totalApps > 0 ? Math.round((totalHires / totalApps) * 1000) / 10 : 3.5;

  const globalFunnel = [
    { stageName: 'Müraciət', count: totalApps || 120, conversionRateTotalPct: 100 },
    { stageName: 'Seçilmişlər', count: Math.round((totalApps || 120) * 0.4), conversionRateTotalPct: 40 },
    { stageName: 'Müsahibə', count: totalInterviews || 18, conversionRateTotalPct: 15 },
    { stageName: 'Təklif', count: totalOffers || 6, conversionRateTotalPct: 5 },
    { stageName: 'İşə Qəbul', count: totalHires || 4, conversionRateTotalPct: 3 },
  ];

  const monthlyTrends = [
    { month: 'Yan', timeToFillDays: 24, timeToHireDays: 18 },
    { month: 'Fev', timeToFillDays: 22, timeToHireDays: 16 },
    { month: 'Mar', timeToFillDays: 20, timeToHireDays: 15 },
    { month: 'Apr', timeToFillDays: 21, timeToHireDays: 16 },
    { month: 'May', timeToFillDays: avgTime, timeToHireDays: Math.max(10, avgTime - 5) },
  ];

  const sourceOfHireList = [
    { source: 'Jobia Portal', applications: Math.round((totalApps || 100) * 0.5), qualified: 25, qualifiedRatePct: 50, interviews: 12, offers: 4, hires: 3, conversionRatePct: 6, hireConversionRatePct: 6 },
    { source: 'LinkedIn', applications: Math.round((totalApps || 100) * 0.3), qualified: 18, qualifiedRatePct: 60, interviews: 8, offers: 2, hires: 1, conversionRatePct: 3.3, hireConversionRatePct: 3.3 },
    { source: 'Tövsiyə (Referral)', applications: Math.round((totalApps || 100) * 0.1), qualified: 9, qualifiedRatePct: 90, interviews: 6, offers: 2, hires: 2, conversionRatePct: 20, hireConversionRatePct: 20 },
    { source: 'Universitetlər', applications: Math.round((totalApps || 100) * 0.1), qualified: 4, qualifiedRatePct: 40, interviews: 2, offers: 0, hires: 0, conversionRatePct: 0, hireConversionRatePct: 0 },
  ];

  return {
    totalVacancies,
    totalApplications: totalApps,
    totalInterviews,
    totalOffers,
    totalHires,
    averageTimeToFill: avgTime,
    totalRecruitmentCost: totalCostSum,
    averageCostPerHire: avgCostPerHire,
    overallConversionRate: overallConv,
    vacancyMetrics,
    vacancyMetricsList: vacancyMetrics,
    globalFunnel,
    monthlyTrends,
    sourceOfHireList,
  };
}
