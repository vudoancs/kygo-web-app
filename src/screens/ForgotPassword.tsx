'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { classifyPasswordResetError, useForgotPassword } from '@/modules/auth/use-password-reset';

const RESEND_COOLDOWN_SECONDS = 60;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_CONFIRMATION = 'Nếu email đã đăng ký, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.';

type FormValues = { email: string };

const ForgotPassword = () => {
  const forgot = useForgotPassword();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { email: '' } });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const send = (email: string) => {
    setErrorMessage(null);
    forgot.mutate(email, {
      onSuccess: () => {
        setSubmittedEmail(email);
        setCooldown(RESEND_COOLDOWN_SECONDS);
      },
      onError: (error) => {
        const { kind, message } = classifyPasswordResetError(error);
        setErrorMessage(
          kind === 'rateLimited'
            ? message || 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.'
            : message || 'Không thể gửi yêu cầu. Vui lòng thử lại.',
        );
      },
    });
  };

  const errorBanner = errorMessage && (
    <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {errorMessage}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-400px)] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-[#b8465f] mb-2">KYGO PROM</h1>
            <p className="text-gray-600">{submittedEmail ? 'Kiểm tra email của bạn' : 'Quên mật khẩu'}</p>
          </div>

          {submittedEmail ? (
            <div className="text-center" aria-live="polite">
              <div className="mx-auto mb-4 inline-flex rounded-full bg-rose-50 p-3">
                <MailCheck className="h-8 w-8 text-[#b8465f]" />
              </div>
              <p className="mb-6 text-sm text-gray-700">{GENERIC_CONFIRMATION}</p>
              {errorBanner}
              <button
                type="button"
                onClick={() => send(submittedEmail)}
                disabled={cooldown > 0 || forgot.isPending}
                className="w-full border-2 border-gray-300 hover:border-[#b8465f] text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {forgot.isPending ? 'Đang gửi...' : cooldown > 0 ? `Gửi lại sau ${cooldown}s` : 'Gửi lại email'}
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-gray-600 text-center">
                Nhập email tài khoản, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
              </p>
              {errorBanner}
              <form onSubmit={handleSubmit((v) => send(v.email.trim().toLowerCase()))} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="email@example.com"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'forgot-email-error' : undefined}
                    {...register('email', {
                      required: 'Vui lòng nhập email',
                      validate: (v) => EMAIL_PATTERN.test(v.trim()) || 'Email không hợp lệ',
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f]"
                  />
                  {errors.email && (
                    <p id="forgot-email-error" className="mt-1.5 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={forgot.isPending}
                  className="w-full bg-[#b8465f] hover:bg-[#9d3a50] text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {forgot.isPending ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Đăng ký bằng Google?</strong> Tài khoản tạo bằng Google không dùng mật khẩu Kygo Prom. Hãy quay
              lại trang đăng nhập và chọn <strong>Đăng nhập với Google</strong>.
            </p>
          </div>

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
};

export default ForgotPassword;
