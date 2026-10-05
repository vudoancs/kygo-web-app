'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAppContext } from '@/modules/app-state';
import type { AppUser } from '@/modules/app-state/context/app-context';
import { getGoogleClientId } from '@/libs/env';
import { httpRequestOrThrow } from '@/services/http/client';
import { HttpError } from '@/services/http/errors';
import { setTokens } from '@/modules/auth/token-storage';
import { loginRequest, persistAuthSession, type ApiUserInfo } from '@/modules/auth/auth.service';

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
};

type GoogleTokenClient = {
  requestAccessToken: (options?: { prompt?: string }) => void;
};

type GoogleOAuth2 = {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    callback: (resp: GoogleTokenResponse) => void;
  }) => GoogleTokenClient;
};

type GoogleAccounts = {
  oauth2: GoogleOAuth2;
};

type GoogleIdentity = {
  accounts: GoogleAccounts;
};

type WindowWithGoogle = Window & {
  google?: GoogleIdentity;
};

type LoginGoogleResponse = {
  accessToken: string;
  userInfo?: ApiUserInfo;
  user?: ApiUserInfo;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type PasswordLoginValues = { email: string; password: string };

/** Map user từ API (Google / email-mật khẩu) sang AppUser của app-state. */
function toAppUser(info: ApiUserInfo, fallbackEmail = ''): AppUser {
  return {
    id: String(info._id ?? info.id ?? ''),
    name: String(info.name ?? info.fullName ?? info.email ?? 'User'),
    email: String(info.email ?? fallbackEmail),
    avatar: typeof info.avatar === 'string' ? info.avatar : undefined,
    phoneNumber:
      typeof info.phoneNumber === 'string' && info.phoneNumber.trim() ? info.phoneNumber.trim() : undefined,
  };
}

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAppContext();
  const redirect = searchParams?.get('redirect') || '/';
  // Trang đặt lại mật khẩu chuyển về /login?reset=success.
  const resetSucceeded = searchParams?.get('reset') === 'success';
  const [googleLoading, setGoogleLoading] = useState(false);
  const tokenClientRef = useRef<GoogleTokenClient | null>(null);
  const [passwordLoginError, setPasswordLoginError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordLoginValues>({ defaultValues: { email: '', password: '' } });

  const handlePasswordLogin = async (values: PasswordLoginValues) => {
    setPasswordLoginError(null);
    const email = values.email.trim().toLowerCase();
    try {
      const result = await loginRequest({ email, password: values.password });
      if (!result?.accessToken) throw new Error('Thiếu accessToken từ API');
      persistAuthSession(result);
      login(toAppUser(result.user ?? {}, email));
      router.push(redirect);
    } catch (e) {
      // Không phân biệt "không có tài khoản" / "sai mật khẩu" trên UI.
      if (e instanceof HttpError && e.status === 400) {
        setPasswordLoginError('Email hoặc mật khẩu không đúng.');
      } else if (e instanceof HttpError && e.status === 429) {
        setPasswordLoginError('Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.');
      } else {
        setPasswordLoginError('Không thể đăng nhập. Vui lòng thử lại.');
      }
    }
  };

  const loadGoogleScript = async () => {
    if (typeof window === 'undefined') return;
    const w = window as WindowWithGoogle;
    if (w.google?.accounts?.oauth2) return;

    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector('script[data-google-gsi="true"]') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Failed to load Google script')));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.dataset.googleGsi = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google script'));
      document.head.appendChild(script);
    });
  };

  const handleGoogleLogin = async () => {
    const clientId = getGoogleClientId();
    if (!clientId) {
      alert('Thiếu cấu hình NEXT_PUBLIC_GOOGLE_CLIENT_ID');
      return;
    }

    setGoogleLoading(true);
    try {
      await loadGoogleScript();

      const w = window as WindowWithGoogle;
      const google = w.google;
      if (!google?.accounts?.oauth2) {
        throw new Error('Google OAuth client chưa sẵn sàng');
      }

      if (!tokenClientRef.current) {
        tokenClientRef.current = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid email profile',
          callback: async (resp: GoogleTokenResponse) => {
            try {
              if (!resp?.access_token) {
                throw new Error(resp?.error || 'Không lấy được Google access_token');
              }

              const result = await httpRequestOrThrow<LoginGoogleResponse>('/auth/login-google', {
                method: 'POST',
                body: { access_token: resp.access_token },
              });

              if (!result?.accessToken) {
                throw new Error('Thiếu accessToken từ API');
              }

              // Lưu JWT để gọi API (My Orders, checkout...)
              setTokens(result.accessToken);

              login(toAppUser(result.userInfo ?? result.user ?? {}));
              router.push(redirect);
            } catch (e) {
              alert(e instanceof Error ? e.message : 'Đăng nhập Google thất bại');
            } finally {
              setGoogleLoading(false);
            }
          },
        });
      }

      tokenClientRef.current.requestAccessToken({ prompt: 'consent' });
    } catch (e) {
      setGoogleLoading(false);
      alert(e instanceof Error ? e.message : 'Đăng nhập Google thất bại');
    }
  };

  return (
    <div className="min-h-[calc(100vh-400px)] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-[#b8465f] mb-2">KYGO PROM</h1>
            <p className="text-gray-600">Đăng nhập để tiếp tục</p>
          </div>

          {resetSucceeded && (
            <div role="status" className="mb-6 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới.
            </div>
          )}

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full bg-white border-2 border-gray-300 hover:border-[#b8465f] text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-3 mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {googleLoading ? 'Đang đăng nhập...' : 'Đăng nhập với Google'}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">hoặc</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form className="space-y-4" onSubmit={handleSubmit(handlePasswordLogin)} noValidate>
            {passwordLoginError && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {passwordLoginError}
              </div>
            )}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="email@example.com"
                aria-invalid={errors.email ? 'true' : 'false'}
                {...register('email', {
                  required: 'Vui lòng nhập email',
                  validate: (v) => EMAIL_PATTERN.test(v.trim()) || 'Email không hợp lệ',
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f]"
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={errors.password ? 'true' : 'false'}
                {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f]"
              />
              {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-[#b8465f] focus:ring-[#b8465f]" />
                <span className="text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <Link href="/forgot-password" className="text-[#b8465f] hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#b8465f] hover:bg-[#9d3a50] text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Info Message */}
          <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              💡 <strong>Đăng nhập nhanh</strong> để theo dõi đơn hàng và lịch thuê
            </p>
          </div>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <a href="#" className="text-[#b8465f] hover:underline font-medium">
              Đăng ký ngay
            </a>
          </p>
        </div>

        {/* Guest Browsing Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Bạn có thể{' '}
            <button onClick={() => router.push('/products')} className="text-[#b8465f] hover:underline">
              tiếp tục xem sản phẩm
            </button>{' '}
            mà không cần đăng nhập
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;