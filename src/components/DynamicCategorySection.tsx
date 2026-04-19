import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useImageLoader } from "../hooks/useImageLoader";
import { useArticleRotation } from "../hooks/useArticleRotation";

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

interface DynamicCategorySectionProps {
  category: CategoryWithArticles;
  showHeader?: boolean;
  showViewAll?: boolean;
  className?: string;
}

const DynamicCategorySection = ({ 
  category, 
  showHeader = true,
  showViewAll = true,
  className = ""
}: DynamicCategorySectionProps) => {
  // Use the article rotation hook for automatic rotation
  const {
    isRotating,
    getRotationClass,
    isNewArticle,
    positions
  } = useArticleRotation({
    articles: category.articles,
    categoryId: category.id,
    maxArticles: 5
  });
  
  if (!category.articles || category.articles.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-lg category-card overflow-hidden mb-8 transition-colors ${className}`} dir="rtl">
      {/* Category Header */}
      {showHeader && (
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
      )}

      {/* Dynamic Layout with Rotation Animation */}
      <div className="p-6">
        <div className="dynamic-grid">
          {/* Big Image on the right */}
          <div className={`big-article-container ${getRotationClass('big')}`}>
            {positions.big && (
              <BigArticleCard 
                article={positions.big} 
                isAnimating={isRotating}
                isNew={isNewArticle(positions.big.id)}
              />
            )}
          </div>
          {/* Four Small Images on the left - Counter-clockwise rotation */}
          <div className="small-articles-grid">
            {/* Top-Right Position */}
            {positions.topRight && (
              <div className={`small-article-container ${getRotationClass('top-right')}`}>
                <SmallArticleCard 
                  article={positions.topRight}
                  isAnimating={isRotating}
                  position="top-right"
                />
              </div>
            )}
            {/* Top-Left Position */}
            {positions.topLeft && (
              <div className={`small-article-container ${getRotationClass('top-left')}`}>
                <SmallArticleCard 
                  article={positions.topLeft}
                  isAnimating={isRotating}
                  position="top-left"
                />
              </div>
            )}
            {/* Bottom-Left Position */}
            {positions.bottomLeft && (
              <div className={`small-article-container ${getRotationClass('bottom-left')}`}>
                <SmallArticleCard 
                  article={positions.bottomLeft}
                  isAnimating={isRotating}
                  position="bottom-left"
                />
              </div>
            )}
            {/* Bottom-Right Position */}
            {positions.bottomRight && (
              <div className={`small-article-container ${getRotationClass('bottom-right')}`}>
                <SmallArticleCard 
                  article={positions.bottomRight}
                  isAnimating={isRotating}
                  position="bottom-right"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Big Article Card (Right Side)
interface BigArticleCardProps {
  article: Article;
  isAnimating?: boolean;
  isNew?: boolean;
}

const BigArticleCard = ({ article, isAnimating = false, isNew = false }: BigArticleCardProps) => {
  const { imgSrc, isBlob } = useImageLoader(article.imagePath);

  if (!imgSrc) {
    return (
      <div className="relative h-full rounded-lg overflow-hidden bg-gray-200 dark:bg-slate-800 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOther mb-2"></div>
          <p className="text-sm text-gray-500 dark:text-slate-300">جاري تحميل الصورة...</p>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/article/${article.id}`} className="group h-full block">
      <div className={`relative h-full rounded-lg overflow-hidden ${isAnimating ? 'article-rotation-animation' : ''}`}>
        <Image
          src={imgSrc}
          alt={article.articleTitle}
          fill
          className="object-cover w-full h-full absolute inset-0 scale-110 group-hover:scale-115 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          unoptimized={isBlob}
        />
        {/* Light overlay for text contrast only */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <h3 className="dynamic-big-title line-clamp-2 leading-tight text-white font-bold article-title-shadow">
            {article.articleTitle}
          </h3>
          {isNew && (
            <div className="absolute -top-2 -right-2">
              <div className="w-4 h-4 bg-primaryOther rounded-full animate-pulse flex items-center justify-center">
                <span className="text-white text-xs">🆕</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

// Small Article Card (Left Side Grid)
interface SmallArticleCardProps {
  article: Article;
  isAnimating?: boolean;
  position?: string;
}

const SmallArticleCard = ({ article, isAnimating = false, position = '' }: SmallArticleCardProps) => {
  const { imgSrc, isBlob } = useImageLoader(article.imagePath);

  if (!imgSrc) {
    return (
      <div className="relative h-full rounded-lg overflow-hidden bg-gray-200 dark:bg-slate-800 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primaryOther mb-1"></div>
          <p className="text-xs text-gray-500 dark:text-slate-300">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/article/${article.id}`} className="group h-full block">
      <div className={`relative h-full rounded-lg overflow-hidden ${isAnimating ? `article-rotation-animation rotation-${position}` : ''}`}>
        <Image
          src={imgSrc}
          alt={article.articleTitle}
          fill
          className={`object-cover w-full h-full absolute inset-0 scale-110 group-hover:scale-115 transition-transform duration-300`}
          sizes="(max-width: 768px) 100vw, 25vw"
          unoptimized={isBlob}
        />
        {/* Light overlay for text contrast only */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
          <h4 className="dynamic-small-title line-clamp-2 leading-tight text-white font-bold article-title-shadow">
            {article.articleTitle}
          </h4>
          {isAnimating && (
            <div className="absolute -top-1 -right-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default DynamicCategorySection;
