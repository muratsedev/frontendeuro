'use client';

import { useState, useEffect } from "react";

interface PrivacyPolicyType {
  id: number;
  title: string;
  content: string;
  createdDate: string;
  modifiedDate: string;
}

export default function PrivacyPolicyPage() {
  const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyPolicyType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://eennback-002-site1.atempurl.com";
        const response = await fetch(`${baseUrl}/api/PrivacyPolicies`);

        if (!response.ok) {
          throw new Error("Failed to fetch Privacy Policy");
        }

        const data = await response.json();
        // API returns an array, get the latest (first) privacy policy
        if (data && data.length > 0) {
          setPrivacyPolicy(data[0]);
        } else {
          setError("No privacy policy found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching privacy policy:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
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

  if (!privacyPolicy) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">لا توجد سياسة خصوصية متاحة</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            {privacyPolicy.title}
          </h1>

          <div className="flex gap-4 text-sm text-gray-500 mb-8 border-b pb-4">
            <time dateTime={privacyPolicy.modifiedDate || privacyPolicy.createdDate}>
              آخر تحديث: {new Date(privacyPolicy.modifiedDate || privacyPolicy.createdDate).toLocaleDateString("ar-SA")}
            </time>
          </div>

          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: privacyPolicy.content }}
          />
        </article>
      </div>
    </div>
  );
}
