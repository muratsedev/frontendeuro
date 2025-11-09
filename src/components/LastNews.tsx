"use client";
import { useEffect, useState } from "react";
import ArticleCard, { Article } from "./ArticleCard";

interface LastNewsProps {
  className?: string;
}

const LastNews = ({ className = '' }: LastNewsProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("LastNews - Fetching latest 9 articles from all categories");
        
        // Fetch all articles and sort by creation date
        const response = await fetch("/api/articles");
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const articlesData: Article[] = await response.json();
        
        // Filter only published articles and sort by creation date (newest first)
        const publishedArticles = articlesData
          .filter(article => article.isPublished)
          .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
          .slice(0, 9); // Get only the latest 9 articles
        
        console.log("LastNews - Received latest articles:", publishedArticles.length);
        
        setArticles(publishedArticles);
      } catch (error) {
        console.error("Failed to fetch latest articles", error);
        setError("فشل في تحميل آخر الأخبار");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <h2 className="text-lg font-bold text-right mb-4 border-b-2 border-blue-500 pb-2">
          آخر الأخبار
        </h2>
        <div className="text-center py-8">
          <div className="text-sm text-gray-500">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <h2 className="text-lg font-bold text-right mb-4 border-b-2 border-blue-500 pb-2">
          آخر الأخبار
        </h2>
        <div className="text-center py-8">
          <div className="text-sm text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <h2 className="text-lg font-bold text-right mb-4 border-b-2 border-blue-500 pb-2">
          آخر الأخبار
        </h2>
        <div className="text-center py-8">
          <div className="text-sm text-gray-500">لا توجد أخبار متاحة حالياً</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col min-h-[500px] ${className}`}>
      {/* Articles List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div className="space-y-2">
            {articles.map((article, index) => (
              <div key={article.id} className="relative">
                <div className="rounded-lg p-2 transition-colors duration-200">
                  <ArticleCard
                    article={article}
                    variant="compact"
                    showImage={true}
                  />
                </div>
                {/* Divider for all items except the last */}
                {index < articles.length - 1 && (
                  <div className="border-b border-gray-200 mt-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastNews;