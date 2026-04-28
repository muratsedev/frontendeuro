'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

const OpinionsSection: React.FC = () => {
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
        setOpinions(data.slice(0, 5));
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
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primaryOther"></div>
      </div>
    );
  }

  if (opinions.length === 0) return null;

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

  return (
    <div className="flex flex-col gap-3">
      {opinions.map((opinion) => {
        const displayDate = opinion.updatedDate || opinion.createdDate;
        const authorPicSrc = opinion.authorPicture
          ? getImageSource(opinion.authorPicture)
          : null;

        return (
          <Link
            key={opinion.id}
            href="/opinion"
            className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200"
            dir="rtl"
          >
            {/* Author avatar */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              {authorPicSrc ? (
                <Image
                  src={authorPicSrc}
                  alt={opinion.authorName ?? 'كاتب'}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primaryOther/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primaryOther/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Text content */}
            <div className="flex flex-col flex-1 min-w-0 text-right">
              <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
                {opinion.title}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {opinion.authorName && (
                  <span className="text-xs text-gray-500 truncate">
                    بقلم: {opinion.authorName}
                  </span>
                )}
                {displayDate && opinion.authorName && (
                  <span className="text-xs text-gray-400">·</span>
                )}
                {displayDate && (
                  <span className="text-xs text-gray-400">
                    {formatDate(displayDate)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default OpinionsSection;
