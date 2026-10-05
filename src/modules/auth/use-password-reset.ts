import { useMutation } from '@tanstack/react-query';
import { HttpError } from '@/services/http/errors';
import { forgotPasswordRequest, resetPasswordRequest } from './auth.service';

export type PasswordResetErrorKind = 'invalidLink' | 'rateLimited' | 'validation' | 'unknown';

export function classifyPasswordResetError(error: unknown): { kind: PasswordResetErrorKind; message?: string } {
  if (!(error instanceof HttpError)) return { kind: 'unknown' };
  if (error.status === 410) return { kind: 'invalidLink', message: error.message };
  if (error.status === 429) return { kind: 'rateLimited', message: error.message };
  if (error.status === 400) return { kind: 'validation', message: error.message };
  return { kind: 'unknown' };
}

export function useForgotPassword() {
  return useMutation({ mutationFn: (email: string) => forgotPasswordRequest(email) });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      resetPasswordRequest(token, newPassword),
  });
}
