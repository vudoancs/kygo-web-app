'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Clock, User, ChevronLeft, Heart, Share2, Facebook, Tag } from 'lucide-react';
import { styleTips } from '../data/styleTips';
import { useLanguage } from '../contexts/LanguageContext';

const StyleTipDetail = () => {
  const params = useParams();
  const id = (params?.id as string) ?? '';
  const router = useRouter();
  const { language, t } = useLanguage();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 500) + 100);

  const tip = styleTips.find(t => t.id === id);

  if (!tip) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-500">{t('styleTips.notFound')}</p>
        <Link href="/style-tips" className="text-[#b8465f] hover:underline mt-4 inline-block">
          {t('styleTips.backToList')}
        </Link>
      </div>
    );
  }

  const getLocalizedContent = (tip: typeof styleTips[0]) => {
    return {
      title: language === 'vi' ? tip.title : language === 'en' ? tip.titleEn : tip.titleKo,
      excerpt: language === 'vi' ? tip.excerpt : language === 'en' ? tip.excerptEn : tip.excerptKo,
      content: language === 'vi' ? tip.content : language === 'en' ? tip.contentEn : tip.contentKo,
      category: language === 'vi' ? tip.category : language === 'en' ? tip.categoryEn : tip.categoryKo,
      tags: language === 'vi' ? tip.tags : language === 'en' ? tip.tagsEn : tip.tagsKo,
    };
  };

  const content = getLocalizedContent(tip);
  
  // Related posts (same category or tags)
  const relatedTips = styleTips
    .filter(t => t.id !== tip.id && (
      t.category === tip.category || 
      t.tags.some(tag => tip.tags.includes(tag))
    ))
    .slice(0, 3);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShareFacebook = () => {
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleShareZalo = () => {
    const url = window.location.href;
    const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(url)}`;
    window.open(zaloUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(t('styleTips.linkCopied'));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] bg-gray-900">
        <img
          src={tip.image}
          alt={content.title}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Back Button */}
        <button
          onClick={() => router.push('/style-tips')}
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 md:-mt-32 bg-white rounded-t-3xl shadow-2xl p-6 md:p-10 lg:p-12">
          
          {/* Category & Meta Info */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-[#b8465f] text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
              {content.category}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-2" />
              {tip.readTime} {t('styleTips.minRead')}
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center text-gray-500 text-sm">
              <User className="w-4 h-4 mr-2" />
              {tip.author}
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500 text-sm">
              {new Date(tip.date).toLocaleDateString(
                language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'ko-KR'
              )}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {content.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 leading-relaxed mb-8 pb-8 border-b border-gray-200">
            {content.excerpt}
          </p>

          {/* Social Actions */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-all font-semibold ${
                isLiked
                  ? 'bg-[#b8465f] border-[#b8465f] text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-[#b8465f] hover:text-[#b8465f]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>

            {/* Share Facebook */}
            <button
              onClick={handleShareFacebook}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold transition-all"
            >
              <Facebook className="w-5 h-5 fill-current" />
              <span className="hidden sm:inline">Facebook</span>
            </button>

            {/* Share Zalo */}
            <button
              onClick={handleShareZalo}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#0068ff] hover:bg-[#0056d6] text-white font-semibold transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              <span className="hidden sm:inline">Zalo</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white border-2 border-gray-300 hover:border-[#b8465f] text-gray-700 hover:text-[#b8465f] font-semibold transition-all"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">{t('styleTips.share')}</span>
            </button>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#b8465f] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-gray-400" />
              <span className="font-semibold text-gray-900">{t('styleTips.tags')}:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-rose-50 text-[#b8465f] px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedTips.length > 0 && (
          <div className="py-16">
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8 text-center">
              {t('styleTips.relatedArticles')}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {relatedTips.map((relatedTip) => {
                const relatedContent = getLocalizedContent(relatedTip);
                return (
                  <Link
                    key={relatedTip.id}
                    href={`/style-tips/${relatedTip.id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={relatedTip.image}
                        alt={relatedContent.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="p-5">
                      <span className="text-[#b8465f] text-xs font-bold uppercase tracking-wider">
                        {relatedContent.category}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-gray-900 mt-2 mb-2 line-clamp-2 group-hover:text-[#b8465f] transition-colors">
                        {relatedContent.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {relatedContent.excerpt}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleTipDetail;
