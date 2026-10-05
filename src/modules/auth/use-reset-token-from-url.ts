'use client';

import { useEffect, useRef, useState } from 'react';

export type ResetTokenState = { status: 'checking' } | { status: 'ready'; token: string } | { status: 'missing' };

/**
 * Đọc token đặt lại mật khẩu từ URL (`#token=...`, fallback `?token=...`) đúng một lần rồi xoá khỏi
 * thanh địa chỉ / history. Token chỉ giữ trong bộ nhớ (không localStorage, không log).
 */
export function useResetTokenFromUrl(): ResetTokenState {
  const [state, setState] = useState<ResetTokenState>({ status: 'checking' });
  const captured = useRef(false);

  useEffect(() => {
    // StrictMode chạy effect hai lần — lần hai URL đã sạch, không được ghi đè thành "missing".
    if (captured.current) return;
    captured.current = true;

    const url = new URL(window.location.href);
    const fromHash = new URLSearchParams(url.hash.replace(/^#/, '')).get('token');
    const fromQuery = url.searchParams.get('token');
    const token = (fromHash || fromQuery || '').trim();

    if (url.hash || fromQuery) {
      url.hash = '';
      url.searchParams.delete('token');
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}`);
    }

    // URL chỉ có ở trình duyệt (không đọc được khi SSR) → đồng bộ một lần sau mount.
    setState(/^[A-Za-z0-9_-]{20,256}$/.test(token) ? { status: 'ready', token } : { status: 'missing' });
  }, []);

  return state;
}
