import type { NextConfig } from 'next';

// Trang quên / đặt lại mật khẩu: không gửi Referer (token), không cache, không index.
const passwordResetHeaders = [
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'Cache-Control', value: 'no-store, max-age=0' },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      { source: '/reset-password', headers: passwordResetHeaders },
      { source: '/forgot-password', headers: passwordResetHeaders },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.unsplash.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
