/**
 * Sanitization utility to prevent XSS attacks by removing dangerous characters and patterns
 * Prevents JavaScript code injection, executable files, and other malicious input
 */

/**
 * Sanitizes text input to remove potential XSS/injection attacks
 * @param input - The user input to sanitize
 * @returns Sanitized string safe to display
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  // Remove null bytes
  let sanitized = input.replace(/\0/g, "");

  // Remove script tags and content (case-insensitive)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, "");

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, "");

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, "");

  // Remove iframe, embed, object tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  sanitized = sanitized.replace(/<embed\b[^<]*(\/)?>/gi, "");
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "");

  // Remove .exe, .bat, .cmd, .com, .pif, .scr file extensions mentions
  sanitized = sanitized.replace(/\.\w*(exe|bat|cmd|com|pif|scr|vbs|vbe|js|jse|wsf|wsh|ps1|ps2|psc1|psc2)\b/gi, "");

  // Encode HTML special characters
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");

  return sanitized.trim();
}

/**
 * Sanitizes email input
 * @param email - The email to validate and sanitize
 * @returns Sanitized email or empty string if invalid
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== "string") {
    return "";
  }

  // Remove whitespace
  let sanitized = email.trim();

  // Basic email validation pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(sanitized)) {
    return "";
  }

  // Remove potentially dangerous characters while preserving valid email characters
  sanitized = sanitized.replace(/[<>()[\]\\,;:\s@"]/g, (char) => {
    if (["@", ".", "-", "_"].includes(char)) {
      return char;
    }
    return "";
  });

  return sanitized;
}

/**
 * Sanitizes phone number input
 * @param phone - The phone number to sanitize
 * @returns Sanitized phone number
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone || typeof phone !== "string") {
    return "";
  }

  // Remove all non-digit characters except + at the beginning
  let sanitized = phone.trim();
  sanitized = sanitized.replace(/[^\d+\s\-()]/g, "");

  // Limit length
  if (sanitized.length > 20) {
    sanitized = sanitized.substring(0, 20);
  }

  return sanitized;
}

/**
 * Sanitizes longer text content (like messages)
 * @param text - The text to sanitize
 * @returns Sanitized text
 */
export function sanitizeMessage(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  // Remove dangerous patterns
  let sanitized = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/javascript:/gi, "");

  // Limit length
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000);
  }

  return sanitized.trim();
}

/**
 * Validates and sanitizes a URL
 * @param url - The URL to validate
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== "string") {
    return "";
  }

  const urlString = url.trim();

  // Block dangerous protocols
  if (
    /^(javascript|data|vbscript|file|about):/i.test(urlString)
  ) {
    return "";
  }

  try {
    new URL(urlString, "http://localhost");
    return urlString;
  } catch {
    return "";
  }
}

/**
 * Check if a string contains dangerous patterns
 * @param input - The input to check
 * @returns True if dangerous patterns are found
 */
export function containsDangerousPatterns(input: string): boolean {
  if (!input || typeof input !== "string") {
    return false;
  }

  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:text\/html/i,
    /on\w+\s*=/i,
    /iframe/i,
    /embed/i,
    /object/i,
    /\.exe\b/i,
    /\.bat\b/i,
    /\.cmd\b/i,
    /\.scr\b/i,
  ];

  return dangerousPatterns.some((pattern) => pattern.test(input));
}
