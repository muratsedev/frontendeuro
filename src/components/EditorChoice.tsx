'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { articlesApi, categoriesApi } from '../app/lib/api';
import { AllArticles, AllCategories } from '../app/types/Articles';
import { getImageUrl } from '../app/lib/imageUtils';
import { generateArticleUrl } from '../app/lib/urlUtils';

const EditorChoice: React.FC = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<AllArticles[]>([]);
  const [categories, setCategories] = useState<AllCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [editorChoiceArticles, categoriesData] = await Promise.all([
          articlesApi.getEditorChoice(),
          categoriesApi.getAll()
        ]);
        
        // Filter only published articles
        const publishedArticles = editorChoiceArticles.filter(article => article.isPublished);
        setArticles(publishedArticles);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching editor choice articles:', error);
        setError('فشل في تحميل اختيارات المحرر');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper to get category for an article
  const getCategoryForArticle = (article: AllArticles) => {
    return categories.find((cat) => cat.id === article.categoryId);
  };

  // Handle click to route to article page
  const handleArticleClick = (article: AllArticles) => {
    const category = getCategoryForArticle(article);
    const url = generateArticleUrl(article, category);
    router.push(url);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primaryOther"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Don't show error, just skip the section
  }

  // Don't render if no articles
  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col space-y-3 p-3">
        {articles.map((article) => (
          <div
            key={article.id}
            className="relative group cursor-pointer rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
            onClick={() => handleArticleClick(article)}
          >
            {/* Image Container */}
            <div className="relative h-32 sm:h-40 overflow-hidden">
              {getImageUrl(article.imagePath) && (
                <Image
                  src={getImageUrl(article.imagePath)!}
                  alt={article.articleTitle}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Editor Choice Badge */}
              <div className="absolute top-2 right-2">
                <span className="bg-primaryOther text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                  ⭐
                </span>
              </div>

              {/* Article Title */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-bold text-sm leading-tight text-right line-clamp-2 group-hover:underline transition-all duration-300">
                  {article.articleTitle}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorChoice;
