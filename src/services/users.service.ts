import { unwrapKygoApiBody } from '@/libs/unwrap-api-body';
import { httpRequestOrThrow } from '@/services/http/client';

export type UserProfile = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  customerId?: string;
  avatar?: string;
};

export async function fetchMyProfile(): Promise<UserProfile> {
  const body = await httpRequestOrThrow<unknown>('/users/profile', {
    method: 'GET',
    auth: true,
  });
  return unwrapKygoApiBody<UserProfile>(body);
}
