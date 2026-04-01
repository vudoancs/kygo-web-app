'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Award, Users, ChevronLeft, Building2, Image as ImageIcon } from 'lucide-react';
import { events } from '../data/events';
import { products } from '../data/products';
import { useLanguage } from '../contexts/LanguageContext';

const EventDetail = () => {
  const params = useParams();
  const slug = (params?.slug as string) ?? '';
  const router = useRouter();
  const { language, t } = useLanguage();

  const event = events.find(e => e.slug === slug);

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-500">{t('events.notFound')}</p>
        <Link href="/events" className="text-[#b8465f] hover:underline mt-4 inline-block">
          {t('events.backToList')}
        </Link>
      </div>
    );
  }

  const getLocalizedContent = (event: typeof events[0]) => {
    return {
      name: language === 'vi' ? event.name : language === 'en' ? event.nameEn : event.nameKo,
      description: language === 'vi' ? event.description : language === 'en' ? event.descriptionEn : event.descriptionKo,
      location: language === 'vi' ? event.location : language === 'en' ? event.locationEn : event.locationKo,
      scale: language === 'vi' ? event.scale : language === 'en' ? event.scaleEn : event.scaleKo,
      organizer: language === 'vi' ? event.organizer : language === 'en' ? event.organizerEn : event.organizerKo,
      tags: language === 'vi' ? event.tags : language === 'en' ? event.tagsEn : event.tagsKo,
    };
  };

  const content = getLocalizedContent(event);
  
  // Get related dresses
  const relatedDresses = products.filter(p => event.relatedDresses.includes(p.id)).slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-[50vh] md:h-[70vh] bg-gray-900">
        <img
          src={event.coverImage}
          alt={content.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Back Button */}
        <button
          onClick={() => router.push('/events')}
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {content.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold uppercase border border-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {content.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="text-lg">{new Date(event.date).toLocaleDateString(
                  language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'ko-KR',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )}</span>
              </div>
              <span className="text-white/50">•</span>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{content.location}</span>
              </div>
              {event.isSponsored && (
                <>
                  <span className="text-white/50">•</span>
                  <span className="bg-[#b8465f] px-4 py-2 rounded-full text-sm font-bold uppercase">
                    {t('events.kygoSponsored')}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Event Info */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">
              {t('events.aboutEvent')}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {content.description}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-5 h-5 text-[#b8465f]" />
                <h3 className="font-bold text-gray-900">{t('events.organizer')}</h3>
              </div>
              <p className="text-gray-700">{content.organizer}</p>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-[#b8465f]" />
                <h3 className="font-bold text-gray-900">{t('events.scale')}</h3>
              </div>
              <p className="text-gray-700">{content.scale}</p>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-[#b8465f]" />
                <h3 className="font-bold text-gray-900">{t('events.dressesUsed')}</h3>
              </div>
              <p className="text-3xl font-bold text-[#b8465f]">{event.dressesUsed}</p>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-gray-900">
              {t('events.gallery')}
            </h2>
            <div className="flex items-center gap-2 text-gray-500">
              <ImageIcon className="w-5 h-5" />
              <span className="font-semibold">{event.gallery.length} {t('events.photos')}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {event.gallery.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-[4/5] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <img
                  src={image}
                  alt={`${content.name} - ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Contestants Spotlight (if any) */}
        {event.contestants.length > 0 && (
          <div className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
              {t('events.contestants')}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {event.contestants.map((contestant, index) => {
                const contestantName = language === 'vi' ? contestant.name : language === 'en' ? contestant.nameEn : contestant.nameKo;
                const contestantTitle = language === 'vi' ? contestant.title : language === 'en' ? contestant.titleEn : contestant.titleKo;
                
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={contestant.avatar}
                        alt={contestantName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-[#b8465f] text-white px-3 py-1 rounded-full text-xs font-bold">
                          {contestantTitle}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
                        {contestantName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="w-4 h-4" />
                        <span>{t('events.dress')}: <span className="font-bold text-[#b8465f]">{contestant.dressCode}</span></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Dresses */}
        {relatedDresses.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('events.relatedDresses')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('events.relatedDressesDesc')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedDresses.map((dress) => (
                <Link
                  key={dress.id}
                  href={`/product/${dress.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={dress.image}
                      alt={dress.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {dress.badge && (
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${
                          dress.badge === 'new' ? 'bg-green-500' :
                          dress.badge === 'sale' ? 'bg-red-500' :
                          'bg-orange-500'
                        }`}>
                          {dress.badge.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-[#b8465f] transition-colors">
                      {dress.name}
                    </h3>
                    
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        {dress.originalBuyPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            {formatPrice(dress.originalBuyPrice)}
                          </span>
                        )}
                        <span className="font-bold text-gray-900">
                          {formatPrice(dress.buyPrice)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-[#b8465f]">
                          {formatPrice(dress.rentPricePerDay)}
                        </span>
                        <span className="text-gray-500">{t('common.perDay')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-block bg-[#b8465f] hover:bg-[#9d3a50] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                {t('events.exploreMore')}
              </Link>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-[#b8465f] to-[#8b3449] rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            {t('events.ctaTitle')}
          </h2>
          <p className="text-lg text-rose-100 mb-8 max-w-2xl mx-auto">
            {t('events.ctaDescription')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="bg-white text-[#b8465f] hover:bg-rose-50 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              {t('events.ctaExplore')}
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#b8465f] px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              {t('events.ctaContact')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
