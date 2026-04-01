'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useProductsQuery } from '@/hooks/use-products-query';
import { useWebCategoriesQuery } from '@/hooks/use-web-categories-query';
import { flattenCategoryTreeForFilter } from '@/libs/web-category-tree';
import { isPublicApiConfigured } from '@/libs/env';
import { productFromDto } from '@/modules/product';
import { useLanguage } from '../contexts/LanguageContext';

function useOptionalSlugParam(): string | undefined {
  const params = useParams();
  const raw = params?.slug;
  if (raw === undefined) return undefined;
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

/** Số SP mỗi trang — khớp `pageSize` gửi lên API (đổi thành 16 nếu muốn lưới 16). */
const PRODUCTS_PER_PAGE = 12;

const ProductListing = () => {
  const category = useOptionalSlugParam();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const isApi = isPublicApiConfigured();
  const [sortBy, setSortBy] = useState('newest');
  const [filterType, setFilterType] = useState<'all' | 'rent' | 'buy'>('all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [colorQuery, setColorQuery] = useState('');
  const [priceRange] = useState<[number, number]>([0, 15000000]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = PRODUCTS_PER_PAGE;

  const colorFilters = useMemo(() => {
    if (!colorQuery.trim()) return undefined;
    const parts = colorQuery
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return parts.length ? parts : undefined;
  }, [colorQuery]);

  const listQueryArgs = useMemo(
    () => ({
      category: category && category !== 'all' ? [category] : undefined,
      page: currentPage,
      pageSize: productsPerPage,
      occasion: selectedOccasions.length ? [...selectedOccasions] : undefined,
      style: selectedStyles.length ? [...selectedStyles] : undefined,
      size: selectedSizes.length ? [...selectedSizes] : undefined,
      color: colorFilters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      search: searchQuery.trim() || undefined,
      listingMode: filterType,
      rentStart: startDate && endDate ? startDate : undefined,
      rentEnd: startDate && endDate ? endDate : undefined,
    }),
    [
      category,
      currentPage,
      productsPerPage,
      selectedOccasions,
      selectedStyles,
      selectedSizes,
      colorFilters,
      priceRange,
      searchQuery,
      filterType,
      startDate,
      endDate,
    ],
  );

  useEffect(() => {
    const occ = searchParams.getAll('occasion');
    const sty = searchParams.getAll('style');
    setSelectedOccasions(occ);
    setSelectedStyles(sty);
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    category,
    selectedOccasions.join(','),
    selectedStyles.join(','),
    selectedSizes.join(','),
    colorQuery,
    priceRange[0],
    priceRange[1],
    searchQuery,
    filterType,
    startDate,
    endDate,
  ]);

  const productsQuery = useProductsQuery(listQueryArgs);
  const categoriesQuery = useWebCategoriesQuery();

  const baseProducts = useMemo(() => {
    if (!isApi) return products;
    if (productsQuery.isPending) return [];
    if (productsQuery.isSuccess && productsQuery.data) {
      const mapped = productsQuery.data.items.map(productFromDto);
      if (mapped.length > 0) return mapped;
      const pageFromApi = productsQuery.data.page ?? 1;
      if (pageFromApi <= 1) return products;
      return [];
    }
    if (productsQuery.isError) return products;
    return products;
  }, [
    isApi,
    productsQuery.data,
    productsQuery.isError,
    productsQuery.isPending,
    productsQuery.isSuccess,
  ]);

  /** Đang dùng kết quả lọc từ API — bỏ lọc trùng trên client (chỉ còn sort cục bộ). */
  const serverFiltersActive =
    isApi &&
    productsQuery.isSuccess &&
    productsQuery.data &&
    ((productsQuery.data.items?.length ?? 0) > 0 || (productsQuery.data.total ?? 0) > 0);

  const apiLoading = isApi && productsQuery.isPending;

  const staticCategoryOptions = useMemo(
    () => [
      { id: 'all', label: t('listing.categories.all') },
      { id: 'princess-dresses', label: t('listing.categories.princessDresses') },
      { id: 'feather-dresses', label: t('listing.categories.featherDresses') },
      { id: 'set-dresses', label: t('listing.categories.setDresses') },
      { id: 'luxury-embellished', label: t('listing.categories.luxuryEmbellished') },
      { id: 'midi-dresses', label: t('listing.categories.midiDresses') },
      { id: 'train-dresses', label: t('listing.categories.trainDresses') },
      { id: 'short-dresses', label: t('listing.categories.shortDresses') },
      { id: 'sequin-dresses', label: t('listing.categories.sequinDresses') },
      { id: 'evening-gowns', label: t('listing.categories.eveningGowns') },
    ],
    [t],
  );

  const categories = useMemo(() => {
    const tree = categoriesQuery.data?.tree;
    if (isPublicApiConfigured() && Array.isArray(tree) && tree.length > 0) {
      return [
        { id: 'all', label: t('listing.categories.all') },
        ...flattenCategoryTreeForFilter(tree),
      ];
    }
    return staticCategoryOptions;
  }, [categoriesQuery.data?.tree, staticCategoryOptions, t]);

  const occasions = [
    t('listing.occasions.office'),
    t('listing.occasions.evening'),
    t('listing.occasions.party'),
    t('listing.occasions.contest'),
    t('listing.occasions.wedding'),
    t('listing.occasions.dating'),
  ];

  const styles = [
    t('listing.styles.unique'),
    t('listing.styles.princess'),
    t('listing.styles.sexy'),
    t('listing.styles.dynamic'),
    t('listing.styles.elegant'),
    t('listing.styles.standout'),
  ];

  const sizes = ['S', 'M', 'L', 'XL'];

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleOccasion = (occasion: string) => {
    setSelectedOccasions(prev =>
      prev.includes(occasion) ? prev.filter(o => o !== occasion) : [...prev, occasion]
    );
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...baseProducts];

    if (!serverFiltersActive) {
      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.subcategory === category);
      }

      if (startDate && endDate) {
        filtered = filtered.filter(product => {
          if (!product.unavailableDates || product.unavailableDates.length === 0) {
            return true;
          }
          const start = new Date(startDate);
          const end = new Date(endDate);
          const hasConflict = product.unavailableDates.some(unavailableDate => {
            const checkDate = new Date(unavailableDate);
            return checkDate >= start && checkDate <= end;
          });
          return !hasConflict;
        });
      }

      if (selectedSizes.length > 0) {
        filtered = filtered.filter(p => p.sizes.some(size => selectedSizes.includes(size)));
      }

      filtered = filtered.filter(
        p => p.buyPrice >= priceRange[0] && p.buyPrice <= priceRange[1],
      );

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          p =>
            p.name.toLowerCase().includes(q) ||
            (p.productCode && p.productCode.toLowerCase().includes(q)) ||
            String(p.id).toLowerCase().includes(q),
        );
      }
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.buyPrice - b.buyPrice);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.buyPrice - a.buyPrice);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
    }

    return filtered;
  }, [
    baseProducts,
    category,
    serverFiltersActive,
    selectedSizes,
    priceRange,
    sortBy,
    startDate,
    endDate,
    searchQuery,
  ]);

  const totalFromApi = productsQuery.data?.total;
  /** Chỉ khi API có `total > 0` — tránh coi mock fallback (total 0) là phân trang server. */
  const useServerPagination =
    isApi &&
    productsQuery.isSuccess &&
    productsQuery.data &&
    (totalFromApi ?? 0) > 0;

  const totalPages = useMemo(() => {
    if (useServerPagination && totalFromApi != null) {
      return Math.max(1, Math.ceil(totalFromApi / productsPerPage));
    }
    return Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  }, [
    useServerPagination,
    totalFromApi,
    productsPerPage,
    filteredProducts.length,
  ]);

  const currentProducts = useMemo(() => {
    if (useServerPagination) {
      return filteredProducts;
    }
    return filteredProducts.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage
    );
  }, [useServerPagination, filteredProducts, currentPage, productsPerPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Danh mục sản phẩm */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{t('filter.category')}</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${cat.id}`}
              className={`block text-sm py-1 transition-colors ${
                category === cat.id || (!category && cat.id === 'all')
                  ? 'text-[#b8465f] font-medium'
                  : 'text-gray-600 hover:text-[#b8465f]'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Dịp mặc */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3">{t('filter.occasion')}</h3>
        <div className="space-y-2">
          {occasions.map((occasion) => (
            <label key={occasion} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOccasions.includes(occasion)}
                onChange={() => toggleOccasion(occasion)}
                className="rounded border-gray-300 text-[#b8465f] focus:ring-[#b8465f]"
              />
              <span className="text-sm text-gray-600">{occasion}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Phong cách */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3">{t('filter.style')}</h3>
        <div className="space-y-2">
          {styles.map((style) => (
            <label key={style} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedStyles.includes(style)}
                onChange={() => toggleStyle(style)}
                className="rounded border-gray-300 text-[#b8465f] focus:ring-[#b8465f]"
              />
              <span className="text-sm text-gray-600">{style}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Màu */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3">{t('filter.color')}</h3>
        <input
          type="text"
          value={colorQuery}
          onChange={(e) => setColorQuery(e.target.value)}
          placeholder={t('filter.colorPlaceholder')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-[#b8465f] focus:outline-none focus:ring-1 focus:ring-[#b8465f]"
        />
      </div>

      {/* Size */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3">{t('filter.size')}</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                selectedSizes.includes(size)
                  ? 'bg-[#b8465f] text-white border-[#b8465f]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#b8465f]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Giá */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3">{t('filter.price')}</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-[#b8465f] focus:ring-[#b8465f]" />
            <span className="text-sm text-gray-600">{t('filter.under5m')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-[#b8465f] focus:ring-[#b8465f]" />
            <span className="text-sm text-gray-600">{t('filter.from5to10m')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-[#b8465f] focus:ring-[#b8465f]" />
            <span className="text-sm text-gray-600">{t('filter.above10m')}</span>
          </label>
        </div>
      </div>

      {/* Rent / Buy Toggle */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3">{t('filter.type')}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-[#b8465f] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('filter.all')}
          </button>
          <button
            onClick={() => setFilterType('rent')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'rent'
                ? 'bg-[#b8465f] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('filter.rent')}
          </button>
          <button
            onClick={() => setFilterType('buy')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'buy'
                ? 'bg-[#b8465f] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('filter.buy')}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#b8465f]">{t('listing.breadcrumbHome')}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{t('listing.breadcrumbProducts')}</span>
      </div>

      {isApi && productsQuery.isError ? (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          Không kết nối được API sản phẩm — đang hiển thị dữ liệu mẫu.
        </p>
      ) : null}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Date Range & Sorting Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
            {/* Date Range Picker */}
            <div className="w-full sm:w-auto flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3">
              <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-sm text-gray-700 focus:outline-none border-none w-full sm:w-auto"
                  style={{
                    colorScheme: 'light',
                  }}
                />
                <span className="text-gray-400 flex-shrink-0">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="text-sm text-gray-700 focus:outline-none border-none w-full sm:w-auto"
                  style={{
                    colorScheme: 'light',
                  }}
                />
              </div>
            </div>

            <div className="w-full sm:flex-1 sm:max-w-md flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('listing.searchNameOrCode')}
                className="text-sm text-gray-700 focus:outline-none border-none w-full bg-transparent"
              />
            </div>

            {/* Sorting Buttons */}
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <button
                onClick={() => setSortBy('newest')}
                className={`px-4 py-2.5 rounded-md text-sm border transition-colors ${
                  sortBy === 'newest'
                    ? 'border-[#b8465f] text-[#b8465f] bg-[#b8465f]/5'
                    : 'border-gray-300 text-gray-600 hover:border-[#b8465f]'
                }`}
              >
                {t('listing.sortNewest')}
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-4 py-2.5 rounded-md text-sm border transition-colors ${
                  sortBy === 'popular'
                    ? 'border-[#b8465f] text-[#b8465f] bg-[#b8465f]/5'
                    : 'border-gray-300 text-gray-600 hover:border-[#b8465f]'
                }`}
              >
                {t('listing.sortPopular')}
              </button>
              <button
                onClick={() => setSortBy('price-asc')}
                className={`px-4 py-2.5 rounded-md text-sm border transition-colors ${
                  sortBy === 'price-asc'
                    ? 'border-[#b8465f] text-[#b8465f] bg-[#b8465f]/5'
                    : 'border-gray-300 text-gray-600 hover:border-[#b8465f]'
                }`}
              >
                {t('listing.sortPriceAsc')}
              </button>
              <button
                onClick={() => setSortBy('price-desc')}
                className={`px-4 py-2.5 rounded-md text-sm border transition-colors ${
                  sortBy === 'price-desc'
                    ? 'border-[#b8465f] text-[#b8465f] bg-[#b8465f]/5'
                    : 'border-gray-300 text-gray-600 hover:border-[#b8465f]'
                }`}
              >
                {t('listing.sortPriceDesc')}
              </button>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md hover:border-[#b8465f] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {t('listing.filterBtn')}
              </button>
            </div>
          </div>

          {/* Product Count */}
          <div className="text-sm text-gray-600 mb-6">
            {t('listing.showingProducts')} <span className="font-semibold text-gray-900">{filteredProducts.length}</span> {t('listing.products')}
          </div>

          {/* Mobile Filter Panel */}
          {mobileFilterOpen && (
            <div className="lg:hidden mb-6 p-4 bg-gray-50 rounded-lg">
              <FilterSidebar />
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
            {apiLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={`sk-${i}`} className="space-y-2">
                    <Skeleton className="aspect-[3/4] w-full rounded-sm" />
                    <Skeleton className="h-4 w-[85%]" />
                    <Skeleton className="h-4 w-[60%]" />
                    <Skeleton className="h-9 w-full rounded-sm" />
                  </div>
                ))
              : currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">{t('listing.noResults')}</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-8 lg:mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg text-sm border border-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#b8465f] hover:text-[#b8465f]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-[#b8465f] text-white border border-[#b8465f]'
                        : 'border border-gray-300 text-gray-700 hover:border-[#b8465f] hover:text-[#b8465f]'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg text-sm border border-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#b8465f] hover:text-[#b8465f]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;