import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchCmsPostBySlugPublic } from '@/services/cms.service';
import { isPublicApiConfigured } from '@/libs/env';
import { getCmsCategoryPath } from '@/config/cms-seo';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  if (!isPublicApiConfigured()) {
    return { title: 'Bài viết' };
  }
  try {
    const post = await fetchCmsPostBySlugPublic(slug);
    const catPath = getCmsCategoryPath(post.category.code);
    return {
      title: `${post.title} | Kygo`,
      description: post.excerpt || post.title,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        images: post.thumbnail ? [{ url: post.thumbnail }] : undefined,
      },
      alternates: {
        canonical: `/post/${encodeURIComponent(post.slug)}`,
      },
      other: catPath
        ? {
            'article:section': post.category.name,
          }
        : undefined,
    };
  } catch {
    return { title: 'Bài viết | Kygo' };
  }
}

export default async function CmsPostPage(props: PageProps) {
  const { slug } = await props.params;

  if (!isPublicApiConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Bài viết</h1>
        <p className="mt-2 text-gray-600">Chưa cấu hình API công khai (NEXT_PUBLIC_API_URL).</p>
      </div>
    );
  }

  let post = null;
  try {
    post = await fetchCmsPostBySlugPublic(slug);
  } catch {
    post = null;
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Không tìm thấy bài viết</h1>
        <Link href="/" className="mt-4 inline-block text-[#b8465f] hover:underline">
          Về trang chủ
        </Link>
      </div>
    );
  }

  const catHref = `/category/${encodeURIComponent(post.category.code)}`;
  const catPath = getCmsCategoryPath(post.category.code);
  const prettyCategoryHref = catPath ? `/${catPath}` : catHref;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 text-sm text-gray-500">
        <Link href={prettyCategoryHref} className="hover:text-[#b8465f]">
          {post.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
      </div>

      <h1 className="font-serif text-3xl font-bold text-gray-900 sm:text-4xl">{post.title}</h1>

      {post.thumbnail ? (
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.thumbnail} alt="" className="w-full object-cover" />
        </div>
      ) : null}

      <div
        className="cms-content mt-10 max-w-none text-gray-800 [&_a]:text-[#b8465f] [&_h1]:font-serif [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h3]:mt-6 [&_h3]:font-serif [&_img]:max-w-full [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-12 border-t border-gray-200 pt-8">
        <Link href={prettyCategoryHref} className="text-sm font-semibold text-[#b8465f] hover:underline">
          ← Quay lại danh mục
        </Link>
      </div>
    </article>
  );
}
