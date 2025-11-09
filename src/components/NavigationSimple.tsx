"use client";
import Link from "next/link";
import Image from "next/image";

const NavigationSimple = () => {
  // Simple static navigation for testing
  const staticLinks = [
    { id: 0, name: "Logo", categorySlug: "home", href: "/" },
    { id: 1, name: "الرئيسية", categorySlug: "home", href: "/" },
    { id: 2, name: "اقتصاد", categorySlug: "economy", href: "/economy" },
    { id: 3, name: "سياسة", categorySlug: "politics", href: "/politics" },
    { id: 4, name: "رياضة", categorySlug: "sports", href: "/sports" },
  ];

  return (
    <nav className="container mx-auto bg-primaryOther font-bold text-white">
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center px-4 py-3">
        <Link href="/" className="flex items-center">
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
      <ul className="flex flex-wrap gap-1 px-2 py-1">
        {staticLinks.map((link) => (
          <li key={link.id} className="relative">
            <Link 
              href={link.href} 
              className="px-2 py-1 hover:bg-opacity-80 rounded transition-colors inline-block text-center"
            >
              {link.categorySlug === 'home' && link.id === 0 ? (
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
        ))}
      </ul>
    </nav>
  );
};

export default NavigationSimple;