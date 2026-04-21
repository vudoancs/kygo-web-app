'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Award, Image as ImageIcon, ChevronRight, Clock } from 'lucide-react';
import { events } from '../data/events';
import { useLanguage } from '../contexts/LanguageContext';
import { isPublicApiConfigured } from '@/libs/env';
import { useCmsPostsQuery } from '@/hooks/use-cms-posts-query';
import { CMS_CATEGORY_CODES, getCmsCategoryPublicHref } from '@/config/cms-seo';
import { Skeleton } from '@/components/ui/skeleton';

const EventsList = () => {
  const { language, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const api = isPublicApiConfigured();
  const cmsQuery = useCmsPostsQuery({
    categoryCode: CMS_CATEGORY_CODES.EVENTS_HOA_KHOI,
    limit: 48,
    enabled: api,
  });

  const cmsItems = cmsQuery.data?.items ?? [];
  const showCms = api && cmsQuery.isSuccess && cmsItems.length > 0;
  const cmsEmpty = api && cmsQuery.isSuccess && cmsItems.length === 0;
  const useMock = !api || cmsQuery.isError;

  const locale = language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'ko-KR';
  const listHref = getCmsCategoryPublicHref(CMS_CATEGORY_CODES.EVENTS_HOA_KHOI);

  const filteredCms = useMemo(() => {
    const items = cmsQuery.data?.items ?? [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || (p.excerpt || '').toLowerCase().includes(q),
    );
  }, [cmsQuery.data, searchQuery]);

  const getLocalizedContent = (event: (typeof events)[0]) => {
    return {
      name: language === 'vi' ? event.name : language === 'en' ? event.nameEn : event.nameKo,
      description: language === 'vi' ? event.description : language === 'en' ? event.descriptionEn : event.descriptionKo,
      location: language === 'vi' ? event.location : language === 'en' ? event.locationEn : event.locationKo,
      tags: language === 'vi' ? event.tags : language === 'en' ? event.tagsEn : event.tagsKo,
    };
  };

  const filterTypes = [
    { id: 'all', label: t('events.filters.all') },
    { id: 'contest', label: t('events.filters.contest') },
    { id: 'runway', label: t('events.filters.runway') },
    { id: 'bts', label: t('events.filters.bts') },
    { id: 'sponsored', label: t('events.filters.sponsored') },
  ];

  const filteredEvents = events.filter((event) => {
    const content = getLocalizedContent(event);

    const matchesSearch =
      searchQuery === '' ||
      content.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'sponsored') return matchesSearch && event.isSponsored;
    if (activeFilter === 'contest')
      return (
        matchesSearch &&
        content.tags.some(
          (tag) =>
            tag.toLowerCase().includes('cuộc thi') ||
            tag.toLowerCase().includes('contest') ||
            tag.toLowerCase().includes('대회'),
        )
      );
    if (activeFilter === 'runway')
      return (
        matchesSearch &&
        content.tags.some(
          (tag) =>
            tag.toLowerCase().includes('runway') ||
            tag.toLowerCase().includes('sự kiện') ||
            tag.toLowerCase().includes('event') ||
            tag.toLowerCase().includes('이벤트'),
        )
      );
    if (activeFilter === 'bts')
      return (
        matchesSearch &&
        content.tags.some(
          (tag) =>
            tag.toLowerCase().includes('hậu trường') ||
            tag.toLowerCase().includes('behind') ||
            tag.toLowerCase().includes('비하인드'),
        )
      );

    return matchesSearch;
  });

  const cmsLoading = api && cmsQuery.isPending;

  const renderCmsGrid = () => {
    if (cmsLoading) {
      return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] w-full rounded-2xl" />
          ))}
        </div>
      );
    }

    if (cmsEmpty) {
      return (
        <div className="py-20 text-center">
          <Award className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <p className="text-lg text-gray-500">
            {language === 'vi'
              ? 'Chưa có bài viết trong mục này.'
              : language === 'en'
                ? 'No articles in this section yet.'
                : '이 섹션에 아직 글이 없습니다.'}
          </p>
        </div>
      );
    }

    if (!showCms) return null;

    if (filteredCms.length === 0) {
      return (
        <div className="py-20 text-center">
          <p className="text-lg text-gray-500">{t('events.noResults')}</p>
        </div>
      );
    }

    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredCms.map((post) => (
          <Link
            key={post.id}
            href={`/post/${encodeURIComponent(post.slug)}`}
            className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              {post.thumbnail ? (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                  Kygo
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute right-4 top-4">
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase text-[#b8465f] backdrop-blur-sm">
                  {post.category.name}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                {new Date(post.createdAt).toLocaleDateString(locale)}
              </div>

              <h3 className="mb-3 line-clamp-2 font-serif text-xl font-bold text-gray-900 transition-colors group-hover:text-[#b8465f]">
                {post.title}
              </h3>

              <p className="mb-4 line-clamp-3 leading-relaxed text-gray-600">{post.excerpt || ''}</p>

              <div className="flex items-center justify-end border-t border-gray-100 pt-4 text-sm font-semibold text-[#b8465f] transition-all group-hover:gap-2">
                {t('events.viewDetails')}
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  const renderMockGrid = () =>
    filteredEvents.length === 0 ? (
      <div className="py-20 text-center">
        <Award className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <p className="text-lg text-gray-500">{t('events.noResults')}</p>
      </div>
    ) : (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => {
          const content = getLocalizedContent(event);
          return (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={event.coverImage}
                  alt={content.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute right-4 top-4 flex flex-col gap-2">
                  {event.isSponsored && (
                    <span className="rounded-full bg-[#b8465f] px-3 py-1 text-xs font-bold uppercase text-white shadow-lg">
                      {t('events.kygoSponsored')}
                    </span>
                  )}
                  {content.tags[0] && (
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase text-gray-900 backdrop-blur-sm">
                      {content.tags[0]}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" />
                      <span>{event.gallery.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      <span>{event.dressesUsed}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(event.date).toLocaleDateString(
                      language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'ko-KR',
                    )}
                  </span>
                  <span className="text-gray-300">•</span>
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{content.location}</span>
                </div>

                <h3 className="mb-3 line-clamp-2 font-serif text-xl font-bold text-gray-900 transition-colors group-hover:text-[#b8465f]">
                  {content.name}
                </h3>

                <p className="mb-4 line-clamp-3 leading-relaxed text-gray-600">{content.description}</p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="text-sm text-gray-500">
                    {event.dressesUsed} {t('events.dressesUsed')}
                  </div>
                  <div className="flex items-center text-sm font-semibold text-[#b8465f] transition-all group-hover:gap-2">
                    {t('events.viewDetails')}
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );

  const countLabel =
    showCms && !cmsLoading ? filteredCms.length : useMock ? filteredEvents.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 to-white">
      <div className="relative bg-gradient-to-r from-[#b8465f] via-[#9d3a50] to-[#b8465f] py-20 text-white md:py-28">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl lg:text-6xl">{t('events.title')}</h1>
          <p className="mx-auto max-w-3xl text-lg text-rose-100 md:text-xl">{t('events.subtitle')}</p>
          {showCms && !cmsLoading ? (
            <div className="mt-6">
              <Link
                href={listHref}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/25"
              >
                {t('common.viewAll')}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="mx-auto mb-8 max-w-2xl">
            <input
              type="text"
              placeholder={t('events.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-2 border-gray-200 px-6 py-4 text-lg shadow-sm focus:border-[#b8465f] focus:outline-none"
            />
          </div>

          {useMock ? (
            <div className="flex flex-wrap justify-center gap-3">
              {filterTypes.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`transform rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider shadow-md transition-all hover:scale-105 ${
                    activeFilter === filter.id
                      ? 'bg-[#b8465f] text-white'
                      : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-[#b8465f]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="mx-auto max-w-2xl text-center text-sm text-gray-500">
              {language === 'vi' ? (
                <>
                  <Clock className="mb-1 mr-1 inline h-4 w-4 align-text-bottom" />
                  Tìm theo tiêu đề hoặc mô tả bài viết.{' '}
                  <Link href={listHref} className="font-semibold text-[#b8465f] hover:underline">
                    Xem tất cả
                  </Link>
                </>
              ) : language === 'en' ? (
                <>
                  Search by title or excerpt.{' '}
                  <Link href={listHref} className="font-semibold text-[#b8465f] hover:underline">
                    View all
                  </Link>
                </>
              ) : (
                <>
                  제목 또는 요약으로 검색.{' '}
                  <Link href={listHref} className="font-semibold text-[#b8465f] hover:underline">
                    전체 보기
                  </Link>
                </>
              )}
            </p>
          )}
        </div>

        {!cmsLoading ? (
          <div className="mb-8 text-center">
            <p className="text-gray-600">
              {t('events.showing')} <span className="font-bold text-[#b8465f]">{countLabel}</span> {t('events.events')}
            </p>
          </div>
        ) : null}

        {showCms || cmsLoading || cmsEmpty ? renderCmsGrid() : null}
        {useMock ? renderMockGrid() : null}

        {showCms && !cmsLoading && !cmsEmpty && filteredCms.length > 0 ? (
          <div className="mt-12 text-center">
            <Link href={listHref} className="inline-flex items-center gap-2 font-semibold text-[#b8465f] hover:underline">
              {t('common.viewAll')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EventsList;
