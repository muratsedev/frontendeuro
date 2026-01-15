"use client";
import { useEffect, useState } from "react";
import ArticleCard, { Article } from "./ArticleCard";

interface ArticlesListProps {
  categoryId?: number;
  excludeId?: string;
  limit?: number;
  variant?: 'default' | 'compact' | 'dropdown';
  showImage?: boolean;
  onArticleClick?: () => void;
  className?: string;
}

const ArticlesList = ({
  categoryId,
  excludeId,
  limit,
  variant = 'default',
  showImage = true,
  onArticleClick,
  className = ''
}: ArticlesListProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stabilize dependency values to prevent useEffect from changing array size
  const stableCategoryId = categoryId ?? undefined;
  const stableExcludeId = excludeId ?? undefined;
  const stableLimit = limit ?? undefined;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If we have a categoryId, try the categories-with-articles endpoint first
        if (stableCategoryId) {
          try {
            console.log("ArticlesList - Trying categories-with-articles endpoint for categoryId:", stableCategoryId);
            
            let categoriesApiUrl = "/api/categories-with-articles";
            const categoriesParams = new URLSearchParams();
            categoriesParams.append('categoryId', stableCategoryId.toString());
            
            if (stableExcludeId) {
              categoriesParams.append('excludeId', stableExcludeId);
            }
            
            categoriesApiUrl += `?${categoriesParams.toString()}`;
            
            const categoriesResponse = await fetch(categoriesApiUrl);
            if (categoriesResponse.ok) {
              const articlesData: Article[] = await categoriesResponse.json();
              console.log("ArticlesList - Success with categories-with-articles:", articlesData.length);
              
              // Apply limit if specified
              const limitedArticles = stableLimit ? articlesData.slice(0, stableLimit) : articlesData;
              setArticles(limitedArticles);
              return; // Success, exit early
            } else {
              console.log("ArticlesList - Categories-with-articles failed, falling back to regular articles API");
            }
          } catch (categoriesError) {
            console.log("ArticlesList - Categories-with-articles error, falling back:", categoriesError);
          }
        }
        
        // Fallback to regular articles endpoint
        let apiUrl = "/api/articles";
        const params = new URLSearchParams();
        
        if (stableCategoryId) {
          params.append('categoryId', stableCategoryId.toString());
        }
        
        if (stableExcludeId) {
          params.append('excludeId', stableExcludeId);
        }
        
        if (params.toString()) {
          apiUrl += `?${params.toString()}`;
        }

        console.log("ArticlesList - Fetching from fallback:", apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        let articlesData: Article[] = await response.json();
        
        // If we have excludeId and we're using the regular articles endpoint, filter it out
        if (stableExcludeId && !stableCategoryId) {
          articlesData = articlesData.filter(article => article.id !== stableExcludeId);
        }
        
        console.log("ArticlesList - Received articles:", articlesData.length);
        
        // Apply limit if specified
        const limitedArticles = stableLimit ? articlesData.slice(0, stableLimit) : articlesData;
        console.log("ArticlesList - After limit:", limitedArticles.length);
        
        setArticles(limitedArticles);
      } catch (error) {
        console.error("Failed to fetch articles", error);
        setError("فشل في تحميل المقالات");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [stableCategoryId, stableExcludeId, stableLimit]);

  if (loading) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <div className="text-sm text-gray-500">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <div className="text-sm text-red-500">{error}</div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <div className="text-sm text-gray-500">
          {stableCategoryId ? "لا توجد مقالات في هذا القسم" : "لا توجد مقالات"}
        </div>
        {stableCategoryId && (
          <div className="text-xs text-gray-400 mt-1">
            جاري البحث عن مقالات أخرى...
          </div>
        )}
      </div>
    );
  }

  // Render based on variant
  if (variant === 'dropdown') {
    return (
      <div className={className}>
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="dropdown"
            showImage={showImage}
            onArticleClick={onArticleClick}
          />
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="compact"
            showImage={showImage}
            onArticleClick={onArticleClick}
          />
        ))}
      </div>
    );
  }

  // Default grid layout
  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          variant="default"
          showImage={showImage}
          onArticleClick={onArticleClick}
        />
      ))}
    </div>
  );
};

export default ArticlesList;
