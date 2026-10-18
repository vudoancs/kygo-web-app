'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { isPublicApiConfigured } from '@/libs/env';
import { useCmsPostsQuery } from '@/hooks/use-cms-posts-query';
import { CMS_CATEGORY_CODES, getCmsCategoryPublicHref } from '@/config/cms-seo';
import { Skeleton } from '@/components/ui/skeleton';
import { QueryErrorCard } from '@/components/feedback/query-error-card';

const StyleTips = () => {
  const { language, t } = useLanguage();
  const api = isPublicApiConfigured();
  const cmsQuery = useCmsPostsQuery({
    categoryCode: CMS_CATEGORY_CODES.BEAUTY_TIPS,
    limit: 48,
    enabled: api,
  });

  const locale = language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'ko-KR';
  const listHref = getCmsCategoryPublicHref(CMS_CATEGORY_CODES.BEAUTY_TIPS);

  const cmsItems = cmsQuery.data?.items ?? [];
  const showCms = api && cmsQuery.isSuccess && cmsItems.length > 0;
  const cmsEmpty = api && cmsQuery.isSuccess && cmsItems.length === 0;
  const cmsFailed = !api || cmsQuery.isError;

  const featuredCms = showCms ? cmsItems[0] : null;
  const otherCms = showCms ? cmsItems.slice(1) : [];

  const bodyLoading = api && cmsQuery.isPending;

  const renderBody = () => {
    if (bodyLoading) {
      return (
        <div className="space-y-16">
          <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
            <div className="flex flex-col justify-center gap-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
            ))}
          </div>
        </div>
      );
    }

    if (showCms && featuredCms) {
      return (
        <>
          <Link href={`/post/${encodeURIComponent(featuredCms.slug)}`} className="group mb-16 block">
            <div className="grid transform gap-8 overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
                {featuredCms.thumbnail ? (
                  <img
                    src={featuredCms.thumbnail}
                    alt={featuredCms.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full min-h-[200px] items-center justify-center bg-gray-100 text-sm text-gray-400">
                    Kygo
                  </div>
                )}
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-[#b8465f] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-lg">
                    {t('styleTips.featured')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold uppercase tracking-wider text-[#b8465f]">
                    {featuredCms.category.name}
                  </span>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1 h-4 w-4" />
                    {new Date(featuredCms.createdAt).toLocaleDateString(locale)}
                  </div>
                </div>

                <h2 className="mb-4 font-serif text-2xl font-bold text-gray-900 transition-colors group-hover:text-[#b8465f] md:text-3xl lg:text-4xl">
                  {featuredCms.title}
                </h2>

                <p className="mb-6 text-base leading-relaxed text-gray-600 md:text-lg">
                  {featuredCms.excerpt || ''}
                </p>

                <div className="flex items-center justify-end font-semibold text-[#b8465f] transition-all group-hover:gap-2">
                  {t('styleTips.readMore')}
                  <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {otherCms.map((post) => (
              <Link
                key={post.id}
                href={`/post/${encodeURIComponent(post.slug)}`}
                className="group transform rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {post.thumbnail ? (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                      Kygo
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute right-4 top-4">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase text-[#b8465f] backdrop-blur-sm">
                      {post.category.name}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {new Date(post.createdAt).toLocaleDateString(locale)}
                  </div>

                  <h3 className="mb-3 line-clamp-2 font-serif text-xl font-bold text-gray-900 transition-colors group-hover:text-[#b8465f]">
                    {post.title}
                  </h3>

                  <p className="mb-4 line-clamp-3 leading-relaxed text-gray-600">{post.excerpt || ''}</p>

                  <div className="flex items-center text-sm font-semibold text-[#b8465f] transition-all group-hover:gap-2">
                    {t('styleTips.readMore')}
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={listHref}
              className="inline-flex items-center gap-2 font-semibold text-[#b8465f] hover:underline"
            >
              {t('common.viewAll')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      );
    }

    if (cmsEmpty) {
      return (
        <p className="py-12 text-center text-gray-600">
          {language === 'vi'
            ? 'Chưa có bài viết trong mục này.'
            : language === 'en'
              ? 'No articles in this section yet.'
              : '이 섹션에 아직 글이 없습니다.'}
        </p>
      );
    }

    if (cmsFailed) {
      return <QueryErrorCard onRetry={api ? () => void cmsQuery.refetch() : undefined} />;
    }

    return null;
  };

  const heroExtra =
    api && cmsQuery.isSuccess && cmsItems.length > 0 ? (
      <div className="mt-6">
        <Link
          href={listHref}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/25"
        >
          {t('common.viewAll')}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/30 to-white">
      <div className="relative bg-gradient-to-r from-[#b8465f] to-[#8b3449] py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl lg:text-6xl">{t('styleTips.title')}</h1>
          <p className="mx-auto max-w-2xl text-lg text-rose-100 md:text-xl">{t('styleTips.subtitle')}</p>
          {heroExtra}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">{renderBody()}</div>
    </div>
  );
};

export default StyleTips;
