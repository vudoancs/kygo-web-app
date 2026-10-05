import type { Metadata } from 'next';
import ResetPassword from '@/screens/ResetPassword';

export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu',
  referrer: 'no-referrer',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <ResetPassword />;
}
