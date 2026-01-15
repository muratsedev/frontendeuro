"use client";
import Link from "next/link";
import ArticlesList from "./ArticlesList";

interface NavigationDropdownProps {
  categoryId: number;
  categoryName: string;
  categoryHref: string;
  isOpen: boolean;
  onClose: () => void;
}

const NavigationDropdown = ({
  categoryId,
  categoryName,
  categoryHref,
  isOpen,
  onClose
}: NavigationDropdownProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-1 bg-white text-black shadow-lg rounded-lg z-50 min-w-64 max-w-80">
      <div className="p-2">
        <div className="font-bold text-sm text-gray-700 mb-2 px-2">
          آخر المقالات - {categoryName}
        </div>
        
        <ArticlesList
          categoryId={categoryId}
          limit={5}
          variant="dropdown"
          showImage={false}
          onArticleClick={onClose}
        />
        
        <Link
          href={categoryHref}
          className="block px-2 py-2 text-center text-sm text-blue-600 hover:bg-gray-100 rounded border-t mt-2"
          onClick={onClose}
        >
          عرض جميع المقالات
        </Link>
      </div>
    </div>
  );
};

export default NavigationDropdown;
