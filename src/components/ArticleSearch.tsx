"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ArticleCard, { Article } from "./ArticleCard";
import { IoSearch, IoClose, IoCalendarOutline, IoFilterOutline } from "react-icons/io5";

interface SearchResponse {
    query: string;
    totalResults: number;
    returnedResults: number;
    sortBy: string;
    order: string;
    articles: Article[];
    error?: string;
}

interface ArticleSearchProps {
    className?: string;
    initialQuery?: string;
    showFilters?: boolean;
    maxResults?: number;
}

const ArticleSearch = ({ 
    className = '', 
    initialQuery = '',
    showFilters = true,
    maxResults = 20
}: ArticleSearchProps) => {
    const [query, setQuery] = useState(initialQuery);
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'createdDate' | 'updatedDate' | 'title'>('createdDate');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [showSearchFilters, setShowSearchFilters] = useState(false);
    const router = useRouter();

    // Debounced search function
    const performSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setSearchResults(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            console.log(`Searching for: "${searchQuery}"`);
            
            const searchParams = new URLSearchParams({
                query: searchQuery.trim(),
                sortBy,
                order,
                limit: maxResults.toString()
            });

            const response = await fetch(`/api/search?${searchParams}`);
            
            if (!response.ok) {
                throw new Error(`Search failed: ${response.status} ${response.statusText}`);
            }

            const data: SearchResponse = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            console.log(`Search completed: ${data.totalResults} results found`);
            setSearchResults(data);

        } catch (err) {
            console.error('Search error:', err);
            setError(err instanceof Error ? err.message : 'Search failed');
            setSearchResults(null);
        } finally {
            setLoading(false);
        }
    }, [sortBy, order, maxResults]);

    // Debounce search input
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.trim()) {
                performSearch(query);
            } else {
                setSearchResults(null);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [query, performSearch]);

    // Re-search when sort options change
    useEffect(() => {
        if (query.trim() && searchResults) {
            performSearch(query);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, order]);

    const handleClearSearch = () => {
        setQuery('');
        setSearchResults(null);
        setError(null);
    };

    const handleArticleClick = (article: Article) => {
        // Navigate to article page
        router.push(`/article/${article.id}`);
    };

    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 text-gray-600 ${className}`}>
            {/* Search Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-right mb-4 text-gray-800">
                    🔍 البحث في المقالات
                </h2>
                
                {/* Search Input */}
                <div className="relative ">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="ابحث في عناوين المقالات والمحتوى..."
                        className="w-full p-4 pl-12 pr-4 text-right text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryOther focus:border-transparent transition-all"
                        dir="rtl"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 ml-2">
                        <IoSearch className="text-gray-400 text-xl font-bold" />
                    </div>
                    {query && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="مسح البحث"
                            type="button"
                        >
                            <IoClose className="text-xl" />
                        </button>
                    )}
                </div>

                {/* Search Filters */}
                {showFilters && (
                    <div className="mt-4">
                        <button
                            onClick={() => setShowSearchFilters(!showSearchFilters)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primaryOther transition-colors"
                            aria-label={showSearchFilters ? "إخفاء خيارات الترتيب" : "عرض خيارات الترتيب"}
                            type="button"
                        >
                            <IoFilterOutline />
                            <span>خيارات الترتيب</span>
                        </button>

                        {showSearchFilters && (
                            <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Sort By */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                                            ترتيب حسب:
                                        </label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as 'createdDate' | 'updatedDate' | 'title')}
                                            className="w-full p-2 border border-gray-300 rounded text-right"
                                            dir="rtl"
                                            aria-label="ترتيب حسب"
                                        >
                                            <option value="createdDate">تاريخ النشر</option>
                                            <option value="updatedDate">تاريخ التحديث</option>
                                            <option value="title">العنوان</option>
                                        </select>
                                    </div>

                                    {/* Order */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                                            الترتيب:
                                        </label>
                                        <select
                                            value={order}
                                            onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
                                            className="w-full p-2 border border-gray-300 rounded text-right"
                                            dir="rtl"
                                            aria-label="الترتيب"
                                        >
                                            <option value="desc">الأحدث أولاً</option>
                                            <option value="asc">الأقدم أولاً</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOther"></div>
                    <p className="mt-2 text-gray-600">جاري البحث...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-600 text-right">❌ خطأ في البحث: {error}</p>
                </div>
            )}

            {/* Search Results */}
            {searchResults && !loading && (
                <div>
                    {/* Results Summary */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between text-sm text-blue-800">
                            <div className="flex items-center gap-1">
                                <IoCalendarOutline />
                                <span>
                                    مرتب حسب: {sortBy === 'createdDate' ? 'تاريخ النشر' : 
                                             sortBy === 'updatedDate' ? 'تاريخ التحديث' : 'العنوان'}
                                    ({order === 'desc' ? 'تنازلي' : 'تصاعدي'})
                                </span>
                            </div>
                            <span>
                                عُثر على {searchResults.totalResults} نتيجة للبحث عن &ldquo;{searchResults.query}&rdquo;
                            </span>
                        </div>
                    </div>

                    {/* Articles Grid */}
                    {searchResults.articles.length > 0 ? (
                        <div className="space-y-4">
                            {searchResults.articles.map((article) => (
                                <div 
                                    key={article.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => handleArticleClick(article)}
                                >
                                    <ArticleCard
                                        article={article}
                                        variant="compact"
                                        showImage={true}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">لم يتم العثور على مقالات تطابق البحث</p>
                        </div>
                    )}

                    {/* Show More Results */}
                    {searchResults.totalResults > searchResults.returnedResults && (
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-500 mb-2">
                                عرض {searchResults.returnedResults} من أصل {searchResults.totalResults} نتيجة
                            </p>
                            <Link
                                href={`/search?q=${encodeURIComponent(searchResults.query)}&sortBy=${sortBy}&order=${order}`}
                                className="inline-block bg-primaryOther text-gray-700 px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                عرض جميع النتائج
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* No Query State */}
            {!query.trim() && !loading && (
                <div className="text-center py-8">
                    <IoSearch className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500">ابدأ بكتابة كلمات البحث للعثور على المقالات</p>
                </div>
            )}
        </div>
    );
};

export default ArticleSearch;