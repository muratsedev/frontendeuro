"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ArticleImage from "./ArticleImage";
import { IoTimeOutline } from "react-icons/io5";

export type Article = {
  id: string;
  articleTitle: string;
  articleSummary: string;
  articleContent: string;
  imagePath: string;
  createdDate: string;
  updatedDate: string;
  isPublished: boolean;
  categoryId: number;
};

interface LastNewsForCategoryProps {
  categoryId: number;
  className?: string;
}

const LastNewsForCategory = ({ categoryId, className = '' }: LastNewsForCategoryProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch articles for the given category
        const response = await fetch(`/api/articles?categoryId=${categoryId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const articlesData: Article[] = await response.json();
        // Filter only published articles and sort by creation date (newest first)
        const publishedArticles = articlesData
          .filter(article => article.isPublished)
          .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
          .slice(0, 5); // Show only 5 articles with proper images
        setArticles(publishedArticles);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
        setError("فشل في تحميل آخر الأخبار");
      } finally {
        setLoading(false);
      }
    };
    fetchLatestArticles();
  }, [categoryId]);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-lg shadow-md mt-8 ${className}`}>
        <div className="text-center py-8">
          <div className="text-sm text-gray-500 dark:text-gray-400">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-lg shadow-md mt-8 ${className}`}>
        <div className="text-center py-8">
          <div className="text-sm text-red-500 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-lg shadow-md mt-8 ${className}`}>
        <div className="text-center py-8">
          <div className="text-sm text-gray-500 dark:text-gray-400">لا توجد أخبار متاحة حالياً</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-lg shadow-lg mt-8 ${className}`}>
      <div className="p-4">
        <div className="space-y-4">
          {articles.map((article, index) => (
            <div key={article.id}>
              <Link 
                href={`/article/${article.id}`}
                className="block transition-colors duration-200 p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <div className="flex gap-3 items-start">
                  {/* Article Image */}
                  <div className="w-20 h-16 flex-shrink-0 relative overflow-hidden rounded">
                    <ArticleImage
                      src={article.imagePath || "/img/1.jpg"}
                      alt={article.articleTitle}
                      className="w-full h-full object-cover"
                      position="top center"
                      fallbackElement={
                        <div className="w-full h-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                          <span className="text-xs text-gray-400 dark:text-gray-500">صورة</span>
                        </div>
                      }
                    />
                  </div>
                  
                  {/* Article Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-right line-clamp-2 mb-1 text-gray-900 dark:text-white hover:underline transition-all duration-200">
                      {article.articleTitle}
                    </h3>
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(article.createdDate).toLocaleDateString('en-US')}
                      </span>
                      <IoTimeOutline className="text-gray-500 dark:text-gray-400 text-xs" />
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Divider for all items except the last */}
              {index < articles.length - 1 && (
                <div className="border-b border-gray-200 dark:border-slate-700 mt-3"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LastNewsForCategory;
