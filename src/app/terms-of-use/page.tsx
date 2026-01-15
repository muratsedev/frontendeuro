'use client';

import { useState, useEffect } from "react";

interface TermsOfUseType {
  id: number;
  title: string;
  content: string;
  createdDate: string;
  modifiedDate: string;
}

export default function TermsOfUsePage() {
  const [termsOfUse, setTermsOfUse] = useState<TermsOfUseType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTermsOfUse = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${baseUrl}/api/TermsOfUse`);

        if (!response.ok) {
          throw new Error("Failed to fetch Terms of Use");
        }

        const data = await response.json();
        setTermsOfUse(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching terms of use:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTermsOfUse();
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

  if (!termsOfUse) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">لا توجد شروط استخدام متاحة</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            {termsOfUse.title}
          </h1>

          <div className="flex gap-4 text-sm text-gray-500 mb-8 border-b pb-4">
            <time dateTime={termsOfUse.modifiedDate || termsOfUse.createdDate}>
              آخر تحديث: {new Date(termsOfUse.modifiedDate || termsOfUse.createdDate).toLocaleDateString("ar-SA")}
            </time>
          </div>

          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: termsOfUse.content }}
          />
        </article>
      </div>
    </div>
  );
}
