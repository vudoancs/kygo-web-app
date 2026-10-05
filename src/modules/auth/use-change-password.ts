import { useMutation } from '@tanstack/react-query';
import { HttpError } from '@/services/http/errors';
import { changePasswordRequest } from './auth.service';

export type ChangePasswordErrorKind =
  | 'currentIncorrect'
  | 'sameAsCurrent'
  | 'invalidPassword'
  | 'passwordNotSet'
  | 'sessionEnded'
  | 'rateLimited'
  | 'unknown';

/** Phân loại lỗi theo `code` nghiệp vụ của backend, fallback theo HTTP status. */
export function classifyChangePasswordError(error: unknown): { kind: ChangePasswordErrorKind; message?: string } {
  if (!(error instanceof HttpError)) return { kind: 'unknown' };
  const code = error.body?.code;
  const message = error.message || undefined;
  if (code === 'CURRENT_PASSWORD_INCORRECT') return { kind: 'currentIncorrect', message };
  if (code === 'NEW_PASSWORD_SAME_AS_CURRENT') return { kind: 'sameAsCurrent', message };
  if (code === 'PASSWORD_NOT_SET') return { kind: 'passwordNotSet', message };
  if (code === 'PASSWORD_CHANGE_CONFLICT' || error.status === 401) return { kind: 'sessionEnded', message };
  if (error.status === 429) return { kind: 'rateLimited', message };
  if (error.status === 400) return { kind: 'invalidPassword', message };
  return { kind: 'unknown' };
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      changePasswordRequest(currentPassword, newPassword),
  });
}
