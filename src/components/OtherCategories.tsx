'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// For blob image support
import { useRef } from 'react';
import { articlesApi, getCategories } from '../app/lib/api';
import { AllArticles } from '../app/types/Articles';
import { fetchImageAsBlob, getImageSource } from '../app/lib/imageHelpers';
import { formatDateArabic } from '../app/lib/hijriUtils';

interface OtherCategoriesProps {
  categoryFilter?: number;
  limit?: number;
}

const OtherCategories: React.FC<OtherCategoriesProps> = ({ categoryFilter, limit = 6 }) => {
  const [articles, setArticles] = useState<AllArticles[]>([]);
  // Removed unused categories state
  const [loading, setLoading] = useState(true);
  const [imageBlobs, setImageBlobs] = useState<{ [key: string]: string }>({});
  const fetchedImages = useRef<{ [key: string]: boolean }>({});
  // Fetch images with improved error handling
  useEffect(() => {
    const fetchImages = async () => {
      const newBlobs: { [key: string]: string } = {};
      
      await Promise.all(
        articles.map(async (article) => {
          const url = article.imagePath;
          if (!url || fetchedImages.current[url]) return;
          
          const blobUrl = await fetchImageAsBlob(url);
          if (blobUrl) {
            newBlobs[url] = blobUrl;
          }
          
          // Mark as processed to avoid retry
          fetchedImages.current[url] = true;
        })
      );
      
      if (Object.keys(newBlobs).length > 0) {
        setImageBlobs((prev) => ({ ...prev, ...newBlobs }));
      }
    };
    
    if (articles.length > 0) fetchImages();
  }, [articles]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories first (removed unused categories state)
        await getCategories();
        
        // Then fetch articles
        let articlesData: AllArticles[];
        if (categoryFilter) {
          articlesData = await articlesApi.getByCategory(categoryFilter);
        } else {
          articlesData = await articlesApi.getAll();
        }
        
        // Filter published articles and sort by createdDate (newest first)
        const sortedArticles = articlesData
          .filter(article => article.isPublished)
          .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        
        setArticles(sortedArticles);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryFilter]);


  if (loading) {
    return (
      <div className="container mx-auto py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {articles.slice(0, limit).map((article) => (
          <Link
            key={article.id}
            href={`/${article.categoryId}/${article.id}`}
            className="block"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer h-[380px] flex flex-col">
              {article.imagePath && article.imagePath.trim() !== '' ? (
                <>
                  <div className="w-full h-[220px] relative group flex-shrink-0">
                    {/* Use <Image> for normal URLs, <img> for blob URLs */}
                    {/*
                      Use <Image> for normal URLs to get Next.js optimization and avoid warnings.
                      Use <img> for blob URLs (from localhost fetch) because <Image> does not support blob URLs.
                      The warning for <img> can be safely ignored for blobs.
                    */}
                    <Image
                      src={getImageSource(article.imagePath)}
                      alt={article.articleTitle}
                      fill
                      className="object-cover rounded-t-xl"
                      style={{ objectPosition: 'center' }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={false}
                      loader={({ src }) => src}
                      unoptimized={!!imageBlobs[article.imagePath]}
                      onError={(e) => {
                        console.warn('Image load error for:', article.imagePath);
                        // Fallback to a placeholder or hide the image
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {/* Light gradient overlay for subtle effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    
                    {/* Article title overlay on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <h3 className="text-white font-bold text-lg md:text-xl leading-tight text-right article-title-shadow line-clamp-2">
                        {article.articleTitle}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Content below image */}
                  <div className="p-2.5 flex-1 flex flex-col">
                    {/* Date with icon */}
                    <div className="flex items-center justify-end gap-2 mb-1.5 text-gray-600">
                      <span className="text-sm">
                        {formatDateArabic(new Date(article.createdDate), { showHijri: false, showGregorian: true })}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                      </svg>
                    </div>
                    
                    {/* Article summary */}
                    <p className="text-gray-700 text-sm text-right line-clamp-3 leading-relaxed">
                      {article.articleSummary}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full h-[220px] bg-gray-100 flex items-center justify-center rounded-t-xl relative flex-shrink-0">
                    <span className="text-gray-400">لا توجد صورة</span>
                    {/* Title overlay even for placeholder */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <h3 className="text-white font-bold text-lg md:text-xl leading-tight text-right article-title-shadow line-clamp-2">
                        {article.articleTitle}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Content below image */}
                  <div className="p-2.5 flex-1 flex flex-col">
                    {/* Date with icon */}
                    <div className="flex items-center justify-end gap-2 mb-1.5 text-gray-600">
                      <span className="text-sm">
                        {formatDateArabic(new Date(article.createdDate), { showHijri: false, showGregorian: true })}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                      </svg>
                    </div>
                    
                    {/* Article summary */}
                    <p className="text-gray-700 text-sm text-right line-clamp-3 leading-relaxed">
                      {article.articleSummary}
                    </p>
                  </div>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد مقالات متاحة</p>
        </div>
      )}
    </div>
  );
};

export default OtherCategories;
