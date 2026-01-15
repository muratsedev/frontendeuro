"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import FeaturedDynamicCategories from "../components/FeaturedDynamicCategories";
import MainPictures from "../components/MainPictures";
import { CategoryWithArticles } from "../components/DynamicCategorySection";

export default function HomePage() {
  const [categories, setCategories] = useState<CategoryWithArticles[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories-with-articles');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto p-4">
          <h1 className="text-4xl font-bold text-right mb-8 text-gray-900">
            موقع التجديد الإخباري
          </h1>
          <MainPictures />
        </div>
      </section>

      {/* Featured Dynamic Categories */}
      {!loading && categories.length > 0 && (
        <FeaturedDynamicCategories
          categories={categories}
          maxCategories={3}
          title="أحدث الأخبار"
          showViewAllButton={true}
        />
      )}

      {/* Loading State */}
      {loading && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primaryOther"></div>
              <p className="mt-4 text-gray-600">جاري تحميل المحتوى...</p>
            </div>
          </div>
        </section>
      )}

      {/* Quick Navigation Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              استكشف المزيد
            </h2>
            <div className="w-24 h-1 bg-primaryOther mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/articles"
              className="group p-6 bg-white rounded-lg category-card hover:bg-primaryOther hover:text-white transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-3xl mb-4">📰</div>
                <h3 className="font-semibold mb-2">جميع المقالات</h3>
                <p className="text-sm group-hover:text-gray-100">
                  تصفح جميع المقالات المنشورة
                </p>
              </div>
            </Link>
            
            <Link
              href="/categories"
              className="group p-6 bg-white rounded-lg category-card hover:bg-primaryOther hover:text-white transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-3xl mb-4">📂</div>
                <h3 className="font-semibold mb-2">التصنيفات العادية</h3>
                <p className="text-sm group-hover:text-gray-100">
                  تصفح بالتصميم العادي
                </p>
              </div>
            </Link>
            
            <Link
              href="/dynamic-categories"
              className="group p-6 bg-white rounded-lg category-card hover:bg-primaryOther hover:text-white transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="font-semibold mb-2">التصنيفات الديناميكية</h3>
                <p className="text-sm group-hover:text-gray-100">
                  تصميم ديناميكي جديد
                </p>
              </div>
            </Link>
            
            <Link
              href="/api-test"
              className="group p-6 bg-white rounded-lg category-card hover:bg-primaryOther hover:text-white transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-3xl mb-4">🔧</div>
                <h3 className="font-semibold mb-2">اختبار API</h3>
                <p className="text-sm group-hover:text-gray-100">
                  اختبر اتصال API
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
