'use client';

import React, { useState, useEffect } from 'react';
import DynamicCategorySection, { CategoryWithArticles } from '../../components/DynamicCategorySection';
import { categoriesApi, getArticles } from '../lib/api';

const ArticleRotationTest = () => {
  const [categories, setCategories] = useState<CategoryWithArticles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            id: category.id,
            name: category.name,
            categorySlug: category.categorySlug,
            isActivated: category.isActivated,
            articles: articlesData
              .filter(article => article.categoryId === category.id && article.isPublished)
              .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
              .map(article => ({
                id: article.id,
                articleTitle: article.articleTitle,
                articleSummary: article.articleSummary,
                articleContent: article.articleContent,
                imagePath: article.imagePath,
                createdDate: new Date(article.createdDate).toISOString(),
                updatedDate: new Date(article.updatedDate).toISOString(),
                isPublished: article.isPublished,
                categoryId: article.categoryId
              }))
          }))
          .filter(category => category.articles.length > 0);
        
        console.log('📄 Categories with articles:', categoriesWithArticles.length);
        console.log('📄 First category articles:', categoriesWithArticles[0]?.articles?.length || 0);
        
        setCategories(categoriesWithArticles);
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
        setError('فشل في تحميل التصنيفات');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithArticles();
  }, []);

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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-8">اختبار دوران المقالات</h1>
        
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">
            <strong>إحصائيات:</strong> تم العثور على {categories.length} تصنيف بمقالات
          </p>
          {categories.map((cat, index) => (
            <p key={cat.id} className="text-sm text-blue-600">
              {index + 1}. {cat.name}: {cat.articles.length} مقال
            </p>
          ))}
        </div>

        <div className="space-y-8">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">لا توجد تصنيفات بمقالات متاحة</p>
            </div>
          ) : (
            categories.slice(0, 2).map((category) => (
              <div key={category.id} className="relative">
                <div className="mb-4 text-sm text-gray-600">
                  التصنيف: <span className="font-medium">{category.name}</span> • 
                  عدد المقالات: <span className="font-medium">{category.articles.length}</span>
                </div>
                
                <DynamicCategorySection
                  category={category}
                  showHeader={true}
                  showViewAll={true}
                  className="shadow-lg"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleRotationTest;