import React from "react";
import CategorySection, { CategoryWithArticles } from "./CategorySection";

interface CategoriesGridProps {
  categories: CategoryWithArticles[];
  maxArticlesPerCategory?: number;
  showViewAllLinks?: boolean;
}

const CategoriesGrid = ({ 
  categories, 
  maxArticlesPerCategory = 6,
  showViewAllLinks = true 
}: CategoriesGridProps) => {
  // Filter out categories with no articles
  const activeCategories = categories.filter(
    category => category.articles && category.articles.length > 0
  );

  if (activeCategories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">لا توجد مقالات متاحة حالياً</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {activeCategories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            maxArticles={maxArticlesPerCategory}
            showViewAll={showViewAllLinks}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesGrid;
