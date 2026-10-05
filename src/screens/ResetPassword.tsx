'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Eye, EyeOff, Link2Off } from 'lucide-react';
import { PASSWORD_POLICY } from '@/modules/auth/auth.service';
import { classifyPasswordResetError, useResetPassword } from '@/modules/auth/use-password-reset';
import { useResetTokenFromUrl } from '@/modules/auth/use-reset-token-from-url';

type FormValues = { newPassword: string; confirmPassword: string };

const inputClass =
  'w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f]';

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-400px)] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-[#b8465f] mb-2">KYGO PROM</h1>
            <p className="text-gray-600">Đặt lại mật khẩu</p>
          </div>
          {children}
          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-[#b8465f] hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleButton({ shown, onClick }: { shown: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={shown ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
      aria-pressed={shown}
      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
    >
      {shown ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  );
}

const ResetPassword = () => {
  const router = useRouter();
  const tokenState = useResetTokenFromUrl();
  const reset = useResetPassword();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { newPassword: '', confirmPassword: '' } });

  if (tokenState.status === 'checking') {
    return (
      <Card>
        <div className="flex justify-center py-6">
          <span
            className="h-8 w-8 animate-spin rounded-full border-2 border-[#b8465f] border-t-transparent"
            aria-label="Đang tải"
          />
        </div>
      </Card>
    );
  }

  if (tokenState.status === 'missing' || linkInvalid) {
    return (
      <Card>
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-red-50 p-3">
            <Link2Off className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="mb-3 text-xl font-bold text-gray-900">Liên kết không hợp lệ hoặc đã hết hạn</h2>
          <p className="mb-6 text-sm text-gray-600">
            Liên kết đặt lại mật khẩu đã hết hạn, đã được sử dụng hoặc đã được thay bằng liên kết mới hơn.
          </p>
          <Link
            href="/forgot-password"
            className="block w-full bg-[#b8465f] hover:bg-[#9d3a50] text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Gửi lại email đặt lại mật khẩu
          </Link>
        </div>
      </Card>
    );
  }

  const token = tokenState.token;

  const onSubmit = (values: FormValues) => {
    setErrorMessage(null);
    reset.mutate(
      { token, newPassword: values.newPassword },
      {
        onSuccess: () => router.replace('/login?reset=success'),
        onError: (error) => {
          const { kind, message } = classifyPasswordResetError(error);
          if (kind === 'invalidLink') {
            setLinkInvalid(true);
            return;
          }
          setErrorMessage(
            message ||
              (kind === 'rateLimited'
                ? 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.'
                : 'Không thể đặt lại mật khẩu. Vui lòng thử lại.'),
          );
        },
      },
    );
  };

  return (
    <Card>
      {errorMessage && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showNew ? 'text' : 'password'}
              autoComplete="new-password"
              aria-invalid={errors.newPassword ? 'true' : 'false'}
              aria-describedby="password-policy"
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
              })}
              className={inputClass}
            />
            <ToggleButton shown={showNew} onClick={() => setShowNew((v) => !v)} />
          </div>
          <p id="password-policy" className="mt-1.5 text-xs text-gray-500">
            Mật khẩu gồm {PASSWORD_POLICY.minLength}–{PASSWORD_POLICY.maxLength} ký tự và không chứa khoảng trắng.
          </p>
          {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              {...register('confirmPassword', {
                required: 'Vui lòng xác nhận mật khẩu',
                validate: (v) => v === getValues('newPassword') || 'Mật khẩu xác nhận không khớp',
              })}
              className={inputClass}
            />
            <ToggleButton shown={showConfirm} onClick={() => setShowConfirm((v) => !v)} />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={reset.isPending}
          className="w-full bg-[#b8465f] hover:bg-[#9d3a50] text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {reset.isPending ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
        </button>
      </form>
    </Card>
  );
};

export default ResetPassword;
