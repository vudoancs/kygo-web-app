'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AlertCircle, ArrowLeft, Camera, CheckCircle2, KeyRound, Lock, ShieldCheck, Trash2, User as UserIcon } from 'lucide-react';
import { useAppContext } from '@/modules/app-state';
import { HttpError } from '@/services/http/errors';
import {
  normalizePhone,
  PROFILE_RULES,
  type EditableProfileField,
  type LoginMethod,
  type MyProfile,
  type UpdateMyProfilePayload,
} from '@/modules/auth/my-profile.service';
import { SaveAccountError, useMyAccount, useSaveMyAccount, type AvatarChange } from '@/modules/auth/use-my-profile';

type FormValues = { name: string; phoneNumber: string; country: string; state: string; city: string };

const FIELDS: EditableProfileField[] = ['name', 'phoneNumber', 'country', 'state', 'city'];
const SUCCESS_MESSAGE = 'Cập nhật thông tin tài khoản thành công.';

const inputClass =
  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f] read-only:bg-gray-50 read-only:text-gray-600 aria-[invalid=true]:border-red-400';

const LOGIN_METHOD_LABELS: Record<LoginMethod, string> = {
  password: 'Email và mật khẩu',
  google: 'Google',
  facebook: 'Facebook',
  apple: 'Apple',
};

function toFormValues(profile: MyProfile): FormValues {
  return {
    name: profile.name,
    phoneNumber: profile.phoneNumber,
    country: profile.country,
    state: profile.state,
    city: profile.city,
  };
}

/** Chỉ gửi field thực sự đổi; field không bắt buộc để trống → null (xoá). */
function buildPatch(values: FormValues, saved: MyProfile): UpdateMyProfilePayload {
  const patch: UpdateMyProfilePayload = {};
  const name = values.name.trim();
  if (name !== saved.name) patch.name = name;
  const phone = values.phoneNumber.trim() ? normalizePhone(values.phoneNumber) : '';
  if (phone !== saved.phoneNumber) patch.phoneNumber = phone || null;
  for (const field of ['country', 'state', 'city'] as const) {
    const value = values[field].trim();
    if (value !== saved[field]) patch[field] = value || null;
  }
  return patch;
}

function describeLoginMethods(methods: LoginMethod[]): string {
  if (methods.length === 0) return 'Không xác định';
  return methods.map((m) => LOGIN_METHOD_LABELS[m]).join(' và ');
}

function formatMb(bytes: number): string {
  return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;
}

function avatarErrorMessage(error: unknown, maxBytes: number): string {
  if (error instanceof HttpError) {
    if (error.status === 413 || error.body?.code === 'AVATAR_TOO_LARGE') return `Ảnh vượt quá ${formatMb(maxBytes)}.`;
    if (error.body?.code === 'AVATAR_INVALID_TYPE') return 'Ảnh đại diện phải là JPEG, PNG hoặc WebP.';
    if (error.status === 429) return 'Bạn đã đổi ảnh quá nhiều lần. Vui lòng thử lại sau.';
  }
  return 'Không thể lưu ảnh đại diện. Vui lòng thử lại.';
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link href="/my-orders" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#b8465f] mb-6">
        <ArrowLeft className="h-4 w-4" />
        Đơn hàng của tôi
      </Link>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Thông tin tài khoản</h1>
        <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân của tài khoản Kygo Prom</p>
      </div>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-gray-200 rounded-lg p-5 sm:p-8 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">{title}</h2>
      {children}
    </section>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm text-red-600">
      {message}
    </p>
  );
}

const AccountProfile = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const profileQuery = useMyAccount();
  const save = useSaveMyAccount();
  const profile = profileQuery.data;

  const [avatarChange, setAvatarChange] = useState<AvatarChange>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: { name: '', phoneNumber: '', country: '', state: '', city: '' },
  });

  // Nạp giá trị đã lưu vào form lần đầu (không ghi đè khi người dùng đang sửa).
  const loadedId = useRef<string | null>(null);
  useEffect(() => {
    if (profile && loadedId.current !== profile.id) {
      loadedId.current = profile.id;
      reset(toFormValues(profile));
    }
  }, [profile, reset]);

  const previewUrl = useMemo(
    () => (avatarChange?.kind === 'upload' ? URL.createObjectURL(avatarChange.file) : null),
    [avatarChange],
  );
  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const pending = save.isPending;
  const hasChanges = isDirty || avatarChange !== null;

  // Cảnh báo khi rời trang (đóng tab / tải lại) với thay đổi chưa lưu.
  useEffect(() => {
    if (!hasChanges) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasChanges]);

  if (!user) {
    return (
      <Shell>
        <Section title="Vui lòng đăng nhập">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
              <UserIcon className="w-8 h-8 text-[#b8465f]" />
            </div>
            <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem thông tin tài khoản.</p>
            <button
              onClick={() => router.push('/login?redirect=/account/profile')}
              className="bg-[#b8465f] text-white px-8 py-3 rounded-lg hover:bg-[#9d3a50] transition-colors font-medium"
            >
              Đăng nhập ngay
            </button>
          </div>
        </Section>
      </Shell>
    );
  }

  if (profileQuery.isPending) {
    return (
      <Shell>
        <div className="flex justify-center py-16" role="status">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#b8465f] border-t-transparent" aria-label="Đang tải" />
        </div>
      </Shell>
    );
  }

  if (profileQuery.isError || !profile) {
    const sessionEnded = profileQuery.error instanceof HttpError && profileQuery.error.status === 401;
    return (
      <Shell>
        <Section title="Không tải được thông tin tài khoản">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                {sessionEnded ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' : 'Vui lòng thử lại.'}
              </p>
              <button
                onClick={() => (sessionEnded ? router.push('/login?redirect=/account/profile') : profileQuery.refetch())}
                className="mt-4 bg-[#b8465f] text-white px-5 py-2 rounded-lg hover:bg-[#9d3a50] transition-colors font-medium"
              >
                {sessionEnded ? 'Đăng nhập' : 'Tải lại'}
              </button>
            </div>
          </div>
        </Section>
      </Shell>
    );
  }

  const policy = profile.avatarPolicy;
  const displayedAvatar =
    avatarChange?.kind === 'upload'
      ? previewUrl
      : avatarChange?.kind === 'remove'
        ? null // Ảnh Google (nếu có) sẽ hiện lại sau khi lưu.
        : profile.avatar || null;
  const usesGoogle = profile.loginMethods.includes('google');

  const onPickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setSuccessMessage(null);
    if (!policy.allowedTypes.includes(file.type)) {
      setAvatarError('Ảnh đại diện phải là JPEG, PNG hoặc WebP.');
      return;
    }
    if (file.size > policy.maxBytes) {
      setAvatarError(`Ảnh vượt quá ${formatMb(policy.maxBytes)}.`);
      return;
    }
    setAvatarError(null);
    setAvatarChange({ kind: 'upload', file });
  };

  const onCancel = () => {
    reset(toFormValues(profile));
    setAvatarChange(null);
    setAvatarError(null);
    setFormError(null);
    setSuccessMessage(null);
  };

  const onSubmit = (values: FormValues) => {
    if (pending || !hasChanges) return;
    setFormError(null);
    setAvatarError(null);
    setSuccessMessage(null);
    const patch = buildPatch(values, profile);
    save.mutate(
      { patch, avatar: avatarChange },
      {
        onSuccess: (latest) => {
          const saved = latest ?? profile;
          reset(toFormValues(saved));
          setAvatarChange(null);
          setSuccessMessage(SUCCESS_MESSAGE);
        },
        onError: (err) => {
          // Giữ nguyên giá trị đang nhập; chỉ bỏ thay đổi ảnh nếu ảnh đã lưu thành công.
          const failure = err instanceof SaveAccountError ? err : null;
          const cause = failure?.error ?? err;
          if (failure?.failedStep === 'profile' && failure.profile) setAvatarChange(null);
          if (cause instanceof HttpError && cause.status === 401) {
            setFormError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để lưu thay đổi.');
            return;
          }
          if (failure?.failedStep === 'avatar') {
            setAvatarError(avatarErrorMessage(cause, policy.maxBytes));
            setFormError('Chưa lưu được thay đổi. Vui lòng kiểm tra ảnh đại diện.');
            return;
          }
          const fieldErrors = cause instanceof HttpError ? cause.body?.fieldErrors : undefined;
          let mapped = false;
          for (const field of FIELDS) {
            const message = fieldErrors?.[field];
            if (message) {
              setError(field, { message }, { shouldFocus: !mapped });
              mapped = true;
            }
          }
          const partial = failure?.profile ? ' Ảnh đại diện đã được lưu.' : '';
          setFormError(
            mapped
              ? `Vui lòng kiểm tra lại các trường được đánh dấu.${partial}`
              : cause instanceof HttpError && cause.status === 429
                ? 'Bạn đã cập nhật quá nhiều lần. Vui lòng thử lại sau.'
                : `Không thể cập nhật thông tin tài khoản. Vui lòng thử lại.${partial}`,
          );
        },
      },
    );
  };

  const fieldProps = (field: EditableProfileField) => ({
    id: `profile-${field}`,
    readOnly: pending,
    'aria-invalid': errors[field] ? ('true' as const) : ('false' as const),
    'aria-describedby': errors[field] ? `profile-${field}-error` : undefined,
    className: inputClass,
  });

  return (
    <Shell>
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={pending} className="space-y-6">
        {successMessage && (
          <div role="status" className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
            <p>{successMessage}</p>
          </div>
        )}
        {formError && (
          <div role="alert" className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p>{formError}</p>
          </div>
        )}

        <Section title="Ảnh đại diện">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-rose-100 flex items-center justify-center">
              {displayedAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displayedAvatar} alt="Ảnh đại diện" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-3xl font-semibold text-[#b8465f]">{(profile.name || profile.email).charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <input
                ref={fileInputRef}
                type="file"
                accept={policy.allowedTypes.join(',')}
                className="hidden"
                onChange={onPickFile}
                aria-label="Chọn ảnh đại diện"
              />
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={pending}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#b8465f] hover:text-[#b8465f] transition-colors disabled:opacity-60"
                >
                  <Camera className="h-4 w-4" />
                  {profile.avatarSource === 'custom' || avatarChange?.kind === 'upload' ? 'Đổi ảnh' : 'Tải ảnh lên'}
                </button>
                {avatarChange ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarChange(null);
                      setAvatarError(null);
                    }}
                    disabled={pending}
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-60"
                  >
                    Bỏ thay đổi ảnh
                  </button>
                ) : (
                  profile.avatarSource === 'custom' && (
                    <button
                      type="button"
                      onClick={() => {
                        setSuccessMessage(null);
                        setAvatarChange({ kind: 'remove' });
                      }}
                      disabled={pending}
                      className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      Gỡ ảnh
                    </button>
                  )
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">JPEG, PNG hoặc WebP, tối đa {formatMb(policy.maxBytes)}.</p>
              {avatarChange?.kind === 'upload' && <p className="mt-1 text-xs text-gray-600">Ảnh mới sẽ được lưu khi bạn bấm “Lưu thay đổi”.</p>}
              {avatarChange?.kind === 'remove' && (
                <p className="mt-1 text-xs text-gray-600">
                  Ảnh sẽ được gỡ khi bạn bấm “Lưu thay đổi”{usesGoogle ? ' và ảnh từ Google sẽ được dùng lại' : ''}.
                </p>
              )}
              {!avatarChange && usesGoogle && profile.avatarSource === 'provider' && (
                <p className="mt-1 text-xs text-gray-600">Đang dùng ảnh từ tài khoản Google. Ảnh bạn tải lên sẽ thay thế ảnh này.</p>
              )}
              <FieldError id="profile-avatar-error" message={avatarError ?? undefined} />
            </div>
          </div>
        </Section>

        <Section title="Thông tin cá nhân">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                autoComplete="name"
                maxLength={PROFILE_RULES.nameMaxLength}
                {...fieldProps('name')}
                {...register('name', {
                  validate: (v) => v.trim().length > 0 || 'Vui lòng nhập họ tên.',
                  maxLength: { value: PROFILE_RULES.nameMaxLength, message: `Họ tên tối đa ${PROFILE_RULES.nameMaxLength} ký tự.` },
                })}
              />
              <FieldError id="profile-name-error" message={errors.name?.message} />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  readOnly
                  aria-describedby="profile-email-note"
                  className={`${inputClass} pr-10`}
                />
                <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
              </div>
              <p id="profile-email-note" className="mt-1 text-xs text-gray-500">
                Email dùng để đăng nhập và không thể thay đổi tại trang này.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="profile-phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="VD: 0905 555 789"
                {...fieldProps('phoneNumber')}
                {...register('phoneNumber', {
                  validate: (v) => {
                    const raw = v.trim();
                    if (!raw) return true;
                    return (
                      (PROFILE_RULES.phoneInputPattern.test(raw) &&
                        PROFILE_RULES.phoneNormalizedPattern.test(normalizePhone(raw))) ||
                      'Số điện thoại không hợp lệ.'
                    );
                  },
                })}
              />
              <FieldError id="profile-phoneNumber-error" message={errors.phoneNumber?.message} />
            </div>

            {(
              [
                ['country', 'Quốc gia', 'country-name'],
                ['state', 'Tỉnh / Thành phố', 'address-level1'],
                ['city', 'Quận / Huyện', 'address-level2'],
              ] as const
            ).map(([field, label, autoComplete]) => (
              <div key={field} className={field === 'country' ? 'sm:col-span-2' : undefined}>
                <label htmlFor={`profile-${field}`} className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
                <input
                  type="text"
                  autoComplete={autoComplete}
                  maxLength={PROFILE_RULES.addressMaxLength}
                  {...fieldProps(field)}
                  {...register(field, {
                    maxLength: {
                      value: PROFILE_RULES.addressMaxLength,
                      message: `Tối đa ${PROFILE_RULES.addressMaxLength} ký tự.`,
                    },
                  })}
                />
                <FieldError id={`profile-${field}-error`} message={errors[field]?.message} />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Đăng nhập và bảo mật">
          <dl className="mb-4 text-sm">
            <dt className="text-gray-500">Phương thức đăng nhập</dt>
            <dd className="mt-1 font-medium text-gray-900">{describeLoginMethods(profile.loginMethods)}</dd>
          </dl>
          {profile.hasPassword ? (
            <Link
              href="/account/change-password"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#b8465f] hover:text-[#b8465f] transition-colors"
            >
              <KeyRound className="h-4 w-4" />
              Đổi mật khẩu
            </Link>
          ) : (
            <div className="flex items-start gap-3 rounded-lg border border-rose-100 bg-rose-50 p-3 text-sm text-gray-700">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#b8465f]" />
              <p>
                Tài khoản của bạn đăng nhập bằng Google nên không có mật khẩu Kygo Prom để thay đổi. Hãy tiếp tục dùng nút
                “Đăng nhập với Google”. Để đổi mật khẩu đăng nhập, vui lòng thay đổi trong tài khoản Google của bạn.
              </p>
            </div>
          )}
        </Section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending || !hasChanges}
            className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={pending || !hasChanges}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#b8465f] hover:bg-[#9d3a50] text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />}
            {pending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </Shell>
  );
};

export default AccountProfile;
