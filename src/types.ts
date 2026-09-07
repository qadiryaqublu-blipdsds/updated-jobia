export type UserRole = 'candidate' | 'business' | 'admin';

export type ApplicationStatus =
  | 'Müraciət edildi'
  | 'Baxılır'
  | 'Baxıldı'
  | 'Qısa Siyahı'
  | 'Müsahibə'
  | 'Müsahibəyə dəvət'
  | 'Təklif Göndərildi'
  | 'Təklif verildi'
  | 'Qəbul Edildi'
  | 'Qəbul edildi'
  | 'İmtina'
  | 'İmtina edildi'
  | string;

export type EmploymentType = 'Tam ştat' | 'Natamam ştat' | 'Məsafədən (Remote)' | 'Hibrid' | 'Təcrübəçi' | string;
export type ExperienceLevel = 'Təcrübəsiz / Junior' | '1-3 il (Mid)' | '3-5 il (Senior)' | '5+ il (Lead/Head)' | string;

export type CVTemplateType =
  | 'horizon'
  | 'nordic'
  | 'modern'
  | 'minimal'
  | 'executive'
  | 'creative'
  | 'modern-emerald'
  | 'ats-standard'
  | 'tech-lead'
  | string;
export type CVLanguage = 'az' | 'en' | 'ru' | 'tr';
export type CVPhotoSize = '112px' | '140px' | '168px' | 'sm' | 'md' | 'lg' | 'xl';
export type CVPhotoShape = 'circle' | 'rounded' | 'square';

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  city?: string;
  address?: string;
  summary: string;
  photoUrl?: string;
  socialLinks?: SocialLinks;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  photoSize?: CVPhotoSize;
  photoShape?: CVPhotoShape;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  location?: string;
  achievements?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  gpa?: string;
  location?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: 'Başlanğıc' | 'Orta' | 'Yaxşı' | 'Əla' | 'Ekspert' | string;
  category?: 'Texniki' | 'Soft skill' | 'Alət / Proqram' | string;
}

export interface LanguageItem {
  id: string;
  language?: string;
  name?: string;
  proficiency?: 'Ana dili' | 'Sərbəst (C1-C2)' | 'Orta (B1-B2)' | 'Baza (A1-A2)' | string;
  level?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  link?: string;
  technologies?: string[];
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  issueDate?: string;
  url?: string;
}

export interface CVData {
  id?: string;
  title?: string;
  fullName?: string;
  professionalTitle?: string;
  about?: string;
  lastUpdated?: string;
  personalInfo: PersonalInfo;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  language?: CVLanguage;
  photoSize?: CVPhotoSize;
  photoShape?: CVPhotoShape;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  size?: string;
  description?: string;
  location?: string;
  address?: string;
  contactPerson?: string;
  contactPosition?: string;
  hrContactName?: string;
  hrContactPosition?: string;
  employeeCount?: string | number;
  activeJobsCount?: number;
  requireOfferApproval?: boolean;
  verified: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected' | 'suspended';
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Vacancy {
  id: string;
  title: string;
  department?: string;
  category: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  companyVerified?: boolean;
  city: string;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  metroStation?: string;
  workplaceType: 'remote' | 'hybrid' | 'on-site' | string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  education?: string;
  minSalary?: number;
  maxSalary?: number;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  hideSalary?: boolean;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  deadline: string;
  postedDate: string;
  status: 'draft' | 'pending_review' | 'published' | 'rejected' | 'paused' | 'closed';
  isApproved?: boolean;
  isFeatured?: boolean;
  viewsCount?: number;
  applicantsCount?: number;
  contactPhone?: string;
  contactWhatsapp?: string;
  isBlueCollarFriendly?: boolean;
  editCount?: number;
  maxEditsAllowed?: number;
  lastEditedAt?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Application {
  id: string;
  jobId?: string;
  vacancyId: string;
  vacancyTitle: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  candidateId?: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidatePhoto?: string;
  appliedDate: string;
  status: ApplicationStatus;
  coverNote?: string;
  cvUrl?: string;
  cvData?: CVData;
  cvFileName?: string;
  cvFileType?: string;
  cvFileData?: string;
  matchScore?: number;
  matchHighlights?: string[];
  recruiterNotes?: string;
  isGuestApplication?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  phone: string;
  companyId?: string;
  companyName?: string;
  companyDescription?: string;
  status?: 'active' | 'suspended' | 'pending';
  emailVerified?: boolean;
  verificationCode?: string;
  verificationCodeSentAt?: string;
  verificationCodeExpiresAt?: string;
  createdAt?: string;
  lastLoginAt?: string;
  avatarUrl?: string;
  notifyOnJobAlerts?: boolean;
  notifyOnOfferUpdates?: boolean;
  notifyOnMarketing?: boolean;
}

export interface AuthSession {
  user: User;
  token?: string;
  expiresAt?: string;
}

export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionTier = 'FREE' | 'PRO' | 'BUSINESS' | 'PREMIUM';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  targetRole: UserRole;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: string[];
  limits: {
    maxJobPosts?: number;
    maxFeaturedJobs?: number;
    maxCVDownloads?: number;
    aiInterviewLimit?: number;
    canViewAnalytics?: boolean;
    canUseATS?: boolean;
    directChat?: boolean;
  };
}

export interface UserSubscription {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  role?: UserRole;
  planId?: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  startDate: string;
  endDate?: string;
  currentPeriodEnd?: string;
  amount?: number;
  currency?: string;
  paymentProvider?: string;
  paymentId?: string;
  autoRenew?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  subscriptionId?: string;
  planName: string;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED';
  paymentMethod: string;
  cardLast4?: string;
  transactionDate: string;
  createdAt?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | 'application_submitted'
    | 'status_changed'
    | 'interview_invite'
    | 'job_offer'
    | 'company_verification'
    | 'vacancy_approval'
    | 'new_applicant'
    | 'new_matching_vacancy'
    | 'payment_success'
    | string;
  isRead: boolean;
  link?: string;
  data?: Record<string, any>;
  createdAt: string;
}

export interface JobOffer {
  id: string;
  jobId?: string;
  applicationId?: string;
  candidateId?: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
  hrContactPerson?: string;
  hrContactPosition?: string;
  position: string;
  department?: string;
  employmentType: string;
  workLocation: string;
  startDate: string;
  grossSalary: number;
  netSalary: number;
  probationPeriod?: string;
  workingSchedule?: string;
  annualLeave?: string;
  bonus?: string;
  benefits?: string[];
  additionalTerms?: string;
  templateId?: string;
  language?: 'az' | 'en';
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | string;
  secureToken?: string;
  acceptedAt?: string;
  declinedAt?: string;
  viewedAt?: string;
  declineReason?: {
    reasonText?: string;
    category?: string;
  };
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OfferAuditLog {
  id: string;
  offerId: string;
  action: 'CREATED' | 'UPDATED' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | string;
  actor?: string;
  actorName?: string;
  details?: string;
  timestamp: string;
}

export interface JobOfferTemplate {
  id: string;
  title: string;
  position?: string;
  department?: string;
  defaultGrossSalary?: number;
  employmentType?: string;
  workLocation?: string;
  probationPeriod?: string;
  workingSchedule?: string;
  annualLeave?: string;
  defaultBenefits?: string[];
  benefits?: string[];
  additionalTerms?: string;
  language?: 'az' | 'en';
  createdAt?: string;
}

export type AdminAuditAction =
  | 'USER_STATUS_CHANGE'
  | 'USER_ROLE_CHANGE'
  | 'VACANCY_APPROVE'
  | 'VACANCY_REJECT'
  | 'VACANCY_DELETE'
  | 'COMPANY_VERIFY'
  | 'SUBSCRIPTION_UPDATE'
  | 'SETTING_CHANGE';

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  adminName?: string;
  adminRole?: string;
  action: AdminAuditAction | string;
  targetType: 'user' | 'vacancy' | 'company' | 'subscription' | 'payment' | 'setting';
  targetId: string;
  targetName?: string;
  previousStatus?: string;
  newStatus?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  [key: string]: any;
}

export interface JobAlertSubscription {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  categories: string[];
  companies: string[];
  companyIds?: string[];
  isActive: boolean;
  frequency: 'instant' | 'daily';
  createdAt?: string;
  updatedAt?: string;
}

export interface PlatformSettings {
  id: string;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  requireEmailVerification: boolean;
  featuredJobPrice: number;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface BulletImprovement {
  original: string;
  improved: string;
  reason?: string;
  originalOrWeakness?: string;
  explanation?: string;
}

export interface ATSCheckList {
  hasContactInfo: boolean;
  hasSummary: boolean;
  hasClearSections: boolean;
  hasQuantifiableResults: boolean;
  atsReadabilityNotes?: string[];
  [key: string]: any;
}

export interface CVAnalysisResult {
  overallScore: number;
  score?: number;
  scoreLabel?: string;
  atsScore?: number;
  candidateName?: string;
  detectedRole?: string;
  seniorityLevel?: string;
  executiveSummary?: string | { verdict?: string };
  candidateSummary?: string;
  summaryFeedback?: string;
  suggestedProfileSummary?: string;
  strengths?: string[];
  weaknesses?: string[];
  missingKeywords?: string[];
  recommendedSkills?: string[];
  bulletImprovements?: BulletImprovement[];
  atsChecks?: ATSCheckList;
  metrics?: {
    bulletCount?: number;
    actionVerbScore?: number;
    metricScore?: number;
    clarityScore?: number;
    [key: string]: any;
  };
  interviewQuestions?: Array<any>;
  careerFit?: {
    fitScore?: number;
    primaryDomain?: string;
    totalExperienceEstimate?: string;
    recommendedIndustries?: string[];
    topRoles?: string[];
    suitableRoles?: Array<{ role: string; matchPercentage: number; reason: string }>;
    growthTrajectory?: string;
    salaryRange?: { min: number; max: number; currency: string };
  };
  experienceHistory?: any[];
  educationHistory?: any[];
}

export interface FactualCVExtractionBlocks {
  blockA_PersonalInfo?: {
    fullName?: string;
    phone?: string;
    email?: string;
    city?: string;
    jobTitle?: string;
    links?: string;
  };
  blockB_Education?: Array<{
    institution: string;
    degree?: string;
    field?: string;
    fieldOfStudy?: string;
    years?: string;
    dates?: string;
  }>;
  blockC_Experience?: Array<{
    company: string;
    position: string;
    dates?: string;
    duration?: string;
    responsibilities?: string[];
    dutiesAndAchievements?: string[];
  }>;
  blockD_LanguagesAndCertificates?: {
    languages?: Array<{ language: string; level: string }>;
    certificates?: Array<{ name: string; date?: string }>;
  };
  blockD_Skills?: string[];
  blockE_Languages?: string[];
  blockE_TechnicalSkills?: string[];
  blockF_AuditNotes?: string[];
  auditAndReview?: {
    strengths?: string[];
    discrepanciesAndGaps?: string[];
    improvementSuggestions?: string[];
  };
}

export interface RecruitmentCostInput {
  jobPostingFee?: number;
  agencyFee?: number;
  hrHourlyRate?: number;
  hrHoursSpent?: number;
  softwareCost?: number;
  jobAdvertising?: number;
  referralBonus?: number;
  paidPromotion?: number;
  recruitmentSoftware?: number;
  otherExpenses?: number;
  [key: string]: any;
}

export interface VacancyRecruitingMetrics {
  vacancyId: string;
  views: number;
  applicationsCount: number;
  totalApplications?: number;
  shortlistedCount: number;
  interviewsCount: number;
  offersCount: number;
  acceptedCount: number;
  timeToFillDays?: number | null;
  openDurationDays?: number;
  medianTimeToHireDays?: number | null;
  vacancyTitle?: string;
  seniority?: string;
  location?: string;
  category?: string;
  isOpen?: boolean;
  qualifiedRatePct?: number;
  offersSentCount?: number;
  hiredCount?: number;
  recruitingQualityScore?: number;
  benchmarkDiffDays?: number;
  totalCost: number;
  costPerHire: number;
  conversionRate: number;
  topCandidateScore?: number;
  candidatesAbove80ScorePct?: number;
  candidatesAbove90ScorePct?: number;
  funnelStages?: Array<{
    stage?: string;
    stageKey?: string;
    stageName?: string;
    stageNameEn?: string;
    count: number;
    percentage?: number;
    conversionRateTotalPct?: number;
    dropOffCount?: number;
    dropOffPct?: number;
    color?: string;
    [key: string]: any;
  }>;
  milestones?: Array<{
    id?: string;
    title: string;
    date: string;
    status?: string;
    description?: string;
    elapsedFromPrevious?: string;
    actor?: string;
    details?: string;
    [key: string]: any;
  }>;
  insights?: Array<any>;
  [key: string]: any;
}

export interface RecruitmentEvent {
  id: string;
  vacancyId: string;
  candidateId?: string;
  stage: 'view' | 'apply' | 'shortlist' | 'interview' | 'offer' | 'hire';
  timestamp: string;
  meta?: Record<string, any>;
}
