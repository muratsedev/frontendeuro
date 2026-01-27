'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AllArticles } from '../app/types/Articles';
import { articlesApi } from '../app/lib/api';
import { getImageSource } from '../app/lib/imageHelpers';

interface PodcastInfo {
  id: number;
  name: string;
  imagePath: string;
  latestDate: string;
}

interface PodcastSectionProps {
  limit?: number;
}

const PodcastSection: React.FC<PodcastSectionProps> = ({ limit = 4 }) => {
  const [articles, setArticles] = useState<AllArticles[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const all = await articlesApi.getAll();
        setArticles(all.filter(a => a.isPublished && a.podcastTypeId && a.podcastTypeId > 0));
      } catch (e: any) {
        console.error('Error loading podcasts', e);
        setError('تعذر تحميل بودكاست');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const podcasts: PodcastInfo[] = useMemo(() => {
    if (!articles.length) return [];

    const map = new Map<number, PodcastInfo>();
    for (const a of articles) {
      const id = a.podcastTypeId;
      if (!id) continue;
      const existing = map.get(id);
      const created = new Date(a.createdDate).toISOString();
      if (!existing) {
        map.set(id, {
          id,
          name: a.podcastName || 'بودكاست',
          imagePath: a.imagePath,
          latestDate: created,
        });
      } else {
        // keep the most recent image/title
        if (created > existing.latestDate) {
          existing.imagePath = a.imagePath;
          existing.latestDate = created;
          existing.name = a.podcastName || existing.name;
        }
      }
    }

    return Array.from(map.values())
      .sort((a, b) => (a.latestDate < b.latestDate ? 1 : -1))
      .slice(0, limit);
  }, [articles, limit]);

  if (loading || error || podcasts.length === 0) return null;

  return (
    <div className="w-full mb-6">
      {/* Title */}
      <div className="flex items-center mb-3">
        <div className="text-primaryOther">
          <p className="text-base md:text-lg font-semibold">بودكاست</p>
        </div>
        <div className="flex-1 h-1 mx-2 md:mx-3 bg-primaryOther border-0 rounded-sm"></div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {podcasts.map((p) => (
          <Link key={p.id} href={`/podcast/${p.id}`} className="block">
            <div className="group cursor-pointer">
              <div className="relative w-full h-40 md:h-44 rounded-lg overflow-hidden bg-gray-200">
                {/* Use Next/Image for optimization; imageHelpers normalizes URLs */}
                <Image
                  src={getImageSource(p.imagePath)}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                  loader={({ src }) => src}
                  unoptimized
                />
                {/* Simple speaker icon on hover (optional) */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm md:text-base font-semibold text-slate-800 line-clamp-2">{p.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PodcastSection;
