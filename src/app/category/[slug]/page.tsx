"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DynamicCategorySection, { CategoryWithArticles } from "../../../components/DynamicCategorySection";
import MainPicturesAlt from "../../../components/MainPicturesAlt";
import LastNewsForCategory from "../../../components/LastNewsForCategory";
import Link from "next/link";
import Image from "next/image";

const CategoryPage = () => {
  const params = useParams();
  const categorySlug = params?.slug as string;
  const [category, setCategory] = useState<CategoryWithArticles | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        
        // Get all categories with articles to find the one with matching slug
        const categoriesResponse = await fetch('/api/categories-with-articles');
        if (!categoriesResponse.ok) {
          throw new Error('فشل في تحميل التصنيفات');
        }
        
        const categories: CategoryWithArticles[] = await categoriesResponse.json();
        const foundCategory = categories.find(cat => cat.categorySlug === categorySlug);
        
        if (!foundCategory) {
          setError("التصنيف غير موجود");
          return;
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
            <div className="mt-4">
              <Link 
                href="/"
                className="px-4 py-2 bg-primaryOther text-white rounded hover:bg-opacity-90 transition-colors inline-block"
              >
                العودة للرئيسية
              </Link>
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

      {/* Main Layout - Same as Main Page */}
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Left Content - Category Sections */}
          <div className="col-span-12 lg:col-span-9">
            <DynamicCategorySection 
              category={category}
              showHeader={false}
              showViewAll={false}
            />

            {/* Additional Articles if more than 5 */}
            {category.articles.length > 5 && (
              <div className="mt-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    مقالات أخرى من {category.name}
                  </h3>
                  <div className="w-24 h-1 bg-primaryOther mx-auto rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.articles.slice(5).map((article) => (
                    <Link 
                      key={article.id} 
                      href={`/article/${article.id}`} 
                      className="group block bg-white rounded-lg category-card overflow-hidden"
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">صورة المقال</span>
                        </div>
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
          </div>
          
          {/* Right Sidebar - Last News */}
          <div className="col-span-12 lg:col-span-3">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 sm:w-16 h-1 bg-primaryOther border-0 rounded-sm"></div>
              <div className="text-primaryOther mx-2">
                <p className="text-xs sm:text-sm font-semibold">آخر الأخبار</p>
              </div>
              <div className="w-12 sm:w-16 h-1 bg-primaryOther border-0 rounded-sm"></div>
            </div>
            <div className="sticky top-4">
              <LastNewsForCategory categoryId={category.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
