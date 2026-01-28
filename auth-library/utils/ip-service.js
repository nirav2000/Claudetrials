/**
 * IP Service Utility
 *
 * Retrieves the user's public IP address using external services.
 * Includes fallback mechanisms for reliability.
 */

import { authConfig } from '../config/firebase-config.js';

/**
 * Get user's public IP address
 * @returns {Promise<string>} The user's IP address
 */
export async function getUserIP() {
  try {
    // Try primary IP service
    const response = await fetch(authConfig.ipServiceUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Primary IP service failed');
    }

    const data = await response.json();
    return data.ip || 'unknown';

  } catch (primaryError) {
    console.warn('Primary IP service failed, trying backup:', primaryError.message);

    try {
      // Try backup IP service
      const backupResponse = await fetch(authConfig.backupIpService, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!backupResponse.ok) {
        throw new Error('Backup IP service failed');
      }

      const backupData = await backupResponse.json();
      return backupData.ip || 'unknown';

    } catch (backupError) {
      console.error('All IP services failed:', backupError.message);
      return 'unknown';
    }
  }
}

/**
 * Get detailed device information
 * @returns {Object} Device information object
 */
export function getDeviceInfo() {
  const userAgent = navigator.userAgent;

  // Detect browser
  let browser = 'Unknown';
  if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    browser = 'Opera';
  }

  // Detect OS
  let os = 'Unknown';
  if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS';
  }

  // Detect device type
  let deviceType = 'Desktop';
  if (/Mobi|Android/i.test(userAgent)) {
    deviceType = 'Mobile';
  } else if (/Tablet|iPad/i.test(userAgent)) {
    deviceType = 'Tablet';
  }

  return {
    browser,
    os,
    deviceType,
    userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}

/**
 * Get location information from IP
 * @param {string} ip - IP address
 * @returns {Promise<Object>} Location information
 */
export async function getLocationFromIP(ip) {
  if (ip === 'unknown') {
    return {
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown'
    };
  }

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);

    if (!response.ok) {
      throw new Error('Location service failed');
    }

    const data = await response.json();

    return {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'XX',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone || 'Unknown'
    };

  } catch (error) {
    console.error('Failed to get location:', error.message);
    return {
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown'
    };
  }
}
