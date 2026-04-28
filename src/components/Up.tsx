'use client'
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { IoMdTime } from "react-icons/io";
import { useCurrentDate } from "../hooks/useDateFormatting";
import { getImageSource } from "../app/lib/imageHelpers";

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
    const controller = new AbortController();
    
    const fetchSocialMedias = async () => {
      try {
        setSocialMediaLoading(true);
        const response = await fetch('/api/social-media', { signal: controller.signal });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Up social media data fetched:', data);

        const normalized = (data || []).map((sm: unknown) => {
          const social = sm as Record<string, unknown>;
          return {
            socialMediaId: (social.socialMediaId ?? social.SocialMediaId) as number,
            iconName: (social.iconName ?? social.IconName) as string,
            link: (social.link ?? social.Link) as string,
            imagePath: (social.imagePath ?? social.ImagePath) as string,
            isActivated: (social.isActivated ?? social.IsActivated ?? false) as boolean,
          } as SocialMedia;
        });
        
        // Filter only activated social media
        const activeSocialMedias = normalized.filter((sm: SocialMedia) => sm.isActivated && !!sm.imagePath);
        setSocialMedias(activeSocialMedias);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // silently ignore — component unmounted
        } else {
          console.error("Failed to fetch social media", error);
        }
        setSocialMedias([]);
      } finally {
        setSocialMediaLoading(false);
      }
    };

    fetchSocialMedias();
    return () => { controller.abort(); };
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-2">
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Left Section - Arabic Text (was on right) */}
        <div className="flex flex-col items-start text-left md:items-start justify-center md:justify-start col-span-3 md:col-span-1">
          <Link
            href="/"
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
          </Link>
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
                          src={getImageSource(sm.imagePath)}
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
