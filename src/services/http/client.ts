import { getPublicApiUrl } from '@/libs/env';
import type { ApiErrorBody, ApiResult } from '@/types/api';
import { HttpError } from './errors';
import { getAccessToken } from '@/modules/auth/token-storage';
import { refreshAccessToken } from './refresh-access-token';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  method?: HttpMethod;
  body?: unknown;
  /** Gắn Authorization từ token client (nếu có). */
  auth?: boolean;
  /** @internal tránh lặp vô hạn khi refresh */
  _retryAfterRefresh?: boolean;
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function normalizeErrorBody(status: number, raw: unknown): ApiErrorBody {
  if (raw && typeof raw === 'object' && 'message' in raw) {
    const m = raw as Record<string, unknown>;
    return {
      statusCode: typeof m.statusCode === 'number' ? m.statusCode : status,
      message: (m.message as string | string[]) ?? resStatusText(status),
      error: typeof m.error === 'string' ? m.error : undefined,
    };
  }
  return { statusCode: status, message: resStatusText(status) };
}

function resStatusText(status: number): string {
  if (status === 401) return 'Phiên đăng nhập hết hạn hoặc không hợp lệ';
  if (status === 403) return 'Không có quyền truy cập';
  if (status === 404) return 'Không tìm thấy tài nguyên';
  return `Lỗi HTTP ${status}`;
}

async function performHttpRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  const base = getPublicApiUrl().replace(/\/$/, '');
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers = new Headers(options.headers);

  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.auth) {
    const token = getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    method: options.method ?? 'GET',
    headers,
    body:
      options.body === undefined || options.body instanceof FormData
        ? (options.body as BodyInit | undefined)
        : JSON.stringify(options.body),
    cache: options.cache ?? 'no-store',
  });

  const raw = await parseJsonSafe(res);

  if (!res.ok) {
    const errBody = normalizeErrorBody(res.status, raw);
    return { ok: false, error: errBody, status: res.status };
  }

  return { ok: true, data: raw as T, status: res.status };
}

/**
 * HTTP client tập trung — ưu tiên fetch native (ít bundle, tích hợp Next cache khi cần).
 * Với `auth: true`, 401 → thử refresh token một lần (single-flight) rồi gọi lại request.
 */
export async function httpRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
  const first = await performHttpRequest<T>(path, options);

  if (
    !first.ok &&
    first.status === 401 &&
    options.auth &&
    !options._retryAfterRefresh &&
    typeof window !== 'undefined'
  ) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return performHttpRequest<T>(path, { ...options, _retryAfterRefresh: true });
    }
  }

  return first;
}

/** Ném HttpError khi !ok — tiện cho try/catch trong service. */
export async function httpRequestOrThrow<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const result = await httpRequest<T>(path, options);
  if (!result.ok) {
    const msg = Array.isArray(result.error.message)
      ? result.error.message.join(', ')
      : result.error.message;
    throw new HttpError(msg, result.status, result.error);
  }
  return result.data;
}
