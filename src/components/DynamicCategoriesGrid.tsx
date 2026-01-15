import React from "react";
import DynamicCategorySection, { CategoryWithArticles } from "./DynamicCategorySection";

interface DynamicCategoriesGridProps {
  categories: CategoryWithArticles[];
  maxCategories?: number;
  showHeaders?: boolean;
  showViewAllLinks?: boolean;
  title?: string;
  className?: string;
}

const DynamicCategoriesGrid = ({ 
  categories, 
  maxCategories = 4,
  showHeaders = true,
  showViewAllLinks = true,
  title = "الأقسام الرئيسية",
  className = ""
}: DynamicCategoriesGridProps) => {
  // Filter categories that have at least 1 article and limit them
  const activeCategories = categories
    .filter(category => category.articles && category.articles.length > 0)
    .slice(0, maxCategories);

  if (activeCategories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">لا توجد مقالات متاحة حالياً</p>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {/* Section Header */}
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="w-24 h-1 bg-primaryOther mx-auto rounded"></div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="space-y-8">
        {activeCategories.map((category) => (
          <DynamicCategorySection
            key={category.id}
            category={category}
            showHeader={showHeaders}
            showViewAll={showViewAllLinks}
          />
        ))}
      </div>
    </div>
  );
};

export default DynamicCategoriesGrid;
