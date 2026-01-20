const TOKEN_KEYS = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
} as const;

/**
 * Store authentication tokens securely
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
  } catch (error) {
    console.error('Failed to store tokens:', error);
  }
};

/**
 * Clear all authentication tokens
 */
export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
};

/**
 * Get the current access token
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(TOKEN_KEYS.ACCESS);
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
};

/**
 * Get the current refresh token
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(TOKEN_KEYS.REFRESH);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * Returns true if an access token exists
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = getAccessToken();
  return !!token && token.length > 0;
};

/**
 * Parse JWT token to get payload (without verification)
 * Only use for reading non-sensitive data like expiration
 */
export const parseToken = (token: string): Record<string, unknown> | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Check if the access token is expired or about to expire
 * @param bufferSeconds - seconds before expiration to consider as expired (default: 60)
 */
export const isTokenExpired = (bufferSeconds = 60): boolean => {
  const token = getAccessToken();
  if (!token) return true;

  const payload = parseToken(token);
  if (!payload || typeof payload.exp !== 'number') return true;

  const expirationTime = payload.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const bufferMs = bufferSeconds * 1000;

  return currentTime >= expirationTime - bufferMs;
};

/**
 * Get user info from token
 */
export const getUserFromToken = (): { userId: string; email: string } | null => {
  const token = getAccessToken();
  if (!token) return null;

  const payload = parseToken(token);
  if (!payload) return null;

  return {
    userId: payload.userId as string,
    email: payload.email as string,
  };
};
