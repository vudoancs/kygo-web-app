import type { Metadata } from 'next';
import AccountProfile from '@/screens/AccountProfile';

export const metadata: Metadata = {
  title: 'Thông tin tài khoản',
  robots: { index: false, follow: false },
};

export default function AccountProfilePage() {
  return <AccountProfile />;
}
