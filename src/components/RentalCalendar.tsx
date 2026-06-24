'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ymdInVn } from '@/libs/vn-date';

interface RentalCalendarProps {
  unavailableDates?: string[];
  rentedDates?: string[];
  bookedDates?: string[];
  focusKey?: string;
  isLoading?: boolean;
  onDateSelect: (date: Date | null) => void;
  selectedDate: Date | null;
}

function ymdFromCalendarCell(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

const RentalCalendar: React.FC<RentalCalendarProps> = ({
  unavailableDates = [],
  rentedDates = [],
  bookedDates = [],
  focusKey,
  isLoading = false,
  onDateSelect,
  selectedDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const rentedSet = useMemo(() => new Set(rentedDates), [rentedDates]);
  const bookedSet = useMemo(() => new Set(bookedDates), [bookedDates]);
  const unavailableSet = useMemo(() => {
    const merged = new Set(unavailableDates);
    for (const d of rentedDates) merged.add(d);
    for (const d of bookedDates) merged.add(d);
    return merged;
  }, [unavailableDates, rentedDates, bookedDates]);

  const todayYmd = ymdInVn();

  useEffect(() => {
    const all = [...rentedDates, ...bookedDates, ...unavailableDates];
    if (!all.length) return;
    const sorted = [...new Set(all)].sort((a, b) => a.localeCompare(b));
    const target = sorted.find((d) => d >= todayYmd) ?? sorted[sorted.length - 1];
    const [y, m] = target.split('-').map(Number);
    if (!y || !m) return;
    setCurrentMonth(new Date(y, m - 1, 1));
  }, [focusKey, rentedDates, bookedDates, unavailableDates, todayYmd]);

  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const firstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getDateKind = (year: number, monthIndex: number, day: number): 'rented' | 'booked' | null => {
    const dateStr = ymdFromCalendarCell(year, monthIndex, day);
    if (rentedSet.has(dateStr)) return 'rented';
    if (bookedSet.has(dateStr)) return 'booked';
    if (unavailableSet.has(dateStr)) return 'booked';
    return null;
  };

  const isPastYmd = (year: number, monthIndex: number, day: number) => {
    const dateStr = ymdFromCalendarCell(year, monthIndex, day);
    return dateStr < todayYmd;
  };

  const isSameDay = (date1: Date | null, date2: Date) => {
    if (!date1) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleDateClick = (day: number) => {
    const year = currentMonth.getFullYear();
    const monthIndex = currentMonth.getMonth();
    const clickedDate = new Date(year, monthIndex, day);
    const kind = getDateKind(year, monthIndex, day);

    if (isPastYmd(year, monthIndex, day) || kind !== null) return;

    if (isSameDay(selectedDate, clickedDate)) {
      onDateSelect(null);
    } else {
      onDateSelect(clickedDate);
    }
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const days = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    const calendarDays = [];
    const year = currentMonth.getFullYear();
    const monthIndex = currentMonth.getMonth();

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    for (let day = 1; day <= days; day++) {
      const date = new Date(year, monthIndex, day);
      const kind = getDateKind(year, monthIndex, day);
      const past = isPastYmd(year, monthIndex, day);
      const selected = isSameDay(selectedDate, date);
      const blocked = past || kind !== null;

      let cellClass =
        'aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors ';

      if (selected) {
        cellClass += 'bg-[#b8465f] text-white shadow-sm';
      } else if (kind === 'rented') {
        cellClass += 'bg-red-500 text-white line-through cursor-not-allowed';
      } else if (kind === 'booked') {
        cellClass += 'bg-blue-600 text-white cursor-not-allowed shadow-sm';
      } else if (past) {
        cellClass += 'text-gray-300 cursor-not-allowed';
      } else {
        cellClass += 'text-gray-700 hover:bg-rose-50 hover:text-[#b8465f]';
      }

      calendarDays.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(day)}
          aria-disabled={blocked}
          tabIndex={blocked ? -1 : 0}
          className={cellClass}
        >
          {day}
        </button>,
      );
    }

    return calendarDays;
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const hasMarkers = rentedDates.length > 0 || bookedDates.length > 0 || unavailableDates.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {isLoading ? (
        <p className="mb-3 text-center text-sm text-gray-500">Đang tải lịch thuê…</p>
      ) : null}
      {!isLoading && !hasMarkers ? (
        <p className="mb-3 text-center text-xs text-gray-400">Chưa có ngày đặt trong khoảng 12 tháng tới</p>
      ) : null}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#b8465f] rounded" />
          <span className="text-gray-600">Đã chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-200 rounded" />
          <span className="text-gray-600">Có sẵn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span className="text-gray-600">Đã thuê</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded" />
          <span className="text-gray-600">Đã đặt</span>
        </div>
      </div>
    </div>
  );
};

export default RentalCalendar;
