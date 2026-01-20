import {
  registerSchema,
  loginSchema,
  createTaskSchema,
  updateTaskSchema,
  paginationSchema,
} from '../utils/validation';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate a valid registration payload', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'John Doe',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject password shorter than 6 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345',
        name: 'John Doe',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject name shorter than 2 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'J',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate a valid login payload', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('createTaskSchema', () => {
    it('should validate a valid task creation payload', () => {
      const validData = {
        title: 'My Task',
        description: 'Task description',
        status: 'PENDING' as const,
      };

      const result = createTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate task without optional fields', () => {
      const validData = {
        title: 'My Task',
      };

      const result = createTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const invalidData = {
        title: '',
      };

      const result = createTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject title longer than 200 characters', () => {
      const invalidData = {
        title: 'a'.repeat(201),
      };

      const result = createTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid status', () => {
      const invalidData = {
        title: 'My Task',
        status: 'INVALID_STATUS',
      };

      const result = createTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('updateTaskSchema', () => {
    it('should validate a valid update payload', () => {
      const validData = {
        title: 'Updated Title',
        description: 'Updated description',
        status: 'COMPLETED' as const,
      };

      const result = updateTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate partial update', () => {
      const validData = {
        status: 'IN_PROGRESS' as const,
      };

      const result = updateTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate empty update (all optional)', () => {
      const validData = {};

      const result = updateTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('paginationSchema', () => {
    it('should provide default values', () => {
      const result = paginationSchema.parse({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should accept custom pagination values', () => {
      const validData = {
        page: 5,
        limit: 20,
      };

      const result = paginationSchema.parse(validData);
      expect(result.page).toBe(5);
      expect(result.limit).toBe(20);
    });

    it('should reject non-positive page number', () => {
      const invalidData = {
        page: 0,
        limit: 10,
      };

      const result = paginationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject limit greater than 100', () => {
      const invalidData = {
        page: 1,
        limit: 101,
      };

      const result = paginationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
