"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import NavigationSearch from "./NavigationSearch";

type NavigationLink = {
  id: number;
  name: string;
  categorySlug: string;
  isActivated: boolean;
  href: string;
};

const Navigation = () => {
  const [links, setLinks] = useState<NavigationLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching navigation links from backend API...');
      
      const response = await fetch('/api/navigation');
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if response contains an error (backend API failed)
      if (data.error && !data.fallback) {
        throw new Error(`Backend API error: ${data.details}`);
      }
      
      // Handle fallback response format
      const navigationLinks = data.links || data;
      
      if (data.fallback) {
        console.log('Using fallback navigation due to backend issues:', data.error);
        setError(`Backend unavailable: ${data.error}`);
        setUsingFallback(true);
      } else {
        console.log('Navigation data fetched successfully from backend:', navigationLinks);
        setUsingFallback(false);
      }
      
      setLinks(navigationLinks);
      
    } catch (error) {
      console.error("Failed to fetch navigation links from backend", error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setUsingFallback(false);
      
      // Only use fallback if backend is completely unavailable
      const fallbackLinks = [
        { id: 0, name: "Logo", categorySlug: "home", isActivated: true, href: "/" },
      ];
      console.log('Using minimal fallback - backend connection failed');
      setLinks(fallbackLinks);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav ref={navRef} className="w-full bg-white border-t-2 border-b-2 border-primaryOther text-base" dir="rtl">
      {/* Fallback indicator */}
      {usingFallback && (
        <div className="bg-yellow-600 text-yellow-100 text-xs px-2 py-1 text-center">
          ⚠️ استخدام القوائم المحلية - الخادم غير متاح
        </div>
      )}

      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-1">
        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center justify-end py-2">
          <div className="flex items-center gap-2">
            <NavigationSearch />
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none rounded p-1"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className={`
          flex-wrap gap-0
          lg:flex lg:items-center
          ${isMenuOpen ? 'flex flex-col' : 'hidden lg:flex'}
        `}>
          {loading ? (
            <li className="px-2 py-1">جاري تحميل القوائم من الخادم...</li>
          ) : error ? (
            <li className="px-2 py-1 text-red-300 flex items-center gap-2">
              <span>فشل في تحميل القوائم من الخادم</span>
              <button
                onClick={fetchLinks}
                className="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
              >
                إعادة المحاولة
              </button>
            </li>
          ) : (
            <>
              {links
                .filter((link) => link && link.href && link.categorySlug !== 'home')
                .map((link) => {
                  return (
                    <li key={link.id} className="relative group">
                      <Link
                        href={link.href}
                        className="px-3 py-2 text-gray-700 hover:text-primaryOther transition-colors inline-block w-full lg:w-auto text-right lg:text-center whitespace-nowrap"
                        onClick={closeMenu}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}

              {/* Desktop Search - Only visible on large screens */}
              <li className="hidden lg:block ms-auto">
                <NavigationSearch />
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
