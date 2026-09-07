import {
  Vacancy,
  Company,
  Application,
  JobOffer,
  CVData,
  AppNotification,
  AdminAuditLog,
  UserSubscription,
  PaymentTransaction,
  User,
  ApplicationStatus,
  UserRole
} from '../types';
import { SAMPLE_VACANCIES, SAMPLE_COMPANIES, SAMPLE_APPLICATIONS, SAMPLE_CANDIDATE_CV } from '../data/mockData';
import { getStoredSubscriptions, saveStoredSubscriptions, getStoredTransactions, saveStoredTransactions } from './subscriptionService';
import { getStoredUsers, saveStoredUsers } from './authService';

const VACANCIES_KEY = 'jobia_vacancies';
const COMPANIES_KEY = 'jobia_companies';
const APPLICATIONS_KEY = 'jobia_applications';
const OFFERS_KEY = 'jobia_job_offers';
const NOTIFICATIONS_KEY = 'jobia_notifications';
const AUDIT_LOGS_KEY = 'jobia_admin_audit_logs';
const CANDIDATE_PROFILE_PREFIX = 'jobia_candidate_cv_';

// Initial seed helper
function initializeData<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  } catch {
    return fallback;
  }
}

export async function getPublishedVacancies(): Promise<Vacancy[]> {
  const all = initializeData<Vacancy>(VACANCIES_KEY, SAMPLE_VACANCIES);
  return all.filter((v) => v.status === 'published' && v.isApproved !== false);
}

export async function getAllVacanciesFromFirestore(): Promise<Vacancy[]> {
  return initializeData<Vacancy>(VACANCIES_KEY, SAMPLE_VACANCIES);
}

export async function getVacancyByIdFromFirestore(id: string): Promise<Vacancy | null> {
  const all = await getAllVacanciesFromFirestore();
  return all.find((v) => v.id === id) || null;
}

export async function getAllCompaniesFromFirestore(): Promise<Company[]> {
  return initializeData<Company>(COMPANIES_KEY, SAMPLE_COMPANIES);
}

export async function getAllApplicationsFromFirestore(): Promise<Application[]> {
  return initializeData<Application>(APPLICATIONS_KEY, SAMPLE_APPLICATIONS);
}

export async function getCandidateApplications(candidateIdOrEmail: string): Promise<Application[]> {
  const all = await getAllApplicationsFromFirestore();
  const search = candidateIdOrEmail.toLowerCase();
  return all.filter(
    (a) =>
      (a.candidateId && a.candidateId === candidateIdOrEmail) ||
      (a.candidateEmail && a.candidateEmail.toLowerCase() === search)
  );
}

export async function getCompanyApplications(companyId: string): Promise<Application[]> {
  const all = await getAllApplicationsFromFirestore();
  return all.filter((a) => a.companyId === companyId);
}

export async function saveVacancyToFirestore(vacancy: Partial<Vacancy>): Promise<Vacancy> {
  const all = await getAllVacanciesFromFirestore();
  const now = new Date().toISOString();

  let updated: Vacancy;
  if (vacancy.id) {
    const index = all.findIndex((v) => v.id === vacancy.id);
    if (index !== -1) {
      updated = {
        ...all[index],
        ...vacancy,
        editCount: (all[index].editCount || 0) + 1,
        updatedAt: now,
      } as Vacancy;
      all[index] = updated;
    } else {
      updated = {
        ...vacancy,
        id: vacancy.id,
        createdAt: now,
        updatedAt: now,
      } as Vacancy;
      all.unshift(updated);
    }
  } else {
    const id = `vac-${Date.now()}`;
    updated = {
      ...vacancy,
      id,
      status: vacancy.status || 'published',
      isApproved: vacancy.isApproved ?? true,
      postedDate: now.split('T')[0],
      createdAt: now,
      updatedAt: now,
      viewsCount: 0,
      applicantsCount: 0,
      currency: vacancy.currency || 'AZN',
    } as Vacancy;
    all.unshift(updated);
  }

  localStorage.setItem(VACANCIES_KEY, JSON.stringify(all));
  return updated;
}

export async function updateVacancyStatus(vacancyId: string, status: Vacancy['status'], isApproved?: boolean): Promise<boolean> {
  const all = await getAllVacanciesFromFirestore();
  const index = all.findIndex((v) => v.id === vacancyId);
  if (index === -1) return false;

  all[index] = {
    ...all[index],
    status,
    isApproved: isApproved !== undefined ? isApproved : all[index].isApproved,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(VACANCIES_KEY, JSON.stringify(all));
  return true;
}

export async function deleteVacancyFromFirestore(vacancyId: string): Promise<boolean> {
  const all = await getAllVacanciesFromFirestore();
  const filtered = all.filter((v) => v.id !== vacancyId);
  localStorage.setItem(VACANCIES_KEY, JSON.stringify(filtered));
  return true;
}

export async function submitJobApplication(app: Partial<Application>): Promise<Application> {
  const all = await getAllApplicationsFromFirestore();
  const now = new Date().toISOString();
  const newApp: Application = {
    id: app.id || `app-${Date.now()}`,
    vacancyId: app.vacancyId || '',
    jobId: app.vacancyId || '',
    vacancyTitle: app.vacancyTitle || '',
    companyId: app.companyId || '',
    companyName: app.companyName || '',
    companyLogo: app.companyLogo,
    candidateId: app.candidateId,
    candidateName: app.candidateName || 'Namizəd',
    candidateEmail: app.candidateEmail || '',
    candidatePhone: app.candidatePhone || '',
    appliedDate: now.split('T')[0],
    status: 'Müraciət edildi',
    matchScore: app.matchScore || 85,
    matchHighlights: app.matchHighlights,
    coverNote: app.coverNote,
    cvData: app.cvData,
    cvFileName: app.cvFileName,
    cvFileType: app.cvFileType,
    cvFileData: app.cvFileData,
    createdAt: now,
    updatedAt: now,
  };

  all.unshift(newApp);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(all));

  // Update applicants count on vacancy
  const vacancies = await getAllVacanciesFromFirestore();
  const vacIdx = vacancies.findIndex((v) => v.id === newApp.vacancyId);
  if (vacIdx !== -1) {
    vacancies[vacIdx].applicantsCount = (vacancies[vacIdx].applicantsCount || 0) + 1;
    localStorage.setItem(VACANCIES_KEY, JSON.stringify(vacancies));
  }

  return newApp;
}

export async function saveApplicationDirectToFirestore(app: Application): Promise<Application> {
  return submitJobApplication(app);
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  recruiterNotes?: string
): Promise<boolean> {
  const all = await getAllApplicationsFromFirestore();
  const idx = all.findIndex((a) => a.id === applicationId);
  if (idx === -1) return false;

  all[idx] = {
    ...all[idx],
    status,
    recruiterNotes: recruiterNotes !== undefined ? recruiterNotes : all[idx].recruiterNotes,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(all));
  return true;
}

export async function setCompanyVerificationStatus(companyId: string, verified: boolean): Promise<boolean> {
  const all = await getAllCompaniesFromFirestore();
  const idx = all.findIndex((c) => c.id === companyId);
  if (idx === -1) return false;

  all[idx] = {
    ...all[idx],
    verified,
    verificationStatus: verified ? 'verified' : 'rejected',
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(COMPANIES_KEY, JSON.stringify(all));
  return true;
}

export async function updateCompanyProfile(company: Partial<Company>): Promise<Company> {
  const all = await getAllCompaniesFromFirestore();
  const idx = all.findIndex((c) => c.id === company.id);
  const now = new Date().toISOString();

  let updated: Company;
  if (idx !== -1) {
    updated = { ...all[idx], ...company, updatedAt: now };
    all[idx] = updated;
  } else {
    updated = {
      id: company.id || `comp-${Date.now()}`,
      name: company.name || 'Şirkət',
      verified: false,
      createdAt: now,
      updatedAt: now,
      ...company,
    };
    all.push(updated);
  }
  localStorage.setItem(COMPANIES_KEY, JSON.stringify(all));
  return updated;
}

export async function saveCandidateProfile(userId: string, cv: CVData): Promise<void> {
  try {
    localStorage.setItem(CANDIDATE_PROFILE_PREFIX + userId, JSON.stringify(cv));
  } catch (e) {
    console.error('Failed to save candidate CV', e);
  }
}

export async function getCandidateProfile(userId: string): Promise<CVData | null> {
  try {
    const raw = localStorage.getItem(CANDIDATE_PROFILE_PREFIX + userId);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read candidate CV', e);
  }
  return SAMPLE_CANDIDATE_CV;
}

// Job Offers
export async function createJobOfferInFirestore(offer: Partial<JobOffer>): Promise<JobOffer> {
  const all = initializeData<JobOffer>(OFFERS_KEY, []);
  const now = new Date().toISOString();
  const newOffer: JobOffer = {
    id: offer.id || `offer-${Date.now()}`,
    candidateId: offer.candidateId || '',
    candidateName: offer.candidateName || 'Namizəd',
    candidateEmail: offer.candidateEmail || '',
    candidatePhone: offer.candidatePhone,
    companyId: offer.companyId || '',
    companyName: offer.companyName || 'Şirkət',
    position: offer.position || 'Mütəxəssis',
    employmentType: offer.employmentType || 'Tam ştat',
    workLocation: offer.workLocation || 'Bakı',
    startDate: offer.startDate || now.split('T')[0],
    grossSalary: offer.grossSalary || 1500,
    netSalary: offer.netSalary || 1250,
    status: offer.status || 'SENT',
    language: offer.language || 'az',
    createdAt: now,
    ...offer,
  };

  all.unshift(newOffer);
  localStorage.setItem(OFFERS_KEY, JSON.stringify(all));
  return newOffer;
}

export async function respondToJobOffer(
  offerId: string,
  status: 'ACCEPTED' | 'DECLINED',
  reason?: { reasonText?: string; category?: string }
): Promise<boolean> {
  const all = initializeData<JobOffer>(OFFERS_KEY, []);
  const idx = all.findIndex((o) => o.id === offerId);
  if (idx === -1) return false;

  const now = new Date().toISOString();
  all[idx] = {
    ...all[idx],
    status,
    declineReason: reason,
    acceptedAt: status === 'ACCEPTED' ? now : undefined,
    declinedAt: status === 'DECLINED' ? now : undefined,
    updatedAt: now,
  };
  localStorage.setItem(OFFERS_KEY, JSON.stringify(all));
  return true;
}

export async function getCompanyOffers(companyId: string): Promise<JobOffer[]> {
  const all = initializeData<JobOffer>(OFFERS_KEY, []);
  return all.filter((o) => o.companyId === companyId);
}

export async function getCandidateOffers(candidateEmailOrId: string): Promise<JobOffer[]> {
  const all = initializeData<JobOffer>(OFFERS_KEY, []);
  const s = candidateEmailOrId.toLowerCase();
  return all.filter(
    (o) =>
      o.candidateId === candidateEmailOrId ||
      o.candidateEmail.toLowerCase() === s
  );
}

// Subscriptions & Payments
export async function getAllSubscriptionsFromFirestore(): Promise<UserSubscription[]> {
  return getStoredSubscriptions();
}

export async function getAllPaymentsFromFirestore(): Promise<PaymentTransaction[]> {
  return getStoredTransactions();
}

export async function getAllUsersFromFirestore(): Promise<User[]> {
  return getStoredUsers();
}

export async function updateSubscriptionStatusInFirestore(
  subscriptionId: string,
  status: UserSubscription['status']
): Promise<boolean> {
  const subs = getStoredSubscriptions();
  const idx = subs.findIndex((s) => s.id === subscriptionId);
  if (idx === -1) return false;
  subs[idx].status = status;
  subs[idx].updatedAt = new Date().toISOString();
  saveStoredSubscriptions(subs);
  return true;
}

export async function updateUserStatusInFirestore(
  userId: string,
  status: 'active' | 'suspended' | 'pending'
): Promise<boolean> {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return false;
  users[idx].status = status;
  saveStoredUsers(users);
  return true;
}

export async function updateUserRoleInFirestore(
  userId: string,
  arg2: string | UserRole,
  maybeRole?: UserRole
): Promise<boolean> {
  const role: UserRole = (maybeRole || arg2) as UserRole;
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return false;
  users[idx].role = role;
  saveStoredUsers(users);
  return true;
}

// Admin Audit Logs
export function getStoredAdminAuditLogs(): AdminAuditLog[] {
  return initializeData<AdminAuditLog>(AUDIT_LOGS_KEY, []);
}

export async function getAllAdminAuditLogsFromFirestore(): Promise<AdminAuditLog[]> {
  return getStoredAdminAuditLogs();
}

export async function recordAdminAuditLog(log: Partial<AdminAuditLog> | any): Promise<AdminAuditLog> {
  const logs = getStoredAdminAuditLogs();
  const newLog: AdminAuditLog = {
    id: `audit-${Date.now()}`,
    adminId: log.adminId || 'admin-system',
    adminEmail: log.adminEmail || 'admin@jobia.az',
    action: log.action || 'system_action',
    targetType: log.targetType || 'setting',
    targetId: log.targetId || '',
    details: log.details || '',
    timestamp: new Date().toISOString(),
    ...log,
  };
  logs.unshift(newLog);
  localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
  return newLog;
}

export async function notifySubscribersOfNewVacancy(vacancy: Vacancy, sendEmails?: boolean): Promise<{ notifiedCount: number }> {
  console.log(`Subscribers notified of new vacancy: ${vacancy.title}`);
  return { notifiedCount: 12 };
}

// Subscriptions / Observers
export function subscribeToUserNotifications(
  userId: string,
  callback: (notifications: AppNotification[]) => void
): () => void {
  const handleUpdate = () => {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_KEY);
      const all: AppNotification[] = raw ? JSON.parse(raw) : [];
      callback(all.filter((n) => n.userId === userId || n.userId === 'all'));
    } catch {
      callback([]);
    }
  };

  handleUpdate();
  window.addEventListener('storage', handleUpdate);
  return () => window.removeEventListener('storage', handleUpdate);
}

export function subscribeToAllVacancies(callback: (vacancies: Vacancy[]) => void): () => void {
  const handleUpdate = () => {
    callback(initializeData<Vacancy>(VACANCIES_KEY, SAMPLE_VACANCIES));
  };
  handleUpdate();
  window.addEventListener('storage', handleUpdate);
  return () => window.removeEventListener('storage', handleUpdate);
}

export function subscribeToAllCompanies(callback: (companies: Company[]) => void): () => void {
  const handleUpdate = () => {
    callback(initializeData<Company>(COMPANIES_KEY, SAMPLE_COMPANIES));
  };
  handleUpdate();
  window.addEventListener('storage', handleUpdate);
  return () => window.removeEventListener('storage', handleUpdate);
}

export function subscribeToCompanyApplications(
  companyId: string,
  callback: (apps: Application[]) => void
): () => void {
  const handleUpdate = () => {
    const all = initializeData<Application>(APPLICATIONS_KEY, SAMPLE_APPLICATIONS);
    callback(all.filter((a) => a.companyId === companyId));
  };
  handleUpdate();
  window.addEventListener('storage', handleUpdate);
  return () => window.removeEventListener('storage', handleUpdate);
}

export function subscribeToCandidateApplications(
  candidateId: string,
  callback: (apps: Application[]) => void
): () => void {
  const handleUpdate = () => {
    const all = initializeData<Application>(APPLICATIONS_KEY, SAMPLE_APPLICATIONS);
    callback(all.filter((a) => a.candidateId === candidateId));
  };
  handleUpdate();
  window.addEventListener('storage', handleUpdate);
  return () => window.removeEventListener('storage', handleUpdate);
}

export function subscribeToAdminAuditLogs(callback: (logs: AdminAuditLog[]) => void): () => void {
  const handleUpdate = () => {
    callback(getStoredAdminAuditLogs());
  };
  handleUpdate();
  window.addEventListener('storage', handleUpdate);
  return () => window.removeEventListener('storage', handleUpdate);
}
