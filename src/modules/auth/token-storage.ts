const ACCESS_KEY = 'kygo_access_token';
const REFRESH_KEY = 'kygo_refresh_token';

/**
 * Lưu token phía client (memory + sessionStorage).
 * Production: ưu tiên httpOnly cookie do NestJS set + BFF; tránh XSS đọc được long-lived token.
 */
let memoryAccess: string | null = null;

export function getAccessToken(): string | null {
  if (memoryAccess) return memoryAccess;
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh?: string): void {
  memoryAccess = access;
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ACCESS_KEY, access);
  if (refresh) sessionStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  memoryAccess = null;
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
}
