"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { articlesApi, categoriesApi } from "../../lib/api";
import { createSlug } from "../../lib/urlUtils";

const ArticlePage = () => {
  const params = useParams();
  const router = useRouter();
  const articleId = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all articles to find the one with matching ID
        const allArticles = await articlesApi.getAll();
        const foundArticle = allArticles.find(a => a.id === articleId && a.isPublished);
        
        if (!foundArticle) {
          setError("المقال غير موجود");
          return;
        }

        // Fetch categories to get category info
        const allCategories = await categoriesApi.getAll();
        const foundCategory = allCategories.find(c => c.id === foundArticle.categoryId);
        
        if (foundCategory) {
          // Redirect to new URL format
          const categorySlug = foundCategory.categorySlug || createSlug(foundCategory.name);
          const articleSlug = foundArticle.id; // Simplified: just use the ID
          const newUrl = `/${categorySlug}/${articleSlug}`;
          
          router.replace(newUrl);
          return;
        }

        // If no category found, still redirect but use a default category
        const articleSlug = foundArticle.id; // Simplified: just use the ID
        const newUrl = `/uncategorized/${articleSlug}`;
        router.replace(newUrl);
        
      } catch (error) {
        console.error("Failed to fetch article", error);
        setError("فشل في تحميل المقال");
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchData();
    }
  }, [articleId, router]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div>جاري إعادة التوجيه...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  return null; // This should never be reached as we redirect
};

export default ArticlePage;
