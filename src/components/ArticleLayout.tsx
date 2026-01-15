"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SimpleArticleDisplay from "./SimpleArticleDisplay";
import SocialShare from "./SocialShare";
import { articlesApi, categoriesApi } from "../app/lib/api";
import { AllArticles, AllCategories } from "../app/types/Articles";

interface ArticleLayoutProps {
  showBreadcrumbs?: boolean;
  showBackButton?: boolean;
  className?: string;
}

const ArticleLayout = ({
  showBreadcrumbs = true,
  showBackButton = true,
  className = ""
}: ArticleLayoutProps) => {
  const params = useParams();
  const router = useRouter();
  
  const categorySlug = params?.category as string;
  const articleSlug = params?.slug as string;
  
  const [article, setArticle] = useState<AllArticles | null>(null);
  const [category, setCategory] = useState<AllCategories | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to convert title to slug
  const createSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\w\s-]/g, '') // Keep Arabic characters, words, spaces, hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Function to extract ID from slug (now expecting just the GUID)
  const extractIdFromSlug = (slug: string): string | null => {
    // Check if slug is a GUID (8-4-4-4-12 pattern)
    const guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (guidPattern.test(slug)) {
      return slug;
    }
    
    // If not a GUID, try to extract from the end (legacy format)
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];
    if (guidPattern.test(lastPart)) {
      return lastPart;
    }
    
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Extract article ID from slug
        const articleId = extractIdFromSlug(articleSlug);
        if (!articleId) {
          setError("معرف المقال غير صالح");
          return;
        }

        // Fetch all articles to find the one with matching ID
        const allArticles = await articlesApi.getAll();
        const foundArticle = allArticles.find((a: AllArticles) => a.id === articleId && a.isPublished);
        
        if (!foundArticle) {
          setError("المقال غير موجود");
          return;
        }

        // Fetch all categories to find the category
        const allCategories = await categoriesApi.getAll();
        const foundCategory = allCategories.find((c: AllCategories) => c.categorySlug === categorySlug || c.id === foundArticle.categoryId);
        
        if (!foundCategory) {
          setError("القسم غير موجود");
          return;
        }

        // Verify that the article belongs to the correct category
        if (foundArticle.categoryId !== foundCategory.id) {
          setError("المقال لا يوجد في هذا القسم");
          return;
        }

        // Generate expected slug and check if current URL is correct
        const expectedSlug = foundArticle.id; // Just use the article ID
        const expectedCategorySlug = foundCategory.categorySlug || createSlug(foundCategory.name);
        
        // If URL doesn't match expected format, redirect to correct URL
        if (categorySlug !== expectedCategorySlug || articleSlug !== expectedSlug) {
          router.replace(`/${expectedCategorySlug}/${expectedSlug}`);
          return;
        }

        setArticle(foundArticle);
        setCategory(foundCategory);
      } catch (error) {
        console.error("Failed to fetch article", error);
        setError("فشل في تحميل المقال");
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug && articleSlug) {
      fetchData();
    }
  }, [categorySlug, articleSlug, router]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div>جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (error || !article || !category) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <div className="text-red-500 mb-4 text-lg">{error || "المقال غير موجود"}</div>
          <p className="text-gray-600 mb-6">
            عذراً، لا يمكننا العثور على المقال المطلوب. قد يكون المقال محذوفاً أو غير موجود.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.back()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
            >
              العودة
            </button>
            <Link
              href="/"
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors inline-block"
            >
              الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get the current URL for sharing
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className={`container mx-auto p-4 max-w-7xl ${className}`}>
      {/* Social Share Buttons - Fixed on the left side */}
      <SocialShare 
        url={currentUrl}
        title={article.articleTitle}
      />

      {/* Breadcrumb Navigation */}
      {showBreadcrumbs && (
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                <Image 
                  src="/img/logo-small-right.png" 
                  alt="الرئيسية" 
                  width={12} 
                  height={4} 
                  className="h-auto m-0 p-0 block leading-none"
                />
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li>
              <Link 
                href={`/category/${category.id}`} 
                className="hover:text-blue-600 transition-colors"
              >
                {category.name}
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-gray-700 font-medium truncate max-w-md">
              {article.articleTitle}
            </li>
          </ol>
        </nav>
      )}

      {/* Back Button */}
      {showBackButton && (
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-500 hover:text-blue-600 transition-colors flex items-center"
        >
          <span className="mr-2">←</span>
          العودة
        </button>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Main Article Content Only */}
        <div className="lg:col-span-1">
          <SimpleArticleDisplay
            article={article}
            category={category}
            showImage={true}
            showSummary={true}
            showFullContent={true}
            showTags={true}
            showMetadata={true}
            showCategoryBadge={true}
            shareUrl={currentUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleLayout;
