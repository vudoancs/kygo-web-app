'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Giới thiệu */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-gray-900">
              {language === 'vi' ? 'GIỚI THIỆU' : language === 'en' ? 'ABOUT US' : '회사 소개'}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-[#b8465f] transition-colors">
                {language === 'vi' ? 'Về Kygo Prom' : language === 'en' ? 'About Kygo Prom' : 'Kygo Prom 소개'}
              </Link></li>
              <li><Link href="/about" className="hover:text-[#b8465f] transition-colors">
                {language === 'vi' ? 'Câu chuyện thương hiệu' : language === 'en' ? 'Brand Story' : '브랜드 스토리'}
              </Link></li>
              <li><Link href="/showroom" className="hover:text-[#b8465f] transition-colors">
                {language === 'vi' ? 'Hệ thống showroom' : language === 'en' ? 'Showroom System' : '쇼룸 시스템'}
              </Link></li>
              <li><Link href="/contact" className="hover:text-[#b8465f] transition-colors">
                {language === 'vi' ? 'Liên hệ' : language === 'en' ? 'Contact' : '연락처'}
              </Link></li>
            </ul>
          </div>

          {/* Hỗ trợ mua & thuê hàng */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-gray-900">
              {language === 'vi' ? 'HỖ TRỢ MUA & THUÊ HÀNG' : language === 'en' ? 'CUSTOMER SUPPORT' : '고객 지원'}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/guide/rental" className="hover:text-[#b8465f] transition-colors">
                {language === 'vi' ? 'Hướng dẫn thuê váy' : language === 'en' ? 'Rental Guide' : '대여 가이드'}
              </Link></li>
              <li><Link href="/guide/purchase" className="hover:text-[#b8465f] transition-colors">
                {language === 'vi' ? 'Hướng dẫn mua hàng' : language === 'en' ? 'Purchase Guide' : '구매 가이드'}
              </Link></li>
              <li><Link href="/guide/size" className="hover:text-[#b8465f] transition-colors">
                {language === 'vi' ? 'Bảng size chuẩn' : language === 'en' ? 'Size Chart' : '사이즈 차트'}
              </Link></li>
              <li><Link href="/guide/payment" className="hover:text-[#b8465f] transition-colors">
                {language === 'vi' ? 'Phương thức thanh toán' : language === 'en' ? 'Payment Methods' : '결제 방법'}
              </Link></li>
              <li><Link href="/faq" className="hover:text-[#b8465f] transition-colors">
                {language === 'vi' ? 'Câu hỏi thường gặp' : language === 'en' ? 'FAQ' : '자주 묻는 질문'}
              </Link></li>
            </ul>
          </div>

          {/* Chính sách */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-gray-900">
              {language === 'vi' ? 'CHÍNH SÁCH' : language === 'en' ? 'POLICIES' : '정책'}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/policy/rental" className="hover:text-[#b8465f] transition-colors">
                {language === 'vi' ? 'Chính sách thuê váy' : language === 'en' ? 'Rental Policy' : '대여 정책'}
              </Link></li>
              <li><Link href="/policy/return" className="hover:text-[#b8465f] transition-colors">
                {language === 'vi' ? 'Chính sách đổi trả' : language === 'en' ? 'Return Policy' : '반품 정책'}
              </Link></li>
              <li><Link href="/policy/privacy" className="hover:text-[#b8465f] transition-colors">
                {language === 'vi' ? 'Chính sách bảo mật' : language === 'en' ? 'Privacy Policy' : '개인정보 보호정책'}
              </Link></li>
              <li><Link href="/policy/warranty" className="hover:text-[#b8465f] transition-colors">
                {language === 'vi' ? 'Chính sách bảo hành' : language === 'en' ? 'Warranty Policy' : '보증 정책'}
              </Link></li>
              <li><Link href="/terms" className="hover:text-[#b8465f] transition-colors">
                {language === 'vi' ? 'Điều khoản dịch vụ' : language === 'en' ? 'Terms of Service' : '서비스 약관'}
              </Link></li>
            </ul>
          </div>

          {/* Liên hệ & Fanpage */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-gray-900">
              {language === 'vi' ? 'LIÊN HỆ' : language === 'en' ? 'CONTACT' : '연락처'}
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-[#b8465f] flex-shrink-0" />
                <div>
                  <a href="tel:0901234567" className="hover:text-[#b8465f] transition-colors">090 123 4567</a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-[#b8465f] flex-shrink-0" />
                <div>
                  <a href="mailto:contact@kygoprom.com" className="hover:text-[#b8465f] transition-colors">contact@kygoprom.com</a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-[#b8465f] flex-shrink-0" />
                <div>
                  {language === 'vi' 
                    ? '33 Mỹ An 23, Phường Ngũ Hành Sơn, Tp Đà Nẵng'
                    : '33 My An 23, Ngu Hanh Son Ward, Da Nang City'}
                </div>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="font-semibold mb-3 text-gray-900">
                {language === 'vi' ? 'Kết nối với chúng tôi' : language === 'en' ? 'Follow Us' : '팔로우'}
              </h4>
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#b8465f] text-white flex items-center justify-center hover:bg-[#9d3a50] transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#b8465f] text-white flex items-center justify-center hover:bg-[#9d3a50] transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#b8465f] text-white flex items-center justify-center hover:bg-[#9d3a50] transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-8 text-center text-sm text-gray-500">
          <p>
            {language === 'vi' 
              ? '© 2026 Kygo Prom. Tất cả quyền được bảo lưu.'
              : language === 'en'
              ? '© 2026 Kygo Prom. All rights reserved.'
              : '© 2026 Kygo Prom. 모든 권리 보유.'}
          </p>
          <p className="mt-1">Website: <a href="https://kygoprom.com" className="text-[#b8465f] hover:underline">kygoprom.com</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;