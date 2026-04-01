import { getPublicApiUrl } from '@/libs/env';
import { clearTokens, getRefreshToken, setTokens } from '@/modules/auth/token-storage';

let inFlight: Promise<boolean> | null = null;

/**
 * Gọi `/auth/refresh` bằng fetch thuần (không qua httpRequest) để tránh đệ quy interceptor.
 * Single-flight: nhiều request 401 chờ cùng một lần refresh.
 */
export function refreshAccessToken(): Promise<boolean> {
  if (!inFlight) {
    inFlight = doRefresh().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}

async function doRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return false;
  }

  const base = getPublicApiUrl().replace(/\/$/, '');
  if (!base) return false;

  try {
    const res = await fetch(`${base}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (!res.ok) {
      clearTokens();
      return false;
    }

    const raw = (await res.json()) as {
      accessToken?: string;
      refreshToken?: string;
    };

    if (!raw.accessToken) {
      clearTokens();
      return false;
    }

    setTokens(raw.accessToken, raw.refreshToken ?? refreshToken);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}
