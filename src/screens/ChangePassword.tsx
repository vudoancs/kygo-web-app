'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, ArrowLeft, Eye, EyeOff, Info, KeyRound, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useAppContext } from '@/modules/app-state';
import { logoutSession, PASSWORD_POLICY } from '@/modules/auth/auth.service';
import { classifyChangePasswordError, useChangePassword } from '@/modules/auth/use-change-password';
import { fetchMyProfile } from '@/services/users.service';

type FormValues = { currentPassword: string; newPassword: string; confirmPassword: string };
type FieldName = keyof FormValues;

const EMPTY_FORM: FormValues = { currentPassword: '', newPassword: '', confirmPassword: '' };

const inputClass =
  'w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f] read-only:bg-gray-50';

export const PASSWORD_CHANGED_LOGIN_PATH = '/login?passwordChanged=1';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        href="/account/profile"
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#b8465f] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Thông tin tài khoản
      </Link>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Đổi mật khẩu</h1>
        <p className="text-gray-600 mt-2">Bảo mật tài khoản Kygo Prom của bạn</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm">{children}</div>
    </div>
  );
}

function ToggleButton({ shown, onClick, disabled }: { shown: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={shown ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
      aria-pressed={shown}
      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
    >
      {shown ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  );
}

function GoogleOnlyNotice() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 inline-flex rounded-full bg-rose-50 p-3">
        <ShieldCheck className="h-8 w-8 text-[#b8465f]" />
      </div>
      <h2 className="mb-3 text-xl font-bold text-gray-900">Tài khoản đăng nhập bằng Google</h2>
      <p className="text-sm text-gray-600">
        Tài khoản của bạn đăng nhập bằng Google nên không có mật khẩu Kygo Prom để thay đổi. Hãy tiếp tục dùng nút
        “Đăng nhập với Google”. Để đổi mật khẩu đăng nhập, vui lòng thay đổi trong tài khoản Google của bạn.
      </p>
    </div>
  );
}

const ChangePassword = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout } = useAppContext();
  const changePassword = useChangePassword();
  const [shown, setShown] = useState<Record<FieldName, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [googleOnly, setGoogleOnly] = useState(false);

  const profileQuery = useQuery({
    queryKey: ['users', 'profile'],
    queryFn: fetchMyProfile,
    enabled: Boolean(user),
    staleTime: 0,
  });

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: EMPTY_FORM });

  const toggle = (field: FieldName) => setShown((prev) => ({ ...prev, [field]: !prev[field] }));

  /** Xoá trạng thái đăng nhập cục bộ + dữ liệu nhạy cảm của form, rồi về trang đăng nhập. */
  const endSession = (loginPath: string) => {
    reset(EMPTY_FORM);
    logoutSession();
    logout();
    queryClient.clear();
    router.replace(loginPath);
  };

  if (!user) {
    return (
      <Shell>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
            <UserIcon className="w-8 h-8 text-[#b8465f]" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để đổi mật khẩu.</p>
          <button
            onClick={() => router.push('/login?redirect=/account/change-password')}
            className="bg-[#b8465f] text-white px-8 py-3 rounded-lg hover:bg-[#9d3a50] transition-colors font-medium"
          >
            Đăng nhập ngay
          </button>
        </div>
      </Shell>
    );
  }

  if (profileQuery.isPending) {
    return (
      <Shell>
        <div className="flex justify-center py-6">
          <span
            className="h-8 w-8 animate-spin rounded-full border-2 border-[#b8465f] border-t-transparent"
            aria-label="Đang tải"
          />
        </div>
      </Shell>
    );
  }

  if (profileQuery.isError) {
    return (
      <Shell>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Không tải được thông tin tài khoản</p>
            <p className="text-sm text-gray-600 mt-1">Vui lòng thử lại.</p>
            <button
              onClick={() => profileQuery.refetch()}
              className="mt-4 bg-[#b8465f] text-white px-5 py-2 rounded-lg hover:bg-[#9d3a50] transition-colors font-medium"
            >
              Tải lại
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  if (googleOnly || profileQuery.data?.hasPassword === false) {
    return (
      <Shell>
        <GoogleOnlyNotice />
      </Shell>
    );
  }

  const pending = changePassword.isPending;

  const onSubmit = (values: FormValues) => {
    if (pending) return;
    setErrorMessage(null);
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => endSession(PASSWORD_CHANGED_LOGIN_PATH),
        onError: (error) => {
          const { kind, message } = classifyChangePasswordError(error);
          switch (kind) {
            case 'currentIncorrect':
              setError('currentPassword', { message: message || 'Mật khẩu hiện tại không đúng.' }, { shouldFocus: true });
              return;
            case 'sameAsCurrent':
              setError(
                'newPassword',
                { message: message || 'Mật khẩu mới phải khác mật khẩu hiện tại.' },
                { shouldFocus: true },
              );
              return;
            case 'invalidPassword':
              setError('newPassword', { message: message || 'Mật khẩu mới không hợp lệ.' }, { shouldFocus: true });
              return;
            case 'passwordNotSet':
              reset(EMPTY_FORM);
              setGoogleOnly(true);
              return;
            case 'sessionEnded':
              endSession('/login?redirect=/account/change-password');
              return;
            case 'rateLimited':
              setErrorMessage(message || 'Bạn đã thử đổi mật khẩu quá nhiều lần. Vui lòng thử lại sau.');
              return;
            default:
              setErrorMessage('Không thể đổi mật khẩu. Vui lòng thử lại.');
          }
        },
      },
    );
  };

  return (
    <Shell>
      <div role="note" className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <Info className="h-5 w-5 shrink-0 text-amber-600" />
        <p>Sau khi đổi mật khẩu, bạn sẽ được đăng xuất khỏi tất cả thiết bị.</p>
      </div>

      {errorMessage && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate aria-busy={pending}>
        {/* Gợi ý cho trình quản lý mật khẩu: tài khoản đang đổi mật khẩu. */}
        <input type="text" name="username" autoComplete="username" value={user.email} readOnly hidden />

        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              id="current-password"
              type={shown.currentPassword ? 'text' : 'password'}
              autoComplete="current-password"
              readOnly={pending}
              aria-invalid={errors.currentPassword ? 'true' : 'false'}
              aria-describedby={errors.currentPassword ? 'current-password-error' : undefined}
              {...register('currentPassword', { required: 'Vui lòng nhập mật khẩu hiện tại' })}
              className={inputClass}
            />
            <ToggleButton shown={shown.currentPassword} onClick={() => toggle('currentPassword')} disabled={pending} />
          </div>
          {errors.currentPassword && (
            <p id="current-password-error" className="mt-1 text-sm text-red-600">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={shown.newPassword ? 'text' : 'password'}
              autoComplete="new-password"
              readOnly={pending}
              aria-invalid={errors.newPassword ? 'true' : 'false'}
              aria-describedby={errors.newPassword ? 'password-policy new-password-error' : 'password-policy'}
              {...register('newPassword', {
                required: 'Vui lòng nhập mật khẩu mới',
                minLength: {
                  value: PASSWORD_POLICY.minLength,
                  message: `Mật khẩu phải có ít nhất ${PASSWORD_POLICY.minLength} ký tự`,
                },
                maxLength: {
                  value: PASSWORD_POLICY.maxLength,
                  message: `Mật khẩu tối đa ${PASSWORD_POLICY.maxLength} ký tự`,
                },
                pattern: { value: /^\S*$/, message: 'Mật khẩu không được chứa khoảng trắng' },
                validate: (v) => v !== getValues('currentPassword') || 'Mật khẩu mới phải khác mật khẩu hiện tại.',
              })}
              className={inputClass}
            />
            <ToggleButton shown={shown.newPassword} onClick={() => toggle('newPassword')} disabled={pending} />
          </div>
          <p id="password-policy" className="mt-1.5 text-xs text-gray-500">
            Mật khẩu gồm {PASSWORD_POLICY.minLength}–{PASSWORD_POLICY.maxLength} ký tự, không chứa khoảng trắng và khác mật
            khẩu hiện tại.
          </p>
          {errors.newPassword && (
            <p id="new-password-error" className="mt-1 text-sm text-red-600">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={shown.confirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              readOnly={pending}
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              {...register('confirmPassword', {
                required: 'Vui lòng xác nhận mật khẩu mới',
                validate: (v) => v === getValues('newPassword') || 'Mật khẩu xác nhận không khớp',
              })}
              className={inputClass}
            />
            <ToggleButton shown={shown.confirmPassword} onClick={() => toggle('confirmPassword')} disabled={pending} />
          </div>
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#b8465f] hover:bg-[#9d3a50] text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <KeyRound className="h-5 w-5" />
          {pending ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
        </button>
      </form>
    </Shell>
  );
};

export default ChangePassword;
