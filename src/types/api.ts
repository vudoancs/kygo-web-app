/** Khớp pattern phổ biến từ NestJS (có thể chỉnh theo backend thực tế). */
export interface ApiSuccess<T> {
  data: T;
  message?: string;
}

export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
  /** Mã lỗi nghiệp vụ (vd. `ORDER_PRICE_STALE`). */
  code?: string;
}

export type ApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: ApiErrorBody; status: number };
