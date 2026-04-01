import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="font-serif text-2xl font-bold text-gray-900">Không tìm thấy trang</h1>
      <Link href="/" className="text-[#b8465f] underline">
        Về trang chủ
      </Link>
    </div>
  );
}
