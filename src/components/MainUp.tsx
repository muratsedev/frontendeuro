"use client"

import Image from "next/image";
import { getImageSource } from "../app/lib/imageHelpers";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { categoriesApi } from "../app/lib/api";
import { generateArticleUrl } from "../app/lib/urlUtils";
import { getArticles } from "../app/lib/api"; // Fixed import path
import { AllArticles, AllCategories } from "../app/types/Articles";


export default function MainUp() {
  const router = useRouter();
  const [articles, setArticles] = useState<AllArticles[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImageUrl, setMainImageUrl] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<AllCategories[]>([]);

  // Fetch articles and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesData, categoriesData] = await Promise.all([
          getArticles(),
          categoriesApi.getAll()
        ]);
        // Filter only published articles and sort by createdDate (newest first)
        const publishedArticles = articlesData
          .filter(article => article.isPublished)
          .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        setArticles(publishedArticles);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching articles or categories:", error);
        // Error handling removed - component continues with fallback content
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get main (center) article with UpperArticleId = 5
  const mainArticle = articles.find(article => article.upperArticleId === 5);
  
  // Get articles for specific UpperArticle positions
  const rightTopArticle = articles.find(article => article.upperArticleId === 3); // علوي - أيمن 1 -> top-right
  const rightBottomArticle = articles.find(article => article.upperArticleId === 4); // علوي - أيمن 2 -> bottom-right
  const leftTopArticle = articles.find(article => article.upperArticleId === 1); // علوي - أيسر 1 -> top-left  
  const leftBottomArticle = articles.find(article => article.upperArticleId === 2); // علوي - أيسر 2 -> bottom-left
  
  // Collect all positioned articles to exclude from fallback
  const positionedArticleIds = [
    mainArticle?.id,
    rightTopArticle?.id,
    rightBottomArticle?.id,
    leftTopArticle?.id,
    leftBottomArticle?.id
  ].filter(Boolean);
  
  // Fallback articles for any empty positions
  const fallbackArticles = articles.filter(article => 
    !positionedArticleIds.includes(article.id)
  );
  
  // Create final positioned articles with fallbacks
  const leftArticles = [
    leftTopArticle || fallbackArticles[0],
    leftBottomArticle || fallbackArticles[1]
  ].filter(Boolean);
  
  const rightArticles = [
    rightTopArticle || fallbackArticles[2],
    rightBottomArticle || fallbackArticles[3]
  ].filter(Boolean);



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

  // Resolve main image via proxy-aware helper.
  useEffect(() => {
    if (!mainArticle || !mainArticle.imagePath) {
      setMainImageUrl(undefined);
    } else {
      setMainImageUrl(getImageSource(mainArticle.imagePath));
    }
  }, [mainArticle]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryOther"></div>
      </div>
    );
  }

  // Don't render anything if no articles are available
  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-2">
      {/* Main News Layout */}
      <div className="grid lg:grid-cols-12 gap-6 min-h-[500px]">
        
        {/* Left Column - Two stacked articles */}
        {leftArticles.length > 0 && (
          <div className="lg:col-span-3 space-y-4 h-full">
            {leftArticles.map((article, index) => (
            <div
              key={`left-${article.id}-${index}`}
              className="relative group cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-[242px]"
              onClick={() => handleArticleClick(article)}
            >
              <div className="relative h-full">
                {getImageSource(article.imagePath) && (
                  <Image
                    src={getImageSource(article.imagePath)}
                    alt={article.articleTitle}
                    fill
                    className="object-cover"
                    style={{ objectPosition: 'top center' }}
                    unoptimized={true}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg leading-tight text-right text-shadow-outline group-hover:underline transition-all duration-300">
                  {article.articleTitle}
                </h3>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Center Column - Main large article */}
        {mainArticle && (
          <div className="lg:col-span-6">
          <div
            className="relative group cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full"
            onClick={() => mainArticle && handleArticleClick(mainArticle)}
          >
            <div className="relative h-full min-h-[500px]">
              {mainImageUrl && (
                <Image
                  src={mainImageUrl}
                  alt={mainArticle?.articleTitle || ""}
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'top center' }}
                  unoptimized={true}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Article content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-center mb-4">
                  <h2 className="text-white font-bold text-2xl md:text-3xl leading-tight text-right text-shadow-outline group-hover:underline transition-all duration-300">
                    {mainArticle?.articleTitle}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Right Column - Two stacked articles */}
        {rightArticles.length > 0 && (
          <div className="lg:col-span-3 space-y-4 h-full">
            {rightArticles.map((article, index) => (
              <div
              key={`right-${article.id}-${index}`}
              className="relative group cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-[242px]"
              onClick={() => handleArticleClick(article)}
            >
              <div className="relative h-full">
                {getImageSource(article.imagePath) && (
                  <Image
                    src={getImageSource(article.imagePath)}
                    alt={article.articleTitle}
                    fill
                    className="object-cover"
                    style={{ objectPosition: 'top center' }}
                    unoptimized={true}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg leading-tight text-right text-shadow-outline group-hover:underline transition-all duration-300">
                  {article.articleTitle}
                </h3>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile responsive layout */}
      {articles.length > 0 && (
        <div className="lg:hidden grid grid-cols-1 gap-4 mt-6">
          {articles.slice(0, 5).map((article, index) => (
          <div
            key={`mobile-${article.id || index}`}
            className="relative group cursor-pointer bg-white rounded-lg shadow-md overflow-hidden"
            onClick={() => handleArticleClick(article)}
          >
            <div className="relative h-48">
              {getImageSource(article.imagePath) && (
                <Image
                  src={getImageSource(article.imagePath)}
                  alt={article.articleTitle}
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'top center' }}
                  unoptimized={true}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-lg leading-tight text-right text-shadow-outline group-hover:underline transition-all duration-300">
                {article.articleTitle}
              </h3>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}
