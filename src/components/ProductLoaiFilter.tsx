'use client';

import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  buildGroupedLoaiFilterOptions,
  sortLoaiTags,
} from '@/modules/product/constants/product-loai-tags';

interface ProductLoaiFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
  onClear?: () => void;
  compact?: boolean;
}

export function ProductLoaiFilter({
  availableTags,
  selectedTags,
  onToggle,
  onClear,
  compact = false,
}: ProductLoaiFilterProps) {
  const { t } = useLanguage();

  const groups = useMemo(
    () => buildGroupedLoaiFilterOptions(availableTags),
    [availableTags],
  );

  if (!availableTags.length) {
    return <p className="text-sm text-gray-500">{t('listing.noLoai')}</p>;
  }

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {!compact ? (
        <p className="text-xs leading-relaxed text-gray-500">{t('filter.loaiHint')}</p>
      ) : null}

      {selectedTags.length > 0 && onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-[#b8465f] hover:underline"
        >
          {t('filter.loaiClear')}
        </button>
      ) : null}

      {groups.map((group) => (
        <div key={group.groupId}>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            {t(group.i18nKey)}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.tags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggle(tag)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? 'border-[#b8465f] bg-[#b8465f] text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-[#b8465f]/40 hover:text-[#b8465f]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

interface SelectedLoaiChipsProps {
  selectedTags: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}

/** Thanh loại đã chọn — hiển thị phía trên lưới sản phẩm. */
export function SelectedLoaiChips({ selectedTags, onToggle, onClear }: SelectedLoaiChipsProps) {
  const { t } = useLanguage();
  const ordered = useMemo(() => sortLoaiTags(selectedTags), [selectedTags]);

  if (!ordered.length) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-rose-100 bg-rose-50/60 px-3 py-2.5">
      <span className="text-xs font-medium text-gray-600">{t('filter.loaiSelected')}:</span>
      {ordered.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onToggle(tag)}
          className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#b8465f] shadow-sm ring-1 ring-[#b8465f]/20 hover:bg-rose-50"
        >
          {tag}
          <X className="h-3 w-3" aria-hidden />
          <span className="sr-only">{t('filter.loaiRemove')}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="ml-auto text-xs font-medium text-gray-500 hover:text-[#b8465f]"
      >
        {t('filter.loaiClearAll')}
      </button>
    </div>
  );
}
