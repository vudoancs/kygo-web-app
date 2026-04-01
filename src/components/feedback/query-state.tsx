'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getErrorMessage } from '@/services/http/errors';

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
}

/**
 * Pattern loading / lỗi thống nhất cho màn hình dùng React Query.
 */
export function QueryState({
  isLoading,
  isError,
  error,
  children,
  skeleton,
}: QueryStateProps) {
  if (isLoading) {
    return (
      skeleton ?? (
        <div className="space-y-4 p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTitle>Không tải được dữ liệu</AlertTitle>
        <AlertDescription>{getErrorMessage(error)}</AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}
