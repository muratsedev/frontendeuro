import Image from "next/image";
import Link from "next/link";
import React from "react";

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

export type CategoryWithArticles = {
  id: number;
  name: string;
  categorySlug: string;
  isActivated: boolean;
  articles: Article[];
};

interface CategorySectionProps {
  category: CategoryWithArticles;
  maxArticles?: number;
  showViewAll?: boolean;
}

const CategorySection = ({ 
  category, 
  maxArticles = 6,
  showViewAll = true 
}: CategorySectionProps) => {
  const displayedArticles = category.articles.slice(0, maxArticles);
  

  if (!category.articles || category.articles.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg category-card overflow-hidden mb-8" dir="rtl">
      {/* Category Header */}
      <div className="bg-primaryOther px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-bold text-xl category-title">{category.name}</h2>
          {showViewAll && (
            <Link 
              href={`/category/${category.categorySlug}`}
              className="text-white text-sm hover:underline flex items-center"
            >
              المزيد
              <span className="mr-2 text-xs">←</span>
            </Link>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="p-6">
        {displayedArticles.length >= 3 ? (
          // Enhanced magazine-style layout
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Featured Article (Large) */}
            <div className="lg:col-span-2">
              <ArticleCard 
                article={displayedArticles[0]} 
                variant="featured" 
              />
            </div>
            
            {/* Secondary Articles Column */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedArticles.slice(1, 5).map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  variant="standard" 
                />
              ))}
            </div>
          </div>
        ) : (
          // Alternative layout for fewer articles
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedArticles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                variant="standard" 
              />
            ))}
          </div>
        )}

        {/* Additional Articles Row */}
        {displayedArticles.length > 5 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
            {displayedArticles.slice(5).map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                variant="compact" 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Article Card Component with different variants
interface ArticleCardProps {
  article: Article;
  variant: 'featured' | 'standard' | 'compact';
}

const ArticleCard = ({ article, variant }: ArticleCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (variant === 'featured') {
    return (
      <Link href={`/article/${article.id}`} className="group block h-full">
        <div className="relative h-full min-h-[400px]">
          <div className="relative overflow-hidden rounded-lg h-full">
            <Image
              src={article.imagePath || '/img/1.jpg'}
              alt={article.articleTitle}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 article-card-overlay" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-3 line-clamp-2 article-title-featured">
                {article.articleTitle}
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-300">
                <span>{formatDate(article.createdDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/article/${article.id}`} className="group block">
        <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex-shrink-0">
            <div className="w-20 h-16 relative overflow-hidden rounded">
              <Image
                src={article.imagePath || '/img/1.jpg'}
                alt={article.articleTitle}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold line-clamp-2 mb-1 group-hover:text-primaryOther transition-colors leading-tight">
              {article.articleTitle}
            </h4>
            <div className="text-xs text-gray-500 flex items-center">
              <span>{formatDate(article.createdDate)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Standard variant
  return (
    <Link href={`/article/${article.id}`} className="group block h-full">
      <div className="bg-white rounded-lg overflow-hidden category-card h-full flex flex-col">
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={article.imagePath || '/img/1.jpg'}
            alt={article.articleTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h4 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primaryOther transition-colors article-title-standard flex-1">
            {article.articleTitle}
          </h4>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {article.articleSummary}
          </p>
          <div className="text-xs text-gray-500 flex items-center justify-between mt-auto">
            <span>{formatDate(article.createdDate)}</span>
            <div className="w-1 h-1 bg-primaryOther rounded-full"></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategorySection;
