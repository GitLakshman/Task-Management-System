import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { verifyAccessToken } from '../utils/jwt';
import { AuthRequest } from '../types';

// Mock JWT utilities
jest.mock('../utils/jwt', () => ({
  verifyAccessToken: jest.fn(),
}));

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next() for valid token', () => {
    const mockPayload = { userId: 'user-123', email: 'test@example.com' };
    mockRequest.headers = {
      authorization: 'Bearer valid-token',
    };
    (verifyAccessToken as jest.Mock).mockReturnValue(mockPayload);

    authenticate(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(verifyAccessToken).toHaveBeenCalledWith('valid-token');
    expect((mockRequest as AuthRequest).user).toEqual(mockPayload);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 401 if no authorization header', () => {
    mockRequest.headers = {};

    authenticate(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'No token provided',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header does not start with Bearer', () => {
    mockRequest.headers = {
      authorization: 'Basic some-token',
    };

    authenticate(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'No token provided',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 for invalid token', () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };
    (verifyAccessToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticate(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid or expired token',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 for expired token', () => {
    mockRequest.headers = {
      authorization: 'Bearer expired-token',
    };
    (verifyAccessToken as jest.Mock).mockImplementation(() => {
      const error = new Error('jwt expired');
      error.name = 'TokenExpiredError';
      throw error;
    });

    authenticate(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid or expired token',
    });
  });

  it('should extract token correctly from Bearer header', () => {
    const mockPayload = { userId: 'user-123', email: 'test@example.com' };
    mockRequest.headers = {
      authorization: 'Bearer   token-with-spaces',
    };
    (verifyAccessToken as jest.Mock).mockReturnValue(mockPayload);

    authenticate(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Should extract everything after "Bearer " (7 characters)
    expect(verifyAccessToken).toHaveBeenCalledWith('  token-with-spaces');
  });
});
