'use client';

import React, { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppContext } from '@/modules/app-state';
import { getGoogleClientId } from '@/libs/env';
import { httpRequestOrThrow } from '@/services/http/client';
import { setTokens } from '@/modules/auth/token-storage';

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAppContext();
  const redirect = searchParams?.get('redirect') || '/';
  const [googleLoading, setGoogleLoading] = useState(false);
  const tokenClientRef = useRef<any>(null);

  const loadGoogleScript = async () => {
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w: any = window as any;
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w: any = window as any;
      const google = w.google;
      if (!google?.accounts?.oauth2) {
        throw new Error('Google OAuth client chưa sẵn sàng');
      }

      if (!tokenClientRef.current) {
        tokenClientRef.current = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid email profile',
          callback: async (resp: { access_token?: string; error?: string }) => {
            try {
              if (!resp?.access_token) {
                throw new Error(resp?.error || 'Không lấy được Google access_token');
              }

              const result = await httpRequestOrThrow<{
                accessToken: string;
                userInfo?: any;
                user?: any;
              }>('/auth/login-google', {
                method: 'POST',
                body: { access_token: resp.access_token },
              });

              if (!result?.accessToken) {
                throw new Error('Thiếu accessToken từ API');
              }

              // Lưu JWT để gọi API (My Orders, checkout...)
              setTokens(result.accessToken);

              const info = result.userInfo ?? result.user ?? {};
              const appUser = {
                id: String(info._id ?? info.id ?? ''),
                name: String(info.name ?? info.fullName ?? info.email ?? 'User'),
                email: String(info.email ?? ''),
                avatar: typeof info.avatar === 'string' ? info.avatar : undefined,
              };

              login(appUser);
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
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f]"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-[#b8465f] focus:ring-[#b8465f]" />
                <span className="text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-[#b8465f] hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#b8465f] hover:bg-[#9d3a50] text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Đăng nhập
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