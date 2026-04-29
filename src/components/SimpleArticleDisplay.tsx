import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchImageAsBlob, getImageSource } from "../app/lib/imageHelpers";
import { AllArticles, AllCategories } from "../app/types/Articles";
import styles from "./SimpleArticleDisplay.module.css";

interface SimpleArticleDisplayProps {
  article: AllArticles;
  category: AllCategories;
  showImage?: boolean;
  showSummary?: boolean;
  showFullContent?: boolean;
  showTags?: boolean;
  showMetadata?: boolean;
  showCategoryBadge?: boolean;
  shareUrl?: string;
}

const SimpleArticleDisplay = ({
  article,
  category,
  showImage = true,
  showSummary = true,
  showFullContent = true,
  showTags = true,
  showMetadata = true,
  showCategoryBadge = true,
  shareUrl = ''
}: SimpleArticleDisplayProps) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isBlob, setIsBlob] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Default font size in pixels
  const [showShareIcons, setShowShareIcons] = useState(false);
  const minFontSize = 12;
  const maxFontSize = 24;

  useEffect(() => {
    let objectUrl: string | null = null;
    
    const loadImage = async () => {
      if (!article.imagePath) return;
      
      // Try to fetch as blob first for better loading
      const blobUrl = await fetchImageAsBlob(article.imagePath);
      
      if (blobUrl) {
        objectUrl = blobUrl;
        setImgSrc(blobUrl);
        setIsBlob(true);
      } else {
        // Fallback to direct URL
        const directUrl = getImageSource(article.imagePath);
        setImgSrc(directUrl);
        setIsBlob(false);
      }
    };
    
    loadImage();
    
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [article.imagePath]);

  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.articleTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(article.articleTitle + ' ' + shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.articleTitle)}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden" dir="rtl">
      {/* Category Badge */}
      {showCategoryBadge && (
        <div className="px-4 pt-4 pb-2">
          <span className="inline-block bg-primaryOther text-white text-sm font-bold px-3 py-1 rounded">
            {category.name}
          </span>
        </div>
      )}

      {/* Article Image */}
      {showImage && imgSrc && (
        <div className="relative w-full h-64 md:h-96">
          <Image
            src={imgSrc}
            alt={article.articleTitle}
            fill
            className="object-cover"
            priority
            unoptimized={isBlob}
          />
        </div>
      )}

      {/* Mobile Social Share - Only visible on mobile, right below the image */}
      <div className="lg:hidden border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex justify-center items-center gap-3">
            {/* Facebook */}
            <button
              onClick={() => handleShare('facebook')}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1877F2] hover:bg-[#0d65d9] text-white transition-all duration-200"
              title="مشاركة على فيسبوك"
              aria-label="مشاركة على فيسبوك"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            {/* Twitter/X */}
            <button
              onClick={() => handleShare('twitter')}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#000000] hover:bg-[#1a1a1a] text-white transition-all duration-200"
              title="مشاركة على تويتر"
              aria-label="مشاركة على تويتر"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => handleShare('linkedin')}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white transition-all duration-200"
              title="مشاركة على لينكد إن"
              aria-label="مشاركة على لينكد إن"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#25D366] hover:bg-[#1da851] text-white transition-all duration-200"
              title="مشاركة على واتساب"
              aria-label="مشاركة على واتساب"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </button>

            {/* Telegram */}
            <button
              onClick={() => handleShare('telegram')}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#229ED9] hover:bg-[#0088cc] text-white transition-all duration-200"
              title="مشاركة على تيليجرام"
              aria-label="مشاركة على تيليجرام"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </button>

            {/* Copy Link */}
            <div className="relative">
              <button
                onClick={handleCopyLink}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200"
                title="نسخ الرابط"
                aria-label="نسخ الرابط"
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              {copied && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  تم النسخ!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-6">
        {/* Font Size Controls */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">حجم الخط:</span>
            <button
              onClick={() => setFontSize(Math.max(minFontSize, fontSize - 2))}
              disabled={fontSize <= minFontSize}
              className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="تصغير الخط"
              aria-label="تصغير الخط"
            >
              <span className="text-sm font-bold">ع</span>
            </button>
            
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-12 text-center">
              {fontSize}px
            </span>
            
            <button
              onClick={() => setFontSize(Math.min(maxFontSize, fontSize + 2))}
              disabled={fontSize >= maxFontSize}
              className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="تكبير الخط"
              aria-label="تكبير الخط"
            >
              <span className="text-lg font-bold">ع</span>
            </button>
          </div>
        </div>

        {/* Metadata */}
        {showMetadata && (
          <div className="text-sm text-gray-500 mb-4 flex items-center gap-4">
            <span>تاريخ النشر: {formatDate(article.createdDate)}</span>
            {article.updatedDate !== article.createdDate && (
              <span>آخر تحديث: {formatDate(article.updatedDate)}</span>
            )}
          </div>
        )}

        {/* Share Button with Icons */}
        <div className="relative inline-flex items-center">
          {/* Share Button */}
          <button
            onClick={() => setShowShareIcons(!showShareIcons)}
            className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="شارك"
            aria-label="شارك"
          >
            <span className="text-sm font-medium">شارك</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.06c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.56 9.31 6.88 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.88 0 1.56-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
            </svg>
          </button>

          {/* Share Icons Toggle - Beside share button with fade and slide-left animation */}
          {showShareIcons && (
            <div 
              className={`absolute right-0 top-full mt-2 flex justify-center items-center gap-3 ${styles['animate-fade-slide-left']} ${styles['share-icons-container']}`}
              data-font-size={fontSize}
            >
            {/* Facebook */}
            <button
              onClick={() => handleShare('facebook')}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1877F2] hover:bg-[#0d65d9] text-white transition-all duration-200"
              title="مشاركة على فيسبوك"
              aria-label="مشاركة على فيسبوك"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            {/* Twitter/X */}
            <button
              onClick={() => handleShare('twitter')}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#000000] hover:bg-[#1a1a1a] text-white transition-all duration-200"
              title="مشاركة على تويتر"
              aria-label="مشاركة على تويتر"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => handleShare('linkedin')}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white transition-all duration-200"
              title="مشاركة على لينكد إن"
              aria-label="مشاركة على لينكد إن"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#25D366] hover:bg-[#1da851] text-white transition-all duration-200"
              title="مشاركة على واتساب"
              aria-label="مشاركة على واتساب"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </button>

            {/* Telegram */}
            <button
              onClick={() => handleShare('telegram')}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#229ED9] hover:bg-[#0088cc] text-white transition-all duration-200"
              title="مشاركة على تيليجرام"
              aria-label="مشاركة على تيليجرام"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </button>

            {/* Copy Link */}
            <div className="relative">
              <button
                onClick={handleCopyLink}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200"
                title="نسخ الرابط"
                aria-label="نسخ الرابط"
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              {copied && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  تم النسخ!
                </div>
              )}
            </div>
          </div>
        )}
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {article.articleTitle}
        </h1>

        {/* Summary */}
        {showSummary && article.articleSummary && (
          <div 
            className={`text-lg text-gray-700 dark:text-gray-300 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-r-4 border-primaryOther ${styles['dynamic-font-size']}`}
            data-font-size={fontSize}
          >
            <p className="font-semibold">{article.articleSummary}</p>
          </div>
        )}

        {/* Full Content */}
        {showFullContent && (
          <div 
            className={`prose prose-lg max-w-none text-gray-800 dark:text-gray-100 dark:prose-invert leading-relaxed article-content ${styles['dynamic-content-font-size']}`}
            data-font-size={fontSize}
            dangerouslySetInnerHTML={{ __html: article.articleContent }}
          />
        )}

        {/* Tags placeholder */}
        {showTags && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {article.tagId && article.tagName && (
                <Link href={`/tag/${article.tagId}`}>
                  <span className="inline-block bg-primaryOther/10 dark:bg-primaryOther/20 text-primaryOther dark:text-primaryOther px-3 py-1 rounded-full text-sm font-medium hover:bg-primaryOther/20 dark:hover:bg-primaryOther/30 transition-colors cursor-pointer">
                    {article.tagName}
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>


    </article>
  );
};

export default SimpleArticleDisplay;