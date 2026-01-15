'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DynamicCategorySection, { CategoryWithArticles } from "../../../components/DynamicCategorySection";
import MainPicturesAlt from "../../../components/MainPicturesAlt";
import Link from "next/link";
import Image from "next/image";

const SingleCategoryPage = () => {
  const params = useParams();
  const categorySlug = params?.slug as string;
  
  const [category, setCategory] = useState<CategoryWithArticles | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        
        // First, get all categories to find the one with matching slug
        const categoriesResponse = await fetch('/api/categories-with-articles');
        if (!categoriesResponse.ok) {
          throw new Error('فشل في تحميل التصنيفات');
        }
        
        const categories: CategoryWithArticles[] = await categoriesResponse.json();
        const foundCategory = categories.find(cat => cat.categorySlug === categorySlug);
        
        if (!foundCategory) {
          throw new Error('التصنيف غير موجود');
        }
        
        setCategory(foundCategory);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
        console.error('Error fetching category:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategory();
    }
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primaryOther"></div>
            <p className="mt-4 text-gray-600">جاري تحميل التصنيف...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">❌ خطأ</div>
            <p className="text-gray-600">{error || 'التصنيف غير موجود'}</p>
            <div className="mt-4 space-x-4">
              <Link 
                href="/categories"
                className="px-4 py-2 bg-primaryOther text-white rounded hover:bg-opacity-90 transition-colors inline-block mr-2"
              >
                العودة للتصنيفات
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="text-sm mb-4" dir="rtl">
            <ol className="flex items-center space-x-reverse space-x-2 text-gray-500">
              <li>
                <Link href="/" className="hover:text-primaryOther transition-colors">
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
                <Link href="/categories" className="hover:text-primaryOther transition-colors">
                  التصنيفات
                </Link>
              </li>
              <li className="mx-2">/</li>
              <li className="text-gray-900 font-medium">{category.name}</li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 text-right">
            {category.name}
          </h1>
          <p className="mt-2 text-gray-600 text-right">
            {category.articles.length} مقال متاح في هذا التصنيف
          </p>
        </div>
      </div>

      {/* Featured Articles Section - Full Width */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MainPicturesAlt />
        </div>
      </div>

      {/* Category Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">        
        <DynamicCategorySection 
          category={category}
          showHeader={false} // Header already shown above
          showViewAll={false} // No need for "view all" on dedicated page
        />

        {/* Additional Articles if more than 5 */}
        {category.articles.length > 5 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-right">
              مقالات إضافية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.articles.slice(5).map((article) => (
                <Link 
                  key={article.id} 
                  href={`/article/${article.id}`} 
                  className="group block bg-white rounded-lg category-card overflow-hidden"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={article.imagePath || '/img/1.jpg'}
                      alt={article.articleTitle}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primaryOther transition-colors">
                      {article.articleTitle}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {article.articleSummary}
                    </p>
                    <div className="text-xs text-gray-500">
                      {new Date(article.createdDate).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Categories */}
        <div className="text-center mt-8">
          <Link 
            href="/categories"
            className="inline-flex items-center px-6 py-3 bg-primaryOther text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <span className="mr-2">←</span>
            العودة لجميع التصنيفات
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleCategoryPage;
