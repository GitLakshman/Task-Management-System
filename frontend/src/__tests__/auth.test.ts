import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setTokens, clearTokens, getAccessToken, isAuthenticated } from '../lib/auth';

describe('Auth Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage mock
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
  });

  describe('setTokens', () => {
    it('should store access and refresh tokens in localStorage', () => {
      setTokens('access-token-123', 'refresh-token-456');

      expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'access-token-123');
      expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-token-456');
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('clearTokens', () => {
    it('should remove both tokens from localStorage', () => {
      clearTokens();

      expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAccessToken', () => {
    it('should return the access token from localStorage', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('my-access-token');

      const token = getAccessToken();

      expect(localStorage.getItem).toHaveBeenCalledWith('accessToken');
      expect(token).toBe('my-access-token');
    });

    it('should return null if no token exists', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const token = getAccessToken();

      expect(token).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if access token exists', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('valid-token');

      const result = isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false if access token does not exist', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const result = isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false if access token is empty string', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('');

      const result = isAuthenticated();

      expect(result).toBe(false);
    });
  });
});
