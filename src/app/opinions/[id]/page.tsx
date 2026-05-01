'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getImageSource } from '../../../app/lib/imageHelpers';

interface Opinion {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  imagePath: string | null;
  createdDate: string;
  updatedDate: string;
  isPublished: boolean;
  authorName: string | null;
  authorPicture: string | null;
  tagId: number | null;
  tagName: string | null;
}

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

export default function OpinionDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [opinion, setOpinion] = useState<Opinion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [copied, setCopied] = useState(false);
  const [showShareIcons, setShowShareIcons] = useState(false);
  const minFontSize = 12;
  const maxFontSize = 24;

  useEffect(() => {
    if (!id) return;
    const fetchOpinion = async () => {
      try {
        const res = await fetch(`/api/opinion/${id}`);
        if (!res.ok) throw new Error('not found');
        const data: Opinion = await res.json();
        setOpinion(data);
      } catch {
        setError('المقال غير موجود');
      } finally {
        setLoading(false);
      }
    };
    fetchOpinion();
  }, [id]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(opinion?.title ?? '')}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent((opinion?.title ?? '') + ' ' + shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(opinion?.title ?? '')}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }, [shareUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryOther" />
      </div>
    );
  }

  if (error || !opinion) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold mb-4">{error ?? 'حدث خطأ'}</p>
          <Link href="/opinions" className="bg-primaryOther text-white px-6 py-2 rounded-lg hover:opacity-90">
            العودة للمقالات
          </Link>
        </div>
      </div>
    );
  }

  const imgSrc = opinion.imagePath ? getImageSource(opinion.imagePath) : null;
  const authorPicSrc = opinion.authorPicture ? getImageSource(opinion.authorPicture) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primaryOther transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href="/opinions" className="hover:text-primaryOther transition-colors">المقالات</Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300 line-clamp-1 max-w-xs">{opinion.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content */}
          <main className="lg:col-span-8">
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Category badge */}
              <div className="px-4 pt-4 pb-2">
                <Link
                  href="/opinions"
                  className="inline-block bg-primaryOther text-white text-sm font-bold px-3 py-1 rounded hover:opacity-90 transition-opacity"
                >
                  مقالات رأي
                </Link>
              </div>

              {/* Cover image */}
              {imgSrc && (
                <div className="relative w-full h-64 md:h-96">
                  <Image
                    src={imgSrc}
                    alt={opinion.title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>
              )}

              {/* Mobile share row */}
              <div className="lg:hidden border-b border-gray-200 px-4 py-3">
                <div className="flex justify-center items-center gap-3">
                  <button onClick={() => handleShare('facebook')} className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1877F2] hover:bg-[#0d65d9] text-white transition-colors" aria-label="فيسبوك">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </button>
                  <button onClick={() => handleShare('twitter')} className="w-9 h-9 flex items-center justify-center rounded-lg bg-black hover:bg-gray-800 text-white transition-colors" aria-label="تويتر">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </button>
                  <button onClick={() => handleShare('whatsapp')} className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#25D366] hover:bg-[#1da851] text-white transition-colors" aria-label="واتساب">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </button>
                  <button onClick={() => handleShare('telegram')} className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#229ED9] hover:bg-[#0088cc] text-white transition-colors" aria-label="تيليجرام">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  </button>
                  <div className="relative">
                    <button onClick={handleCopyLink} className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-colors" aria-label="نسخ الرابط">
                      {copied ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      )}
                    </button>
                    {copied && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">تم النسخ!</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Font size controls */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">حجم الخط:</span>
                    <button
                      onClick={() => setFontSize(f => Math.max(minFontSize, f - 2))}
                      disabled={fontSize <= minFontSize}
                      className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="text-sm font-bold">ع</span>
                    </button>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-12 text-center">{fontSize}px</span>
                    <button
                      onClick={() => setFontSize(f => Math.min(maxFontSize, f + 2))}
                      disabled={fontSize >= maxFontSize}
                      className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="text-lg font-bold">ع</span>
                    </button>
                  </div>
                  {/* Desktop share button */}
                  <div className="hidden lg:flex relative items-center">
                    <button
                      onClick={() => setShowShareIcons(s => !s)}
                      className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primaryOther transition-colors"
                    >
                      <span className="text-sm font-medium">شارك</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.06c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.56 9.31 6.88 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.88 0 1.56-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
                    </button>
                    {showShareIcons && (
                      <div className="absolute right-full top-0 flex items-center gap-2 mr-3 bg-white dark:bg-gray-700 shadow-lg rounded-lg px-3 py-2 border border-gray-200">
                        <button onClick={() => handleShare('facebook')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1877F2] hover:bg-[#0d65d9] text-white transition-colors" aria-label="فيسبوك"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></button>
                        <button onClick={() => handleShare('twitter')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-black hover:bg-gray-800 text-white transition-colors" aria-label="تويتر"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></button>
                        <button onClick={() => handleShare('whatsapp')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#25D366] hover:bg-[#1da851] text-white transition-colors" aria-label="واتساب"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></button>
                        <button onClick={() => handleShare('telegram')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#229ED9] hover:bg-[#0088cc] text-white transition-colors" aria-label="تيليجرام"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></button>
                        <div className="relative">
                          <button onClick={handleCopyLink} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-colors" aria-label="نسخ الرابط">
                            {copied ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            )}
                          </button>
                          {copied && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">تم النسخ!</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                  {opinion.title}
                </h1>

                {/* Author + date */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    {authorPicSrc ? (
                      <Image src={authorPicSrc} alt={opinion.authorName ?? 'كاتب'} width={48} height={48} className="object-cover w-full h-full" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primaryOther/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primaryOther/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    {opinion.authorName && (
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        بقلم: {opinion.authorName}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {formatDate(opinion.updatedDate || opinion.createdDate)}
                    </p>
                  </div>
                </div>

                {/* Summary */}
                {opinion.summary && (
                  <p
                    className="text-gray-600 dark:text-gray-300 font-normal leading-relaxed mb-6 border-r-4 border-primaryOther pr-4 bg-gray-50 dark:bg-gray-700/30 py-3 rounded-l"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {opinion.summary}
                  </p>
                )}

                {/* Body content */}
                {opinion.content && (
                  <div
                    className="prose max-w-none text-gray-800 dark:text-gray-200 leading-relaxed article-content"
                    style={{ fontSize: `${fontSize}px`, fontWeight: 400 }}
                    dangerouslySetInnerHTML={{ __html: opinion.content }}
                  />
                )}

                {/* Tag */}
                {!!opinion.tagId && !!opinion.tagName && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href={`/tag/${opinion.tagName}`}
                      className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full hover:bg-primaryOther hover:text-white transition-colors"
                    >
                      # {opinion.tagName}
                    </Link>
                  </div>
                )}
              </div>
            </article>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center mb-4">
                <h2 className="text-base font-bold text-primaryOther">المزيد من المقالات</h2>
                <div className="flex-1 h-0.5 mx-3 bg-primaryOther rounded-sm" />
              </div>
              <MoreOpinions currentId={opinion.id} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ── Sidebar: more opinions ─────────────────────────────── */
function MoreOpinions({ currentId }: { currentId: string }) {
  const [opinions, setOpinions] = useState<Opinion[]>([]);

  useEffect(() => {
    fetch(`/api/opinion-list`)
      .then(r => r.json())
      .then((data: Opinion[]) => setOpinions(data.filter(o => o.id !== currentId).slice(0, 6)))
      .catch(() => { /* silent */ });
  }, [currentId]);

  if (opinions.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {opinions.map(op => (
        <Link
          key={op.id}
          href={`/opinions/${op.id}`}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
          dir="rtl"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
            {op.authorPicture ? (
              <Image src={getImageSource(op.authorPicture)} alt={op.authorName ?? ''} width={40} height={40} className="object-cover w-full h-full" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primaryOther/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primaryOther/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-primaryOther transition-colors">
              {op.title}
            </p>
            {op.authorName && (
              <span className="text-xs text-gray-400 mt-0.5">{op.authorName}</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
