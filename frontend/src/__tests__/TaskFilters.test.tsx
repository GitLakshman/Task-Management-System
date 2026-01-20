import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskFilters from '../components/tasks/TaskFilters';

describe('TaskFilters Component', () => {
  const mockOnStatusChange = vi.fn();
  const mockOnSearchChange = vi.fn();

  const defaultProps = {
    statusFilter: '',
    searchQuery: '',
    onStatusChange: mockOnStatusChange,
    onSearchChange: mockOnSearchChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search input and status filter', () => {
    render(<TaskFilters {...defaultProps} />);

    expect(screen.getByPlaceholderText('Search by title...')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Status')).toBeInTheDocument();
  });

  it('should call onSearchChange when search input changes', () => {
    render(<TaskFilters {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search by title...');
    fireEvent.change(searchInput, { target: { value: 'My task' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('My task');
  });

  it('should call onStatusChange when status filter changes', () => {
    render(<TaskFilters {...defaultProps} />);

    const statusSelect = screen.getByLabelText('Filter by Status');
    fireEvent.change(statusSelect, { target: { value: 'PENDING' } });

    expect(mockOnStatusChange).toHaveBeenCalledWith('PENDING');
  });

  it('should display all status options', () => {
    render(<TaskFilters {...defaultProps} />);

    const statusSelect = screen.getByLabelText('Filter by Status');
    
    expect(statusSelect).toContainHTML('All Tasks');
    expect(statusSelect).toContainHTML('Pending');
    expect(statusSelect).toContainHTML('In Progress');
    expect(statusSelect).toContainHTML('Completed');
  });

  it('should show Clear Filters button when filters are applied', () => {
    render(
      <TaskFilters
        {...defaultProps}
        statusFilter="PENDING"
        searchQuery="test"
      />
    );

    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  it('should not show Clear Filters button when no filters are applied', () => {
    render(<TaskFilters {...defaultProps} />);

    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();
  });

  it('should clear both filters when Clear Filters is clicked', () => {
    render(
      <TaskFilters
        {...defaultProps}
        statusFilter="COMPLETED"
        searchQuery="test task"
      />
    );

    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);

    expect(mockOnStatusChange).toHaveBeenCalledWith('');
    expect(mockOnSearchChange).toHaveBeenCalledWith('');
  });

  it('should show current search query in input', () => {
    render(
      <TaskFilters
        {...defaultProps}
        searchQuery="existing search"
      />
    );

    const searchInput = screen.getByPlaceholderText('Search by title...');
    expect(searchInput).toHaveValue('existing search');
  });

  it('should show current status filter in select', () => {
    render(
      <TaskFilters
        {...defaultProps}
        statusFilter="IN_PROGRESS"
      />
    );

    const statusSelect = screen.getByLabelText('Filter by Status');
    expect(statusSelect).toHaveValue('IN_PROGRESS');
  });
});
