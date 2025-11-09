import Link from "next/link";
import { createSlug } from "../app/lib/urlUtils";
import ArticleImage from "./ArticleImage";
import { useArabicDate } from "../hooks/useDateFormatting";
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

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'dropdown';
  showImage?: boolean;
  onArticleClick?: () => void;
  category?: { id: number; name: string; categorySlug?: string };
}

const ArticleCard = ({ 
  article, 
  variant = 'default', 
  showImage = true,
  onArticleClick,
  category 
}: ArticleCardProps) => {
  const formattedDate = useArabicDate(article.createdDate, false); // Only Gregorian date
  
  const handleClick = () => {
    if (onArticleClick) {
      onArticleClick();
    }
  };

  // Generate article URL based on available category info
  const getArticleUrl = () => {
    if (category) {
      const categorySlug = category.categorySlug || createSlug(category.name);
      const articleSlug = article.id; // Simplified: just use the ID
      return `/${categorySlug}/${articleSlug}`;
    }
    // Fallback to old format if no category provided
    return `/article/${article.id}`;
  };

  // Dropdown variant for navigation
  if (variant === 'dropdown') {
    return (
      <Link
        href={getArticleUrl()}
        className="block px-2 py-2 hover:bg-gray-100 rounded text-sm"
        onClick={handleClick}
      >
        <div className="font-medium line-clamp-2 text-right">
          {article.articleTitle}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {new Date(article.createdDate).toLocaleDateString('en-US')}
        </div>
      </Link>
    );
  }

  // Compact variant for lists
  if (variant === 'compact') {
    return (
      <Link
        href={getArticleUrl()}
        className="block"
        onClick={handleClick}
      >
        <div className="flex gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          {showImage && article.imagePath && article.imagePath.trim() !== '' && (
            <div className="w-16 h-16 flex-shrink-0 relative overflow-hidden rounded">
              <ArticleImage
                src={article.imagePath}
                alt={article.articleTitle}
                className="w-full h-full object-cover"
                fallbackElement={
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">لا توجد صورة</span>
                  </div>
                }
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-right line-clamp-2 mb-1 hover:underline transition-all duration-200">
              {article.articleTitle}
            </h3>
            <div className="flex items-center gap-1 justify-end">
              <span className="text-xs text-gray-500">
                {new Date(article.createdDate).toLocaleDateString('en-US')}
              </span>
              <IoTimeOutline className="text-gray-500 text-xs" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant for main listings
  return (
    <Link href={getArticleUrl()} onClick={handleClick} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
        {showImage && article.imagePath && article.imagePath.trim() !== '' && (
          <>
            <div className="h-48 overflow-hidden relative">
              <ArticleImage
                src={article.imagePath}
                alt={article.articleTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                fallbackElement={
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">لا توجد صورة</span>
                  </div>
                }
              />
              {/* Light overlay for text contrast only */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent z-10" />
              {/* Article title on image */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h2 className="text-lg font-bold text-right line-clamp-2 text-white article-title-shadow">
                  {article.articleTitle}
                </h2>
              </div>
            </div>
            {/* Date and Summary below image */}
            <div className="p-4">
              <p className="text-gray-600 text-right line-clamp-2 mb-2 text-sm">
                {article.articleSummary}
              </p>
              <span className="text-sm text-gray-500">
                {formattedDate}
              </span>
            </div>
          </>
        )}
        {(!showImage || !article.imagePath || article.imagePath.trim() === '') && (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2 text-right line-clamp-2">
              {article.articleTitle}
            </h2>
            <p className="text-gray-600 mb-4 text-right line-clamp-3">
              {article.articleSummary}
            </p>
            <span className="text-sm text-gray-500">
              {formattedDate}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ArticleCard;
