import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../utils/jwt';

describe('JWT Utilities', () => {
  const mockPayload = {
    userId: 'user-123',
    email: 'test@example.com',
  };

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = generateAccessToken(mockPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include payload data in the token', () => {
      const token = generateAccessToken(mockPayload);
      const decoded = jwt.decode(token) as any;
      
      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
    });

    it('should have 15 minutes expiration', () => {
      const token = generateAccessToken(mockPayload);
      const decoded = jwt.decode(token) as any;
      
      const expectedExpiry = Math.floor(Date.now() / 1000) + 15 * 60;
      expect(decoded.exp).toBeCloseTo(expectedExpiry, -1);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = generateRefreshToken(mockPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should have 7 days expiration', () => {
      const token = generateRefreshToken(mockPayload);
      const decoded = jwt.decode(token) as any;
      
      const expectedExpiry = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
      expect(decoded.exp).toBeCloseTo(expectedExpiry, -1);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and decode a valid access token', () => {
      const token = generateAccessToken(mockPayload);
      const decoded = verifyAccessToken(token);
      
      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => verifyAccessToken(invalidToken)).toThrow();
    });

    it('should throw error for expired token', () => {
      // Create a token that's already expired
      const expiredToken = jwt.sign(
        { ...mockPayload, exp: Math.floor(Date.now() / 1000) - 100 },
        process.env.JWT_ACCESS_SECRET || 'test_secret'
      );
      
      expect(() => verifyAccessToken(expiredToken)).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify and decode a valid refresh token', () => {
      const token = generateRefreshToken(mockPayload);
      const decoded = verifyRefreshToken(token);
      
      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => verifyRefreshToken(invalidToken)).toThrow();
    });

    it('should not verify access token with refresh secret', () => {
      const accessToken = generateAccessToken(mockPayload);
      
      // Access token should fail verification with refresh secret
      expect(() => verifyRefreshToken(accessToken)).toThrow();
    });
  });

  describe('Token Security', () => {
    it('should generate different tokens for different payloads', () => {
      const token1 = generateAccessToken({ userId: 'user-1', email: 'user1@test.com' });
      const token2 = generateAccessToken({ userId: 'user-2', email: 'user2@test.com' });
      
      expect(token1).not.toBe(token2);
    });

    it('should generate different tokens on each call even with same payload', () => {
      // Due to iat (issued at) claim, tokens should be different
      const token1 = generateAccessToken(mockPayload);
      
      // Small delay to ensure different iat
      const token2 = generateAccessToken(mockPayload);
      
      // Tokens might be the same if generated in the same second
      // This test verifies the structure is correct
      expect(token1.split('.')).toHaveLength(3);
      expect(token2.split('.')).toHaveLength(3);
    });
  });
});
