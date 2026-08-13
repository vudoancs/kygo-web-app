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
  SHOP_BANK_NAME,
  SHOP_QR_IMAGE,
  buildShopVietQrUrl,
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
    const dynamic = buildShopVietQrUrl({ amount: payAmount, addInfo: transferNote });
    return dynamic || SHOP_QR_IMAGE;
  }, [payAmount, transferNote]);

  useEffect(() => {
    setQrFailed(false);
  }, [qrUrl]);

  const title =
    mode === 'deposit' ? 'Yêu cầu đặt cọc cho đơn hàng' : 'Thanh toán phần còn lại';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-gray-200 bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-gray-900">{title}</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Đơn <span className="font-semibold text-gray-900">{orderNumber}</span>
            {mode === 'deposit'
              ? ' — chọn mức đặt cọc rồi chuyển khoản theo hướng dẫn.'
              : ' — thanh toán toàn bộ số tiền còn lại.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {mode === 'deposit' ? (
            <div>
              <p className="mb-2 text-sm font-medium text-gray-800">Chọn mức đặt cọc</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDepositPercent(50)}
                  className={`rounded-lg border-2 p-3 text-left transition-colors ${
                    depositPercent === 50
                      ? 'border-[#b8465f] bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-900">50% giá trị đơn</p>
                  <p className="mt-1 text-sm font-bold text-[#b8465f]">
                    {formatVnd(Math.round(orderTotal * 0.5))}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Mặc định</p>
                </button>
                <button
                  type="button"
                  onClick={() => setDepositPercent(100)}
                  className={`rounded-lg border-2 p-3 text-left transition-colors ${
                    depositPercent === 100
                      ? 'border-[#b8465f] bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-900">100% giá trị đơn</p>
                  <p className="mt-1 text-sm font-bold text-[#b8465f]">{formatVnd(orderTotal)}</p>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-sm text-amber-900">
                Số còn lại cần thanh toán:{' '}
                <span className="font-bold">{formatVnd(payAmount)}</span>
              </p>
            </div>
          )}

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-900">Bước 1: Chuyển khoản</p>
            <p className="mt-1 text-sm text-gray-600">
              Quét mã QR{vietQrReady ? ' động' : ''} — số tiền{' '}
              <span className="font-semibold text-[#b8465f]">{formatVnd(payAmount)}</span>
              {vietQrReady ? ', nội dung CK đã gắn mã đơn.' : '.'}
            </p>

            <div className="mt-4 flex flex-col items-center">
              {!qrFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={qrUrl}
                  src={qrUrl}
                  alt="QR chuyển khoản Kygo"
                  className="h-56 w-56 rounded-lg border border-gray-200 bg-white object-contain p-2"
                  onError={() => setQrFailed(true)}
                />
              ) : (
                <div className="flex h-56 w-56 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-4 text-center text-xs text-gray-500">
                  Không tải được mã QR.
                  <br />
                  Kiểm tra cấu hình STK hoặc liên hệ shop.
                </div>
              )}
              {vietQrReady ? (
                <p className="mt-2 text-xs font-medium text-emerald-700">
                  QR VietQR · cập nhật theo số tiền &amp; mã đơn
                </p>
              ) : null}
              <div className="mt-3 w-full space-y-1 text-center text-sm text-gray-700">
                {SHOP_BANK_ACCOUNT ? (
                  <>
                    <p>
                      <span className="text-gray-500">Ngân hàng:</span>{' '}
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
                  </>
                ) : (
                  <p className="text-xs text-amber-700">
                    Chưa bật QR động. Thêm STK vào file{' '}
                    <code className="rounded bg-white px-1">.env</code>.
                  </p>
                )}
                <p>
                  <span className="text-gray-500">Nội dung CK:</span>{' '}
                  <span className="font-semibold text-gray-900">{transferNote}</span>
                </p>
                <p>
                  <span className="text-gray-500">Số tiền:</span>{' '}
                  <span className="font-bold text-[#b8465f]">{formatVnd(payAmount)}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-rose-100 bg-rose-50/70 p-4">
            <p className="text-sm font-semibold text-gray-900">Bước 2: Liên hệ shop xác nhận</p>
            <p className="mt-1 text-sm text-gray-600">
              Sau khi chuyển khoản, liên hệ shop để xác nhận giao dịch và đơn hàng.
            </p>
            <div className="mt-3">
              <ShopContactButtons />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
