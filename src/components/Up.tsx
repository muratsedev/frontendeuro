'use client'
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { IoMdTime } from "react-icons/io";
import { useCurrentDate } from "../hooks/useDateFormatting";
import { BACKEND_API_URL } from "../app/lib/config";

type SocialMedia = {
  socialMediaId: number;
  iconName: string;
  link: string;
  imagePath: string;
  isActivated: boolean;
};

function Up() {
  const [isMounted, setIsMounted] = useState(false);
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
  const [socialMediaLoading, setSocialMediaLoading] = useState(true);
  
  const currentDate = useCurrentDate({
    format: 'arabic',
    showHijri: false,      // Only show Gregorian
    showGregorian: true,
    hijriFirst: false,
    separator: ''
  });

  useEffect(() => {
    setIsMounted(true);
    
    const fetchSocialMedias = async () => {
      try {
        setSocialMediaLoading(true);
        const response = await fetch(`${BACKEND_API_URL}/api/SocialMedia`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Up social media data fetched:', data);
        
        // Filter only activated social media
        const activeSocialMedias = data.filter((sm: SocialMedia) => sm.isActivated);
        setSocialMedias(activeSocialMedias);
      } catch (error) {
        console.error("Failed to fetch social media", error);
        setSocialMedias([]);
      } finally {
        setSocialMediaLoading(false);
      }
    };

    fetchSocialMedias();
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
              {socialMediaLoading ? (
                <div className="flex items-center gap-2 mt-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                </div>
              ) : socialMedias.length > 0 ? (
                <ul className="flex items-center gap-2 mt-3">
                  {socialMedias.map((sm) => (
                    <li key={sm.socialMediaId}>
                      <a
                        href={sm.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-75 transition-opacity"
                        title={sm.iconName}
                      >
                        <Image
                          src={`${BACKEND_API_URL}/${sm.imagePath}`}
                          alt={sm.iconName}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-contain"
                          unoptimized
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Up;
