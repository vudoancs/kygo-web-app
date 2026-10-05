import type { Metadata } from 'next';
import ChangePassword from '@/screens/ChangePassword';

export const metadata: Metadata = {
  title: 'Đổi mật khẩu',
  robots: { index: false, follow: false },
};

export default function ChangePasswordPage() {
  return <ChangePassword />;
}
