import { httpRequestOrThrow } from '@/services/http/client';
import { setTokens, clearTokens } from './token-storage';

export interface LoginPayload {
  email: string;
  password: string;
}

/** User trả về từ API đăng nhập (User.toObject() — không có hash). */
export type ApiUserInfo = Record<string, unknown> & {
  _id?: unknown;
  id?: unknown;
  name?: unknown;
  fullName?: unknown;
  email?: unknown;
  avatar?: unknown;
  phoneNumber?: unknown;
};

/** Phản hồi `POST /auth/login` (AuthService.login) và `/auth/refresh`. */
export interface AuthTokensDto {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: ApiUserInfo;
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

/** Response của POST /auth/change-password (backend: PasswordChangeService). Không cấp phiên mới. */
export interface ChangePasswordResponse {
  success: true;
  message: string;
}

/**
 * Đổi mật khẩu của tài khoản đang đăng nhập (tài khoản lấy từ JWT, không gửi userId/email).
 * Lỗi có `code` (HttpError.body.code): CURRENT_PASSWORD_INCORRECT / NEW_PASSWORD_SAME_AS_CURRENT (400),
 * PASSWORD_NOT_SET / PASSWORD_CHANGE_CONFLICT (409), TOO_MANY_ATTEMPTS (429).
 */
export async function changePasswordRequest(currentPassword: string, newPassword: string): Promise<ChangePasswordResponse> {
  return httpRequestOrThrow<ChangePasswordResponse>('/auth/change-password', {
    method: 'POST',
    auth: true,
    body: { currentPassword, newPassword },
  });
}

/** Response của GET /auth/password-status. `hasPassword=false` → tài khoản chỉ đăng nhập Google. */
export interface PasswordStatusResponse {
  hasPassword: boolean;
}

export async function passwordStatusRequest(): Promise<PasswordStatusResponse> {
  return httpRequestOrThrow<PasswordStatusResponse>('/auth/password-status', { method: 'GET', auth: true });
}
