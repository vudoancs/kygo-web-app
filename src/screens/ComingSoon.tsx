'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
  description?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title = 'Trang đang được phát triển',
  description = 'Chúng tôi đang hoàn thiện trang này. Vui lòng quay lại sau!'
}) => {
  return (
    <div className="min-h-[calc(100vh-400px)] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-100 rounded-full mb-6">
          <span className="text-4xl">🚧</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{description}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#b8465f] text-white px-8 py-3 rounded-lg hover:bg-[#9d3a50] transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
