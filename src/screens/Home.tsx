'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  products,
  getLocalizedOccasions,
  getLocalizedStyles,
  occasionApiValueById,
  styleApiValueById,
} from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductCardMobile from '../components/ProductCardMobile';
import { useLanguage } from '../contexts/LanguageContext';
import { useNewProductsQuery, useFeaturedProductsQuery } from '@/hooks/use-products-query';
import { useCmsPostsQuery } from '@/hooks/use-cms-posts-query';
import { isPublicApiConfigured } from '@/libs/env';
import { productFromDto } from '@/modules/product';
import { Skeleton } from '@/components/ui/skeleton';
import { CMS_CATEGORY_CODES, getCmsCategoryPublicHref } from '@/config/cms-seo';

const Home = () => {
  const { language, t } = useLanguage();
  const api = isPublicApiConfigured();
  const newQuery = useNewProductsQuery({ page: 1, pageSize: 8 });
  const featuredQuery = useFeaturedProductsQuery({ page: 1, pageSize: 8 });
  const beautyPostsQuery = useCmsPostsQuery({
    categoryCode: CMS_CATEGORY_CODES.BEAUTY_TIPS,
    limit: 4,
    enabled: api,
  });
  const eventsPostsQuery = useCmsPostsQuery({
    categoryCode: CMS_CATEGORY_CODES.EVENTS_HOA_KHOI,
    limit: 4,
    enabled: api,
  });

  const localizedOccasions = getLocalizedOccasions(language);
  const localizedStyles = getLocalizedStyles(language);

  const newArrivals = useMemo(() => {
    const fallback = products.filter((p) => p.badge === 'hot' || p.badge === 'new').slice(0, 8);
    if (!api) return fallback;
    if (newQuery.isSuccess) return (newQuery.data?.items ?? []).map(productFromDto);
    if (newQuery.isError) return fallback;
    return [];
  }, [api, newQuery.isSuccess, newQuery.isError, newQuery.data]);

  const trending = useMemo(() => {
    const fallback = products.filter((p) => p.popular).slice(0, 8);
    if (!api) return fallback;
    if (featuredQuery.isSuccess) return (featuredQuery.data?.items ?? []).map(productFromDto);
    if (featuredQuery.isError) return fallback;
    return [];
  }, [api, featuredQuery.isSuccess, featuredQuery.isError, featuredQuery.data]);

  const newLoading = api && newQuery.isPending;
  const trendingLoading = api && featuredQuery.isPending;

  const beautyHref = getCmsCategoryPublicHref(CMS_CATEGORY_CODES.BEAUTY_TIPS);
  const eventsCmsHref = getCmsCategoryPublicHref(CMS_CATEGORY_CODES.EVENTS_HOA_KHOI);
  const beautyItems = beautyPostsQuery.data?.items ?? [];
  const eventsCmsItems = eventsPostsQuery.data?.items ?? [];
  const cmsSectionVisible =
    api &&
    (beautyPostsQuery.isPending ||
      eventsPostsQuery.isPending ||
      beautyItems.length > 0 ||
      eventsCmsItems.length > 0);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[400px] lg:h-[600px] bg-gradient-to-br from-rose-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1768823341746-d1983ff626a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBldmVuaW5nJTIwZ293biUyMGZhc2hpb24lMjBtb2RlbHxlbnwxfHx8fDE3Njk1NzUwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="font-serif text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 lg:mb-4">
              KYGO PROM
            </h1>
            <p className="text-xl lg:text-2xl xl:text-3xl text-gray-700 mb-4 lg:mb-8">
              {language === 'vi' ? 'Thuê & Mua Đầm Dạ Hội Cao Cấp' : language === 'en' ? 'Rent & Buy Premium Evening Gowns' : '프리미엄 이브닝 가운 대여 및 구매'}
            </p>
            <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 max-w-xl">
              {language === 'vi' 
                ? 'Khám phá bộ sưu tập váy đầm dạ hội sang trọng, thanh lịch. Dịch vụ cho thuê linh hoạt 1-3 ngày với giá ưu đãi.'
                : language === 'en'
                ? 'Discover our elegant and luxurious evening gown collection. Flexible rental service for 1-3 days with special prices.'
                : '우아하고 고급스러운 이브닝 가운 컬렉션을 만나보세요. 특별 가격으로 1-3일 유연한 대여 서비스를 제공합니다.'}
            </p>
            <div className="flex gap-3 lg:gap-4">
              <Link
                href="/products"
                className="bg-[#b8465f] text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-lg hover:bg-[#9d3a50] transition-colors flex items-center gap-2 font-medium text-sm lg:text-base"
              >
                {language === 'vi' ? 'Khám phá ngay' : language === 'en' ? 'Explore Now' : '지금 둘러보기'} <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
              </Link>
              <Link
                href="/products"
                className="bg-white text-[#b8465f] px-6 lg:px-8 py-2.5 lg:py-3 rounded-lg border-2 border-[#b8465f] hover:bg-rose-50 transition-colors font-medium text-sm lg:text-base"
              >
                {language === 'vi' ? 'Thuê váy' : language === 'en' ? 'Rent Dress' : '드레스 대여'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {language === 'vi' ? 'Dịp Mặc' : language === 'en' ? 'Occasions' : '착용 행사'}
            </h2>
            <div className="w-20 h-1 bg-[#b8465f] mx-auto"></div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {localizedOccasions.map((occasion) => (
              <Link
                key={occasion.id}
                href={`/products?occasion=${encodeURIComponent(occasionApiValueById[occasion.id] ?? occasion.id)}`}
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-lg border border-gray-100 hover:border-[#b8465f] hover:shadow-lg transition-all group"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform">{occasion.icon}</div>
                <div className="text-sm text-gray-700 text-center group-hover:text-[#b8465f] font-medium">
                  {occasion.label}
                </div>
              </Link>
            ))}
          </div>
          
          <div className="lg:hidden overflow-x-auto -mx-4 px-4">
            <div className="flex gap-4">
              {localizedOccasions.map((occasion) => (
                <Link
                  key={occasion.id}
                  href={`/products?occasion=${encodeURIComponent(occasionApiValueById[occasion.id] ?? occasion.id)}`}
                  className="flex-shrink-0 w-[120px] flex flex-col items-center gap-3 p-4 bg-white rounded-lg border border-gray-100"
                >
                  <div className="text-3xl">{occasion.icon}</div>
                  <div className="text-xs text-gray-700 text-center font-medium">
                    {occasion.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Styles */}
      <section className="bg-gray-50 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {language === 'vi' ? 'Phong Cách' : language === 'en' ? 'Styles' : '스타일'}
            </h2>
            <div className="w-20 h-1 bg-[#b8465f] mx-auto"></div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {localizedStyles.map((style) => (
              <Link
                key={style.id}
                href={`/products?style=${encodeURIComponent(styleApiValueById[style.id] ?? style.id)}`}
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-lg border border-gray-100 hover:border-[#b8465f] hover:shadow-lg transition-all group"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform">{style.icon}</div>
                <div className="text-sm text-gray-700 text-center group-hover:text-[#b8465f] font-medium">
                  {style.label}
                </div>
              </Link>
            ))}
          </div>
          
          <div className="lg:hidden overflow-x-auto -mx-4 px-4">
            <div className="flex gap-4">
              {localizedStyles.map((style) => (
                <Link
                  key={style.id}
                  href={`/products?style=${encodeURIComponent(styleApiValueById[style.id] ?? style.id)}`}
                  className="flex-shrink-0 w-[120px] flex flex-col items-center gap-3 p-4 bg-white rounded-lg border border-gray-100"
                >
                  <div className="text-3xl">{style.icon}</div>
                  <div className="text-xs text-gray-700 text-center font-medium">
                    {style.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl lg:text-3xl font-bold text-gray-900">
                {language === 'vi' ? 'Hàng Mới Về' : language === 'en' ? 'New Arrivals' : '신상품'}
              </h2>
            </div>
            <Link href="/products" className="text-[#b8465f] hover:underline flex items-center gap-1 text-sm">
              {t('common.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {newLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] w-full rounded-sm" />
              ))}
            </div>
          ) : api && newQuery.isSuccess && newArrivals.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
              {language === 'vi'
                ? 'Chưa có sản phẩm được đánh dấu “Hàng mới”.'
                : language === 'en'
                  ? 'No products marked as “New arrivals” yet.'
                  : '신상품으로 표시된 상품이 아직 없습니다.'}
            </div>
          ) : (
            <>
              <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="lg:hidden overflow-x-auto -mx-4 px-4">
                <div className="flex gap-4">
                  {newArrivals.map((product) => (
                    <ProductCardMobile key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Trending / Featured */}
      <section className="bg-gray-50 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl lg:text-3xl font-bold text-gray-900">
                {language === 'vi' ? 'Xu Hướng Hiện Hành' : language === 'en' ? 'Trending Now' : '인기 상품'}
              </h2>
            </div>
            <Link href="/products" className="text-[#b8465f] hover:underline flex items-center gap-1 text-sm">
              {t('common.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {trendingLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] w-full rounded-sm" />
              ))}
            </div>
          ) : api && featuredQuery.isSuccess && trending.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
              {language === 'vi'
                ? 'Chưa có sản phẩm được đánh dấu “Nổi bật”.'
                : language === 'en'
                  ? 'No products marked as “Featured” yet.'
                  : '추천(인기) 상품으로 표시된 상품이 아직 없습니다.'}
            </div>
          ) : (
            <>
              <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {trending.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="lg:hidden overflow-x-auto -mx-4 px-4">
                <div className="flex gap-4">
                  {trending.map((product) => (
                    <ProductCardMobile key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {cmsSectionVisible ? (
        <section className="border-t border-gray-100 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {(beautyPostsQuery.isPending || beautyItems.length > 0) && (
              <div className="mb-14">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 lg:text-3xl">
                    {language === 'vi'
                      ? 'Bí quyết mặc đẹp'
                      : language === 'en'
                        ? 'Style tips'
                        : '스타일 팁'}
                  </h2>
                  <Link
                    href={beautyHref}
                    className="flex items-center gap-1 text-sm text-[#b8465f] hover:underline"
                  >
                    {t('common.viewAll')} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                {beautyPostsQuery.isPending ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="hidden gap-6 lg:grid lg:grid-cols-4">
                      {beautyItems.map((post) => (
                        <Link
                          key={post.id}
                          href={`/post/${encodeURIComponent(post.slug)}`}
                          className="group overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                        >
                          <div className="aspect-[4/3] bg-gray-100">
                            {post.thumbnail ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={post.thumbnail}
                                alt=""
                                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                Kygo
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[#b8465f]">
                              {post.title}
                            </div>
                            {post.excerpt ? (
                              <p className="mt-1 line-clamp-2 text-xs text-gray-600">{post.excerpt}</p>
                            ) : null}
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 lg:hidden -mx-4 px-4">
                      {beautyItems.map((post) => (
                        <Link
                          key={post.id}
                          href={`/post/${encodeURIComponent(post.slug)}`}
                          className="group w-[200px] flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm"
                        >
                          <div className="aspect-[4/3] bg-gray-100">
                            {post.thumbnail ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={post.thumbnail}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                Kygo
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="line-clamp-2 text-sm font-semibold text-gray-900">{post.title}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {(eventsPostsQuery.isPending || eventsCmsItems.length > 0) && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 lg:text-3xl">
                    {language === 'vi'
                      ? 'Sự kiện & Hoa khôi'
                      : language === 'en'
                        ? 'Events & beauty queens'
                        : '이벤트 & 미인'}
                  </h2>
                  <Link
                    href={eventsCmsHref}
                    className="flex items-center gap-1 text-sm text-[#b8465f] hover:underline"
                  >
                    {t('common.viewAll')} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                {eventsPostsQuery.isPending ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="aspect-[4/5] w-full rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="hidden gap-6 lg:grid lg:grid-cols-4">
                      {eventsCmsItems.map((post) => (
                        <Link
                          key={post.id}
                          href={`/post/${encodeURIComponent(post.slug)}`}
                          className="group overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                        >
                          <div className="aspect-[4/5] bg-gray-100">
                            {post.thumbnail ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={post.thumbnail}
                                alt=""
                                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                Kygo
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[#b8465f]">
                              {post.title}
                            </div>
                            {post.excerpt ? (
                              <p className="mt-1 line-clamp-2 text-xs text-gray-600">{post.excerpt}</p>
                            ) : null}
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 lg:hidden -mx-4 px-4">
                      {eventsCmsItems.map((post) => (
                        <Link
                          key={post.id}
                          href={`/post/${encodeURIComponent(post.slug)}`}
                          className="group w-[200px] flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm"
                        >
                          <div className="aspect-[4/5] bg-gray-100">
                            {post.thumbnail ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={post.thumbnail}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                Kygo
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="line-clamp-2 text-sm font-semibold text-gray-900">{post.title}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎀</span>
            </div>
            <h3 className="font-semibold mb-2">
              {language === 'vi' ? 'Sản phẩm chất lượng cao' : 'High Quality Products'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'vi' ? '100% váy chính hãng, nhập khẩu' : '100% authentic imported dresses'}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="font-semibold mb-2">
              {language === 'vi' ? 'Giao hàng nhanh chóng' : 'Fast Delivery'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'vi' ? 'Giao hàng toàn quốc, nhanh trong ngày' : 'Nationwide delivery, same-day service'}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="font-semibold mb-2">
              {language === 'vi' ? 'Giá cả hợp lý' : 'Affordable Prices'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'vi' ? 'Cho thuê từ 1-3 ngày với giá ưu đãi' : 'Rent for 1-3 days with special prices'}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="font-semibold mb-2">
              {language === 'vi' ? 'Hỗ trợ tận tâm' : 'Dedicated Support'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'vi' ? 'Tư vấn nhiệt tình, chuyên nghiệp' : 'Enthusiastic, professional consultation'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
