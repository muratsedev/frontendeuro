"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import { AllArticles } from "@/app/types/Articles";
import { BACKEND_API_URL } from "@/app/lib/config";

interface TagArticleResponse {
  articleId: string;
  articleTitle: string;
  articleSummary: string;
  articleContent: string;
  imagePath: string;
  createdDate: string;
  updatedDate: string;
  isPublished: boolean;
  categoryId: number;
  tagId: number;
  tagName: string;
  categoryName: string;
}

export default function TagPage() {
  const params = useParams();
  const tagId = params?.id as string;
  
  const [articles, setArticles] = useState<AllArticles[]>([]);
  const [tagName, setTagName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticlesByTag = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch articles for the specific tag using the new endpoint with full backend URL
        const response = await fetch(`${BACKEND_API_URL}/api/tags/${tagId}/articles`);
        if (!response.ok) {
          throw new Error("Failed to fetch articles by tag");
        }

        const fetchedArticles: TagArticleResponse[] = await response.json();

        // Map the API response to AllArticles format
        const mappedArticles: AllArticles[] = fetchedArticles.map(article => ({
          id: article.articleId,
          articleTitle: article.articleTitle,
          articleSummary: article.articleSummary,
          articleContent: article.articleContent,
          imagePath: article.imagePath,
          createdDate: new Date(article.createdDate),
          updatedDate: new Date(article.updatedDate),
          isPublished: article.isPublished,
          facebook: false,
          twitter: false,
          categoryId: article.categoryId,
          tagId: article.tagId,
          tagName: article.tagName,
          upperArticleId: 0,
          upperArticleName: "",
          podcastTypeId: 0,
          podcastName: ""
        }));

        setArticles(mappedArticles);
        
        // Get tag name from first article
        if (fetchedArticles.length > 0) {
          setTagName(fetchedArticles[0].tagName);
        }
      } catch (err) {
        console.error("Error fetching articles by tag:", err);
        setError("فشل في تحميل المقالات");
      } finally {
        setLoading(false);
      }
    };

    if (tagId) {
      fetchArticlesByTag();
    }
  }, [tagId]);

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
        <div className="text-center text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-right mb-2 text-slate-900 dark:text-white">
          {tagName || "الوسم"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-right">
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
          <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد مقالات لهذا الوسم</p>
        </div>
      )}
    </div>
  );
}
