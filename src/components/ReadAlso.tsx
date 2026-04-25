"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { articlesApi } from "../app/lib/api";
import { AllArticles, AllCategories } from "../app/types/Articles";
import ArticleImage from "./ArticleImage";

interface ReadAlsoProps {
  currentArticle: AllArticles;
  category: AllCategories;
}

const ReadAlso = ({ currentArticle, category }: ReadAlsoProps) => {
  const [articles, setArticles] = useState<AllArticles[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        // Fetch articles from the same category
        const categoryArticles = await articlesApi.getByCategory(category.id);

        // Exclude the current article and unpublished ones
        const candidates = categoryArticles.filter(
          (a: AllArticles) => a.id !== currentArticle.id && a.isPublished
        );

        // Prioritise articles sharing the same tag
        const sameTag = candidates.filter(
          (a: AllArticles) =>
            currentArticle.tagId &&
            a.tagId === currentArticle.tagId
        );
        const otherTag = candidates.filter(
          (a: AllArticles) =>
            !currentArticle.tagId ||
            a.tagId !== currentArticle.tagId
        );

        // Shuffle each group separately, then combine (same-tag first)
        const shuffle = <T,>(arr: T[]): T[] =>
          [...arr].sort(() => Math.random() - 0.5);

        const ordered = [...shuffle(sameTag), ...shuffle(otherTag)];
        setArticles(ordered.slice(0, 5));
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [currentArticle.id, currentArticle.tagId, category.id]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3 mb-4">
            <div className="w-20 h-16 bg-gray-200 rounded animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <aside
      className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-[#1a3a6b] px-4 py-3">
        <h3 className="text-white font-bold text-base">إقرأ أيضاً</h3>
      </div>

      <ul className="divide-y divide-gray-100">
        {articles.map((article) => {
          const articleUrl = `/${category.categorySlug}/${article.id}`;
          return (
            <li key={article.id}>
              <Link
                href={articleUrl}
                className="flex gap-3 p-3 hover:bg-gray-50 transition-colors group"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                  <ArticleImage
                    src={article.imagePath}
                    alt={article.articleTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 line-clamp-3 leading-snug group-hover:text-[#1a3a6b] transition-colors">
                    {article.articleTitle}
                  </p>
                  {article.tagName && (
                    <span className="mt-1 inline-block text-xs text-gray-400">
                      {article.tagName}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ReadAlso;
