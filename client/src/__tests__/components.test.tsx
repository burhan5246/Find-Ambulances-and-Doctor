import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Spinner } from '../components/ui/Spinner';
import { Pagination } from '../components/ui/Pagination';
import { ServiceList } from '../features/services/components/ServiceList';
import type { Service } from '../types/service';

describe('Badge', () => {
  it('renders ambulance badge', () => {
    render(<Badge type="ambulance" />);
    expect(screen.getByText('ambulance')).toBeInTheDocument();
    expect(screen.getByLabelText('Type: ambulance')).toBeInTheDocument();
  });

  it('renders doctor badge', () => {
    render(<Badge type="doctor" />);
    expect(screen.getByText('doctor')).toBeInTheDocument();
  });
});

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loading spinner when isLoading', () => {
    render(<Button isLoading>Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onClick handler', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click</Button>);

    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('EmptyState', () => {
  it('renders default message', () => {
    render(<EmptyState />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders custom title and message', () => {
    render(<EmptyState title="Nothing here" message="Add something" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByText('Add something')).toBeInTheDocument();
  });

  it('renders action button when provided', async () => {
    const handleAction = jest.fn();
    render(<EmptyState actionLabel="Add Item" onAction={handleAction} />);

    const button = screen.getByText('Add Item');
    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});

describe('ErrorState', () => {
  it('renders default error message', () => {
    render(<ErrorState />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', async () => {
    const handleRetry = jest.fn();
    render(<ErrorState onRetry={handleRetry} />);

    await userEvent.click(screen.getByText('Try Again'));
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('has alert role for accessibility', () => {
    render(<ErrorState />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

describe('Spinner', () => {
  it('renders with default message', () => {
    render(<Spinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<Spinner message="Fetching data..." />);
    expect(screen.getByText('Fetching data...')).toBeInTheDocument();
  });

  it('has status role for accessibility', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

describe('ServiceList', () => {
  const service: Service = {
    id: 1,
    title: 'Quick Rescue',
    description: 'Fast response ambulance service',
    location: 'Downtown',
    type: 'ambulance',
    imageUrl: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  it('renders category tabs and notifies the parent when a tab is selected', async () => {
    const handleTypeFilterChange = jest.fn();

    render(
      <ServiceList
        data={[service]}
        pagination={null}
        totals={null}
        isLoading={false}
        error={null}
        onPageChange={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onRetry={jest.fn()}
        onAddService={jest.fn()}
        activeTypeFilter={undefined}
        onTypeFilterChange={handleTypeFilterChange}
      />
    );

    await userEvent.click(screen.getByRole('tab', { name: /ambulances/i }));

    expect(handleTypeFilterChange).toHaveBeenCalledWith('ambulance');
  });
});

describe('Pagination', () => {
  const defaultProps = {
    page: 1,
    totalPages: 3,
    total: 25,
    limit: 10,
    hasNextPage: true,
    hasPrevPage: false,
    onPageChange: jest.fn(),
  };

  it('renders page information', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText(/Showing 1–10 of 25/)).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('enables next button when hasNextPage', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByLabelText('Next page')).not.toBeDisabled();
  });

  it('calls onPageChange when clicking next', async () => {
    const handleChange = jest.fn();
    render(<Pagination {...defaultProps} onPageChange={handleChange} />);

    await userEvent.click(screen.getByLabelText('Next page'));
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it('does not render when totalPages is 1', () => {
    const { container } = render(
      <Pagination {...defaultProps} totalPages={1} hasNextPage={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('marks current page with aria-current', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByLabelText('Page 1')).toHaveAttribute('aria-current', 'page');
  });
});
