'use client';

import { useState, useEffect } from "react";

interface AboutUsType {
  id: number;
  title: string;
  content: string;
  createdDate: string;
  modifiedDate: string;
}

export default function AboutUsPage() {
  const [aboutUs, setAboutUs] = useState<AboutUsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://euronews-001-site1.stempurl.com";
        const response = await fetch(`${baseUrl}/api/AboutUs`);

        if (!response.ok) {
          throw new Error("Failed to fetch About Us");
        }

        const data = await response.json();
        // API returns an array, get the latest (first) about us entry
        if (data && data.length > 0) {
          setAboutUs(data[0]);
        } else {
          setError("لا توجد معلومات متاحة");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ");
        console.error("Error fetching about us:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-600">خطأ: {error}</p>
      </div>
    );
  }

  if (!aboutUs) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">لا توجد معلومات متاحة</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            {aboutUs.title}
          </h1>

          <div className="flex gap-4 text-sm text-gray-500 mb-8 border-b pb-4">
            <time dateTime={aboutUs.modifiedDate || aboutUs.createdDate}>
              آخر تحديث: {new Date(aboutUs.modifiedDate || aboutUs.createdDate).toLocaleDateString("ar-SA")}
            </time>
          </div>

          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: aboutUs.content }}
          />
        </article>
      </div>
    </div>
  );
}
