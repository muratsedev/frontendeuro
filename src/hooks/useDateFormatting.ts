/**
 * Custom React hooks for Hijri and Gregorian date formatting
 * Provides consistent date formatting across the application
 */

import { useState, useEffect, useMemo } from 'react';
import {
  formatDateArabic,
  formatDateEnglish,
  getCurrentDateFormatted,
  gregorianToHijri,
  hijriToGregorian,
  getGregorianMonthNameAr,
  HijriDate
} from '../app/lib/hijriUtils';

export interface DateFormatOptions {
  showHijri?: boolean;
  showGregorian?: boolean;
  separator?: string;
  hijriFirst?: boolean;
  format?: 'arabic' | 'english';
  shortMonth?: boolean;
}

/**
 * Hook for formatting a specific date with Hijri/Gregorian options
 */
export function useFormattedDate(
  date: Date | string | null, 
  options: DateFormatOptions = {}
): string {
  return useMemo(() => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Validate date
    if (isNaN(dateObj.getTime()) || dateObj.getFullYear() === 1) {
      return '';
    }

    const {
      format = 'arabic',
      showHijri = true,
      showGregorian = true,
      separator = ' - ',
      hijriFirst = true,
      shortMonth = true
    } = options;

    if (format === 'arabic') {
      return formatDateArabic(dateObj, { showHijri, showGregorian, separator, hijriFirst });
    } else {
      return formatDateEnglish(dateObj, { showHijri, showGregorian, separator, hijriFirst, shortMonth });
    }
  }, [date, options]);
}

/**
 * Hook for getting the current date with live updates
 */
export function useCurrentDate(
  options: DateFormatOptions & { updateInterval?: number } = {}
): string {
  const [currentDate, setCurrentDate] = useState<string>('');
  const { updateInterval = 60000, ...formatOptions } = options; // Update every minute by default

  useEffect(() => {
    const updateDate = () => {
      const formatted = getCurrentDateFormatted(formatOptions);
      setCurrentDate(formatted);
    };

    // Initial update
    updateDate();

    // Set up interval for updates
    const interval = setInterval(updateDate, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval, formatOptions]);

  return currentDate;
}

/**
 * Hook for converting between Hijri and Gregorian dates
 */
export function useDateConversion(initialDate?: Date) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());

  const hijriDate = useMemo(() => {
    return gregorianToHijri(selectedDate);
  }, [selectedDate]);

  const updateFromGregorian = (date: Date) => {
    setSelectedDate(date);
  };

  const updateFromHijri = (hijri: HijriDate) => {
    const gregorian = hijriToGregorian(hijri);
    const newDate = new Date(gregorian.year, gregorian.month - 1, gregorian.day);
    setSelectedDate(newDate);
  };

  return {
    gregorianDate: selectedDate,
    hijriDate,
    updateFromGregorian,
    updateFromHijri,
    formattedArabic: formatDateArabic(selectedDate),
    formattedEnglish: formatDateEnglish(selectedDate)
  };
}

/**
 * Hook specifically for article dates - formats creation and update dates
 */
export function useArticleDate(
  createdDate: string | Date,
  updatedDate?: string | Date,
  options: DateFormatOptions = {}
) {
  const defaultOptions: DateFormatOptions = {
    format: 'arabic',
    showHijri: false, // For articles, usually just show Gregorian for simplicity
    showGregorian: true,
    hijriFirst: false,
    ...options
  };

  const formattedCreated = useFormattedDate(createdDate, defaultOptions);
  const formattedUpdated = useFormattedDate(updatedDate || null, defaultOptions);

  return {
    createdDate: formattedCreated,
    updatedDate: updatedDate ? formattedUpdated : null,
    hasUpdated: !!updatedDate && formattedUpdated !== formattedCreated
  };
}

/**
 * Hook for simple Arabic date formatting (commonly used pattern)
 */
export function useArabicDate(
  date: Date | string | null,
  includeHijri: boolean = false
): string {
  return useFormattedDate(date, {
    format: 'arabic',
    showHijri: includeHijri,
    showGregorian: true,
    hijriFirst: includeHijri,
    separator: includeHijri ? ' هـ - ' : ''
  });
}

/**
 * Hook for compact date formatting (day/month format)
 */
export function useCompactDate(
  date: Date | string | null,
  options: { 
    locale?: 'ar' | 'en';
    includeYear?: boolean;
  } = {}
): string {
  const { locale = 'ar', includeYear = false } = options;

  return useMemo(() => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '';

    if (locale === 'ar') {
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();
      const monthNameAr = getGregorianMonthNameAr(month);
      
      return includeYear 
        ? `${day} ${monthNameAr} ${year}`
        : `${day} ${monthNameAr}`;
    } else {
      return dateObj.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        ...(includeYear && { year: 'numeric' })
      });
    }
  }, [date, locale, includeYear]);
}

/**
 * Hook for month names - useful for dropdowns or month pickers
 */
export function useMonthNames(type: 'hijri' | 'gregorian' = 'gregorian', locale: 'ar' | 'en' = 'ar') {
  return useMemo(() => {
    if (type === 'hijri') {
      if (locale === 'ar') {
        return [
          'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
          'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
        ];
      } else {
        return [
          'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani', 
          'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban', 
          'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
        ];
      }
    } else {
      if (locale === 'ar') {
        return [
          'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
          'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
      } else {
        return [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
      }
    }
  }, [type, locale]);
}

/**
 * Hook to check if a date is within Ramadan (approximate)
 */
export function useIsRamadan(date?: Date): boolean {
  return useMemo(() => {
    const checkDate = date || new Date();
    const hijriDate = gregorianToHijri(checkDate);
    return hijriDate.month === 9; // Ramadan is the 9th month in Hijri calendar
  }, [date]);
}

/**
 * Hook for relative time formatting (e.g., "منذ 3 أيام")
 */
export function useRelativeTime(
  date: Date | string | null,
  locale: 'ar' | 'en' = 'ar'
): string {
  return useMemo(() => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (locale === 'ar') {
      if (diffDays > 0) {
        return `منذ ${diffDays} ${diffDays === 1 ? 'يوم' : 'أيام'}`;
      } else if (diffHours > 0) {
        return `منذ ${diffHours} ${diffHours === 1 ? 'ساعة' : 'ساعات'}`;
      } else if (diffMinutes > 0) {
        return `منذ ${diffMinutes} ${diffMinutes === 1 ? 'دقيقة' : 'دقائق'}`;
      } else {
        return 'الآن';
      }
    } else {
      if (diffDays > 0) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else if (diffMinutes > 0) {
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      } else {
        return 'now';
      }
    }
  }, [date, locale]);
}