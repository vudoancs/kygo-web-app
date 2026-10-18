'use client';

import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface QueryErrorCardProps {
  /** Tiêu đề; mặc định "Không tải được dữ liệu". */
  title?: string;
  /** Mô tả; mặc định "Vui lòng thử lại." (hoặc thông báo chưa cấu hình API khi không có onRetry). */
  description?: string;
  /** Có → hiện nút "Tải lại" (thường là `query.refetch`). */
  onRetry?: () => void;
  className?: string;
}

/**
 * Trạng thái lỗi khi gọi API thất bại — không bao giờ thay bằng data mẫu.
 */
export function QueryErrorCard({ title, description, onRetry, className }: QueryErrorCardProps) {
  const { t } = useLanguage();
  return (
    <div role="alert" className={`bg-white border border-gray-200 rounded-lg p-8 ${className ?? ''}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{title ?? t('common.loadFailed')}</p>
          <p className="text-sm text-gray-600 mt-1">
            {description ?? (onRetry ? t('common.retryHint') : t('common.apiNotConfigured'))}
          </p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 bg-[#b8465f] text-white px-5 py-2 rounded-lg hover:bg-[#9d3a50] transition-colors font-medium"
            >
              {t('common.retry')}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
