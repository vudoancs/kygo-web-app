import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AppProviders } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'KYGO PROM — Thuê & mua đầm dạ hội',
    template: '%s | KYGO PROM',
  },
  description:
    'Thuê và mua đầm dạ hội cao cấp. Dịch vụ linh hoạt, bộ sưu tập sang trọng.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased">
        <AppProviders>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
