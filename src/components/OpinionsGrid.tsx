'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BACKEND_API_URL } from '../app/lib/config';
import { getImageSource } from '../app/lib/imageHelpers';

interface Opinion {
  id: string;
  title: string;
  updatedDate: string | null;
  createdDate: string | null;
  isPublished: boolean;
  authorName: string | null;
  authorPicture: string | null;
  imagePath: string | null;
}

const isValidDate = (d: string | null): boolean => {
  if (!d) return false;
  return new Date(d).getFullYear() > 2000;
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

const OpinionsGrid: React.FC = () => {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpinions = async () => {
      try {
        const res = await fetch(`${BACKEND_API_URL}/api/Opinions/published`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('fetch failed');
        const data: Opinion[] = await res.json();
        setOpinions(data);
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchOpinions();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" dir="rtl">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl animate-pulse">
            <div className="w-full aspect-[4/3] bg-gray-200 rounded-t-xl" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (opinions.length === 0) {
    return (
      <div className="text-center text-gray-400 py-16" dir="rtl">
        لا توجد مقالات منشورة
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" dir="rtl">
      {opinions.map((opinion) => {
        const displayDate = isValidDate(opinion.updatedDate)
          ? opinion.updatedDate
          : isValidDate(opinion.createdDate)
          ? opinion.createdDate
          : null;

        const imgSrc = opinion.imagePath
          ? getImageSource(opinion.imagePath)
          : null;

        const authorPicSrc = opinion.authorPicture
          ? getImageSource(opinion.authorPicture)
          : null;

        return (
          <div
            key={opinion.id}
            className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200"
          >
            {/* Card image with title overlay */}
            <div className="relative w-full aspect-[4/3] bg-gray-200 flex-shrink-0">
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={opinion.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-primaryOther/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-primaryOther/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              {/* Title overlay at bottom of image */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent p-3">
                <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 text-right">
                  {opinion.title}
                </h3>
              </div>
            </div>

            {/* Author + date below image */}
            <div className="flex items-center gap-2 p-3 text-right">
              {/* Author avatar */}
              <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                {authorPicSrc ? (
                  <Image
                    src={authorPicSrc}
                    alt={opinion.authorName ?? 'كاتب'}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primaryOther/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primaryOther/50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                {opinion.authorName && (
                  <span className="text-xs font-semibold text-gray-700 truncate">
                    {opinion.authorName}
                  </span>
                )}
                {displayDate && (
                  <span className="text-xs text-gray-400">
                    {formatDate(displayDate)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OpinionsGrid;
