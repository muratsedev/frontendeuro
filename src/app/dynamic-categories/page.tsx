'use client';

import React, { useEffect, useState } from "react";
import DynamicCategoriesGrid from "../../components/DynamicCategoriesGrid";
import { CategoryWithArticles } from "../../components/DynamicCategorySection";

const DynamicCategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryWithArticles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories-with-articles');
        
        if (!response.ok) {
          throw new Error('فشل في تحميل التصنيفات');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primaryOther"></div>
            <p className="mt-4 text-gray-600">جاري تحميل التصنيفات...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">❌ خطأ</div>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primaryOther text-white rounded hover:bg-opacity-90 transition-colors"
            >
              إعادة المحاولة
            </button>
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
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            التصنيفات الديناميكية
          </h1>
          <p className="mt-2 text-gray-600 text-center">
            تصميم ديناميكي مع صورة كبيرة على اليمين وأربع صور صغيرة على اليسار
          </p>
        </div>
      </div>

      {/* Dynamic Categories Grid */}
      <DynamicCategoriesGrid 
        categories={categories}
        maxCategories={6}
        showHeaders={true}
        showViewAllLinks={true}
        title="الأقسام الرئيسية"
      />
    </div>
  );
};

export default DynamicCategoriesPage;
