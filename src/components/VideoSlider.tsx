'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { videosApi } from '../app/lib/api';
import { Video } from '../app/types/Articles';

type VideoSliderProps = {
  embedded?: boolean;
};

const CARD_WIDTH = 220; // px — matches lg:w-[220px]
const GAP = 12;         // px — gap-3
const STEP = CARD_WIDTH + GAP;

const VideoSlider: React.FC<VideoSliderProps> = ({ embedded = false }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);           // current CSS translateX (negative = moved left)
  const [transitioning, setTransitioning] = useState(false);
  const isAnimating = useRef(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosData = await videosApi.getAll();
        setVideos(videosData.filter(v => v.isPublished));
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // We render: [...videos, ...videos, ...videos]
  // Start at middle set: offset = -(n * STEP)
  const n = videos.length;
  const startOffset = useRef(0);

  useEffect(() => {
    if (n > 0) {
      startOffset.current = -(n * STEP);
      setOffset(-(n * STEP));
    }
  }, [n]);

  const slide = useCallback((dir: 'left' | 'right') => {
    if (isAnimating.current || n === 0) return;
    isAnimating.current = true;
    setTransitioning(true);

    const delta = dir === 'right' ? -STEP : STEP;
    setOffset(prev => prev + delta);

    setTimeout(() => {
      setTransitioning(false);
      // Jump silently back to middle equivalent if needed
      setOffset(prev => {
        const middle = -(n * STEP);
        const total = n * STEP;
        // Wrapped too far right (positive direction)
        if (prev > middle + total - STEP / 2) return prev - total;
        // Wrapped too far left (negative direction)
        if (prev < middle - total + STEP / 2) return prev + total;
        return prev;
      });
      isAnimating.current = false;
    }, 320);
  }, [n]);

  const getYouTubeId = (url: string) => {
    const m = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return m && m[2].length === 11 ? m[2] : null;
  };

  const getThumb = (url: string) => {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  };

  if (loading || n === 0) return null;

  const displayVideos = [...videos, ...videos, ...videos];

  const inner = (
    <>
      <div className="flex items-center mb-3">
        <div className="text-primaryOther">
          <p className="text-base md:text-lg font-semibold">مقاطع فيديو قصيرة</p>
        </div>
        <div className="flex-1 h-1 mx-2 md:mx-3 bg-primaryOther border-0 rounded-sm" />
      </div>

      <div className="relative overflow-hidden">
        {/* Left arrow */}
        <button
          onClick={() => slide('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-md rounded-full w-9 h-9 flex items-center justify-center hover:bg-primaryOther hover:text-white hover:border-primaryOther transition-colors"
          aria-label="السابق"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={() => slide('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-md rounded-full w-9 h-9 flex items-center justify-center hover:bg-primaryOther hover:text-white hover:border-primaryOther transition-colors"
          aria-label="التالي"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Track */}
        <div
          dir="ltr"
          className="flex mx-10"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(${offset}px)`,
            transition: transitioning ? 'transform 300ms ease' : 'none',
            willChange: 'transform',
          }}
        >
          {displayVideos.map((video, index) => (
            <a
              key={`${video.videoId}-${index}`}
              href={video.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group cursor-pointer"
              style={{ width: `${CARD_WIDTH}px` }}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
                <div className="relative bg-gray-200 overflow-hidden" style={{ aspectRatio: '9/16' }}>
                  <img
                    src={getThumb(video.videoLink)}
                    alt={video.videoTitle}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      if (t.src.includes('hqdefault')) {
                        t.src = t.src.replace('hqdefault', 'mqdefault');
                      } else {
                        t.onerror = null;
                        t.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 9 16"%3E%3Crect width="9" height="16" fill="%23d1d5db"/%3E%3C/svg%3E';
                      }
                    }}
                  />
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white font-bold text-sm leading-tight text-right line-clamp-2">
                      {video.videoTitle}
                    </h3>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );

  if (embedded) return <div className="w-full mb-6">{inner}</div>;

  return (
    <div className="container mx-auto px-2 md:px-0 mb-6">
      <div className="grid grid-cols-12 gap-3 lg:gap-5">
        <div className="col-span-12 lg:col-span-9">{inner}</div>
      </div>
    </div>
  );
};

export default VideoSlider;
