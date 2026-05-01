"use client";
import { useEffect, useRef } from "react";
import ArticleCard, { Article } from "./ArticleCard";
import { useInfiniteArticles } from "../hooks/useInfiniteArticles";

interface LastNewsProps {
  className?: string;
}

const LastNews = ({ className = '' }: LastNewsProps) => {
  const { articles, loading, loadingMore, error, hasMore, loadMore } = useInfiniteArticles({ pageSize: 10 });

  // Sentinel element at the bottom — triggers loadMore automatically when visible
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-lg shadow-md p-4 ${className}`}>
        <h2 className="text-lg font-bold text-right mb-4 border-b-2 border-blue-500 pb-2 text-slate-900 dark:text-white">
          آخر الأخبار
        </h2>
        <div className="text-center py-8">
          <div className="text-sm text-gray-500 dark:text-gray-400">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-lg shadow-md p-4 ${className}`}>
        <h2 className="text-lg font-bold text-right mb-4 border-b-2 border-blue-500 pb-2 text-slate-900 dark:text-white">
          آخر الأخبار
        </h2>
        <div className="text-center py-8">
          <div className="text-sm text-red-500 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-lg shadow-md p-4 ${className}`}>
        <h2 className="text-lg font-bold text-right mb-4 border-b-2 border-blue-500 pb-2 text-slate-900 dark:text-white">
          آخر الأخبار
        </h2>
        <div className="text-center py-8">
          <div className="text-sm text-gray-500 dark:text-gray-400">لا توجد أخبار متاحة حالياً</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden flex flex-col ${className}`}>
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div className="space-y-2">
            {articles.map((article, index) => (
              <div key={article.id} className="relative">
                <div className="rounded-lg p-2 transition-colors duration-200">
                  <ArticleCard
                    article={article as Article}
                    variant="compact"
                    showImage={true}
                    category={article.categorySlug ? { id: article.categoryId, name: article.categoryName || '', categorySlug: article.categorySlug } : undefined}
                  />
                </div>
                {index < articles.length - 1 && (
                  <div className="border-b border-gray-200 dark:border-slate-700 mt-2"></div>
                )}
              </div>
            ))}
          </div>

          {/* Invisible sentinel — auto-triggers next page when scrolled into view */}
          {hasMore && <div ref={sentinelRef} className="h-8" />}

          {/* Subtle loading indicator */}
          {loadingMore && (
            <div className="py-3 text-center">
              <div className="inline-block w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LastNews;