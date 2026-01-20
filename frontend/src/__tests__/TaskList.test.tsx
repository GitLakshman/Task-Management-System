import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../components/tasks/TaskList';
import type { Task } from '../types';

describe('TaskList Component', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnToggle = vi.fn();

  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'First Task',
      description: 'First task description',
      status: 'PENDING',
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z',
    },
    {
      id: 'task-2',
      title: 'Second Task',
      description: 'Second task description',
      status: 'IN_PROGRESS',
      createdAt: '2024-01-16T10:00:00.000Z',
      updatedAt: '2024-01-16T10:00:00.000Z',
    },
    {
      id: 'task-3',
      title: 'Completed Task',
      status: 'COMPLETED',
      createdAt: '2024-01-17T10:00:00.000Z',
      updatedAt: '2024-01-17T10:00:00.000Z',
    },
  ];

  const defaultProps = {
    tasks: mockTasks,
    isLoading: false,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    onToggle: mockOnToggle,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading spinner when isLoading is true', () => {
      render(<TaskList {...defaultProps} isLoading={true} />);

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should not show tasks when loading', () => {
      render(<TaskList {...defaultProps} isLoading={true} />);

      expect(screen.queryByText('First Task')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty message when no tasks', () => {
      render(<TaskList {...defaultProps} tasks={[]} />);

      expect(screen.getByText('No tasks found. Create your first task!')).toBeInTheDocument();
    });
  });

  describe('Task Display', () => {
    it('should render all tasks', () => {
      render(<TaskList {...defaultProps} />);

      expect(screen.getByText('First Task')).toBeInTheDocument();
      expect(screen.getByText('Second Task')).toBeInTheDocument();
      expect(screen.getByText('Completed Task')).toBeInTheDocument();
    });

    it('should render task descriptions', () => {
      render(<TaskList {...defaultProps} />);

      expect(screen.getByText('First task description')).toBeInTheDocument();
      expect(screen.getByText('Second task description')).toBeInTheDocument();
    });

    it('should not render description if not provided', () => {
      render(<TaskList {...defaultProps} />);

      // Completed Task has no description
      const completedTaskItem = screen.getByText('Completed Task').closest('li');
      expect(completedTaskItem).not.toHaveTextContent('description');
    });

    it('should display correct status badges', () => {
      render(<TaskList {...defaultProps} />);

      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('should format dates correctly', () => {
      render(<TaskList {...defaultProps} />);

      // Check that dates are formatted (exact format depends on locale)
      const dateElements = screen.getAllByText(/Created:/);
      expect(dateElements).toHaveLength(3);
    });
  });

  describe('Task Actions', () => {
    it('should call onEdit when Edit button is clicked', () => {
      render(<TaskList {...defaultProps} />);

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      expect(mockOnEdit).toHaveBeenCalledWith(mockTasks[0]);
    });

    it('should call onDelete when Delete button is clicked', () => {
      render(<TaskList {...defaultProps} />);

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[1]);

      expect(mockOnDelete).toHaveBeenCalledWith('task-2');
    });

    it('should call onToggle when toggle button is clicked', () => {
      render(<TaskList {...defaultProps} />);

      const completeButtons = screen.getAllByText('Complete');
      fireEvent.click(completeButtons[0]);

      expect(mockOnToggle).toHaveBeenCalledWith('task-1');
    });

    it('should show "Complete" button for non-completed tasks', () => {
      const pendingTasks = [mockTasks[0]];
      render(<TaskList {...defaultProps} tasks={pendingTasks} />);

      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    it('should show "Reopen" button for completed tasks', () => {
      const completedTasks = [mockTasks[2]];
      render(<TaskList {...defaultProps} tasks={completedTasks} />);

      expect(screen.getByText('Reopen')).toBeInTheDocument();
    });
  });

  describe('Status Badge Colors', () => {
    it('should apply correct color classes for PENDING status', () => {
      render(<TaskList {...defaultProps} tasks={[mockTasks[0]]} />);

      const badge = screen.getByText('Pending');
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('should apply correct color classes for IN_PROGRESS status', () => {
      render(<TaskList {...defaultProps} tasks={[mockTasks[1]]} />);

      const badge = screen.getByText('In Progress');
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
    });

    it('should apply correct color classes for COMPLETED status', () => {
      render(<TaskList {...defaultProps} tasks={[mockTasks[2]]} />);

      const badge = screen.getByText('Completed');
      expect(badge).toHaveClass('bg-green-100', 'text-green-800');
    });
  });
});
