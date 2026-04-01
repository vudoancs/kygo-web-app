import dynamic from 'next/dynamic';

const Checkout = dynamic(() => import('@/screens/Checkout'), {
  loading: () => (
    <div className="mx-auto max-w-3xl animate-pulse space-y-4 p-8">
      <div className="h-10 rounded bg-gray-100" />
      <div className="h-40 rounded bg-gray-100" />
    </div>
  ),
});

export default function CheckoutPage() {
  return <Checkout />;
}
