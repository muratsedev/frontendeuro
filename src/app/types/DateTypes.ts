/**
 * TypeScript types and interfaces for Hijri/Gregorian date conversion
 */

// Locale options for date formatting
export type DateLocale = 'ar' | 'en';

// Calendar system types
export type CalendarSystem = 'hijri' | 'gregorian';

// Month display format
export type MonthFormat = 'full' | 'short' | 'numeric';

// Date formatting styles
export type DateFormat = 'arabic' | 'english';

// Date separator styles
export type DateSeparator = ' - ' | ' / ' | ' | ' | ' هـ - ' | ' م - ';

// Base interface for date objects
export interface BaseDate {
  year: number;
  month: number; // 1-12
  day: number;
}

// Hijri calendar date
export interface HijriDate extends BaseDate {
  readonly _calendar: 'hijri';
}

// Gregorian calendar date
export interface GregorianDate extends BaseDate {
  readonly _calendar: 'gregorian';
}

// Date conversion result
export interface DateConversionResult {
  original: Date;
  hijri: HijriDate;
  gregorian: GregorianDate;
  formatted: {
    arabic: string;
    english: string;
    hijriOnly: string;
    gregorianOnly: string;
  };
}

// Options for date formatting functions
export interface DateFormatOptions {
  showHijri?: boolean;
  showGregorian?: boolean;
  separator?: DateSeparator;
  hijriFirst?: boolean;
  format?: DateFormat;
  shortMonth?: boolean;
  includeYear?: boolean;
  locale?: DateLocale;
}

// Options for current date hook
export interface CurrentDateOptions extends DateFormatOptions {
  updateInterval?: number; // milliseconds
}

// Options for compact date formatting
export interface CompactDateOptions {
  locale?: DateLocale;
  includeYear?: boolean;
  monthFormat?: MonthFormat;
}

// Article date formatting result
export interface ArticleDateResult {
  createdDate: string;
  updatedDate: string | null;
  hasUpdated: boolean;
  relativeTime?: string;
}

// Month names mapping
export interface MonthNames {
  hijri: {
    ar: readonly string[];
    en: readonly string[];
  };
  gregorian: {
    ar: readonly string[];
    en: readonly string[];
    enShort: readonly string[];
  };
}

// Date validation result
export interface DateValidationResult {
  isValid: boolean;
  error?: string;
  normalizedDate?: Date;
}

// Calendar conversion context
export interface CalendarConversionContext {
  sourceCalendar: CalendarSystem;
  targetCalendar: CalendarSystem;
  accuracy: 'approximate' | 'precise';
  source: string; // Source of conversion algorithm
}

// Date formatting context for React components
export interface DateFormattingContext {
  defaultOptions: DateFormatOptions;
  currentLocale: DateLocale;
  preferredCalendar: CalendarSystem;
  timezone?: string;
}

// Hook return types
export interface UseDateConversionReturn {
  gregorianDate: Date;
  hijriDate: HijriDate;
  updateFromGregorian: (date: Date) => void;
  updateFromHijri: (hijri: HijriDate) => void;
  formattedArabic: string;
  formattedEnglish: string;
}

export interface UseArticleDateReturn extends ArticleDateResult {
  formattedCreated: string;
  formattedUpdated: string | null;
}

// Date range interface
export interface DateRange {
  start: Date;
  end: Date;
  duration?: {
    days: number;
    months: number;
    years: number;
  };
}

// Hijri date range
export interface HijriDateRange {
  start: HijriDate;
  end: HijriDate;
  gregorianEquivalent: DateRange;
}

// Special Islamic dates/events
export interface IslamicEvent {
  name: string;
  nameAr: string;
  hijriDate: HijriDate;
  isFixed: boolean; // Fixed date each year vs calculated
  description?: string;
  descriptionAr?: string;
}

// Date formatting preferences (for user settings)
export interface DateFormattingPreferences {
  primaryCalendar: CalendarSystem;
  showBothCalendars: boolean;
  dateFormat: DateFormat;
  monthFormat: MonthFormat;
  separator: DateSeparator;
  locale: DateLocale;
}

// Error types for date operations
export type DateConversionError = 
  | 'INVALID_DATE'
  | 'INVALID_HIJRI_DATE'
  | 'INVALID_GREGORIAN_DATE'
  | 'CONVERSION_FAILED'
  | 'UNSUPPORTED_YEAR_RANGE';

export interface DateError {
  type: DateConversionError;
  message: string;
  messageAr: string;
  originalInput?: unknown;
}

// Utility type for date input (flexible input types)
export type DateInput = Date | string | number | HijriDate | GregorianDate;

// Calendar metadata
export interface CalendarMetadata {
  name: string;
  nameAr: string;
  epochYear: number; // Starting year for the calendar
  averageYearLength: number; // In days
  monthsPerYear: number;
  maxDaysInMonth: number;
  minDaysInMonth: number;
  isLunar: boolean;
  isSolar: boolean;
}

// Format validation result
export interface FormatValidationResult {
  isValid: boolean;
  detectedFormat?: string;
  suggestions?: string[];
  errors?: string[];
}

// Export type guards for runtime type checking
export type TypeGuard<T> = (value: unknown) => value is T;

// Function signature types for utility functions
export type DateFormatter = (date: Date, options?: DateFormatOptions) => string;
export type DateConverter = (input: DateInput) => DateConversionResult;
export type DateValidator = (input: unknown) => DateValidationResult;