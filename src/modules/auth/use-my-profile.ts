import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '@/modules/app-state';
import {
  fetchMyAccount,
  removeMyAvatar,
  updateMyAccount,
  uploadMyAvatar,
  type MyProfile,
  type UpdateMyProfilePayload,
} from './my-profile.service';

export const MY_ACCOUNT_QUERY_KEY = ['auth', 'me'] as const;

/** Thay đổi ảnh đại diện đang chờ lưu. */
export type AvatarChange = { kind: 'upload'; file: File } | { kind: 'remove' } | null;

/**
 * Kết quả lưu: ảnh và thông tin là hai request riêng. Nếu ảnh lưu được mà PATCH lỗi, `profile` vẫn chứa ảnh mới
 * để giao diện không mất phần đã lưu; `failedStep` cho biết bước nào lỗi.
 */
export class SaveAccountError extends Error {
  constructor(
    readonly error: unknown,
    readonly failedStep: 'avatar' | 'profile',
    readonly profile: MyProfile | null,
  ) {
    super('save-account-failed');
    this.name = 'SaveAccountError';
  }
}

/** Đồng bộ tên / ảnh / SĐT sang trạng thái đăng nhập dùng chung (Header, menu tài khoản). */
function useSyncSessionUser() {
  const { user, login } = useAppContext();
  return (profile: MyProfile) => {
    if (!user) return;
    const phoneNumber = profile.phoneNumber || undefined;
    const avatar = profile.avatar || undefined;
    if (user.name === profile.name && user.avatar === avatar && user.phoneNumber === phoneNumber) return;
    login({ ...user, name: profile.name, avatar, phoneNumber });
  };
}

export function useMyAccount() {
  const { user } = useAppContext();
  const syncSessionUser = useSyncSessionUser();
  const query = useQuery({
    queryKey: MY_ACCOUNT_QUERY_KEY,
    queryFn: fetchMyAccount,
    enabled: Boolean(user),
    staleTime: 0,
  });

  // Hồ sơ mới nhất (kể cả đổi từ thiết bị khác) → cập nhật Header.
  const data = query.data;
  useEffect(() => {
    if (data) syncSessionUser(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return query;
}

export function useSaveMyAccount() {
  const queryClient = useQueryClient();
  const syncSessionUser = useSyncSessionUser();

  const apply = (profile: MyProfile) => {
    queryClient.setQueryData(MY_ACCOUNT_QUERY_KEY, profile);
    syncSessionUser(profile);
  };

  return useMutation({
    mutationFn: async ({ patch, avatar }: { patch: UpdateMyProfilePayload; avatar: AvatarChange }) => {
      let latest: MyProfile | null = null;
      if (avatar) {
        try {
          latest = avatar.kind === 'upload' ? await uploadMyAvatar(avatar.file) : await removeMyAvatar();
        } catch (err) {
          throw new SaveAccountError(err, 'avatar', null);
        }
        apply(latest);
      }
      if (Object.keys(patch).length > 0) {
        try {
          latest = await updateMyAccount(patch);
        } catch (err) {
          throw new SaveAccountError(err, 'profile', latest);
        }
        apply(latest);
      }
      return latest;
    },
  });
}
