'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, ShoppingBag, ChevronDown, Menu, X, Globe } from 'lucide-react';
import { useAppContext } from '@/modules/app-state';
import { useLanguage } from '../contexts/LanguageContext';
import { isPublicApiConfigured } from '@/libs/env';
import { useWebCategoriesQuery } from '@/hooks/use-web-categories-query';
import {
  getFallbackHeaderMenu,
  getStaticTailMenu,
  webCategoryTreeToMenuItems,
  type HeaderMenuItem,
} from '@/components/header-menu-items';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const { cart, user } = useAppContext();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const categoriesQuery = useWebCategoriesQuery();

  const menuItems: HeaderMenuItem[] = useMemo(() => {
    const home: HeaderMenuItem = { key: 'home', label: t('nav.home'), path: '/' };
    const tail = getStaticTailMenu(language);
    const tree = categoriesQuery.data?.tree;
    if (isPublicApiConfigured() && Array.isArray(tree) && tree.length > 0) {
      return [home, ...webCategoryTreeToMenuItems(tree), ...tail];
    }
    return getFallbackHeaderMenu(language, t);
  }, [language, t, categoriesQuery.data?.tree]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-700 hover:text-[#b8465f] transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center">
              <div className="text-[#b8465f] font-serif text-xl lg:text-2xl font-bold">
                KYGO PROM
              </div>
            </div>
          </Link>

          {/* Main Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.key)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.path}
                  className="text-gray-700 hover:text-[#b8465f] transition-colors flex items-center gap-1 py-2 text-sm font-medium"
                >
                  {item.label}
                  {item.dropdown && <ChevronDown className="w-4 h-4" />}
                </Link>

                {/* Dropdown */}
                {item.dropdown && activeDropdown === item.key && (
                  <div className="absolute left-0 top-full pt-2 w-64">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={`${item.key}-${subItem.path}`}
                          href={subItem.path}
                          className="block px-6 py-3 text-sm text-gray-700 hover:bg-rose-50 hover:text-[#b8465f] transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-700 hover:text-[#b8465f] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Account - Hidden on mobile */}
            <button
              onClick={() => (user ? router.push('/my-orders') : router.push('/login'))}
              className="hidden lg:block text-gray-700 hover:text-[#b8465f] transition-colors"
              aria-label="User account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button
              onClick={() => router.push('/cart')}
              className="text-gray-700 hover:text-[#b8465f] transition-colors relative"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#b8465f] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-[#b8465f] transition-colors rounded-lg hover:bg-gray-50"
              >
                <Globe className="w-5 h-5" />
                <span className="font-medium text-sm uppercase">
                  {language === 'vi' ? 'VI' : language === 'en' ? 'EN' : 'KO'}
                </span>
              </button>

              {languageDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLanguageDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setLanguage('vi');
                        setLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                        language === 'vi' ? 'text-[#b8465f] bg-rose-50 font-medium' : 'text-gray-700'
                      }`}
                    >
                      Tiếng Việt
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                        language === 'en' ? 'text-[#b8465f] bg-rose-50 font-medium' : 'text-gray-700'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('ko');
                        setLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                        language === 'ko' ? 'text-[#b8465f] bg-rose-50 font-medium' : 'text-gray-700'
                      }`}
                    >
                      한국어
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-4 border-t border-gray-100">
            <input
              type="text"
              placeholder={language === 'vi' ? 'Tìm kiếm sản phẩm...' : language === 'en' ? 'Search products...' : '제품 검색...'}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f]"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="text-[#b8465f] font-serif text-xl font-bold">
              KYGO PROM
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-700 hover:text-[#b8465f]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            {menuItems.map((item) => (
              <div key={item.key} className="mb-2">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() =>
                        setMobileActiveDropdown(
                          mobileActiveDropdown === item.key ? null : item.key
                        )
                      }
                      className="w-full flex items-center justify-between py-3 text-gray-700 hover:text-[#b8465f] font-medium"
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileActiveDropdown === item.key ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {mobileActiveDropdown === item.key && (
                      <div className="pl-4 space-y-2">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 text-sm text-gray-600 hover:text-[#b8465f]"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-gray-700 hover:text-[#b8465f] font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* User Account in Mobile Menu */}
            <div className="border-t border-gray-200 mt-4 pt-4">
              <Link
                href={user ? '/my-orders' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-gray-700 hover:text-[#b8465f] font-medium"
              >
                {user ? t('nav.myAccount') : t('nav.login')}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;