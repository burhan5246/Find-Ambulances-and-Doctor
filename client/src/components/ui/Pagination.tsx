import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

const Wrapper = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.lg} 0;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
`;

const Info = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray[500]};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 0.5rem;
  border: 1px solid ${(p) => (p.$active ? theme.colors.primary[500] : theme.colors.gray[200])};
  background: ${(p) => (p.$active ? theme.colors.primary[500] : 'white')};
  color: ${(p) => (p.$active ? 'white' : theme.colors.gray[700])};
  border-radius: ${theme.radii.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${(p) => (p.$active ? theme.fontWeights.semibold : theme.fontWeights.normal)};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover:not(:disabled):not([data-active='true']) {
    background: ${theme.colors.gray[50]};
    border-color: ${theme.colors.gray[300]};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 2.25rem;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray[400]};
`;

/** Generate an array of page numbers with ellipsis */
function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 3) {
    pages.push('ellipsis');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('ellipsis');
  }

  pages.push(total);

  return pages;
}

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <Wrapper aria-label="Pagination">
      <Info>
        Showing {start}–{end} of {total} results
      </Info>
      <Controls>
        <PageButton
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </PageButton>

        {pageNumbers.map((pageNum, index) =>
          pageNum === 'ellipsis' ? (
            <Ellipsis key={`ellipsis-${index}`}>…</Ellipsis>
          ) : (
            <PageButton
              key={pageNum}
              $active={pageNum === page}
              data-active={pageNum === page}
              onClick={() => onPageChange(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={pageNum === page ? 'page' : undefined}
            >
              {pageNum}
            </PageButton>
          )
        )}

        <PageButton
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </PageButton>
      </Controls>
    </Wrapper>
  );
}
