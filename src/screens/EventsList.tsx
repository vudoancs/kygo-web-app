'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Award, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { events } from '../data/events';
import { useLanguage } from '../contexts/LanguageContext';

const EventsList = () => {
  const { language, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getLocalizedContent = (event: typeof events[0]) => {
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

  const filteredEvents = events.filter(event => {
    const content = getLocalizedContent(event);
    
    // Search filter
    const matchesSearch = searchQuery === '' || 
      content.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'sponsored') return matchesSearch && event.isSponsored;
    if (activeFilter === 'contest') return matchesSearch && content.tags.some(tag => 
      tag.toLowerCase().includes('cuộc thi') || 
      tag.toLowerCase().includes('contest') ||
      tag.toLowerCase().includes('대회')
    );
    if (activeFilter === 'runway') return matchesSearch && content.tags.some(tag => 
      tag.toLowerCase().includes('runway') || 
      tag.toLowerCase().includes('sự kiện') ||
      tag.toLowerCase().includes('event') ||
      tag.toLowerCase().includes('이벤트')
    );
    if (activeFilter === 'bts') return matchesSearch && content.tags.some(tag => 
      tag.toLowerCase().includes('hậu trường') || 
      tag.toLowerCase().includes('behind') ||
      tag.toLowerCase().includes('비하인드')
    );
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#b8465f] via-[#9d3a50] to-[#b8465f] text-white py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {t('events.title')}
          </h1>
          <p className="text-lg md:text-xl text-rose-100 max-w-3xl mx-auto">
            {t('events.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filters */}
        <div className="mb-10">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <input
              type="text"
              placeholder={t('events.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-[#b8465f] focus:outline-none text-lg shadow-sm"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3">
            {filterTypes.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wider transition-all transform hover:scale-105 shadow-md ${
                  activeFilter === filter.id
                    ? 'bg-[#b8465f] text-white'
                    : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-[#b8465f]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            {t('events.showing')} <span className="font-bold text-[#b8465f]">{filteredEvents.length}</span> {t('events.events')}
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t('events.noResults')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => {
              const content = getLocalizedContent(event);
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={event.coverImage}
                      alt={content.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Tags */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {event.isSponsored && (
                        <span className="bg-[#b8465f] text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-lg">
                          {t('events.kygoSponsored')}
                        </span>
                      )}
                      {content.tags[0] && (
                        <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-bold uppercase">
                          {content.tags[0]}
                        </span>
                      )}
                    </div>

                    {/* Stats Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <ImageIcon className="w-4 h-4" />
                          <span>{event.gallery.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>{event.dressesUsed}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString(
                        language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'ko-KR'
                      )}</span>
                      <span className="text-gray-300">•</span>
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{content.location}</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#b8465f] transition-colors">
                      {content.name}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {content.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        {event.dressesUsed} {t('events.dressesUsed')}
                      </div>
                      <div className="flex items-center text-[#b8465f] font-semibold text-sm group-hover:gap-2 transition-all">
                        {t('events.viewDetails')}
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
