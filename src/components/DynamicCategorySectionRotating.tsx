import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useImageLoader } from "../hooks/useImageLoader";

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

interface DynamicCategorySectionRotatingProps {
  category: CategoryWithArticles;
  showHeader?: boolean;
  showViewAll?: boolean;
  className?: string;
}

const DynamicCategorySectionRotating = ({ 
  category, 
  showHeader = true,
  showViewAll = true,
  className = ""
}: DynamicCategorySectionRotatingProps) => {
  // State for managing article rotation animation
  const [animateRotation, setAnimateRotation] = useState(false);
  const [previousArticleIds, setPreviousArticleIds] = useState<string[]>([]);
  
  // Sort articles by creation date (newest first) and take exactly 5 articles (1 big + 4 small)
  const sortedArticles = category.articles
    .filter(article => article.isPublished)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 5);

  // Detect new articles added to trigger rotation animation
  useEffect(() => {
    if (sortedArticles.length > 0) {
      const currentArticleIds = sortedArticles.map(article => article.id);
      
      // Check if we have a new article (different first article)
      if (previousArticleIds.length > 0 && previousArticleIds[0] !== currentArticleIds[0]) {
        console.log(`🔄 Article rotation detected in category ${category.name}`);
        console.log('Previous first article:', previousArticleIds[0]);
        console.log('New first article:', currentArticleIds[0]);
        
        // Trigger rotation animation
        setAnimateRotation(true);
        
        // Reset animation after animation completes
        setTimeout(() => {
          setAnimateRotation(false);
        }, 1000); // 1 second animation duration
      }
      
      // Update previous article IDs
      setPreviousArticleIds(currentArticleIds);
    }
  }, [sortedArticles, previousArticleIds, category.name]);
  
  if (!category.articles || category.articles.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg category-card overflow-hidden mb-8 ${className}`} dir="rtl">
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
          <div className={`big-article-container ${animateRotation ? 'rotate-to-big' : ''}`}>
            {sortedArticles[0] && (
              <BigArticleCard 
                article={sortedArticles[0]} 
                isAnimating={animateRotation}
              />
            )}
          </div>
          {/* Four Small Images on the left - Counter-clockwise rotation */}
          <div className="small-articles-grid">
            {/* Top-Right Position */}
            {sortedArticles[1] && (
              <div className={`small-article-container ${animateRotation ? 'rotate-to-top-right' : ''}`}>
                <SmallArticleCard 
                  article={sortedArticles[1]}
                  isAnimating={animateRotation}
                  position="top-right"
                />
              </div>
            )}
            {/* Top-Left Position */}
            {sortedArticles[2] && (
              <div className={`small-article-container ${animateRotation ? 'rotate-to-top-left' : ''}`}>
                <SmallArticleCard 
                  article={sortedArticles[2]}
                  isAnimating={animateRotation}
                  position="top-left"
                />
              </div>
            )}
            {/* Bottom-Left Position */}
            {sortedArticles[3] && (
              <div className={`small-article-container ${animateRotation ? 'rotate-to-bottom-left' : ''}`}>
                <SmallArticleCard 
                  article={sortedArticles[3]}
                  isAnimating={animateRotation}
                  position="bottom-left"
                />
              </div>
            )}
            {/* Bottom-Right Position */}
            {sortedArticles[4] && (
              <div className={`small-article-container ${animateRotation ? 'rotate-to-bottom-right' : ''}`}>
                <SmallArticleCard 
                  article={sortedArticles[4]}
                  isAnimating={animateRotation}
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

// Enhanced Big Article Card with Animation
interface BigArticleCardProps {
  article: Article;
  isAnimating?: boolean;
}

const BigArticleCard = ({ article, isAnimating = false }: BigArticleCardProps) => {
  const { imgSrc, isBlob } = useImageLoader(article.imagePath);

  if (!imgSrc) {
    return (
      <div className="relative h-full rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOther mb-2"></div>
          <p className="text-sm text-gray-500">جاري تحميل الصورة...</p>
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
          {isAnimating && (
            <div className="absolute -top-2 -right-2">
              <div className="w-3 h-3 bg-primaryOther rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

// Enhanced Small Article Card with Animation
interface SmallArticleCardProps {
  article: Article;
  isAnimating?: boolean;
  position: string;
}

const SmallArticleCard = ({ article, isAnimating = false, position }: SmallArticleCardProps) => {
  const { imgSrc, isBlob } = useImageLoader(article.imagePath);

  if (!imgSrc) {
    return (
      <div className="relative h-full rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primaryOther mb-1"></div>
          <p className="text-xs text-gray-500">جاري التحميل...</p>
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
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default DynamicCategorySectionRotating;