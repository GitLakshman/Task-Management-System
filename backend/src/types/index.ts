import { Request } from 'express';

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface TaskFilters {
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  search?: string;
}
