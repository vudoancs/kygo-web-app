import React from 'react';
import { ShoppingBag, Phone } from 'lucide-react';

interface MobileCTAProps {
  onRent?: () => void;
  onBuy?: () => void;
  onContact?: () => void;
}

const MobileCTA: React.FC<MobileCTAProps> = ({ onRent, onBuy, onContact }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 z-40 lg:hidden shadow-lg">
      {onContact && (
        <button
          onClick={onContact}
          className="flex-shrink-0 w-12 h-12 border border-[#b8465f] text-[#b8465f] rounded-lg flex items-center justify-center hover:bg-rose-50 transition-colors"
        >
          <Phone className="w-5 h-5" />
        </button>
      )}
      {onRent && (
        <button
          onClick={onRent}
          className="flex-1 bg-white border-2 border-[#b8465f] text-[#b8465f] py-3 px-6 rounded-lg font-semibold hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          Thuê
        </button>
      )}
      {onBuy && (
        <button
          onClick={onBuy}
          className="flex-1 bg-[#b8465f] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#9d3a50] transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          Mua
        </button>
      )}
    </div>
  );
};

export default MobileCTA;
