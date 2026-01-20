import prisma from '../config/database';
import { TaskStatus, Prisma } from '@prisma/client';
import { TaskFilters, PaginationParams } from '../types';

export class TaskService {
  /**
   * Get paginated tasks for a user with optional filters
   * Uses optimized queries with proper indexing
   */
  async getTasks(
    userId: string,
    filters: TaskFilters,
    pagination: PaginationParams
  ) {
    // Build where clause efficiently
    const where: Prisma.TaskWhereInput = { userId };

    if (filters.status) {
      where.status = filters.status as TaskStatus;
    }

    if (filters.search) {
      where.title = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    // Execute queries in parallel for better performance
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
        // Select only needed fields to reduce data transfer
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
        hasNextPage: pagination.page < Math.ceil(total / pagination.limit),
        hasPrevPage: pagination.page > 1,
      },
    };
  }

  /**
   * Get a single task by ID with ownership verification
   */
  async getTaskById(taskId: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  /**
   * Create a new task for a user
   */
  async createTask(
    userId: string,
    data: { title: string; description?: string; status?: TaskStatus }
  ) {
    // Sanitize input
    const sanitizedData = {
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      status: data.status || TaskStatus.PENDING,
      userId,
    };

    return prisma.task.create({
      data: sanitizedData,
    });
  }

  /**
   * Update an existing task with ownership verification
   */
  async updateTask(
    taskId: string,
    userId: string,
    data: { title?: string; description?: string; status?: TaskStatus }
  ) {
    // Verify ownership first
    const task = await this.getTaskById(taskId, userId);

    // Build update data efficiently - only include changed fields
    const updateData: Prisma.TaskUpdateInput = {};
    
    if (data.title !== undefined) {
      updateData.title = data.title.trim();
    }
    if (data.description !== undefined) {
      updateData.description = data.description.trim() || null;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    // Skip update if no fields to update
    if (Object.keys(updateData).length === 0) {
      return task;
    }

    return prisma.task.update({
      where: { id: task.id },
      data: updateData,
    });
  }

  /**
   * Delete a task with ownership verification
   */
  async deleteTask(taskId: string, userId: string) {
    const task = await this.getTaskById(taskId, userId);

    await prisma.task.delete({
      where: { id: task.id },
    });

    return { success: true };
  }

  /**
   * Toggle task status between COMPLETED and PENDING
   */
  async toggleTask(taskId: string, userId: string) {
    const task = await this.getTaskById(taskId, userId);

    const newStatus: TaskStatus =
      task.status === TaskStatus.COMPLETED 
        ? TaskStatus.PENDING 
        : TaskStatus.COMPLETED;

    return prisma.task.update({
      where: { id: task.id },
      data: { status: newStatus },
    });
  }

  /**
   * Bulk update task status (optimization for batch operations)
   */
  async bulkUpdateStatus(taskIds: string[], userId: string, status: TaskStatus) {
    // Verify ownership of all tasks
    const tasks = await prisma.task.findMany({
      where: {
        id: { in: taskIds },
        userId,
      },
      select: { id: true },
    });

    if (tasks.length !== taskIds.length) {
      throw new Error('Some tasks were not found or do not belong to you');
    }

    return prisma.task.updateMany({
      where: {
        id: { in: taskIds },
        userId,
      },
      data: { status },
    });
  }

  /**
   * Get task statistics for a user
   */
  async getTaskStats(userId: string) {
    const [pending, inProgress, completed, total] = await Promise.all([
      prisma.task.count({ where: { userId, status: TaskStatus.PENDING } }),
      prisma.task.count({ where: { userId, status: TaskStatus.IN_PROGRESS } }),
      prisma.task.count({ where: { userId, status: TaskStatus.COMPLETED } }),
      prisma.task.count({ where: { userId } }),
    ]);

    return {
      pending,
      inProgress,
      completed,
      total,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}
