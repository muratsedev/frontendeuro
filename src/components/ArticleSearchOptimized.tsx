"use client";
import { useState, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ArticleCard, { Article } from "./ArticleCard";
import { IoSearch, IoClose, IoCalendarOutline, IoFilterOutline, IoRefresh } from "react-icons/io5";
import { useSearch } from "../hooks/useSearch";

// Optimized SearchResult type - only essential fields
type SearchResult = {
    id: string;
    articleTitle: string;
    articleSummary: string;
    articleContent: string;
    imagePath: string;
    createdDate: string;
    updatedDate: string;
    categoryId: string;
};

interface ArticleSearchOptimizedProps {
    className?: string;
    initialQuery?: string;
    showFilters?: boolean;
    maxResults?: number;
}

// Memoized sort options to prevent recreation
const SORT_OPTIONS = [
    { value: 'createdDate', label: 'تاريخ النشر' },
    { value: 'updatedDate', label: 'تاريخ التحديث' },
    { value: 'title', label: 'العنوان' }
] as const;

const ORDER_OPTIONS = [
    { value: 'desc', label: 'الأحدث أولاً' },
    { value: 'asc', label: 'الأقدم أولاً' }
] as const;

// Memoized ArticleItem component to prevent unnecessary re-renders
const ArticleItem = memo(({ article, onArticleClick }: {
    article: SearchResult;
    onArticleClick: (article: Article) => void;
}) => {
    const convertedArticle = useMemo((): Article => ({
        ...article,
        categoryId: parseInt(article.categoryId, 10) || 0,
        isPublished: true
    }), [article]);

    const handleClick = useCallback(() => {
        onArticleClick(convertedArticle);
    }, [convertedArticle, onArticleClick]);

    return (
        <div 
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleClick}
        >
            <ArticleCard
                article={convertedArticle}
                variant="compact"
                showImage={true}
            />
        </div>
    );
});

ArticleItem.displayName = 'ArticleItem';

// Memoized filter section to prevent unnecessary re-renders
const FilterSection = memo(({ 
    showFilters, 
    showSearchFilters, 
    setShowSearchFilters, 
    sortBy, 
    setSortBy, 
    order, 
    setOrder 
}: {
    showFilters: boolean;
    showSearchFilters: boolean;
    setShowSearchFilters: (show: boolean) => void;
    sortBy: string;
    setSortBy: (sort: 'createdDate' | 'updatedDate' | 'title') => void;
    order: string;
    setOrder: (order: 'asc' | 'desc') => void;
}) => {
    const toggleFilters = useCallback(() => {
        setShowSearchFilters(!showSearchFilters);
    }, [showSearchFilters, setShowSearchFilters]);

    const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value as 'createdDate' | 'updatedDate' | 'title');
    }, [setSortBy]);

    const handleOrderChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setOrder(e.target.value as 'asc' | 'desc');
    }, [setOrder]);

    if (!showFilters) return null;

    return (
        <div className="mt-4">
            <button
                onClick={toggleFilters}
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                                ترتيب حسب:
                            </label>
                            <select
                                value={sortBy}
                                onChange={handleSortChange}
                                className="w-full p-2 border border-gray-300 rounded text-right"
                                dir="rtl"
                                aria-label="ترتيب حسب"
                            >
                                {SORT_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                                الترتيب:
                            </label>
                            <select
                                value={order}
                                onChange={handleOrderChange}
                                className="w-full p-2 border border-gray-300 rounded text-right"
                                dir="rtl"
                                aria-label="الترتيب"
                            >
                                {ORDER_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

FilterSection.displayName = 'FilterSection';

const ArticleSearchOptimized = ({ 
    className = '', 
    initialQuery = '',
    showFilters = true,
    maxResults = 20
}: ArticleSearchOptimizedProps) => {
    const [query, setQuery] = useState(initialQuery);
    const [sortBy, setSortBy] = useState<'createdDate' | 'updatedDate' | 'title'>('createdDate');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [showSearchFilters, setShowSearchFilters] = useState(false);
    const [searchEnabled, setSearchEnabled] = useState(false);
    const router = useRouter();

    // Memoized search params to prevent unnecessary API calls
    const searchParams = useMemo(() => ({
        query: query.trim(),
        sortBy,
        order,
        limit: maxResults
    }), [query, sortBy, order, maxResults]);

    // Use React Query for search with enhanced features
    const { 
        data: searchResults, 
        isLoading, 
        error, 
        refetch,
        isFetching,
        isStale
    } = useSearch(searchParams, searchEnabled && !!query.trim());

    // Memoized handlers to prevent unnecessary re-renders
    const handleSearch = useCallback(() => {
        if (query.trim()) {
            setSearchEnabled(true);
        }
    }, [query]);

    const handleClearSearch = useCallback(() => {
        setQuery('');
        setSearchEnabled(false);
    }, []);

    const handleArticleClick = useCallback((article: Article) => {
        router.push(`/article/${article.id}`);
    }, [router]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query.trim()) {
            e.preventDefault();
            handleSearch();
        }
    }, [query, handleSearch]);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    // Memoized sort label to prevent recalculation
    const sortLabel = useMemo(() => {
        const sortOption = SORT_OPTIONS.find(opt => opt.value === sortBy);
        const orderOption = ORDER_OPTIONS.find(opt => opt.value === order);
        return `${sortOption?.label} (${orderOption?.label})`;
    }, [sortBy, order]);

    // Memoized search URL to prevent recreation
    const searchUrl = useMemo(() => {
        if (!searchResults?.query) return '';
        return `/search?q=${encodeURIComponent(searchResults.query)}&sortBy=${sortBy}&order=${order}`;
    }, [searchResults?.query, sortBy, order]);

    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
            {/* Search Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-right text-gray-800">
                        🔍 البحث في المقالات
                    </h2>
                    {(searchResults || error) && (
                        <button
                            onClick={handleRefresh}
                            disabled={isFetching}
                            className="p-2 text-gray-500 hover:text-primaryOther transition-colors disabled:opacity-50"
                            aria-label="تحديث النتائج"
                        >
                            <IoRefresh className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                </div>
                
                {/* Search Input */}
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={handleQueryChange}
                        onKeyDown={handleKeyDown}
                        placeholder="ابحث في عناوين المقالات والمحتوى... (اضغط Enter)"
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

                {/* Search Button */}
                <div className="mt-3 text-center">
                    <button
                        onClick={handleSearch}
                        disabled={!query.trim() || isLoading}
                        className="px-6 py-2 bg-primaryOther text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'جاري البحث...' : 'بحث'}
                    </button>
                </div>

                {/* Search Filters */}
                <FilterSection
                    showFilters={showFilters}
                    showSearchFilters={showSearchFilters}
                    setShowSearchFilters={setShowSearchFilters}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    order={order}
                    setOrder={setOrder}
                />
            </div>

            {/* Cache Status Indicator */}
            {isStale && searchResults && (
                <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 text-center">
                    ⚠️ النتائج قد تكون قديمة - اضغط على تحديث للحصول على أحدث النتائج
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOther"></div>
                    <p className="mt-2 text-gray-600">جاري البحث...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-600 text-right">❌ خطأ في البحث: {error.message}</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            )}

            {/* Search Results */}
            {searchResults && !isLoading && (
                <div>
                    {/* Results Summary */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between text-sm text-blue-800">
                            <div className="flex items-center gap-1">
                                <IoCalendarOutline />
                                <span>مرتب حسب: {sortLabel}</span>
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
                                <ArticleItem
                                    key={article.id}
                                    article={article}
                                    onArticleClick={handleArticleClick}
                                />
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
                                href={searchUrl}
                                className="inline-block bg-primaryOther text-gray-700 px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                عرض جميع النتائج
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* No Query State */}
            {!query.trim() && !isLoading && !searchResults && (
                <div className="text-center py-8">
                    <IoSearch className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500">ابدأ بكتابة كلمات البحث واضغط Enter أو زر البحث</p>
                </div>
            )}
        </div>
    );
};

export default ArticleSearchOptimized;