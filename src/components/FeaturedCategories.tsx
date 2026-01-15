import React from "react";
import Link from "next/link";
import CategorySection, { CategoryWithArticles } from "./CategorySection";

interface FeaturedCategoriesProps {
  categories: CategoryWithArticles[];
  maxCategories?: number;
  maxArticlesPerCategory?: number;
  title?: string;
  showViewAllButton?: boolean;
}

const FeaturedCategories = ({ 
  categories, 
  maxCategories = 3,
  maxArticlesPerCategory = 4,
  title = "التصنيفات المميزة",
  showViewAllButton = true
}: FeaturedCategoriesProps) => {
  // Filter and limit categories
  const activeCategories = categories
    .filter(category => category.articles && category.articles.length > 0)
    .slice(0, maxCategories);

  if (activeCategories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 text-right">
            {title}
          </h2>
          {showViewAllButton && (
            <Link 
              href="/categories"
              className="inline-flex items-center px-4 py-2 bg-primaryOther text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm"
            >
              عرض جميع التصنيفات
              <span className="mr-2">←</span>
            </Link>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {activeCategories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              maxArticles={maxArticlesPerCategory}
              showViewAll={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
