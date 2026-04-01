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
