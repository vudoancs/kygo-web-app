'use client';

import React from 'react';
import { CheckCircle2, MapPin, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductImage } from '@/components/ProductImage';
import type { CartItem } from '@/modules/app-state';

export type OrderSuccessSummary = {
  items: CartItem[];
  deliveryMethod: 'delivery' | 'pickup';
  address?: string;
  district?: string;
  city?: string;
};

const SHOWROOM_ADDRESS = '33 Mỹ An 23, Phường Ngũ Hành Sơn, Tp Đà Nẵng';
const CONTACT_PHONE = '0799443533';
const CONTACT_PHONE_DISPLAY = '0799 443 533';
const ZALO_URL = 'https://zalo.me/0799443533';

type OrderSuccessDialogProps = {
  open: boolean;
  summary: OrderSuccessSummary | null;
  onViewOrders: () => void;
  onThanks: () => void;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

function formatRentalPeriod(item: CartItem): string | null {
  if (item.type !== 'rent' || !item.rentStartDate || !item.rentDuration) return null;
  const startDate = new Date(item.rentStartDate);
  const duration = item.rentDuration;
  const returnDate = new Date(
    startDate.getTime() + Math.max(duration - 1, 0) * 24 * 60 * 60 * 1000,
  );
  const startLabel = startDate.toLocaleDateString('vi-VN');
  const returnLabel = returnDate.toLocaleDateString('vi-VN');
  return `${duration} ngày · ${startLabel} → ${returnLabel}`;
}

function resolveReceiveLabel(summary: OrderSuccessSummary): string {
  if (summary.deliveryMethod === 'pickup') {
    return `Nhận tại showroom: ${SHOWROOM_ADDRESS}`;
  }
  const address = [summary.address, summary.district, summary.city]
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .join(', ');
  return address ? `Nhận tại: ${address}` : 'Nhận tại: giao hàng tận nơi';
}

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

export function OrderSuccessDialog({
  open,
  summary,
  onViewOrders,
  onThanks,
}: OrderSuccessDialogProps) {
  if (!summary) return null;

  const total = summary.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onThanks();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto border-gray-200 bg-white p-0 sm:max-w-lg">
        <div className="bg-gradient-to-b from-rose-50 to-white px-6 pt-8 pb-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#b8465f]/10">
            <CheckCircle2 className="h-8 w-8 text-[#b8465f]" />
          </div>
          <DialogHeader className="space-y-2 text-center sm:text-center">
            <DialogTitle className="font-serif text-2xl font-bold text-gray-900">
              Bạn đã đặt hàng thành công
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Cảm ơn bạn đã tin tưởng Kygo Prom. Chúng tôi sẽ liên hệ sớm để xác nhận đơn.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 pb-6">
          <div className="space-y-3">
            {summary.items.map((item) => {
              const rentalPeriod = formatRentalPeriod(item);
              return (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                >
                  <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-md bg-white">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Size: {item.size}
                      {item.type === 'rent' ? ' · Thuê' : ' · Mua'}
                    </p>
                    {rentalPeriod ? (
                      <p className="mt-1 text-xs text-gray-600">
                        Thời gian thuê: <span className="font-medium text-gray-900">{rentalPeriod}</span>
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm font-semibold text-[#b8465f]">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-rose-100 bg-rose-50/60 p-3">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#b8465f]" />
              <span>{resolveReceiveLabel(summary)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-rose-100 pt-2 text-sm">
              <span className="text-gray-600">Tổng cộng</span>
              <span className="font-bold text-[#b8465f]">{formatPrice(total)}</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Liên hệ</p>
            <div className="flex gap-3">
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:border-[#b8465f] hover:text-[#b8465f]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b8465f]/10">
                  <Phone className="h-4 w-4 text-[#b8465f]" />
                </span>
                Gọi điện
              </a>
              <a
                href={ZALO_URL}
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
            <p className="mt-2 text-center text-xs text-gray-500">{CONTACT_PHONE_DISPLAY}</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onViewOrders}
              className="w-full rounded-lg bg-[#b8465f] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#9d3a50] sm:flex-1"
            >
              Xem đơn hàng của bạn
            </button>
            <button
              type="button"
              onClick={onThanks}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-[#b8465f] hover:text-[#b8465f] sm:flex-1"
            >
              Cảm ơn
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
