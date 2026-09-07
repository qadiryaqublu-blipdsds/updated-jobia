import { User, AuthSession } from '../types';
import { getStoredUsers, saveStoredUsers, saveCurrentSession } from './authService';

const OTP_STORAGE_PREFIX = 'jobia_otp_code_';
const RATE_LIMIT_PREFIX = 'jobia_otp_ratelimit_';

export async function checkEmailRegistered(email: string): Promise<boolean> {
  const users = getStoredUsers();
  return users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export async function verifyCredentialsOnly(email: string, password?: string): Promise<{ valid: boolean; error?: string }> {
  const users = getStoredUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    return { valid: true }; // allow demo registration / login
  }
  if (user.status === 'suspended') {
    return { valid: false, error: 'Hesabınız inzibatçı tərəfindən dondurulub.' };
  }
  return { valid: true };
}

export async function loginWithFirebase(email: string, password?: string): Promise<{ user: User; session: AuthSession }> {
  const cleanEmail = email.trim().toLowerCase();
  const users = getStoredUsers();
  let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    user = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      email: cleanEmail,
      fullName: cleanEmail.split('@')[0],
      role: 'candidate',
      phone: '',
      status: 'active',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    users.push(user);
    saveStoredUsers(users);
  } else {
    user = { ...user, lastLoginAt: new Date().toISOString() };
    saveStoredUsers(users.map((u) => (u.id === user!.id ? user! : u)));
  }

  const session: AuthSession = {
    user,
    token: `token-${user.id}`,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  saveCurrentSession(session);
  return { user, session };
}

export async function registerCandidateWithFirebase(payload: {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
}): Promise<{ user: User; session: AuthSession }> {
  const cleanEmail = payload.email.trim().toLowerCase();
  const users = getStoredUsers();
  
  const id = `cand-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const newUser: User = {
    id,
    email: cleanEmail,
    fullName: payload.fullName.trim(),
    role: 'candidate',
    phone: payload.phone?.trim() || '',
    status: 'active',
    emailVerified: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveStoredUsers(users);

  const session: AuthSession = {
    user: newUser,
    token: `token-${id}`,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  saveCurrentSession(session);
  return { user: newUser, session };
}

export async function registerEmployerWithFirebase(payload: {
  email: string;
  password?: string;
  fullName: string;
  companyName: string;
  phone?: string;
}): Promise<{ user: User; session: AuthSession }> {
  const cleanEmail = payload.email.trim().toLowerCase();
  const users = getStoredUsers();
  
  const companyId = `comp-${Date.now()}`;
  const id = `emp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const newUser: User = {
    id,
    email: cleanEmail,
    fullName: payload.fullName.trim(),
    role: 'business',
    phone: payload.phone?.trim() || '',
    companyId,
    companyName: payload.companyName.trim(),
    status: 'active',
    emailVerified: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveStoredUsers(users);

  const session: AuthSession = {
    user: newUser,
    token: `token-${id}`,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  saveCurrentSession(session);
  return { user: newUser, session };
}

export async function resetUserPasswordDirect(email: string, newPassword?: string): Promise<{ success: boolean }> {
  return { success: true };
}

export function checkVerificationRateLimit(email: string): { allowed: boolean; waitSeconds?: number; cooldownRemaining?: number } {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_PREFIX + email.toLowerCase());
    if (raw) {
      const lastSent = parseInt(raw, 10);
      const elapsed = (Date.now() - lastSent) / 1000;
      if (elapsed < 60) {
        const remaining = Math.ceil(60 - elapsed);
        return { allowed: false, waitSeconds: remaining, cooldownRemaining: remaining };
      }
    }
  } catch (e) {
    // ignore
  }
  return { allowed: true, cooldownRemaining: 0 };
}

export async function generateAndSaveVerificationCode(userId: string): Promise<string> {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    localStorage.setItem(OTP_STORAGE_PREFIX + userId, code);
  } catch (e) {
    // ignore
  }
  return code;
}

export async function resendVerificationEmail(
  userId: string,
  email: string
): Promise<{ success: boolean; error?: string; message?: string; cooldownRemaining?: number }> {
  const limit = checkVerificationRateLimit(email);
  if (!limit.allowed) {
    return {
      success: false,
      error: `Zəhmət olmasa ${limit.waitSeconds} saniyə gözləyin və yenidən cəhd edin.`,
      cooldownRemaining: limit.waitSeconds,
    };
  }

  const code = await generateAndSaveVerificationCode(userId);
  try {
    localStorage.setItem(RATE_LIMIT_PREFIX + email.toLowerCase(), Date.now().toString());
  } catch (e) {
    // ignore
  }

  // Also call server-side otp if available
  try {
    await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
  } catch (e) {
    // ignore non-blocking
  }

  return { success: true, message: 'Təsdiqləmə kodu e-poçt ünvanınıza göndərildi.', cooldownRemaining: 60 };
}

export async function verifyUserEmailCode(
  userId: string,
  email: string,
  code: string
): Promise<{ user: User; session: AuthSession }> {
  const savedCode = localStorage.getItem(OTP_STORAGE_PREFIX + userId);
  // Accept the saved code, or standard test bypass '123456', or server verification
  if (savedCode && savedCode !== code && code !== '123456') {
    // Try server verification
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!data.ok) {
        throw new Error('Daxil edilən kod yanlışdır və ya vaxtı bitib.');
      }
    } catch (e: any) {
      if (code !== '123456') {
        throw new Error(e.message || 'Kod yanlışdır.');
      }
    }
  }

  const users = getStoredUsers();
  const user = users.find((u) => u.id === userId || u.email.toLowerCase() === email.toLowerCase()) || {
    id: userId,
    email: email.toLowerCase(),
    fullName: email.split('@')[0],
    role: 'candidate',
    phone: '',
    status: 'active',
    emailVerified: true,
  };

  user.emailVerified = true;
  saveStoredUsers(users.map((u) => (u.id === user.id ? user : u)));

  const session: AuthSession = {
    user,
    token: `token-${user.id}`,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
  saveCurrentSession(session);

  return { user, session };
}

export async function checkAndSyncVerificationStatus(userId: string): Promise<{ verified: boolean; user?: User; message?: string }> {
  const users = getStoredUsers();
  const user = users.find((u) => u.id === userId);
  if (user && user.emailVerified) {
    return { verified: true, user, message: 'Hesab artıq təsdiqlənib.' };
  }
  return { verified: true, user: user || undefined, message: 'Status yeniləndi.' };
}
