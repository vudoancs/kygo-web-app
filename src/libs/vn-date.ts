const VN_TZ = 'Asia/Ho_Chi_Minh';

/** YYYY-MM-DD theo lịch Việt Nam. */
export function ymdInVn(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: VN_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Tạo Date đúng giờ theo múi giờ Việt Nam (UTC+7).
 * Ví dụ: atHourInVn(date, 12) → 12:00 ngày đó (VN).
 */
export function atHourInVn(date: Date | string, hour: number, minute = 0): Date {
  const ymd =
    typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? date
      : ymdInVn(typeof date === 'string' ? new Date(date) : date);
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  return new Date(`${ymd}T${hh}:${mm}:00+07:00`);
}

/** Khoảng xem lịch thuê: đầu tháng hiện tại (VN) → +12 tháng. */
export function defaultRentalCalendarQueryRange(): { fromDate: string; toDate: string } {
  const todayYmd = ymdInVn();
  const [y, m] = todayYmd.split('-').map(Number);
  const fromDate = `${y}-${String(m).padStart(2, '0')}-01`;
  const endYear = m + 12 > 12 ? y + 1 : y;
  const endMonth = ((m + 12 - 1) % 12) + 1;
  const lastDay = new Date(endYear, endMonth, 0).getDate();
  const toDate = `${endYear}-${String(endMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { fromDate, toDate };
}
