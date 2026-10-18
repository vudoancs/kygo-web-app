import { permanentRedirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ id: string }>;
};

/** Chi tiết mẹo làm đẹp là bài viết CMS — tham số được coi là slug, dùng chung trang `/post/[slug]`. */
export default async function StyleTipDetailPage(props: PageProps) {
  const { id } = await props.params;
  permanentRedirect(`/post/${encodeURIComponent(id)}`);
}
