"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BACKEND_API_URL } from "../app/lib/config";

type SocialMedia = {
  socialMediaId: number;
  iconName: string;
  link: string;
  imagePath: string;
  isActivated: boolean;
};

interface SocialMediaIconsProps {
  className?: string;
  iconSize?: number;
  columns?: number;
  showTitle?: boolean;
}

export default function SocialMediaIcons({ 
  className = "", 
  iconSize = 32,
  columns = 3,
  showTitle = false
}: SocialMediaIconsProps) {
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialMedias = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_API_URL}/api/SocialMedia`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Social media icons data fetched:', data);
        
        // Filter only activated social media
        const activeSocialMedias = data.filter((sm: SocialMedia) => sm.isActivated);
        setSocialMedias(activeSocialMedias);
      } catch (error) {
        console.error("Failed to fetch social media icons", error);
        setSocialMedias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialMedias();
  }, []);

  if (loading) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mx-auto"></div>
      </div>
    );
  }

  if (socialMedias.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {showTitle && (
        <h3 className="font-bold text-lg mb-3 text-center">
          تابعنا على
        </h3>
      )}
      <div 
        className={`grid gap-2 mx-auto max-w-fit grid-cols-${columns}`}
      >
        {socialMedias.map((sm) => (
          <Link
            key={sm.socialMediaId}
            href={sm.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all hover:scale-110 flex items-center justify-center"
            title={sm.iconName}
          >
            <Image
              src={sm.imagePath?.startsWith('http') ? sm.imagePath : `${BACKEND_API_URL}/${sm.imagePath}`}
              alt={sm.iconName}
              width={iconSize}
              height={iconSize}
              className="object-contain w-auto h-auto"
              unoptimized
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
