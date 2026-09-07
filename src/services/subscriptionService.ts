import { UserSubscription, SubscriptionPlan, SubscriptionTier, PaymentTransaction, UserRole } from '../types';

const SUBSCRIPTIONS_KEY = 'jobia_user_subscriptions';
const TRANSACTIONS_KEY = 'jobia_payment_transactions';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'candidate-free',
    name: 'Baza Namizəd',
    tier: 'FREE',
    targetRole: 'candidate',
    priceMonthly: 0,
    priceYearly: 0,
    currency: 'AZN',
    features: [
      'Bütün aktiv vakansiyalara birbaşa müraciət',
      'Standart CV yaratmaq və saxlamaq',
      'Xəritə üzərindən yaxın işləri tapmaq',
      'Salaria & Vacatia kalkulyatoru',
    ],
    limits: {
      maxCVDownloads: 3,
      aiInterviewLimit: 1,
      canUseATS: false,
    },
  },
  {
    id: 'candidate-pro',
    name: 'Karyera Pro VIP',
    tier: 'PRO',
    targetRole: 'candidate',
    priceMonthly: 9.99,
    priceYearly: 89.99,
    currency: 'AZN',
    features: [
      'Limitsiz PDF CV yükləmələri (bütün premium şablonlar)',
      'AI Dərin CV Audit və ATS Optimizatoru',
      'Süni İntellektlə limitsiz Müsahibə Simulyatoru',
      'İşəgötürənlərin axtarışında fərqləndirilmiş profil',
      'Yeni uyğun vakansiyalar üçün ani SMS/Email bildirişi',
    ],
    limits: {
      maxCVDownloads: 9999,
      aiInterviewLimit: 9999,
      canUseATS: true,
      directChat: true,
    },
  },
  {
    id: 'business-standard',
    name: 'Biznes Standart',
    tier: 'FREE',
    targetRole: 'business',
    priceMonthly: 0,
    priceYearly: 0,
    currency: 'AZN',
    features: [
      'Aylıq 2 pulsuz vakansiya elanı',
      'Namizədlərin müraciət bazasını idarə etmək',
      'Standart iş təklifi şablonları',
    ],
    limits: {
      maxJobPosts: 2,
      maxFeaturedJobs: 0,
      canViewAnalytics: false,
    },
  },
  {
    id: 'business-growth',
    name: 'Biznes Korporativ Growth',
    tier: 'BUSINESS',
    targetRole: 'business',
    priceMonthly: 79.99,
    priceYearly: 799.99,
    currency: 'AZN',
    features: [
      'Aylıq limitsiz vakansiya paylaşımı',
      '3 ədəd VIP önə çəkilmiş (Featured) vakansiya yeri',
      'Tam Rekrutment Analitika Paneli & Funnel Təhlili',
      'Rəqəmsal İş Təklifi (Job Offer) və Audit jurnalı',
      'Şirkət profili üçün rəsmi mavi təsdiq nişanı (Verified)',
      'İşə qəbul xərcləri və Cost-per-Hire avtomatlaşdırılması',
    ],
    limits: {
      maxJobPosts: 9999,
      maxFeaturedJobs: 3,
      canViewAnalytics: true,
      directChat: true,
    },
  },
  {
    id: 'business-enterprise',
    name: 'Enterprise VIP Platinum',
    tier: 'PREMIUM',
    targetRole: 'business',
    priceMonthly: 199.99,
    priceYearly: 1899.99,
    currency: 'AZN',
    features: [
      'Limitsiz vakansiyalar və limitsiz VIP önə çıxarılma',
      'Fərdi HR menecer dəstəyi və namizəd skrinqi',
      'Google Chat və WhatsApp işə qəbul bot inteqrasiyası',
      'Xüsusi API çıxışları və ATS inteqrasiyaları',
    ],
    limits: {
      maxJobPosts: 99999,
      maxFeaturedJobs: 999,
      canViewAnalytics: true,
      directChat: true,
    },
  },
];

export function getStoredSubscriptions(): UserSubscription[] {
  try {
    const raw = localStorage.getItem(SUBSCRIPTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse subscriptions', e);
  }
  return [];
}

export function saveStoredSubscriptions(subs: UserSubscription[]): void {
  try {
    localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subs));
  } catch (e) {
    console.error('Failed to save subscriptions', e);
  }
}

export function getStoredTransactions(): PaymentTransaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse transactions', e);
  }
  return [];
}

export function saveStoredTransactions(txs: PaymentTransaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txs));
  } catch (e) {
    console.error('Failed to save transactions', e);
  }
}

export function getUserSubscription(userId?: string, role: UserRole = 'candidate'): UserSubscription | null {
  const subs = getStoredSubscriptions();
  if (userId) {
    const sub = subs.find((s) => s.userId === userId && s.status === 'ACTIVE');
    if (sub) return sub;
  }
  // Return default active FREE tier for the role
  return {
    id: `sub-default-${userId || 'guest'}`,
    userId: userId || 'guest',
    tier: 'FREE',
    status: 'ACTIVE',
    startDate: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    billingCycle: 'yearly',
  };
}

export function updateUserSubscription(
  userId?: string,
  tier: SubscriptionTier = 'PRO',
  billingCycle: 'monthly' | 'yearly' = 'yearly'
): UserSubscription {
  const subs = getStoredSubscriptions();
  const validUserId = userId || 'current-user';

  const newSub: UserSubscription = {
    id: `sub-${Date.now()}`,
    userId: validUserId,
    tier,
    status: 'ACTIVE',
    startDate: new Date().toISOString(),
    currentPeriodEnd: new Date(
      Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
    ).toISOString(),
    billingCycle,
  };

  const filtered = subs.filter((s) => s.userId !== validUserId);
  filtered.push(newSub);
  saveStoredSubscriptions(filtered);

  return newSub;
}

export function checkFeatureAccess(
  sub: UserSubscription | null,
  feature: 'ats_analysis' | 'unlimited_cv' | 'recruiting_analytics' | 'featured_job' | 'job_offer_portal' | string,
  userRole?: UserRole
): { allowed: boolean; requiredTier: SubscriptionTier; featureTitle: string; featureDescription: string } {
  const tier = sub?.tier || 'FREE';

  if (feature === 'ats_analysis' || feature === 'unlimited_cv') {
    if (tier === 'PRO' || tier === 'BUSINESS' || tier === 'PREMIUM') {
      return {
        allowed: true,
        requiredTier: 'PRO',
        featureTitle: 'AI ATS və CV Analizi',
        featureDescription: 'CV-nizi ATS sistemlərinə tam uyğunlaşdırın.',
      };
    }
    return {
      allowed: false,
      requiredTier: 'PRO',
      featureTitle: 'AI ATS və CV Analizi',
      featureDescription: 'Bu funksiyadan istifadə üçün Karyera Pro VIP abunəliyi tələb olunur.',
    };
  }

  if (feature === 'recruiting_analytics' || feature === 'featured_job') {
    if (tier === 'BUSINESS' || tier === 'PREMIUM') {
      return {
        allowed: true,
        requiredTier: 'BUSINESS',
        featureTitle: 'İşə Qəbul Analitikası və Funnel',
        featureDescription: 'Vakansiya üzrə ətraflı statistikaya baxın.',
      };
    }
    return {
      allowed: false,
      requiredTier: 'BUSINESS',
      featureTitle: 'İşə Qəbul Analitikası və Funnel',
      featureDescription: 'Bu funksiya Biznes Korporativ Growth abunəliyi ilə təqdim olunur.',
    };
  }

  return {
    allowed: true,
    requiredTier: 'FREE',
    featureTitle: 'Əsas Funksiya',
    featureDescription: 'İstifadə üçün açıqdır.',
  };
}
