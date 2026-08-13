'use client';

import React from 'react';
import { Phone } from 'lucide-react';
import {
  SHOP_PHONE_DISPLAY,
  SHOP_TEL_URL,
  SHOP_ZALO_URL,
} from '@/constants/shop-contact';

function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#0068FF"
        d="M12 2C6.477 2 2 5.94 2 10.8c0 2.84 1.53 5.37 3.92 7.02-.12.98-.55 2.64-1.77 3.92 0 0 3.03-.34 5.18-1.92.88.18 1.8.28 2.67.28 5.523 0 10-3.94 10-8.8S17.523 2 12 2z"
      />
      <path
        fill="#FFFFFF"
        d="M8.1 9.15h7.8c.5 0 .9.4.9.9s-.4.9-.9.9H8.1c-.5 0-.9-.4-.9-.9s.4-.9.9-.9zm0 3.1h5.2c.5 0 .9.4.9.9s-.4.9-.9.9H8.1c-.5 0-.9-.4-.9-.9s.4-.9.9-.9z"
      />
    </svg>
  );
}

type ShopContactButtonsProps = {
  compact?: boolean;
  className?: string;
};

export function ShopContactButtons({ compact = false, className = '' }: ShopContactButtonsProps) {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <a
          href={SHOP_TEL_URL}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-[#b8465f] transition-colors hover:border-[#b8465f]"
          aria-label="Gọi điện"
          title={`Gọi ${SHOP_PHONE_DISPLAY}`}
        >
          <Phone className="h-4 w-4" />
        </a>
        <a
          href={SHOP_ZALO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors hover:border-[#0068FF]"
          aria-label="Zalo"
          title="Zalo"
        >
          <ZaloIcon className="h-5 w-5" />
        </a>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${className}`}>
      <a
        href={SHOP_TEL_URL}
        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:border-[#b8465f] hover:text-[#b8465f]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b8465f]/10">
          <Phone className="h-4 w-4 text-[#b8465f]" />
        </span>
        Gọi điện
      </a>
      <a
        href={SHOP_ZALO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:border-[#0068FF] hover:text-[#0068FF]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0068FF]/10">
          <ZaloIcon className="h-5 w-5" />
        </span>
        Zalo
      </a>
    </div>
  );
}
