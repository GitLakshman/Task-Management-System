import { describe, it, expect } from 'vitest';
import type { User, Task, LoginData, RegisterData, TaskFormData } from '../types';

describe('Type Definitions', () => {
  describe('User Type', () => {
    it('should accept valid user object', () => {
      const user: User = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'John Doe',
      };

      expect(user.id).toBe('user-123');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('John Doe');
    });
  });

  describe('Task Type', () => {
    it('should accept valid task object with all fields', () => {
      const task: Task = {
        id: 'task-123',
        title: 'Test Task',
        description: 'Task description',
        status: 'PENDING',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z',
      };

      expect(task.id).toBe('task-123');
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Task description');
      expect(task.status).toBe('PENDING');
    });

    it('should accept task without optional description', () => {
      const task: Task = {
        id: 'task-456',
        title: 'Another Task',
        status: 'IN_PROGRESS',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z',
      };

      expect(task.description).toBeUndefined();
    });

    it('should accept all valid status values', () => {
      const pendingTask: Task = {
        id: '1',
        title: 'Task',
        status: 'PENDING',
        createdAt: '',
        updatedAt: '',
      };

      const inProgressTask: Task = {
        id: '2',
        title: 'Task',
        status: 'IN_PROGRESS',
        createdAt: '',
        updatedAt: '',
      };

      const completedTask: Task = {
        id: '3',
        title: 'Task',
        status: 'COMPLETED',
        createdAt: '',
        updatedAt: '',
      };

      expect(pendingTask.status).toBe('PENDING');
      expect(inProgressTask.status).toBe('IN_PROGRESS');
      expect(completedTask.status).toBe('COMPLETED');
    });
  });

  describe('LoginData Type', () => {
    it('should accept valid login data', () => {
      const loginData: LoginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      expect(loginData.email).toBe('test@example.com');
      expect(loginData.password).toBe('password123');
    });
  });

  describe('RegisterData Type', () => {
    it('should accept valid register data', () => {
      const registerData: RegisterData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
      };

      expect(registerData.email).toBe('test@example.com');
      expect(registerData.password).toBe('password123');
      expect(registerData.name).toBe('John Doe');
    });
  });

  describe('TaskFormData Type', () => {
    it('should accept task form data with all fields', () => {
      const formData: TaskFormData = {
        title: 'New Task',
        description: 'Task description',
        status: 'IN_PROGRESS',
      };

      expect(formData.title).toBe('New Task');
      expect(formData.description).toBe('Task description');
      expect(formData.status).toBe('IN_PROGRESS');
    });

    it('should accept task form data with only required fields', () => {
      const formData: TaskFormData = {
        title: 'New Task',
      };

      expect(formData.title).toBe('New Task');
      expect(formData.description).toBeUndefined();
      expect(formData.status).toBeUndefined();
    });
  });
});
