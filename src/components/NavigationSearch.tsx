"use client";
import { useState, useEffect, useRef } from "react";
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

const NavigationSearch = () => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Handle click outside to close dropdown
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
        }
    }, [query]);

    const performSearch = async (searchQuery: string) => {
        try {
            setLoading(true);
            
            const searchParams = new URLSearchParams({
                query: searchQuery.trim(),
                sortBy: 'createdDate',
                order: 'desc',
                limit: '5' // Only show 5 results in navigation
            });

            const response = await fetch(`/api/search?${searchParams}`);
            
            if (response.ok) {
                const data: SearchResponse = await response.json();
                setSearchResults(data.articles || []);
                setShowResults(true);
            }
        } catch (error) {
            console.error('Navigation search error:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchClick = () => {
        setIsOpen(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleArticleClick = (articleId: string) => {
        router.push(`/article/${articleId}`);
        setIsOpen(false);
        setShowResults(false);
        setQuery('');
    };

    const handleViewAllResults = () => {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
        setShowResults(false);
        setQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setShowResults(false);
            setSearchResults([]);
        } else if (e.key === 'Enter' && query.trim()) {
            e.preventDefault();
            performSearch(query);
        }
    };

    return (
        <div ref={searchRef} className="relative">
            {/* Search Toggle Button (Mobile/Compact) */}
            {!isOpen && (
                <button
                    onClick={handleSearchClick}
                    className="p-2 text-gray-700 hover:text-primaryOther rounded transition-colors"
                    aria-label="البحث"
                >
                    <IoSearch className="w-5 h-5" />
                </button>
            )}

            {/* Expanded Search Input */}
            {isOpen && (
                <div className="absolute top-full left-0 z-50 bg-white rounded-lg shadow-lg border min-w-[300px] md:min-w-[400px]">
                    {/* Search Input */}
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="البحث في المقالات..."
                            className="w-full p-3 pr-10 pl-10 text-right text-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-primaryOther focus:outline-none"
                            dir="rtl"
                        />
                        <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <button
                            onClick={() => setIsOpen(false)}
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
                                        <button
                                            key={article.id}
                                            onClick={() => handleArticleClick(article.id)}
                                            className="w-full p-3 text-right hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                        >
                                            <div className="font-medium text-gray-900 line-clamp-2 text-sm">
                                                {article.articleTitle}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(article.createdDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                })}
                                            </div>
                                        </button>
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

export default NavigationSearch;