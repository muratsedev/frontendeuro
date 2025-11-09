"use client";
import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IoSearch, IoClose } from "react-icons/io5";

interface SearchResult {
    id: string;
    articleTitle: string;
    createdDate: string;
}

interface SearchResponse {
    query: string;
    totalResults: number;
    articles: SearchResult[];
}

// Memoized search result item to prevent unnecessary re-renders
const SearchResultItem = memo(({ 
    article, 
    onArticleClick 
}: { 
    article: SearchResult; 
    onArticleClick: (id: string) => void; 
}) => {
    const handleClick = useCallback(() => {
        onArticleClick(article.id);
    }, [article.id, onArticleClick]);

    const formattedDate = useMemo(() => {
        return new Date(article.createdDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }, [article.createdDate]);

    return (
        <button
            onClick={handleClick}
            className="w-full p-3 text-right hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
        >
            <div className="font-medium text-gray-900 line-clamp-2 text-sm">
                {article.articleTitle}
            </div>
            <div className="text-xs text-gray-500 mt-1">
                {formattedDate}
            </div>
        </button>
    );
});

SearchResultItem.displayName = 'SearchResultItem';

const NavigationSearchOptimized = () => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const router = useRouter();

    // Optimized click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Clear results when query changes
    useEffect(() => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowResults(false);
            // Cancel any ongoing request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        }
    }, [query]);

    // Optimized search function with abort controller
    const performSearch = useCallback(async (searchQuery: string) => {
        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        try {
            setLoading(true);
            
            const searchParams = new URLSearchParams({
                query: searchQuery.trim(),
                sortBy: 'createdDate',
                order: 'desc',
                limit: '5'
            });

            const response = await fetch(`/api/search?${searchParams}`, {
                signal: abortControllerRef.current.signal
            });
            
            if (response.ok) {
                const data: SearchResponse = await response.json();
                setSearchResults(data.articles || []);
                setShowResults(true);
            }
        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                console.error('Navigation search error:', error);
                setSearchResults([]);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Memoized handlers
    const handleSearchClick = useCallback(() => {
        setIsOpen(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    }, []);

    const handleArticleClick = useCallback((articleId: string) => {
        router.push(`/article/${articleId}`);
        setIsOpen(false);
        setShowResults(false);
        setQuery('');
    }, [router]);

    const handleViewAllResults = useCallback(() => {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
        setShowResults(false);
        setQuery('');
    }, [router, query]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setShowResults(false);
            setSearchResults([]);
        } else if (e.key === 'Enter' && query.trim()) {
            e.preventDefault();
            performSearch(query);
        }
    }, [query, performSearch]);

    const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return (
        <div ref={searchRef} className="relative">
            {/* Search Toggle Button */}
            {!isOpen && (
                <button
                    onClick={handleSearchClick}
                    className="p-2 text-white font-bold hover:bg-white hover:bg-opacity-20 hover:text-gray-100 rounded transition-colors"
                    aria-label="البحث"
                >
                    <IoSearch className="w-5 h-5" />
                </button>
            )}

            {/* Expanded Search Input */}
            {isOpen && (
                <div className="absolute top-0 right-0 z-50 bg-white rounded-lg shadow-lg border min-w-[300px] md:min-w-[400px]">
                    {/* Search Input */}
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={handleQueryChange}
                            onKeyDown={handleKeyDown}
                            placeholder="البحث في المقالات..."
                            className="w-full p-3 pr-10 pl-10 text-right text-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-primaryOther focus:outline-none"
                            dir="rtl"
                        />
                        <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <button
                            onClick={handleClose}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            aria-label="إغلاق البحث"
                        >
                            <IoClose className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Search Results Dropdown */}
                    {showResults && (
                        <div className="border-t border-gray-200 max-h-80 overflow-y-auto">
                            {loading && (
                                <div className="p-4 text-center">
                                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primaryOther"></div>
                                    <span className="mr-2 text-sm text-gray-600">جاري البحث...</span>
                                </div>
                            )}

                            {!loading && searchResults.length > 0 && (
                                <>
                                    {searchResults.map((article) => (
                                        <SearchResultItem
                                            key={article.id}
                                            article={article}
                                            onArticleClick={handleArticleClick}
                                        />
                                    ))}
                                    
                                    {/* View All Results */}
                                    <button
                                        onClick={handleViewAllResults}
                                        className="w-full p-3 text-center bg-primaryOther text-gray-700 hover:bg-opacity-90 transition-colors text-sm font-medium"
                                    >
                                        عرض جميع النتائج ({query})
                                    </button>
                                </>
                            )}

                            {!loading && searchResults.length === 0 && query.trim() && (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    لم يتم العثور على نتائج للبحث عن &ldquo;{query}&rdquo;
                                </div>
                            )}

                            {!loading && !query.trim() && (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    أدخل كلمات البحث للعثور على المقالات
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NavigationSearchOptimized;