import { httpRequestOrThrow } from '@/services/http/client';

/** Backend: `MyProfileResponseDto` (kygo-erp-api/src/modules/auth/profile/my-profile.dto.ts). */
export type LoginMethod = 'password' | 'google' | 'facebook' | 'apple';
export type AvatarSource = 'custom' | 'provider' | 'none';

export interface MyProfile {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  avatar: string;
  avatarSource: AvatarSource;
  country: string;
  state: string;
  city: string;
  role: string;
  loginMethods: LoginMethod[];
  hasPassword: boolean;
  avatarPolicy: { maxBytes: number; allowedTypes: string[] };
  createdAt: string | null;
  updatedAt: string | null;
}

/** Backend: `UpdateMyProfileDto`. Bỏ qua field = giữ nguyên; `null` = xoá (trừ `name`). */
export interface UpdateMyProfilePayload {
  name?: string;
  phoneNumber?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
}

export type EditableProfileField = keyof UpdateMyProfilePayload;

/** Cùng quy tắc với backend (my-profile.dto.ts). */
export const PROFILE_RULES = {
  nameMaxLength: 50,
  addressMaxLength: 100,
  phoneInputPattern: /^\+?[\d\s().-]+$/,
  phoneNormalizedPattern: /^\d{9,15}$/,
} as const;

/** Bản sao `normalizePhone` của backend: bỏ ký tự lạ, 84XXXXXXXXX → 0XXXXXXXXX. */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('84') && digits.length >= 10) return `0${digits.slice(2)}`;
  return digits;
}

/** Mã lỗi ảnh đại diện (HttpError.body.code). */
export type AvatarErrorCode = 'AVATAR_FILE_REQUIRED' | 'AVATAR_INVALID_TYPE' | 'AVATAR_TOO_LARGE';

export async function fetchMyAccount(): Promise<MyProfile> {
  return httpRequestOrThrow<MyProfile>('/auth/me', { method: 'GET', auth: true });
}

export async function updateMyAccount(payload: UpdateMyProfilePayload): Promise<MyProfile> {
  return httpRequestOrThrow<MyProfile>('/auth/me', { method: 'PATCH', auth: true, body: payload });
}

export async function uploadMyAvatar(file: File): Promise<MyProfile> {
  const form = new FormData();
  form.append('file', file);
  return httpRequestOrThrow<MyProfile>('/auth/me/avatar', { method: 'POST', auth: true, body: form });
}

export async function removeMyAvatar(): Promise<MyProfile> {
  return httpRequestOrThrow<MyProfile>('/auth/me/avatar', { method: 'DELETE', auth: true });
}
