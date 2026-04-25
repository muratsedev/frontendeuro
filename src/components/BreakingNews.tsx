"use client";
import { useEffect, useState, useRef, useCallback } from "react";

type BreakingNewsItem = {
  id: number;
  title: string;
  breakingNewsDuration: string;
  createdAt: string;
  isPublished: boolean;
};

type BreakingNewsItemRaw = BreakingNewsItem & {
  Id?: number;
  Title?: string;
  BreakingNewsDuration?: string;
  CreatedAt?: string;
  IsPublished?: boolean;
};

const BreakingNews = () => {
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<Map<number, number>>(new Map());
  const expirationTimersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const countdownTimersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Function to update breaking news published status
  const updateBreakingNewsStatus = useCallback(async (id: number, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/breaking-news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished }),
      });

      if (!response.ok) {
        console.error(`Failed to update breaking news ${id} status`);
        return false;
      }

      console.log(`Breaking news ${id} status updated to ${isPublished}`);
      return true;
    } catch (error) {
      console.error(`Error updating breaking news ${id} status:`, error);
      return false;
    }
  }, []);

  // Function to format time remaining
  const formatTimeRemaining = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${seconds}s`;
    }
  }, []);

  useEffect(() => {
    // Store refs to avoid stale closure issues
    const expirationTimers = expirationTimersRef.current;
    const countdownTimers = countdownTimersRef.current;

    // Helper function to parse TimeOnly format (HH:mm:ss) to milliseconds
    const parseTimeOnlyToMs = (timeOnly: string): number => {
      const [hours, minutes, seconds] = timeOnly.split(':').map(Number);
      return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
    };

    // Function to set up countdown timers for visual feedback
    const setupCountdownTimers = (newsItems: BreakingNewsItem[]) => {
      // Clear existing countdown timers
      countdownTimers.forEach(timer => clearInterval(timer));
      countdownTimers.clear();

      const newTimeRemaining = new Map<number, number>();

      newsItems.forEach(news => {
        if (!news.isPublished) return;

        const createdAt = new Date(news.createdAt);
        const durationMs = parseTimeOnlyToMs(news.breakingNewsDuration);
        const expirationTime = new Date(createdAt.getTime() + durationMs);

        const updateCountdown = () => {
          const currentTime = new Date();
          const timeLeft = expirationTime.getTime() - currentTime.getTime();
          
          if (timeLeft <= 0) {
            newTimeRemaining.delete(news.id);
            countdownTimers.delete(news.id);
            return;
          }

          newTimeRemaining.set(news.id, timeLeft);
          setTimeRemaining(new Map(newTimeRemaining));
        };

        // Initial update
        updateCountdown();

        // Set up interval for countdown updates (every second)
        const timer = setInterval(updateCountdown, 1000);
        countdownTimers.set(news.id, timer);
      });
    };

    // Function to set up expiration timers for breaking news
    const setupExpirationTimers = (newsItems: BreakingNewsItem[], fetchBreakingNews: () => void) => {
      // Clear existing timers
      expirationTimers.forEach(timer => clearTimeout(timer));
      expirationTimers.clear();

      newsItems.forEach(news => {
        if (!news.isPublished) return;

        const createdAt = new Date(news.createdAt);
        const durationMs = parseTimeOnlyToMs(news.breakingNewsDuration);
        const expirationTime = new Date(createdAt.getTime() + durationMs);
        const currentTime = new Date();
        const timeUntilExpiration = expirationTime.getTime() - currentTime.getTime();

        console.log(`Breaking news "${news.title}" expires at:`, expirationTime);
        console.log(`Time until expiration: ${timeUntilExpiration}ms`);

        // If already expired, update immediately
        if (timeUntilExpiration <= 0) {
          console.log(`Breaking news "${news.title}" has already expired, updating status...`);
          updateBreakingNewsStatus(news.id, false).then(() => {
            // Refresh the breaking news list after update
            fetchBreakingNews();
          });
          return;
        }

        // Set timer for future expiration
        const timer = setTimeout(async () => {
          console.log(`Breaking news "${news.title}" duration expired, updating status...`);
          const success = await updateBreakingNewsStatus(news.id, false);
          if (success) {
            // Refresh the breaking news list after update
            fetchBreakingNews();
          }
          expirationTimers.delete(news.id);
        }, timeUntilExpiration);

        expirationTimers.set(news.id, timer);
      });
    };

    const fetchBreakingNews = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/breaking-news', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(35000)
        });
        
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          setBreakingNews([]);
          return;
        }
        
        const data: BreakingNewsItemRaw[] = await response.json();
        const normalizedData: BreakingNewsItem[] = (data || []).map((news) => ({
          id: news.id ?? news.Id ?? 0,
          title: news.title ?? news.Title ?? '',
          breakingNewsDuration: news.breakingNewsDuration ?? news.BreakingNewsDuration ?? '00:00:00',
          createdAt: news.createdAt ?? news.CreatedAt ?? new Date(0).toISOString(),
          isPublished: Boolean(news.isPublished ?? news.IsPublished ?? false),
        }));

        console.log('Breaking News API - Received items:', normalizedData.length);
        console.log('Breaking News API - Final items count:', normalizedData.filter((news) => news.isPublished).length);
        
        // Filter only published breaking news
        const publishedNews = normalizedData.filter((news) => news.isPublished);
        setBreakingNews(publishedNews);
        
        // Set up expiration timers for all breaking news (including unpublished ones)
        setupExpirationTimers(normalizedData, fetchBreakingNews);
        // Set up countdown timers for visual feedback
        setupCountdownTimers(normalizedData);
      } catch (error) {
        if (error instanceof Error && error.name === 'TimeoutError') {
          console.warn("Breaking news fetch timed out, will retry later");
        } else {
          console.error("Failed to fetch breaking news", error);
        }
        // Don't throw error, just set empty array to prevent UI from breaking
        setBreakingNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBreakingNews();

    // Set up periodic check every 60 seconds to ensure expired news are caught
    const periodicCheck = setInterval(() => {
      console.log('Performing periodic check for expired breaking news...');
      fetchBreakingNews();
    }, 60000);

    // Cleanup timers on unmount
    return () => {
      expirationTimers.forEach(timer => clearTimeout(timer));
      expirationTimers.clear();
      countdownTimers.forEach(timer => clearInterval(timer));
      countdownTimers.clear();
      if (periodicCheck) {
        clearInterval(periodicCheck);
      }
    };
  }, [updateBreakingNewsStatus, formatTimeRemaining]);

  // Auto-rotate breaking news items
  useEffect(() => {
    if (breakingNews.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === breakingNews.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }
  }, [breakingNews.length]);

  // Don't show loading state or empty state
  if (loading || !breakingNews || breakingNews.length === 0 || !isVisible) {
    return null;
  }

  const currentNews = breakingNews[currentIndex];
  const currentTimeRemaining = timeRemaining.get(currentNews?.id || 0);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="container mx-auto bg-red-600 text-white py-2 border-b-2 border-red-700 animate-scale-in">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <span className="bg-white text-red-600 px-4 py-2 text-sm font-bold rounded-sm ml-2 flex-shrink-0">
              أخبار عاجلة
            </span>
            <div className="flex-1 mx-4">
              <span className="text-sm font-normal animate-fade-in">
                {currentNews.title}
              </span>
              {currentTimeRemaining && currentTimeRemaining > 0 && (
                <span className="text-xs opacity-75 ml-2 bg-red-700 px-2 py-1 rounded">
                  ينتهي خلال: {formatTimeRemaining(currentTimeRemaining)}
                </span>
              )}
            </div>
            {breakingNews.length > 1 && (
              <div className="flex items-center ml-2">
                <span className="text-xs opacity-75">
                  {currentIndex + 1} / {breakingNews.length}
                </span>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="text-white hover:text-red-200 transition-colors duration-200 ml-2 p-1"
            title="إغلاق الأخبار العاجلة"
            aria-label="إغلاق الأخبار العاجلة"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-in;
        }
      `}</style>
    </div>
  );
};

export default BreakingNews;