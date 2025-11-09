"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/navigation');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Navigation data fetched:', data);
        setLinks(data);
      } catch (error) {
        console.error("Failed to fetch navigation links", error);
        
        // Fallback to static links if API fails
        const fallbackLinks = [
          { id: 0, name: "Logo", categorySlug: "home", isActivated: true, href: "/" },
          // { id: 998, name: "عنا", categorySlug: "about", isActivated: true, href: "/about" },
          // { id: 999, name: "اتصل بنا", categorySlug: "contact", isActivated: true, href: "/contact" }
        ];
        setLinks(fallbackLinks);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav ref={navRef} className="container mx-auto bg-primaryOther font-bold text-white">
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3">
        <button
          onClick={toggleMenu}
          className="text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded p-2"
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
        <Link href="/" className="flex items-center" onClick={closeMenu}>
          <Image 
            src="/img/logo-small-right.png" 
            alt="الرئيسية" 
            width={20} 
            height={8} 
            className="h-auto"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className={`
        flex-wrap gap-1 px-2 py-1
        lg:flex lg:mt-1
        ${isMenuOpen ? 'flex flex-col' : 'hidden lg:flex'}
      `}>
        {loading ? (
          <li className="px-2 py-1">جاري التحميل...</li>
        ) : (
          links
            .filter((link) => link && link.href) // Filter out null/undefined links and links without href
            .map((link) => (
            <li key={link.id} className="relative group">
              <Link 
                href={link.href} 
                className="px-2 py-1 hover:bg-opacity-80 rounded transition-colors inline-block w-full lg:w-auto text-right lg:text-center"
                onClick={closeMenu}
              >
                {link.categorySlug === 'home' ? (
                  <Image 
                    src="/img/logo-small-right.png" 
                    alt="الرئيسية" 
                    width={20} 
                    height={8} 
                    className="h-auto m-0 p-0 hidden lg:block leading-none"
                  />
                ) : (
                  link.name
                )}
              </Link>
            </li>
          ))
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
