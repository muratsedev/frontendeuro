/**
 * Hijri to Gregorian Calendar Conversion Utilities
 * Supports both directions: Hijri to Gregorian and Gregorian to Hijri
 */

// Hijri month names in Arabic
export const HIJRI_MONTHS_AR = [
  'محرم',           // Muharram
  'صفر',            // Safar
  'ربيع الأول',     // Rabi' al-awwal
  'ربيع الآخر',     // Rabi' al-thani
  'جمادى الأولى',   // Jumada al-awwal
  'جمادى الآخرة',   // Jumada al-thani
  'رجب',            // Rajab
  'شعبان',          // Sha'ban
  'رمضان',          // Ramadan
  'شوال',           // Shawwal
  'ذو القعدة',      // Dhu al-Qi'dah
  'ذو الحجة'        // Dhu al-Hijjah
] as const;

// Hijri month names in English
export const HIJRI_MONTHS_EN = [
  'Muharram',
  'Safar',
  'Rabi\' al-awwal',
  'Rabi\' al-thani',
  'Jumada al-awwal',
  'Jumada al-thani',
  'Rajab',
  'Sha\'ban',
  'Ramadan',
  'Shawwal',
  'Dhu al-Qi\'dah',
  'Dhu al-Hijjah'
] as const;

// Gregorian month names in Arabic
export const GREGORIAN_MONTHS_AR = [
  'يناير',          // January
  'فبراير',         // February
  'مارس',           // March
  'أبريل',          // April
  'مايو',           // May
  'يونيو',          // June
  'يوليو',          // July
  'أغسطس',          // August
  'سبتمبر',         // September
  'أكتوبر',         // October
  'نوفمبر',         // November
  'ديسمبر'          // December
] as const;

// Gregorian month names in English (short)
export const GREGORIAN_MONTHS_EN_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const;

export interface HijriDate {
  year: number;
  month: number; // 1-12
  day: number;
}

export interface GregorianDate {
  year: number;
  month: number; // 1-12
  day: number;
}

/**
 * Convert a Gregorian date to approximate Hijri date
 * Note: This is a simplified calculation. For precise conversion, use a proper Hijri calendar library.
 */
export function gregorianToHijri(gregorianDate: Date | GregorianDate): HijriDate {
  let year: number, month: number, day: number;
  
  if (gregorianDate instanceof Date) {
    year = gregorianDate.getFullYear();
    month = gregorianDate.getMonth() + 1; // getMonth() returns 0-11
    day = gregorianDate.getDate();
  } else {
    year = gregorianDate.year;
    month = gregorianDate.month;
    day = gregorianDate.day;
  }

  // Julian day calculation
  const a = Math.floor((14 - month) / 12);
  const y = year - a;
  const m = month + 12 * a - 3;
  
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + 1721119;
  
  // Convert Julian day to Hijri
  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  month = Math.floor((24 * l) / 709);
  day = l - Math.floor((709 * month) / 24);
  year = 30 * n + j - 30;

  return {
    year: year,
    month: month,
    day: day
  };
}

/**
 * Convert a Hijri date to approximate Gregorian date
 * Note: This is a simplified calculation. For precise conversion, use a proper Hijri calendar library.
 */
export function hijriToGregorian(hijriDate: HijriDate): GregorianDate {
  const { year, month, day } = hijriDate;
  
  const jd = Math.floor((11 * year + 3) / 30) + 354 * year + 30 * month - Math.floor((month - 1) / 2) + day + 1948440 - 385;
  
  const a = jd + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  
  const gregorianDay = e - Math.floor((153 * m + 2) / 5) + 1;
  const gregorianMonth = m + 3 - 12 * Math.floor(m / 10);
  const gregorianYear = 100 * b + d - 4800 + Math.floor(m / 10);
  
  return {
    year: gregorianYear,
    month: gregorianMonth,
    day: gregorianDay
  };
}

/**
 * Get Hijri month name in Arabic
 */
export function getHijriMonthNameAr(monthNumber: number): string {
  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error('Month number must be between 1 and 12');
  }
  return HIJRI_MONTHS_AR[monthNumber - 1];
}

/**
 * Get Hijri month name in English
 */
export function getHijriMonthNameEn(monthNumber: number): string {
  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error('Month number must be between 1 and 12');
  }
  return HIJRI_MONTHS_EN[monthNumber - 1];
}

/**
 * Get Gregorian month name in Arabic
 */
export function getGregorianMonthNameAr(monthNumber: number): string {
  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error('Month number must be between 1 and 12');
  }
  return GREGORIAN_MONTHS_AR[monthNumber - 1];
}

/**
 * Get Gregorian month name in English (short form)
 */
export function getGregorianMonthNameEnShort(monthNumber: number): string {
  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error('Month number must be between 1 and 12');
  }
  return GREGORIAN_MONTHS_EN_SHORT[monthNumber - 1];
}

/**
 * Format a date in Arabic style with both Hijri and Gregorian
 */
export function formatDateArabic(date: Date, options: {
  showHijri?: boolean;
  showGregorian?: boolean;
  separator?: string;
  hijriFirst?: boolean;
} = {}): string {
  const {
    showHijri = true,
    showGregorian = true,
    separator = ' - ',
    hijriFirst = true
  } = options;

  const parts: string[] = [];

  if (showGregorian) {
    const gregorianDay = date.getDate();
    const gregorianMonth = date.getMonth() + 1;
    const gregorianYear = date.getFullYear();
    const gregorianStr = `${gregorianDay} ${getGregorianMonthNameAr(gregorianMonth)} ${gregorianYear}`;
    parts.push(gregorianStr);
  }

  if (showHijri) {
    const hijriDate = gregorianToHijri(date);
    const hijriStr = `${hijriDate.day} ${getHijriMonthNameAr(hijriDate.month)} ${hijriDate.year}`;
    parts.push(hijriStr);
  }

  if (hijriFirst && parts.length === 2) {
    return parts.reverse().join(separator);
  }

  return parts.join(separator);
}

/**
 * Format a date in English style
 */
export function formatDateEnglish(date: Date, options: {
  showHijri?: boolean;
  showGregorian?: boolean;
  separator?: string;
  hijriFirst?: boolean;
  shortMonth?: boolean;
} = {}): string {
  const {
    showHijri = false,
    showGregorian = true,
    separator = ' - ',
    hijriFirst = false,
    shortMonth = true
  } = options;

  const parts: string[] = [];

  if (showGregorian) {
    const gregorianDay = date.getDate().toString().padStart(2, '0');
    const gregorianMonth = date.getMonth() + 1;
    const gregorianYear = date.getFullYear();
    const monthName = shortMonth 
      ? getGregorianMonthNameEnShort(gregorianMonth)
      : date.toLocaleString('en-US', { month: 'long' });
    const gregorianStr = `${monthName}/${gregorianDay}/${gregorianYear}`;
    parts.push(gregorianStr);
  }

  if (showHijri) {
    const hijriDate = gregorianToHijri(date);
    const hijriStr = `${hijriDate.day} ${getHijriMonthNameEn(hijriDate.month)} ${hijriDate.year}`;
    parts.push(hijriStr);
  }

  if (hijriFirst && parts.length === 2) {
    return parts.reverse().join(separator);
  }

  return parts.join(separator);
}

/**
 * Get current date in both Hijri and Gregorian formats
 */
export function getCurrentDateFormatted(options: {
  format?: 'arabic' | 'english';
  showHijri?: boolean;
  showGregorian?: boolean;
  separator?: string;
  hijriFirst?: boolean;
} = {}): string {
  const {
    format = 'arabic',
    showHijri = true,
    showGregorian = true,
    separator = ' - ',
    hijriFirst = true
  } = options;

  const today = new Date();

  if (format === 'arabic') {
    return formatDateArabic(today, { showHijri, showGregorian, separator, hijriFirst });
  } else {
    return formatDateEnglish(today, { showHijri, showGregorian, separator, hijriFirst });
  }
}

/**
 * Convert Hijri month number to corresponding Gregorian month (approximate)
 * This is a simplified mapping for the current year
 */
export function hijriMonthToGregorianMonth(hijriMonth: number, hijriYear: number): number {
  // Create a reference Hijri date (1st day of the month)
  const hijriDate: HijriDate = {
    year: hijriYear,
    month: hijriMonth,
    day: 1
  };
  
  // Convert to Gregorian
  const gregorianDate = hijriToGregorian(hijriDate);
  
  return gregorianDate.month;
}

/**
 * Convert Gregorian month number to corresponding Hijri month (approximate)
 * This is a simplified mapping for the current year
 */
export function gregorianMonthToHijriMonth(gregorianMonth: number, gregorianYear: number): number {
  // Create a reference Gregorian date (1st day of the month)
  const gregorianDate = new Date(gregorianYear, gregorianMonth - 1, 1);
  
  // Convert to Hijri
  const hijriDate = gregorianToHijri(gregorianDate);
  
  return hijriDate.month;
}