import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchCmsCategories, fetchCmsPostsPublic } from '@/services/cms.service';
import { isPublicApiConfigured } from '@/libs/env';
import { getCmsCategoryPath } from '@/config/cms-seo';

type PageProps = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { code } = await props.params;
  if (!isPublicApiConfigured()) {
    return { title: 'Danh mục' };
  }
  try {
    const cats = await fetchCmsCategories();
    const name = cats.find((c) => c.code === code)?.name || code;
    const pathSeg = getCmsCategoryPath(code);
    const canonicalPath = pathSeg ? `/${pathSeg}` : `/category/${encodeURIComponent(code)}`;
    return {
      title: `${name} | Kygo`,
      description: `Bài viết: ${name}`,
      alternates: {
        canonical: canonicalPath,
      },
    };
  } catch {
    return { title: 'Danh mục | Kygo' };
  }
}

export default async function CmsCategoryPage(props: PageProps) {
  const { code } = await props.params;
  const sp = await props.searchParams;
  const page = Math.max(1, Number(sp.page || '1') || 1);

  if (!isPublicApiConfigured()) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Nội dung</h1>
        <p className="mt-2 text-gray-600">Chưa cấu hình API công khai (NEXT_PUBLIC_API_URL).</p>
      </div>
    );
  }

  let categoryName = code;
  let list = null as Awaited<ReturnType<typeof fetchCmsPostsPublic>> | null;
  try {
    const [cats, data] = await Promise.all([fetchCmsCategories(), fetchCmsPostsPublic({ categoryCode: code, page, limit: 9 })]);
    categoryName = cats.find((c) => c.code === code)?.name || code;
    list = data;
  } catch {
    list = null;
  }

  const items = list?.items || [];
  const totalPages = list?.totalPages || 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900">{categoryName}</h1>
        <p className="mt-2 text-sm text-gray-600">Các bài viết đã xuất bản trong danh mục này.</p>
      </div>

      {!list ? (
        <p className="text-gray-600">Không tải được dữ liệu. Vui lòng thử lại sau.</p>
      ) : items.length === 0 ? (
        <p className="text-gray-600">Chưa có bài viết.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/post/${encodeURIComponent(p.slug)}`}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-[16/10] bg-gray-100">
                {p.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumbnail} alt="" className="h-full w-full object-cover transition group-hover:scale-[1.02]" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No image</div>
                )}
              </div>
              <div className="p-4">
                <div className="line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-[#b8465f]">{p.title}</div>
                <div className="mt-2 line-clamp-3 text-sm text-gray-600">{p.excerpt}</div>
                <div className="mt-3 text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-10 flex items-center justify-center gap-3">
          <PaginationLink code={code} page={page - 1} disabled={page <= 1} label="Trước" />
          <span className="text-sm text-gray-600">
            Trang {page}/{totalPages}
          </span>
          <PaginationLink code={code} page={page + 1} disabled={page >= totalPages} label="Sau" />
        </div>
      ) : null}
    </div>
  );
}

function PaginationLink({
  code,
  page,
  disabled,
  label,
}: {
  code: string;
  page: number;
  disabled: boolean;
  label: string;
}) {
  const href = `/category/${encodeURIComponent(code)}?page=${page}`;
  if (disabled) {
    return (
      <span className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-300">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:border-[#b8465f] hover:text-[#b8465f]"
    >
      {label}
    </Link>
  );
}
