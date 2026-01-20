import { TaskStatus } from '@prisma/client';

// Create mock before using it
const mockFindMany = jest.fn();
const mockFindFirst = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockCount = jest.fn();

// Mock the database module
jest.mock('../config/database', () => ({
  __esModule: true,
  default: {
    task: {
      findMany: mockFindMany,
      findFirst: mockFindFirst,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
      count: mockCount,
    },
  },
}));

import { TaskService } from '../services/task.service';

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
    jest.clearAllMocks();
  });

  const mockUserId = 'user-123';
  const mockTask = {
    id: 'task-123',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('getTasks', () => {
    it('should return paginated tasks for a user', async () => {
      const mockTasks = [mockTask];
      mockFindMany.mockResolvedValue(mockTasks);
      mockCount.mockResolvedValue(1);

      const result = await taskService.getTasks(
        mockUserId,
        {},
        { page: 1, limit: 10, skip: 0 }
      );

      expect(result.tasks).toEqual(mockTasks);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('should filter tasks by status', async () => {
      mockFindMany.mockResolvedValue([mockTask]);
      mockCount.mockResolvedValue(1);

      await taskService.getTasks(
        mockUserId,
        { status: TaskStatus.PENDING },
        { page: 1, limit: 10, skip: 0 }
      );

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: mockUserId,
            status: TaskStatus.PENDING,
          }),
        })
      );
    });

    it('should filter tasks by search query', async () => {
      mockFindMany.mockResolvedValue([mockTask]);
      mockCount.mockResolvedValue(1);

      await taskService.getTasks(
        mockUserId,
        { search: 'Test' },
        { page: 1, limit: 10, skip: 0 }
      );

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            title: {
              contains: 'Test',
              mode: 'insensitive',
            },
          }),
        })
      );
    });

    it('should calculate correct pagination', async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(25);

      const result = await taskService.getTasks(
        mockUserId,
        {},
        { page: 2, limit: 10, skip: 10 }
      );

      expect(result.pagination.totalPages).toBe(3);
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      );
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      mockFindFirst.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById('task-123', mockUserId);

      expect(result).toEqual(mockTask);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: 'task-123', userId: mockUserId },
      });
    });

    it('should throw error if task not found', async () => {
      mockFindFirst.mockResolvedValue(null);

      await expect(
        taskService.getTaskById('non-existent', mockUserId)
      ).rejects.toThrow('Task not found');
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const createData = {
        title: 'New Task',
        description: 'New Description',
      };
      mockCreate.mockResolvedValue({ ...mockTask, ...createData });

      const result = await taskService.createTask(mockUserId, createData);

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          title: createData.title,
          description: createData.description,
          status: TaskStatus.PENDING,
          userId: mockUserId,
        },
      });
      expect(result.title).toBe(createData.title);
    });

    it('should use provided status if given', async () => {
      const createData = {
        title: 'New Task',
        status: TaskStatus.IN_PROGRESS,
      };
      mockCreate.mockResolvedValue({ ...mockTask, ...createData });

      await taskService.createTask(mockUserId, createData);

      expect(mockCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          status: TaskStatus.IN_PROGRESS,
        }),
      });
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      mockFindFirst.mockResolvedValue(mockTask);
      mockUpdate.mockResolvedValue({
        ...mockTask,
        title: 'Updated Title',
      });

      const result = await taskService.updateTask('task-123', mockUserId, {
        title: 'Updated Title',
      });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        data: { title: 'Updated Title' },
      });
      expect(result.title).toBe('Updated Title');
    });

    it('should throw error if task does not exist', async () => {
      mockFindFirst.mockResolvedValue(null);

      await expect(
        taskService.updateTask('non-existent', mockUserId, { title: 'Test' })
      ).rejects.toThrow('Task not found');
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task', async () => {
      mockFindFirst.mockResolvedValue(mockTask);
      mockDelete.mockResolvedValue(mockTask);

      await taskService.deleteTask('task-123', mockUserId);

      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: mockTask.id },
      });
    });

    it('should throw error if task does not exist', async () => {
      mockFindFirst.mockResolvedValue(null);

      await expect(
        taskService.deleteTask('non-existent', mockUserId)
      ).rejects.toThrow('Task not found');
    });
  });

  describe('toggleTask', () => {
    it('should toggle PENDING task to COMPLETED', async () => {
      const pendingTask = { ...mockTask, status: TaskStatus.PENDING };
      mockFindFirst.mockResolvedValue(pendingTask);
      mockUpdate.mockResolvedValue({
        ...pendingTask,
        status: TaskStatus.COMPLETED,
      });

      const result = await taskService.toggleTask('task-123', mockUserId);

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        data: { status: TaskStatus.COMPLETED },
      });
      expect(result.status).toBe(TaskStatus.COMPLETED);
    });

    it('should toggle COMPLETED task to PENDING', async () => {
      const completedTask = { ...mockTask, status: TaskStatus.COMPLETED };
      mockFindFirst.mockResolvedValue(completedTask);
      mockUpdate.mockResolvedValue({
        ...completedTask,
        status: TaskStatus.PENDING,
      });

      const result = await taskService.toggleTask('task-123', mockUserId);

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        data: { status: TaskStatus.PENDING },
      });
      expect(result.status).toBe(TaskStatus.PENDING);
    });

    it('should toggle IN_PROGRESS task to COMPLETED', async () => {
      const inProgressTask = { ...mockTask, status: TaskStatus.IN_PROGRESS };
      mockFindFirst.mockResolvedValue(inProgressTask);
      mockUpdate.mockResolvedValue({
        ...inProgressTask,
        status: TaskStatus.COMPLETED,
      });

      const result = await taskService.toggleTask('task-123', mockUserId);

      expect(result.status).toBe(TaskStatus.COMPLETED);
    });
  });
});
