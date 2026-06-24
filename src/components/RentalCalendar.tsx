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
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const rentedSet = useMemo(() => new Set(rentedDates), [rentedDates]);
  const bookedSet = useMemo(() => new Set(bookedDates), [bookedDates]);
  const unavailableSet = useMemo(() => {
    const merged = new Set(unavailableDates);
    for (const d of rentedDates) merged.add(d);
    for (const d of bookedDates) merged.add(d);
    return merged;
  }, [unavailableDates, rentedDates, bookedDates]);

  useEffect(() => {
    const all = [...rentedDates, ...bookedDates, ...unavailableDates];
    if (!all.length) return;
    const today = ymdInVn();
    const sorted = [...new Set(all)].sort((a, b) => a.localeCompare(b));
    const target = sorted.find((d) => d >= today) ?? sorted[0];
    const [y, m] = target.split('-').map(Number);
    if (!y || !m) return;
    setCurrentMonth(new Date(y, m - 1, 1));
  }, [focusKey, rentedDates, bookedDates, unavailableDates]);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDateKind = (year: number, monthIndex: number, day: number): 'rented' | 'booked' | null => {
    const dateStr = ymdFromCalendarCell(year, monthIndex, day);
    if (rentedSet.has(dateStr)) return 'rented';
    if (bookedSet.has(dateStr)) return 'booked';
    if (unavailableSet.has(dateStr)) return 'booked';
    return null;
  };

  const isDateUnavailable = (year: number, monthIndex: number, day: number) =>
    getDateKind(year, monthIndex, day) !== null;

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
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

    if (isPastDate(clickedDate) || isDateUnavailable(year, monthIndex, day)) {
      return;
    }

    if (isSameDay(selectedDate, clickedDate)) {
      onDateSelect(null);
    } else {
      onDateSelect(clickedDate);
    }
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const days = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    for (let day = 1; day <= days; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const year = currentMonth.getFullYear();
      const monthIndex = currentMonth.getMonth();
      const kind = getDateKind(year, monthIndex, day);
      const past = isPastDate(date);
      const selected = isSameDay(selectedDate, date);
      const disabled = past || kind !== null;

      calendarDays.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={disabled}
          className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            selected
              ? 'bg-[#b8465f] text-white'
              : past
                ? 'text-gray-300 cursor-not-allowed'
                : kind === 'rented'
                  ? 'bg-red-100 text-red-600 line-through cursor-not-allowed'
                  : kind === 'booked'
                    ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-rose-50 hover:text-[#b8465f]'
          }`}
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {isLoading ? (
        <p className="mb-3 text-center text-sm text-gray-500">Đang tải lịch thuê…</p>
      ) : null}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button
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
          <div className="w-4 h-4 bg-[#b8465f] rounded"></div>
          <span className="text-gray-600">Đã chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
          <span className="text-gray-600">Có sẵn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded border border-red-200"></div>
          <span className="text-gray-600">Đã thuê</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 rounded border border-blue-200"></div>
          <span className="text-gray-600">Đã đặt</span>
        </div>
      </div>
    </div>
  );
};

export default RentalCalendar;
