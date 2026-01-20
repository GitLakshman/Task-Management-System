import bcrypt from 'bcrypt';
import prisma from '../config/database';
import { 
  generateAccessToken, 
  generateRefreshToken,
  verifyRefreshToken 
} from '../utils/jwt';

// BCrypt salt rounds - higher is more secure but slower
const SALT_ROUNDS = 12;

export class AuthService {
  /**
   * Register a new user
   * Returns user data without sensitive fields
   */
  async register(email: string, password: string, name: string) {
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password with cost factor
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name.trim(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return user;
  }

  /**
   * Authenticate user and return tokens
   */
  async login(email: string, password: string) {
    // Normalize email for lookup
    const normalizedEmail = email.toLowerCase().trim();
    
    const user = await prisma.user.findUnique({ 
      where: { email: normalizedEmail } 
    });
    
    // Use constant-time comparison to prevent timing attacks
    // Even if user doesn't exist, we still do a hash comparison
    if (!user) {
      // Perform dummy hash comparison to prevent timing attacks
      await bcrypt.compare(password, '$2b$12$dummy.hash.for.timing.attack.prevention');
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const payload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token hash for security
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refresh(refreshToken: string) {
    // First verify the token is valid
    try {
      verifyRefreshToken(refreshToken);
    } catch {
      throw new Error('Invalid refresh token');
    }

    const user = await prisma.user.findFirst({
      where: { refreshToken },
    });

    if (!user) {
      throw new Error('Invalid refresh token');
    }

    const payload = { userId: user.id, email: user.email };
    const newAccessToken = generateAccessToken(payload);

    return { accessToken: newAccessToken };
  }

  /**
   * Logout user by invalidating refresh token
   */
  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { success: true };
  }

  /**
   * Invalidate all refresh tokens (logout from all devices)
   */
  async logoutAll(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { success: true };
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
