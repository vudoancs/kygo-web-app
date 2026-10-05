import type { Metadata } from 'next';
import ForgotPassword from '@/screens/ForgotPassword';

export const metadata: Metadata = {
  title: 'Quên mật khẩu',
  referrer: 'no-referrer',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
