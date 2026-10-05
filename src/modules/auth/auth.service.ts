import { httpRequestOrThrow } from '@/services/http/client';
import { setTokens, clearTokens } from './token-storage';

export interface LoginPayload {
  email: string;
  password: string;
}

/** Phản hồi mẫu từ NestJS JWT — chỉnh field theo DTO backend. */
export interface AuthTokensDto {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthTokensDto> {
  return httpRequestOrThrow<AuthTokensDto>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function refreshRequest(refreshToken: string): Promise<AuthTokensDto> {
  return httpRequestOrThrow<AuthTokensDto>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  });
}

export function persistAuthSession(tokens: AuthTokensDto): void {
  setTokens(tokens.accessToken, tokens.refreshToken);
}

export function logoutSession(): void {
  clearTokens();
}

/** Response của POST /auth/forgot-password và /auth/reset-password (backend: PasswordResetService). */
export interface PasswordResetMessageResponse {
  success: true;
  message: string;
}

/** Chính sách mật khẩu backend (RegisterBodyDto / ResetPasswordDto): 8–12 ký tự, không khoảng trắng. */
export const PASSWORD_POLICY = { minLength: 8, maxLength: 12 } as const;

/** Luôn trả cùng một response cho mọi email (không lộ tài khoản tồn tại). 429 khi IP vượt giới hạn. */
export async function forgotPasswordRequest(email: string): Promise<PasswordResetMessageResponse> {
  return httpRequestOrThrow<PasswordResetMessageResponse>('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
}

/** 410 = liên kết không hợp lệ / hết hạn / đã dùng; 400 = mật khẩu không đạt chính sách. */
export async function resetPasswordRequest(token: string, newPassword: string): Promise<PasswordResetMessageResponse> {
  return httpRequestOrThrow<PasswordResetMessageResponse>('/auth/reset-password', {
    method: 'POST',
    body: { token, newPassword },
  });
}
