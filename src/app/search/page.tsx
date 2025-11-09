"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ArticleSearch from "../../components/ArticleSearch";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams?.get('q') || '';
    
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-right text-gray-900">
                        البحث في المقالات
                    </h1>
                    <p className="mt-2 text-gray-600 text-right">
                        ابحث في جميع المقالات والأخبار المنشورة
                    </p>
                </div>

                {/* Search Component */}
                <ArticleSearch 
                    initialQuery={query}
                    showFilters={true}
                    maxResults={50}
                    className="max-w-4xl mx-auto"
                />
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOther"></div>
                    <p className="mt-2 text-gray-600">جاري تحميل البحث...</p>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}