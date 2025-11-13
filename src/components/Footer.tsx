"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BACKEND_API_URL } from "../app/lib/config";

type CategoryLink = {
  id: number;
  name: string;
  categorySlug: string;
  isActivated: boolean;
  href: string;
  isShowInFooter?: boolean;
};

type SocialMedia = {
  socialMediaId: number;
  iconName: string;
  link: string;
  imagePath: string;
  isActivated: boolean;
};

function Footer() {
  const [categories, setCategories] = useState<CategoryLink[]>([]);
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [socialMediaLoading, setSocialMediaLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/navigation');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Footer categories data fetched:', data);

        // Filter out non-category links (home, about, contact)
        // and only include categories that are marked to show in footer.
        const categoryLinks = (data || []).filter((link: unknown) => {
          if (!link) return false;
          const linkObj = link as Record<string, unknown>;
          const id = linkObj.id as number | undefined;
          if (id === 0 || id === 998 || id === 999) return false;
          // Check normalized property or PascalCase from backend
          const showInFooter = (linkObj.isShowInFooter ?? linkObj.IsShowInFooter) === true;
          return showInFooter;
        });

        setCategories(categoryLinks);
      } catch (error) {
        console.error("Failed to fetch footer categories", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchSocialMedias = async () => {
      try {
        setSocialMediaLoading(true);
        const response = await fetch(`${BACKEND_API_URL}/api/SocialMedia`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Footer social media data fetched:', data);

        // Normalize keys from backend (PascalCase) to frontend camelCase
        const normalized = (data || []).map((sm: unknown) => {
          const smObj = sm as Record<string, unknown>;
          return {
            socialMediaId: (smObj.socialMediaId ?? smObj.SocialMediaId) as number,
            iconName: (smObj.iconName ?? smObj.IconName) as string,
            link: (smObj.link ?? smObj.Link) as string,
            imagePath: (smObj.imagePath ?? smObj.ImagePath) as string,
            isActivated: (smObj.isActivated ?? smObj.IsActivated ?? false) as boolean,
          } as SocialMedia;
        });

        // Filter only activated social media
        const activeSocialMedias = normalized.filter((sm: SocialMedia) => sm.isActivated === true);
        setSocialMedias(activeSocialMedias);
      } catch (error) {
        console.error("Failed to fetch social media", error);
        setSocialMedias([]);
      } finally {
        setSocialMediaLoading(false);
      }
    };

    fetchCategories();
    fetchSocialMedias();
  }, []);

  return (
    // <footer className="text-white">
    <footer className="text-gray-600 mt-5">
      {/* Green Background Section with Container */}
      {/* <div className="bg-primaryOther container mx-auto px-4"> */}
      <div className="container mx-auto px-4">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div
            className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10 md:py-12"
            dir="rtl"
          >
            {/* Categories Section - 4 columns on desktop */}
            <div className="md:col-span-4 text-center md:text-right">
              <h3 className="font-bold text-xl mb-4 border-b-2 border-white/20 pb-2 inline-block">
                الأقسام
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/articles"
                    className="hover:underline transition-all text-sm md:text-base flex items-center justify-center md:justify-start gap-2"
                  >
                    <span>كل الأخبار</span>
                  </Link>
                </li>
                {loading ? (
                  <li className="text-gray-300 text-sm">جاري التحميل...</li>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={category.href}
                        className="hover:underline transition-all text-sm md:text-base flex items-center justify-center md:justify-start gap-2"
                      >
                        <span>{category.name}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-300 text-sm">لا توجد أقسام متاحة</li>
                )}
              </ul>
            </div>

            {/* Important Links Section - 4 columns on desktop */}
            <div className="md:col-span-4 text-center md:text-center">
              <h3 className="font-bold text-xl mb-4 border-b-2 border-white/20 pb-2 inline-block">
                روابط مهمة
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/about"
                    className="hover:underline transition-all text-sm md:text-base flex items-center justify-center gap-2"
                  >
                    <span>عن الأوروبية</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:underline transition-all text-sm md:text-base flex items-center justify-center gap-2"
                  >
                    <span>شروط الخدمة</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:underline transition-all text-sm md:text-base flex items-center justify-center gap-2"
                  >
                    <span>سياسة الخصوصية</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media Section - 4 columns on desktop */}
            <div className="md:col-span-4 text-center md:text-center">
              <h3 className="font-bold text-xl mb-4 border-b-2 border-white/20 pb-2 inline-block">
                تابع الأوروبية على
              </h3>
              {socialMediaLoading ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
                </div>
              ) : socialMedias.length > 0 ? (
                <div className="flex flex-row justify-center items-center gap-3 mt-2">
                  {socialMedias.map((sm: SocialMedia) => (
                    <Link
                      key={sm.socialMediaId}
                      href={sm.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-all hover:scale-110"
                      title={sm.iconName}
                    >
                      <Image
                        src={`${BACKEND_API_URL}/${sm.imagePath}`}
                        alt={sm.iconName}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain"
                        unoptimized
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm mt-4">لا توجد وسائل تواصل متاحة</p>
              )}
            </div>

            {/* Logo and Description Section - 12 columns on desktop (full width) */}
            <div className="md:col-span-12 text-center md:text-center border-t border-gray-200 pt-8 mt-4">
              <Link
                href="/"
                title="الصفحة الرئيسية - الأوروبية"
                className="inline-block mb-4"
              >
                <Image
                  src={"/brand.png"}
                  alt="شعار جريدة الأوروبية"
                  width={140}
                  height={140}
                  className="hover:opacity-90 transition-opacity"
                />
              </Link>
              <p className="mb-2">الشبكة الأوروبية للأنباء</p>
              <div className="text-center">
                <p className="text-sm md:text-base">
                  جميع الحقوق محفوظة &copy; {new Date().getFullYear()}{" "}
                  الأوروبية
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section - Full Width Orange Background */}
      {/* <div className="border-t border-white/20 py-4 bg-secondaryOther container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm md:text-base text-white">
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} الأوروبية
          </p>
        </div>
      </div> */}
    </footer>
  );
}

export default Footer;
