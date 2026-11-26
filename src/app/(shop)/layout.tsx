import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import Header from '@/components/Header';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const analyticsEnabled = process.env.NODE_ENV === 'production' && /^G-[A-Z0-9]+$/.test(measurementId ?? '');

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <BottomNav />
      <Footer />
      {analyticsEnabled && measurementId && <GoogleAnalytics measurementId={measurementId} />}
    </div>
  );
}
