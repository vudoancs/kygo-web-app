import { Suspense } from 'react';
import ProductListing from '@/screens/ProductListing';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">Đang tải…</div>}>
      <ProductListing />
    </Suspense>
  );
}
