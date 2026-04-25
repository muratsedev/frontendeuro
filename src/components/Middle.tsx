'use client';

import React, { useState, useEffect } from 'react';
import OtherCategories from './OtherCategories';
import { categoriesApi } from '../app/lib/api';
import { AllCategories } from '../app/types/Articles';
import LastNews from './LastNews';
import EditorChoice from './EditorChoice';
import VideoSlider from './VideoSlider';
import PodcastSection from './PodcastSection';
import OpinionsSection from './OpinionsSection';

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
      <div className="mb-6">
        <div className="container mx-auto flex items-center mb-3 px-2 md:px-0">
          <div className="text-primaryOther">
            <p className="text-lg md:text-xl font-semibold">{category.name}</p>
          </div>
          <div className="flex-1 h-1 mx-2 md:mx-3 bg-primaryOther border-0 rounded-sm"></div>
        </div>
        <div className="container mx-auto px-2 md:px-0">
          <OtherCategories categoryFilter={category.id} limit={4} />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 min-h-screen">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOther"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 min-h-screen">
        <div className="flex justify-center items-center h-96">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const activatedCategories = categories.filter(cat => cat.isActivated);

  // Desired ordering for key sections on the left column
  const desiredOrder = ['سياسة وأمن', 'اقتصاد', 'الشرق الأوسط', 'البلقان'];
  const orderedCategories = [...activatedCategories].sort((a, b) => {
    const ai = desiredOrder.indexOf(a.name);
    const bi = desiredOrder.indexOf(b.name);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return 0;
  });

  if (activatedCategories.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <p className="text-gray-500">لا توجد أقسام متاحة</p>
        </div>
      </div>
    );
  }

  // Dynamic insertion points: after 2nd for videos, after 4th for podcasts (fallback to last)
  const insertVideoAfterIndex = Math.min(1, orderedCategories.length - 1);
  const insertPodcastAfterIndex = Math.min(3, orderedCategories.length - 1);

  return (
    <>
      {/* Main Layout with Categories on Left and Last News on Right */}
      <div className="container mx-auto px-2 md:px-0 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-5 items-start">
          {/* Left Column - 8 columns: ordered categories and video slider */}
          <div className="col-span-12 lg:col-span-8">
            {orderedCategories.map((category, idx) => (
              <React.Fragment key={category.id}>
                <CategorySection Name={category.name} />
                {/* Insert Video Slider after the second category (سياسة وأمن, اقتصاد) */}
                {idx === insertVideoAfterIndex && (
                  <VideoSlider embedded />
                )}
                {/* Insert Podcast section after the 4th visible category */}
                {idx === insertPodcastAfterIndex && (
                  <PodcastSection />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Video Slider is rendered inside the left column above */}
          
          {/* Right Column - 4 columns: Opinions, Editor Choice then Last News */}
          <div className="col-span-12 lg:col-span-4">
            {/* Opinions Section */}
            <div className="mb-4 bg-gray-50 rounded-lg p-3 md:p-4">
              <div className="flex items-center justify-center mb-3">
                <div className="flex-1 h-1 bg-primaryOther border-0 rounded-sm"></div>
                <div className="text-primaryOther mx-2 text-center">
                  <p className="text-sm md:text-base font-semibold whitespace-nowrap">المقالات</p>
                </div>
                <div className="flex-1 h-1 bg-primaryOther border-0 rounded-sm"></div>
              </div>
              <OpinionsSection />
            </div>

            {/* Editor Choice Section */}
            <div className="mb-4 bg-gray-50 rounded-lg p-3 md:p-4">
              <div className="flex items-center justify-center mb-3">
                <div className="flex-1 h-1 bg-primaryOther border-0 rounded-sm"></div>
                <div className="text-primaryOther mx-2 text-center">
                  <p className="text-sm md:text-base font-semibold whitespace-nowrap">اختيار المحرر</p>
                </div>
                <div className="flex-1 h-1 bg-primaryOther border-0 rounded-sm"></div>
              </div>
              <EditorChoice />
            </div>

            {/* Last News Section */}
            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
              <div className="flex items-center justify-center mb-3">
                <div className="flex-1 h-1 bg-primaryOther border-0 rounded-sm"></div>
                <div className="text-primaryOther mx-2 text-center">
                  <p className="text-sm md:text-base font-semibold whitespace-nowrap">آخر الأخبار</p>
                </div>
                <div className="flex-1 h-1 bg-primaryOther border-0 rounded-sm"></div>
              </div>
              <div className="lg:sticky lg:top-4">
                <LastNews />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All categories are rendered in the left column above; no separate remaining block */}
    </>
  );
};

export default Middle;