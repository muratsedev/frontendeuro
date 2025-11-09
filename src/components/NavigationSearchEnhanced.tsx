"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoSearch, IoClose } from "react-icons/io5";
import { useNavigationSearch } from "../hooks/useSearch";

const NavigationSearchEnhanced = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [searchEnabled, setSearchEnabled] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Use React Query for search
    const { 
        data: searchResponse, 
        isLoading, 
        error,
        isFetching 
    } = useNavigationSearch(query, searchEnabled);

    const searchResults = searchResponse?.articles || [];

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchEnabled(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchClick = () => {
        setIsOpen(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleArticleClick = (articleId: string) => {
        router.push(`/article/${articleId}`);
        setIsOpen(false);
        setSearchEnabled(false);
        setQuery('');
    };

    const handleViewAllResults = () => {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
        setSearchEnabled(false);
        setQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchEnabled(false);
        } else if (e.key === 'Enter' && query.trim()) {
            e.preventDefault();
            setSearchEnabled(true);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if (!e.target.value.trim()) {
            setSearchEnabled(false);
        }
    };

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
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="البحث في المقالات... (اضغط Enter)"
                            className="w-full p-3 pr-10 pl-10 text-right border-0 rounded-lg focus:ring-2 focus:ring-primaryOther focus:outline-none text-gray-700"
                            dir="rtl"
                        />
                        <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setSearchEnabled(false);
                                setQuery('');
                            }}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            aria-label="إغلاق البحث"
                        >
                            <IoClose className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Search Results Dropdown */}
                    {(searchEnabled || isLoading || isFetching) && (
                        <div className="border-t border-gray-200 max-h-80 overflow-y-auto">
                            {/* Loading State */}
                            {(isLoading || isFetching) && (
                                <div className="p-4 text-center">
                                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primaryOther"></div>
                                    <span className="mr-2 text-sm text-gray-600">جاري البحث...</span>
                                </div>
                            )}

                            {/* Error State */}
                            {error && !isLoading && (
                                <div className="p-4 text-center text-red-600 text-sm">
                                    خطأ في البحث: {error.message}
                                </div>
                            )}

                            {/* Results */}
                            {!isLoading && !error && searchResults.length > 0 && (
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
                                                {new Date(article.createdDate).toLocaleDateString('ar-SA')}
                                            </div>
                                        </button>
                                    ))}
                                    
                                    {/* View All Results */}
                                    <button
                                        onClick={handleViewAllResults}
                                        className="w-full p-3 text-center bg-primaryOther text-gray-700 hover:bg-opacity-90 transition-colors text-sm font-medium"
                                    >
                                        عرض جميع النتائج ({searchResponse?.totalResults || 0})
                                    </button>
                                </>
                            )}

                            {/* No Results */}
                            {!isLoading && !error && searchEnabled && searchResults.length === 0 && query.trim() && (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    لم يتم العثور على نتائج للبحث عن &ldquo;{query}&rdquo;
                                </div>
                            )}

                            {/* Instructions */}
                            {!searchEnabled && !isLoading && (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    اكتب كلمة البحث واضغط Enter
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NavigationSearchEnhanced;