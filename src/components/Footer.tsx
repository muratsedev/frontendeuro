"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type CategoryLink = {
  id: number;
  name: string;
  categorySlug: string;
  isActivated: boolean;
  href: string;
};

function Footer() {
  const [categories, setCategories] = useState<CategoryLink[]>([]);
  const [loading, setLoading] = useState(true);

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
        const categoryLinks = data.filter((link: CategoryLink) => 
          link.id !== 0 && link.id !== 998 && link.id !== 999
        );
        
        setCategories(categoryLinks);
      } catch (error) {
        console.error("Failed to fetch footer categories", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Split categories into two columns for better layout

  return (
    // <footer className="text-white">
    <footer className="text-gray-600 mt-5">
      <div className="container mx-auto px-4 flex flex-col-reverse divide-y-4 divide-y-reverse divide-gray-200">
        <div></div>
        <div></div>
      </div>
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
              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mt-6">
                {/* First Row */}
                <Link
                  href="#"
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all hover:scale-110"
                  title="فيسبوك"
                >
                  <Image
                    src={"/sm/X.png"}
                    alt="فيسبوك"
                    width={32}
                    height={32}
                  />
                </Link>
                <Link
                  href="#"
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all hover:scale-110"
                  title="فيسبوك"
                >
                  <Image
                    src={"/sm/Facebook.png"}
                    alt="فيسبوك"
                    width={32}
                    height={32}
                  />
                </Link>
                <Link
                  href="#"
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all hover:scale-110"
                  title="يوتيوب"
                >
                  <Image
                    src={"/sm/Youtube.png"}
                    alt="يوتيوب"
                    width={32}
                    height={32}
                  />
                </Link>

                {/* Second Row */}
                <Link
                  href="#"
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all hover:scale-110"
                  title="واتساب"
                >
                  <Image
                    src={"/sm/WhatsApp.png"}
                    alt="واتساب"
                    width={32}
                    height={32}
                  />
                </Link>
                <Link
                  href="#"
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all hover:scale-110"
                  title="تيليغرام"
                >
                  <Image
                    src={"/sm/Telegram.png"}
                    alt="تيليغرام"
                    width={32}
                    height={32}
                  />
                </Link>
                <Link
                  href="#"
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all hover:scale-110"
                  title="إنستغرام"
                >
                  <Image
                    src={"/sm/Instegram.png"}
                    alt="إنستغرام"
                    width={32}
                    height={32}
                  />
                </Link>
              </div>
              {/* Logo and Description Section - 3 columns on desktop */}
              <div className="md:col-span-3 text-center md:text-center">
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
                    className="hover:opacity-90 transition-opacity mt-10"
                  />
                </Link>
                <p>الشبكة الأوروبية للأنباء</p>
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
