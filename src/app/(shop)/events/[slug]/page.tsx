import { permanentRedirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Chi tiết sự kiện là bài viết CMS — dùng chung trang `/post/[slug]`. */
export default async function EventDetailPage(props: PageProps) {
  const { slug } = await props.params;
  permanentRedirect(`/post/${encodeURIComponent(slug)}`);
}
