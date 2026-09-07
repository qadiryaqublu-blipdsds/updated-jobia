import { User, AuthSession, UserRole } from '../types';

const USERS_STORAGE_KEY = 'jobia_registered_users';
const CURRENT_USER_KEY = 'jobia_current_user';
const CURRENT_SESSION_KEY = 'jobia_current_session';

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored users', e);
  }
  return [];
}

export function saveStoredUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save stored users', e);
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get current user', e);
  }
  return null;
}

export function saveCurrentUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error('Failed to save current user', e);
  }
}

export function getCurrentSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get current session', e);
  }
  const user = getCurrentUser();
  if (user) {
    return { user, token: 'session-' + user.id };
  }
  return null;
}

export function saveCurrentSession(session: AuthSession | null): void {
  try {
    if (session) {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
      saveCurrentUser(session.user);
    } else {
      localStorage.removeItem(CURRENT_SESSION_KEY);
      saveCurrentUser(null);
    }
  } catch (e) {
    console.error('Failed to save session', e);
  }
}

export function logoutUser(): void {
  saveCurrentSession(null);
}

export function toggleUserAccountStatus(userId: string): User | null {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  const user = users[index];
  const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
  users[index] = { ...user, status: newStatus };
  saveStoredUsers(users);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    saveCurrentUser(users[index]);
  }

  return users[index];
}

export function registerUser(payload: Partial<User>): { user: User; session: AuthSession } {
  const users = getStoredUsers();
  const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const newUser: User = {
    id,
    email: payload.email?.toLowerCase().trim() || '',
    fullName: payload.fullName || 'İstifadəçi',
    role: payload.role || 'candidate',
    phone: payload.phone || '',
    companyId: payload.companyId,
    companyName: payload.companyName,
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

export function loginUser(email: string, role?: UserRole): { user: User; session: AuthSession } {
  const users = getStoredUsers();
  let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Auto-create user if not found
    const id = `user-${Date.now()}`;
    user = {
      id,
      email: email.toLowerCase().trim(),
      fullName: email.split('@')[0],
      role: role || 'candidate',
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
