import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskModal from '../components/tasks/TaskModal';
import type { Task, TaskFormData } from '../types';

describe('TaskModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    task: null,
  };

  const mockTask: Task = {
    id: 'task-123',
    title: 'Existing Task',
    description: 'Existing description',
    status: 'IN_PROGRESS',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Visibility', () => {
    it('should render modal when isOpen is true', () => {
      render(<TaskModal {...defaultProps} />);

      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      render(<TaskModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
    });
  });

  describe('Create Mode', () => {
    it('should show "Create New Task" title when no task is provided', () => {
      render(<TaskModal {...defaultProps} />);

      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });

    it('should show "Create" button when no task is provided', () => {
      render(<TaskModal {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    });

    it('should have empty form fields for new task', () => {
      render(<TaskModal {...defaultProps} />);

      expect(screen.getByPlaceholderText('Enter task title')).toHaveValue('');
      expect(screen.getByPlaceholderText('Enter task description (optional)')).toHaveValue('');
    });

    it('should have PENDING as default status', () => {
      render(<TaskModal {...defaultProps} />);

      expect(screen.getByRole('combobox')).toHaveValue('PENDING');
    });
  });

  describe('Edit Mode', () => {
    it('should show "Edit Task" title when task is provided', () => {
      render(<TaskModal {...defaultProps} task={mockTask} />);

      expect(screen.getByText('Edit Task')).toBeInTheDocument();
    });

    it('should show "Update" button when task is provided', () => {
      render(<TaskModal {...defaultProps} task={mockTask} />);

      expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
    });

    it('should populate form with task data', () => {
      render(<TaskModal {...defaultProps} task={mockTask} />);

      expect(screen.getByPlaceholderText('Enter task title')).toHaveValue('Existing Task');
      expect(screen.getByPlaceholderText('Enter task description (optional)')).toHaveValue('Existing description');
      expect(screen.getByRole('combobox')).toHaveValue('IN_PROGRESS');
    });
  });

  describe('Form Validation', () => {
    it('should show error for empty title', async () => {
      const user = userEvent.setup();
      render(<TaskModal {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: 'Create' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
      });
    });

    it('should show error for title longer than 200 characters', async () => {
      const user = userEvent.setup();
      render(<TaskModal {...defaultProps} />);

      const titleInput = screen.getByPlaceholderText('Enter task title');
      await user.type(titleInput, 'a'.repeat(201));

      const submitButton = screen.getByRole('button', { name: 'Create' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title is too long')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with form data when valid', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);
      render(<TaskModal {...defaultProps} />);

      const titleInput = screen.getByPlaceholderText('Enter task title');
      const descriptionInput = screen.getByPlaceholderText('Enter task description (optional)');

      await user.type(titleInput, 'New Task Title');
      await user.type(descriptionInput, 'New task description');

      const submitButton = screen.getByRole('button', { name: 'Create' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'New Task Title',
          description: 'New task description',
          status: 'PENDING',
        });
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      // Create a promise that doesn't resolve immediately
      let resolveSubmit: (value?: unknown) => void = () => {};
      mockOnSubmit.mockImplementation(() => new Promise((resolve) => {
        resolveSubmit = resolve;
      }));

      render(<TaskModal {...defaultProps} />);

      const titleInput = screen.getByPlaceholderText('Enter task title');
      await user.type(titleInput, 'Test Task');

      const submitButton = screen.getByRole('button', { name: 'Create' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument();
      });

      // Resolve the submission
      resolveSubmit!();
    });
  });

  describe('Modal Actions', () => {
    it('should call onClose when Cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskModal {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when backdrop is clicked', () => {
      render(<TaskModal {...defaultProps} />);

      const backdrop = document.querySelector('.bg-gray-500');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });
  });

  describe('Status Options', () => {
    it('should have all status options available', () => {
      render(<TaskModal {...defaultProps} />);

      const statusSelect = screen.getByRole('combobox');

      expect(statusSelect).toContainHTML('Pending');
      expect(statusSelect).toContainHTML('In Progress');
      expect(statusSelect).toContainHTML('Completed');
    });

    it('should allow changing status', async () => {
      const user = userEvent.setup();
      render(<TaskModal {...defaultProps} />);

      const statusSelect = screen.getByRole('combobox');
      await user.selectOptions(statusSelect, 'COMPLETED');

      expect(statusSelect).toHaveValue('COMPLETED');
    });
  });
});
