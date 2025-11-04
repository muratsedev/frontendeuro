'use client'
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { IoMdTime } from "react-icons/io";
import { useCurrentDate } from "../hooks/useDateFormatting";

function Up() {
  const [isMounted, setIsMounted] = useState(false);
  
  const currentDate = useCurrentDate({
    format: 'arabic',
    showHijri: false,      // Only show Gregorian
    showGregorian: true,
    hijriFirst: false,
    separator: ''
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-2">
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Left Section - Arabic Text (was on right) */}
        <div className="flex flex-col items-start text-left md:items-start justify-center md:justify-start col-span-3 md:col-span-1">
          <a
            href="#"
            title="الصفحة الرئيسية - الأوروبية"
            className="hover:opacity-90 transition-opacity mx-auto md:mx-0"
          >
            <Image
              src={"/brand.png"}
              alt="شعار جريدة الأوروبية"
              width={140}
              height={140}
              className="max-w-full h-auto"
            />
          </a>
        </div>

        {/* Center Section - Logo */}
        <div className="hidden md:flex justify-center items-center">
          {/* <a
            href="#"
            title="الصفحة الرئيسية - الأوروبية"
            className="hover:opacity-90 transition-opacity"
          >
            <Image
              src={"/brand.png"}
              alt="شعار جريدة الأوروبية"
              width={140}
              height={140}
              className="max-w-full h-auto"
            />
          </a> */}
        </div>

        {/* Right Section - Date and Social Media (was on left) */}
        {isMounted && (
          <div className="hidden md:flex flex-col items-end space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-lg font-medium">{currentDate}</span>
              <IoMdTime className="text-lg" />
            </div>
            <div>
              <ul className="flex items-center gap-2 mt-3">
                <li>
                  <a
                    href="#"
                    className="hover:opacity-75 transition-opacity"
                    title="فيسبوك"
                  >
                    <Image
                      src={"/sm/Facebook.png"}
                      alt="فيسبوك"
                      width={40}
                      height={40}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:opacity-75 transition-opacity"
                    title="فيسبوك"
                  >
                    <Image
                      src={"/sm/X.png"}
                      alt="تويتر"
                      width={40}
                      height={40}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:opacity-75 transition-opacity"
                    title="واتساب"
                  >
                    <Image
                      src={"/sm/WhatsApp.png"}
                      alt="واتساب"
                      width={40}
                      height={40}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:opacity-75 transition-opacity"
                    title="يوتيوب"
                  >
                    <Image
                      src={"/sm/Youtube.png"}
                      alt="يوتيوب"
                      width={40}
                      height={40}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:opacity-75 transition-opacity"
                    title="إنستغرام"
                  >
                    <Image
                      src={"/sm/Instegram.png"}
                      alt="إنستغرام"
                      width={40}
                      height={40}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:opacity-75 transition-opacity"
                    title="تيليغرام"
                  >
                    <Image
                      src={"/sm/Telegram.png"}
                      alt="تيليغرام"
                      width={40}
                      height={40}
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Up;
