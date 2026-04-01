function required(name: string, value: string | undefined): string {
  if (value === undefined || value === '') {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

/** Có cấu hình base URL API (build-time `NEXT_PUBLIC_API_URL`). */
export function isPublicApiConfigured(): boolean {
  const u = process.env.NEXT_PUBLIC_API_URL;
  return typeof u === 'string' && u.trim().length > 0;
}

/** Gọi API từ trình duyệt (NestJS public URL). */
export function getPublicApiUrl(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL ?? '';
  }
  return process.env.NEXT_PUBLIC_API_URL ?? process.env.API_SERVER_URL ?? '';
}

export function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
  );
}

/** Dùng khi bắt buộc phải có base URL (ví dụ build CI). */
export function requirePublicApiUrl(): string {
  return required('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL);
}
