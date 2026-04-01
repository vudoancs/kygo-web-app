'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, Tag, User } from 'lucide-react';
import { useAppContext } from '@/modules/app-state';
import { useLanguage } from '../contexts/LanguageContext';

const BottomNav = () => {
  const pathname = usePathname();
  const { cart, user } = useAppContext();
  const { language } = useLanguage();

  const navItems = [
    {
      label: language === 'vi' ? 'Trang chủ' : language === 'en' ? 'Home' : '홈',
      path: '/',
      icon: Home,
    },
    {
      label: language === 'vi' ? 'Tìm kiếm' : language === 'en' ? 'Search' : '검색',
      path: '/products',
      icon: Search,
    },
    {
      label: language === 'vi' ? 'Giỏ hàng' : language === 'en' ? 'Cart' : '장바구니',
      path: '/cart',
      icon: ShoppingCart,
      badge: cart.length,
    },
    {
      label: language === 'vi' ? 'Thanh lý' : language === 'en' ? 'Sale' : '세일',
      path: '/products?filter=sale',
      icon: Tag,
    },
    {
      label: language === 'vi' ? 'Tài khoản' : language === 'en' ? 'Account' : '계정',
      path: user ? '/my-orders' : '/login',
      icon: User,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path.split('?')[0];
          
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-1 relative ${
                isActive ? 'text-[#b8465f]' : 'text-gray-600'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#b8465f] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;