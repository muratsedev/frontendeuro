'use client';

import React, { useState, useEffect } from 'react';
import OtherCategories from './OtherCategories';
import { categoriesApi } from '../app/lib/api';
import { AllCategories } from '../app/types/Articles';
import LastNews from './LastNews';
import EditorChoice from './EditorChoice';

const Middle: React.FC = () => {
  const [categories, setCategories] = useState<AllCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoriesData = await categoriesApi.getAll();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('لايوجد اتصال مع قاعدة البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Get specific categories for display
  const getCategory = (categoryName: string) => {
    return categories.find(cat => cat.name === categoryName);
  };

  const CategorySection: React.FC<{ Name: string }> = ({ Name }) => {
    const category = getCategory(Name);
    
    // Only render if category exists and is activated
    if (!category || !category.isActivated) {
      return null;
    }
    
    return (
      <>
        <div className="container mx-auto flex items-center mb-6">
          <div className="text-primaryOther">
            <p>{category.name}</p>
          </div>
          <div className="w-96 h-1 mx-auto my-4 bg-primaryOther border-0 rounded-sm md:my-10"></div>
        </div>
        <div className="container mx-auto mb-8">
          <OtherCategories categoryFilter={category.id} limit={4} />
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOther"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const activatedCategories = categories.filter(cat => cat.isActivated);

  if (activatedCategories.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <p className="text-gray-500">لا توجد أقسام متاحة</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Layout with Categories on Left and Last News on Right */}
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Left Content - Category Sections */}
          <div className="col-span-12 lg:col-span-9">
            {activatedCategories.map((category) => (
              <CategorySection key={category.id} Name={category.name} />
            ))}
          </div>
          
          {/* Right Sidebar - Editor Choice and Last News */}
          <div className="col-span-12 lg:col-span-3">
            {/* Editor Choice Section */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 sm:w-16 h-1 bg-primaryOther border-0 rounded-sm"></div>
                <div className="text-primaryOther mx-2">
                  <p className="text-xs sm:text-sm font-semibold">اختيار المحرر</p>
                </div>
                <div className="w-12 sm:w-16 h-1 bg-primaryOther border-0 rounded-sm"></div>
              </div>
              <EditorChoice />
            </div>

            {/* Last News Section */}
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 sm:w-16 h-1 bg-primaryOther border-0 rounded-sm"></div>
                <div className="text-primaryOther mx-2">
                  <p className="text-xs sm:text-sm font-semibold">آخر الأخبار</p>
                </div>
                <div className="w-12 sm:w-16 h-1 bg-primaryOther border-0 rounded-sm"></div>
              </div>
              <div className="sticky top-4">
                <LastNews />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Middle;