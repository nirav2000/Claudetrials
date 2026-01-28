/**
 * Validation Utilities
 *
 * Input validation for authentication forms
 */

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateEmail(email) {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email address is required'
    };
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  // Check for common typos
  const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
  const domain = email.split('@')[1]?.toLowerCase();

  // Warn about common typos (but still allow them)
  const suspiciousPatterns = [
    'gmial.com',
    'gmai.com',
    'yahooo.com',
    'yaho.com',
    'outlok.com',
    'hotmial.com'
  ];

  if (suspiciousPatterns.includes(domain)) {
    return {
      isValid: true,
      warning: 'Did you mean one of these: gmail.com, yahoo.com, outlook.com, hotmail.com?'
    };
  }

  return { isValid: true };
}

/**
 * Validate verification code
 * @param {string} code - Verification code to validate
 * @param {number} expectedLength - Expected code length
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateCode(code, expectedLength = 6) {
  if (!code || code.trim() === '') {
    return {
      isValid: false,
      error: 'Verification code is required'
    };
  }

  const cleanCode = code.replace(/\s/g, ''); // Remove spaces

  if (cleanCode.length !== expectedLength) {
    return {
      isValid: false,
      error: `Verification code must be ${expectedLength} digits`
    };
  }

  if (!/^\d+$/.test(cleanCode)) {
    return {
      isValid: false,
      error: 'Verification code must contain only numbers'
    };
  }

  return { isValid: true, cleanCode };
}

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - User input
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }

  // Create a temporary div to use browser's built-in HTML encoding
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Validate display name
 * @param {string} name - Display name to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateDisplayName(name) {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      error: 'Display name is required'
    };
  }

  if (name.length < 2) {
    return {
      isValid: false,
      error: 'Display name must be at least 2 characters'
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      error: 'Display name must be less than 50 characters'
    };
  }

  // Allow letters, numbers, spaces, hyphens, and underscores
  const nameRegex = /^[a-zA-Z0-9\s\-_]+$/;

  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      error: 'Display name can only contain letters, numbers, spaces, hyphens, and underscores'
    };
  }

  return { isValid: true };
}

/**
 * Rate limiting check
 * @param {string} key - Unique key for rate limiting (e.g., email or IP)
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Object} { allowed: boolean, remainingAttempts: number, resetTime: number }
 */
export function checkRateLimit(key, maxAttempts = 5, windowMs = 900000) {
  const storageKey = `rateLimit_${key}`;
  const now = Date.now();

  // Get existing rate limit data
  const rateLimitData = JSON.parse(localStorage.getItem(storageKey) || '{}');

  // Reset if window has passed
  if (rateLimitData.resetTime && now > rateLimitData.resetTime) {
    localStorage.removeItem(storageKey);
    return {
      allowed: true,
      remainingAttempts: maxAttempts - 1,
      resetTime: now + windowMs
    };
  }

  // Initialize or increment attempts
  const attempts = (rateLimitData.attempts || 0) + 1;
  const resetTime = rateLimitData.resetTime || (now + windowMs);

  // Check if limit exceeded
  if (attempts > maxAttempts) {
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime: resetTime,
      message: `Too many attempts. Please try again in ${Math.ceil((resetTime - now) / 60000)} minutes.`
    };
  }

  // Update rate limit data
  localStorage.setItem(storageKey, JSON.stringify({
    attempts,
    resetTime
  }));

  return {
    allowed: true,
    remainingAttempts: maxAttempts - attempts,
    resetTime
  };
}

/**
 * Clear rate limit for a key
 * @param {string} key - Unique key for rate limiting
 */
export function clearRateLimit(key) {
  const storageKey = `rateLimit_${key}`;
  localStorage.removeItem(storageKey);
}
