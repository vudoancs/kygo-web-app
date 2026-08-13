'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ShopContactButtons } from '@/components/ShopContactButtons';
import {
  SHOP_ACCOUNT_NAME,
  SHOP_BANK_ACCOUNT,
  SHOP_BANK_BIN,
  SHOP_BANK_NAME,
  SHOP_QR_IMAGE,
  buildTransferNote,
  formatVnd,
  isShopVietQrConfigured,
} from '@/constants/shop-contact';

export type OrderPaymentMode = 'deposit' | 'remaining';

type OrderPaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: OrderPaymentMode;
  orderNumber: string;
  orderTotal: number;
  remainingAmount: number;
};

/** VietQR gọn (qr_only) — phù hợp popup không scroll. */
function buildCompactVietQrUrl(amount: number, addInfo: string): string | null {
  if (!isShopVietQrConfigured()) return null;
  const amt = Math.max(0, Math.round(amount));
  const info = encodeURIComponent(addInfo.replace(/\s+/g, ' ').trim().slice(0, 100));
  const accountName = encodeURIComponent(SHOP_ACCOUNT_NAME);
  return `https://img.vietqr.io/image/${SHOP_BANK_BIN}-${SHOP_BANK_ACCOUNT}-qr_only.png?amount=${amt}&addInfo=${info}&accountName=${accountName}`;
}

export function OrderPaymentDialog({
  open,
  onOpenChange,
  mode,
  orderNumber,
  orderTotal,
  remainingAmount,
}: OrderPaymentDialogProps) {
  const [depositPercent, setDepositPercent] = useState<50 | 100>(50);
  const [qrFailed, setQrFailed] = useState(false);

  useEffect(() => {
    if (open) {
      setDepositPercent(50);
      setQrFailed(false);
    }
  }, [open, mode, orderNumber]);

  const payAmount = useMemo(() => {
    if (mode === 'remaining') {
      return Math.max(0, Math.round(remainingAmount));
    }
    return Math.max(0, Math.round((orderTotal * depositPercent) / 100));
  }, [depositPercent, mode, orderTotal, remainingAmount]);

  const transferNote = buildTransferNote(orderNumber);
  const vietQrReady = isShopVietQrConfigured();

  const qrUrl = useMemo(() => {
    return buildCompactVietQrUrl(payAmount, transferNote) || SHOP_QR_IMAGE;
  }, [payAmount, transferNote]);

  useEffect(() => {
    setQrFailed(false);
  }, [qrUrl]);

  const title =
    mode === 'deposit' ? 'Yêu cầu đặt cọc cho đơn hàng' : 'Thanh toán phần còn lại';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-3 overflow-hidden border-gray-200 bg-white p-4 sm:max-w-xl sm:p-5">
        <DialogHeader className="space-y-1 pr-6 text-left">
          <DialogTitle className="font-serif text-lg leading-tight text-gray-900 sm:text-xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-600 sm:text-sm">
            Đơn <span className="font-semibold text-gray-900">{orderNumber}</span>
            {mode === 'deposit' ? ' — chọn mức đặt cọc rồi chuyển khoản.' : ' — thanh toán số còn lại.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {mode === 'deposit' ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDepositPercent(50)}
                className={`rounded-lg border-2 px-3 py-2 text-left transition-colors ${
                  depositPercent === 50
                    ? 'border-[#b8465f] bg-rose-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="text-xs font-semibold text-gray-900 sm:text-sm">50% giá trị đơn</p>
                <p className="text-sm font-bold text-[#b8465f]">
                  {formatVnd(Math.round(orderTotal * 0.5))}
                </p>
                <p className="text-[11px] text-gray-500">Mặc định</p>
              </button>
              <button
                type="button"
                onClick={() => setDepositPercent(100)}
                className={`rounded-lg border-2 px-3 py-2 text-left transition-colors ${
                  depositPercent === 100
                    ? 'border-[#b8465f] bg-rose-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="text-xs font-semibold text-gray-900 sm:text-sm">100% giá trị đơn</p>
                <p className="text-sm font-bold text-[#b8465f]">{formatVnd(orderTotal)}</p>
              </button>
            </div>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
              <p className="text-sm text-amber-900">
                Còn lại: <span className="font-bold">{formatVnd(payAmount)}</span>
              </p>
            </div>
          )}

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="mx-auto flex-shrink-0 sm:mx-0">
                {!qrFailed ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={qrUrl}
                    src={qrUrl}
                    alt="QR chuyển khoản Kygo"
                    className="h-36 w-36 rounded-md border border-gray-200 bg-white object-contain p-1 sm:h-40 sm:w-40"
                    onError={() => setQrFailed(true)}
                  />
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-md border border-dashed border-gray-300 bg-white p-2 text-center text-[11px] text-gray-500 sm:h-40 sm:w-40">
                    Không tải được QR
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1.5 text-sm">
                <p className="font-semibold text-gray-900">Bước 1: Chuyển khoản</p>
                <p className="text-xs text-gray-600">
                  Quét QR — số tiền{' '}
                  <span className="font-semibold text-[#b8465f]">{formatVnd(payAmount)}</span>
                  {vietQrReady ? ', nội dung đã gắn mã đơn.' : '.'}
                </p>
                {vietQrReady ? (
                  <p className="text-[11px] font-medium text-emerald-700">
                    QR động theo số tiền &amp; mã đơn
                  </p>
                ) : null}
                {SHOP_BANK_ACCOUNT ? (
                  <div className="space-y-0.5 text-xs text-gray-700 sm:text-sm">
                    <p>
                      <span className="text-gray-500">NH:</span>{' '}
                      <span className="font-medium">{SHOP_BANK_NAME || '—'}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">STK:</span>{' '}
                      <span className="font-semibold">{SHOP_BANK_ACCOUNT}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">Chủ TK:</span>{' '}
                      <span className="font-medium">{SHOP_ACCOUNT_NAME}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-700">Chưa cấu hình STK VietQR trong `.env`.</p>
                )}
                <p className="text-xs sm:text-sm">
                  <span className="text-gray-500">Nội dung:</span>{' '}
                  <span className="font-semibold text-gray-900">{transferNote}</span>
                </p>
                <p className="text-xs sm:text-sm">
                  <span className="text-gray-500">Số tiền:</span>{' '}
                  <span className="font-bold text-[#b8465f]">{formatVnd(payAmount)}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-rose-100 bg-rose-50/70 px-3 py-2.5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">Bước 2: Liên hệ shop xác nhận</p>
                <p className="text-xs text-gray-600">Sau khi CK, gọi/Zalo để xác nhận đơn.</p>
              </div>
              <ShopContactButtons compact className="justify-start sm:justify-end" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
