import Cookies from 'js-cookie';

/**
 * Cookie utility functions for handling JWT tokens securely
 * These functions provide a secure way to store and retrieve tokens using cookies
 */

// Cookie configuration
const COOKIE_CONFIG = {
  secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
  sameSite: 'Strict',
  expires: 1, // 1 day
  httpOnly: false, // Note: Browser-side cookies can't be httpOnly, consider server-side storage for production
};

// Cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'nexus_access_token',
  ID_TOKEN: 'nexus_id_token',
  REFRESH_TOKEN: 'nexus_refresh_token',
  USER_INFO: 'nexus_user_info',
  AUTH_STATE: 'nexus_auth_state'
};

/**
 * Store access token in a cookie
 * @param {string} token - The JWT access token
 */
export const setAccessTokenCookie = (token) => {
  if (!token) return;
  
  try {
    Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, token, {
      ...COOKIE_CONFIG,
      expires: 1/24 // 1 hour for access token
    });
  } catch (error) {
    console.error('Error setting access token cookie:', error);
  }
};

/**
 * Retrieve access token from cookie
 * @returns {string|null} The JWT access token or null if not found
 */
export const getAccessTokenCookie = () => {
  try {
    return Cookies.get(COOKIE_NAMES.ACCESS_TOKEN) || null;
  } catch (error) {
    console.error('Error getting access token cookie:', error);
    return null;
  }
};

/**
 * Store ID token in a cookie
 * @param {string} token - The JWT ID token
 */
export const setIdTokenCookie = (token) => {
  if (!token) return;
  
  try {
    Cookies.set(COOKIE_NAMES.ID_TOKEN, token, COOKIE_CONFIG);
  } catch (error) {
    console.error('Error setting ID token cookie:', error);
  }
};

/**
 * Retrieve ID token from cookie
 * @returns {string|null} The JWT ID token or null if not found
 */
export const getIdTokenCookie = () => {
  try {
    return Cookies.get(COOKIE_NAMES.ID_TOKEN) || null;
  } catch (error) {
    console.error('Error getting ID token cookie:', error);
    return null;
  }
};

/**
 * Store user information in a cookie
 * @param {object} userInfo - User information object
 */
export const setUserInfoCookie = (userInfo) => {
  if (!userInfo) return;
  
  try {
    const userInfoString = JSON.stringify(userInfo);
    Cookies.set(COOKIE_NAMES.USER_INFO, userInfoString, COOKIE_CONFIG);
  } catch (error) {
    console.error('Error setting user info cookie:', error);
  }
};

/**
 * Retrieve user information from cookie
 * @returns {object|null} User information object or null if not found
 */
export const getUserInfoCookie = () => {
  try {
    const userInfoString = Cookies.get(COOKIE_NAMES.USER_INFO);
    return userInfoString ? JSON.parse(userInfoString) : null;
  } catch (error) {
    console.error('Error getting user info cookie:', error);
    return null;
  }
};

/**
 * Store authentication state in a cookie
 * @param {boolean} isAuthenticated - Authentication state
 */
export const setAuthStateCookie = (isAuthenticated) => {
  try {
    Cookies.set(COOKIE_NAMES.AUTH_STATE, isAuthenticated.toString(), COOKIE_CONFIG);
  } catch (error) {
    console.error('Error setting auth state cookie:', error);
  }
};

/**
 * Retrieve authentication state from cookie
 * @returns {boolean} Authentication state
 */
export const getAuthStateCookie = () => {
  try {
    const authState = Cookies.get(COOKIE_NAMES.AUTH_STATE);
    return authState === 'true';
  } catch (error) {
    console.error('Error getting auth state cookie:', error);
    return false;
  }
};

/**
 * Clear all authentication-related cookies
 */
export const clearAuthCookies = () => {
  try {
    Object.values(COOKIE_NAMES).forEach(cookieName => {
      Cookies.remove(cookieName);
      // Also try to remove from different paths
      Cookies.remove(cookieName, { path: '/' });
      Cookies.remove(cookieName, { path: '', domain: window.location.hostname });
    });
    console.log('All authentication cookies cleared');
  } catch (error) {
    console.error('Error clearing auth cookies:', error);
  }
};

/**
 * Check if access token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} True if token is expired, false otherwise
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - The JWT token
 * @returns {number|null} Expiration time in seconds or null if invalid
 */
export const getTokenExpiration = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp;
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
};

/**
 * Validate token structure
 * @param {string} token - The JWT token to validate
 * @returns {boolean} True if token structure is valid, false otherwise
 */
export const isValidTokenStructure = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  return parts.length === 3;
};