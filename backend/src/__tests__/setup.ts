import { PrismaClient } from '@prisma/client';

// Mock Prisma client
export const mockPrisma = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

// Mock environment variables
process.env.JWT_ACCESS_SECRET = 'test_access_secret_for_testing_purposes_12345';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_for_testing_purposes_12345';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
process.env.PORT = '3001';
process.env.FRONTEND_URL = 'http://localhost:3000';

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Cleanup after all tests
afterAll(() => {
  jest.resetModules();
});
