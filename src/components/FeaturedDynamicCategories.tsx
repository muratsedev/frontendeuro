import React from "react";
import Link from "next/link";
import DynamicCategorySection, { CategoryWithArticles } from "./DynamicCategorySection";

interface FeaturedDynamicCategoriesProps {
  categories: CategoryWithArticles[];
  maxCategories?: number;
  title?: string;
  showViewAllButton?: boolean;
  className?: string;
}

const FeaturedDynamicCategories = ({ 
  categories, 
  maxCategories = 2,
  title = "الأقسام المميزة",
  showViewAllButton = true,
  className = ""
}: FeaturedDynamicCategoriesProps) => {
  // Filter and limit categories that have at least 5 articles for best display
  const activeCategories = categories
    .filter(category => category.articles && category.articles.length >= 5)
    .slice(0, maxCategories);

  if (activeCategories.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="w-24 h-1 bg-primaryOther mx-auto rounded mb-6"></div>
          {showViewAllButton && (
            <Link 
              href="/dynamic-categories"
              className="inline-flex items-center px-6 py-3 bg-primaryOther text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
            >
              عرض جميع التصنيفات
              <span className="mr-2">←</span>
            </Link>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {activeCategories.map((category) => (
            <DynamicCategorySection
              key={category.id}
              category={category}
              showHeader={true}
              showViewAll={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDynamicCategories;
