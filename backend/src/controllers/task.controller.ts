import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { createTaskSchema, updateTaskSchema } from '../utils/validation';
import { AuthRequest } from '../types';

const taskService = new TaskService();

export class TaskController {
  async getTasks(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).user?.userId!;
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as any;
      const search = req.query.search as string;

      const filters = { status, search };
      const pagination = { page, limit, skip: (page - 1) * limit };

      const result = await taskService.getTasks(userId, filters, pagination);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTaskById(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).user?.userId!;
      const task = await taskService.getTaskById(req.params.id, userId);
      res.json({ task });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async createTask(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).user?.userId!;
      const data = createTaskSchema.parse(req.body);
      const task = await taskService.createTask(userId, data);
      res.status(201).json({ task });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).user?.userId!;
      const data = updateTaskSchema.parse(req.body);
      const task = await taskService.updateTask(req.params.id, userId, data);
      res.json({ task });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).user?.userId!;
      await taskService.deleteTask(req.params.id, userId);
      res.json({ message: 'Task deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async toggleTask(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).user?.userId!;
      const task = await taskService.toggleTask(req.params.id, userId);
      res.json({ task });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
