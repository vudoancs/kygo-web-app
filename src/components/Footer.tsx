'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
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
                  <a href="tel:0799443533" className="hover:text-[#b8465f] transition-colors">0799 443 533</a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-[#b8465f] flex-shrink-0" />
                <div>
                  <a href="mailto:mypham.kt95@gmail.com" className="hover:text-[#b8465f] transition-colors">contact@kygoprom.com</a>
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
                <a
                  href="https://www.facebook.com/kygoprom"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Facebook"
                  className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
                    <path
                      fill="#1877F2"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@kygo.prom"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  title="TikTok"
                  className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
                    <path
                      fill="#000000"
                      d="M19.321 5.562a5.124 5.124 0 0 1-3.214-1.395A5.142 5.142 0 0 1 14.563.95h-3.69v14.84c0 1.816-1.48 3.296-3.296 3.296a3.3 3.3 0 0 1-3.296-3.296 3.3 3.3 0 0 1 3.296-3.296c.34 0 .668.053.978.148V8.863a7.052 7.052 0 0 0-.978-.068A6.998 6.998 0 0 0 .58 15.79a6.998 6.998 0 0 0 6.998 6.998 6.998 6.998 0 0 0 6.998-6.998V8.78a8.762 8.762 0 0 0 4.745 1.39V6.54c-.001 0-.001-.978-.001-.978z"
                    />
                    <path
                      fill="#25F4EE"
                      d="M19.321 5.562v.977a8.762 8.762 0 0 1-4.745-1.39v7.01a6.998 6.998 0 0 1-6.998 6.998 6.94 6.94 0 0 1-3.64-1.027 6.98 6.98 0 0 0 5.246 2.377 6.998 6.998 0 0 0 6.998-6.998V6.5a8.76 8.76 0 0 0 3.139.06z"
                      opacity="0.85"
                    />
                    <path
                      fill="#FE2C55"
                      d="M8.555 12.642a3.292 3.292 0 0 0-.978-.148 3.3 3.3 0 0 0-3.296 3.296 3.3 3.3 0 0 0 2.139 3.085 3.294 3.294 0 0 1-1.012-2.37 3.3 3.3 0 0 1 3.296-3.296c.34 0 .668.053.978.148v-.567z"
                      opacity="0.9"
                    />
                  </svg>
                </a>
                <a
                  href="https://zalo.me/0799443533"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Zalo"
                  title="Zalo"
                  className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
                    <path
                      fill="#0068FF"
                      d="M12 2C6.477 2 2 5.94 2 10.8c0 2.84 1.53 5.37 3.92 7.02-.12.98-.55 2.64-1.77 3.92 0 0 3.03-.34 5.18-1.92.88.18 1.8.28 2.67.28 5.523 0 10-3.94 10-8.8S17.523 2 12 2z"
                    />
                    <path
                      fill="#FFFFFF"
                      d="M8.1 9.15h7.8c.5 0 .9.4.9.9s-.4.9-.9.9H8.1c-.5 0-.9-.4-.9-.9s.4-.9.9-.9zm0 3.1h5.2c.5 0 .9.4.9.9s-.4.9-.9.9H8.1c-.5 0-.9-.4-.9-.9s.4-.9.9-.9z"
                    />
                  </svg>
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