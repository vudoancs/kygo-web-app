'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, User, ChevronRight } from 'lucide-react';
import { styleTips } from '../data/styleTips';
import { useLanguage } from '../contexts/LanguageContext';

const StyleTips = () => {
  const { language, t } = useLanguage();

  const getLocalizedContent = (tip: typeof styleTips[0]) => {
    return {
      title: language === 'vi' ? tip.title : language === 'en' ? tip.titleEn : tip.titleKo,
      excerpt: language === 'vi' ? tip.excerpt : language === 'en' ? tip.excerptEn : tip.excerptKo,
      category: language === 'vi' ? tip.category : language === 'en' ? tip.categoryEn : tip.categoryKo,
      tags: language === 'vi' ? tip.tags : language === 'en' ? tip.tagsEn : tip.tagsKo,
    };
  };

  // Featured post (first one)
  const featuredTip = styleTips[0];
  const featuredContent = getLocalizedContent(featuredTip);

  // Other posts
  const otherTips = styleTips.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/30 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#b8465f] to-[#8b3449] text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {t('styleTips.title')}
          </h1>
          <p className="text-lg md:text-xl text-rose-100 max-w-2xl mx-auto">
            {t('styleTips.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Featured Article */}
        <Link 
          href={`/style-tips/${featuredTip.id}`}
          className="group block mb-16"
        >
          <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
              <img 
                src={featuredTip.image}
                alt={featuredContent.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-[#b8465f] text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide shadow-lg">
                  {t('styleTips.featured')}
                </span>
              </div>
            </div>
            
            <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#b8465f] font-semibold text-sm uppercase tracking-wider">
                  {featuredContent.category}
                </span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {featuredTip.readTime} {t('styleTips.minRead')}
                </div>
              </div>
              
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-[#b8465f] transition-colors">
                {featuredContent.title}
              </h2>
              
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                {featuredContent.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-2" />
                  {featuredTip.author}
                </div>
                
                <div className="flex items-center text-[#b8465f] font-semibold group-hover:gap-2 transition-all">
                  {t('styleTips.readMore')}
                  <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Grid of Other Articles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherTips.map((tip) => {
            const content = getLocalizedContent(tip);
            return (
              <Link
                key={tip.id}
                href={`/style-tips/${tip.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={tip.image}
                    alt={content.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-[#b8465f] px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {content.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {tip.readTime} {t('styleTips.minRead')}
                    <span className="text-gray-300">•</span>
                    <span>{new Date(tip.date).toLocaleDateString(
                      language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'ko-KR'
                    )}</span>
                  </div>
                  
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#b8465f] transition-colors">
                    {content.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {content.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {content.tags.slice(0, 2).map((tag, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-rose-50 text-[#b8465f] px-3 py-1 rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-[#b8465f] font-semibold text-sm group-hover:gap-2 transition-all">
                    {t('styleTips.readMore')}
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StyleTips;
