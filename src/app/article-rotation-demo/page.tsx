'use client';

import React, { useState, useEffect } from 'react';
import DynamicCategorySection from '../../components/DynamicCategorySection';
import { categoriesApi, getArticles } from '../lib/api';
import { CategoryWithArticles } from '../../components/DynamicCategorySection';

const ArticleRotationDemo = () => {
  const [categories, setCategories] = useState<CategoryWithArticles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refresh categories every 30 seconds to detect new articles
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchCategoriesWithArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Fetching categories with articles...');
        
        // Fetch categories and articles separately
        const [categoriesData, articlesData] = await Promise.all([
          categoriesApi.getAll(),
          getArticles()
        ]);
        
        console.log('📥 Categories received:', categoriesData.length);
        console.log('📥 Articles received:', articlesData.length);
        
        // Combine categories with their articles
        const categoriesWithArticles: CategoryWithArticles[] = categoriesData
          .filter(category => category.isActivated)
          .map(category => ({
            ...category,
            articles: articlesData.filter(article => 
              article.categoryId === category.id && article.isPublished
            )
            .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
            .map(article => ({
              ...article,
              createdDate: new Date(article.createdDate).toISOString(),
              updatedDate: new Date(article.updatedDate).toISOString()
            }))
          }))
          .filter(category => category.articles.length > 0);
        
        console.log('📄 Categories with articles:', categoriesWithArticles.length);
        setCategories(categoriesWithArticles);
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
        setError('فشل في تحميل التصنيفات');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithArticles();
  }, [refreshKey]);

  // Auto-refresh every 30 seconds to detect new articles
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing categories...');
      setRefreshKey(prev => prev + 1);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primaryOther mb-4"></div>
          <p className="text-lg text-gray-600">جاري تحميل المقالات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">{error}</p>
          <button 
            onClick={handleManualRefresh}
            className="bg-primaryOther text-white px-6 py-2 rounded-lg hover:bg-primaryOther/90"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">عرض دوران المقالات</h1>
              <p className="text-gray-600 mt-2">
                المقالات الجديدة تظهر تلقائياً في الصورة الكبيرة وتنتقل بقية المقالات في حركة عكس عقارب الساعة
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                آخر تحديث: {new Date().toLocaleTimeString('ar')}
              </div>
              <button 
                onClick={handleManualRefresh}
                className="bg-primaryOther text-white px-4 py-2 rounded-lg hover:bg-primaryOther/90 transition-colors flex items-center gap-2"
              >
                🔄 تحديث
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">💡 كيفية اختبار الدوران</h2>
          <div className="grid md:grid-cols-2 gap-4 text-blue-800">
            <div>
              <h3 className="font-medium mb-2">📝 لإضافة مقال جديد:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>اذهب إلى لوحة التحكم</li>
                <li>أضف مقال جديد واختر التصنيف</li>
                <li>احفظ المقال واجعله منشور</li>
                <li>ارجع لهذه الصفحة لرؤية الدوران</li>
              </ol>
            </div>
            <div>
              <h3 className="font-medium mb-2">🔄 حركة الدوران:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>المقال الجديد → الصورة الكبيرة</li>
                <li>الصورة الكبيرة → أعلى يمين</li>
                <li>أعلى يمين → أعلى يسار</li>
                <li>أعلى يسار → أسفل يسار</li>
                <li>أسفل يسار → أسفل يمين</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Categories with Rotation */}
        <div className="space-y-8">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">لا توجد تصنيفات بمقالات متاحة</p>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="relative">
                {/* Category Stats */}
                <div className="mb-4 text-sm text-gray-600">
                  التصنيف: <span className="font-medium">{category.name}</span> • 
                  عدد المقالات: <span className="font-medium">{category.articles.length}</span>
                </div>
                
                {/* Dynamic Category Section with Rotation */}
                <DynamicCategorySection
                  category={category}
                  showHeader={true}
                  showViewAll={true}
                  className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>تحديث تلقائي كل 30 ثانية • أضف مقالات جديدة لرؤية الدوران التلقائي</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleRotationDemo;