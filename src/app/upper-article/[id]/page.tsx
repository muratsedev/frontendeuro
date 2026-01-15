"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import { AllArticles } from "@/app/types/Articles";

export default function UpperArticlePage() {
  const params = useParams();
  const upperArticleId = params?.id as string;
  
  const [articles, setArticles] = useState<AllArticles[]>([]);
  const [upperArticleName, setUpperArticleName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticlesByUpperArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all articles
        const response = await fetch("/api/articles");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }

        const allArticles: AllArticles[] = await response.json();

        // Filter articles by upperArticleId
        const filteredArticles = allArticles.filter(
          (article) => article.upperArticleId === parseInt(upperArticleId) && article.isPublished
        );

        setArticles(filteredArticles);
        
        // Get upper article name from first article
        if (filteredArticles.length > 0) {
          setUpperArticleName(filteredArticles[0].upperArticleName);
        }
      } catch (err) {
        console.error("Error fetching articles by upper article:", err);
        setError("فشل في تحميل المقالات");
      } finally {
        setLoading(false);
      }
    };

    if (upperArticleId) {
      fetchArticlesByUpperArticle();
    }
  }, [upperArticleId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryOther"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-right mb-2">
          {upperArticleName || "المقال المميز"}
        </h1>
        <p className="text-gray-600 text-right">
          {articles.length} {articles.length === 1 ? "مقال" : "مقالات"}
        </p>
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={{
                id: article.id,
                articleTitle: article.articleTitle,
                articleSummary: article.articleSummary,
                articleContent: article.articleContent,
                imagePath: article.imagePath,
                createdDate: article.createdDate.toString(),
                updatedDate: article.updatedDate.toString(),
                isPublished: article.isPublished,
                categoryId: article.categoryId,
              }}
              variant="default"
              showImage={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">لا توجد مقالات لهذا التصنيف</p>
        </div>
      )}
    </div>
  );
}
