// Create mocks before using them in jest.mock
const mockUserCreate = jest.fn();
const mockUserFindUnique = jest.fn();
const mockUserFindFirst = jest.fn();
const mockUserUpdate = jest.fn();

// Mock the database module
jest.mock('../config/database', () => ({
  __esModule: true,
  default: {
    user: {
      create: mockUserCreate,
      findUnique: mockUserFindUnique,
      findFirst: mockUserFindFirst,
      update: mockUserUpdate,
    },
  },
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock JWT utilities
jest.mock('../utils/jwt', () => ({
  generateAccessToken: jest.fn(() => 'mock-access-token'),
  generateRefreshToken: jest.fn(() => 'mock-refresh-token'),
  verifyAccessToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
}));

import bcrypt from 'bcrypt';
import { AuthService } from '../services/auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashed-password',
    name: 'John Doe',
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockUserFindUnique.mockResolvedValue(null); // No existing user
      mockUserCreate.mockResolvedValue({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        createdAt: mockUser.createdAt,
      });

      const result = await authService.register(
        'test@example.com',
        'password123',
        'John Doe'
      );

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(mockUserCreate).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          password: 'hashed-password',
          name: 'John Doe',
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
      expect(result.email).toBe('test@example.com');
    });

    it('should throw error if email already exists', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);

      await expect(
        authService.register('test@example.com', 'password123', 'John Doe')
      ).rejects.toThrow('Email already registered');
    });
  });

  describe('login', () => {
    it('should return user and tokens on valid credentials', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUserUpdate.mockResolvedValue(mockUser);

      const result = await authService.login('test@example.com', 'password123');

      expect(result.user.email).toBe(mockUser.email);
      expect(result.accessToken).toBe('mock-access-token');
      expect(result.refreshToken).toBe('mock-refresh-token');
    });

    it('should throw error if user not found', async () => {
      mockUserFindUnique.mockResolvedValue(null);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password is incorrect', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should store refresh token in database', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUserUpdate.mockResolvedValue(mockUser);

      await authService.login('test@example.com', 'password123');

      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { refreshToken: 'mock-refresh-token' },
      });
    });
  });

  describe('refresh', () => {
    it('should return new access token for valid refresh token', async () => {
      const { verifyRefreshToken } = require('../utils/jwt');
      verifyRefreshToken.mockReturnValue({ userId: mockUser.id, email: mockUser.email });
      mockUserFindFirst.mockResolvedValue(mockUser);

      const result = await authService.refresh('valid-refresh-token');

      expect(result.accessToken).toBe('mock-access-token');
      expect(mockUserFindFirst).toHaveBeenCalledWith({
        where: { refreshToken: 'valid-refresh-token' },
      });
    });

    it('should throw error for invalid refresh token', async () => {
      const { verifyRefreshToken } = require('../utils/jwt');
      verifyRefreshToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        authService.refresh('invalid-refresh-token')
      ).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('logout', () => {
    it('should clear refresh token on logout', async () => {
      mockUserUpdate.mockResolvedValue(mockUser);

      await authService.logout(mockUser.id);

      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { refreshToken: null },
      });
    });
  });
});
