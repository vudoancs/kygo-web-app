/**
 * Một số controller ERP trả `{ success: true, data: T }`. Web store trả thẳng T.
 */
export function unwrapKygoApiBody<T>(body: unknown): T {
  if (
    body !== null &&
    typeof body === 'object' &&
    'data' in body &&
    'success' in body &&
    (body as { success: unknown }).success === true
  ) {
    return (body as { data: T }).data;
  }
  return body as T;
}
