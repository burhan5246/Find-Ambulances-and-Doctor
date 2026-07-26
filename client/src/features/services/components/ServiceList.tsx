import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import type { Service } from '../../../types/service';
import type { PaginationMeta, ServiceTotals } from '../../../types/api';
import { ServiceCard } from './ServiceCard';
import { Spinner, EmptyState, ErrorState, Pagination } from '../../../components/ui';
import { Ambulance, Stethoscope, LayoutGrid } from 'lucide-react';
import type { ServiceType } from '../../../types/service';

interface ServiceListProps {
  data: Service[];
  pagination: PaginationMeta | null;
  totals: ServiceTotals | null;
  isLoading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onRetry: () => void;
  onAddService: () => void;
  activeTypeFilter?: ServiceType;
  onTypeFilterChange?: (type: ServiceType | undefined) => void;
}

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing['2xl']};
  padding: ${theme.spacing.xl};
  background: linear-gradient(135deg, ${theme.colors.primary[50]}, ${theme.colors.accent[50]});
  border-radius: ${theme.radii.xl};
  border: 1px solid ${theme.colors.gray[100]};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.lg};
  }
`;

const StatCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  padding: 0;
`;

const StatIcon = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: ${theme.radii.lg};
  background: ${(p) => p.$color};
  flex-shrink: 0;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const StatLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray[600]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: ${theme.fontWeights.medium};
`;

const StatNumber = styled.span`
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.gray[900]};
  line-height: 1.1;
`;

const StatSubtitle = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray[500]};
  font-weight: ${theme.fontWeights.normal};
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.sm};
  }
`;

const Section = styled.section`
  animation: fadeIn 0.3s ease;
`;

const TabRow = styled.div`
  display: flex;
  gap: 0.25rem;
  background: ${theme.colors.gray[100]};
  border-radius: ${theme.radii.lg};
  padding: 0.25rem;
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${theme.radii.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${(p) => (p.$active ? theme.fontWeights.semibold : theme.fontWeights.medium)};
  font-family: ${theme.fonts.body};
  color: ${(p) => (p.$active ? theme.colors.primary[700] : theme.colors.gray[600])};
  background: ${(p) => (p.$active ? 'white' : 'transparent')};
  box-shadow: ${(p) => (p.$active ? theme.shadows.sm : 'none')};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    color: ${(p) => (p.$active ? theme.colors.primary[700] : theme.colors.gray[800])};
  }
`;

export function ServiceList({
  data,
  pagination,
  totals,
  isLoading,
  error,
  onPageChange,
  onEdit,
  onDelete,
  onRetry,
  onAddService,
  activeTypeFilter,
  onTypeFilterChange,
}: ServiceListProps) {
  const showTabs = onTypeFilterChange !== undefined;

  return (
    <Section>
      {/* Summary Stats — FR-6 */}
      {totals && (
        <StatsRow>
          <StatCard>
            <StatIcon $color={theme.colors.ambulance.bg}>
              <Ambulance size={24} color={theme.colors.ambulance.text} />
            </StatIcon>
            <StatInfo>
              <StatLabel>Total Ambulances</StatLabel>
              <StatNumber>{totals.ambulance}</StatNumber>
              <StatSubtitle>Active Services</StatSubtitle>
            </StatInfo>
          </StatCard>
          <StatCard>
            <StatIcon $color={theme.colors.doctor.bg}>
              <Stethoscope size={24} color={theme.colors.doctor.text} />
            </StatIcon>
            <StatInfo>
              <StatLabel>Total Doctors</StatLabel>
              <StatNumber>{totals.doctor}</StatNumber>
              <StatSubtitle>Available Now</StatSubtitle>
            </StatInfo>
          </StatCard>
        </StatsRow>
      )}

      {showTabs && (
        <TabRow role="tablist" aria-label="Filter services by type">
          <TabButton
            $active={activeTypeFilter === undefined}
            onClick={() => onTypeFilterChange?.(undefined)}
            aria-pressed={activeTypeFilter === undefined}
            role="tab"
          >
            <LayoutGrid size={14} />
            All
          </TabButton>
          <TabButton
            $active={activeTypeFilter === 'ambulance'}
            onClick={() => onTypeFilterChange?.('ambulance')}
            aria-pressed={activeTypeFilter === 'ambulance'}
            role="tab"
          >
            <Ambulance size={14} />
            Ambulances
          </TabButton>
          <TabButton
            $active={activeTypeFilter === 'doctor'}
            onClick={() => onTypeFilterChange?.('doctor')}
            aria-pressed={activeTypeFilter === 'doctor'}
            role="tab"
          >
            <Stethoscope size={14} />
            Doctors
          </TabButton>
        </TabRow>
      )}

      {/* Loading state — FR-8 */}
      {isLoading && <Spinner message="Loading services..." />}

      {/* Error state — FR-9 */}
      {!isLoading && error && (
        <ErrorState
          message={error}
          onRetry={onRetry}
        />
      )}

      {/* Empty state — FR-10 */}
      {!isLoading && !error && data.length === 0 && (
        <EmptyState
          title="No services found"
          message="Get started by adding your first ambulance or doctor service."
          actionLabel="Add Service"
          onAction={onAddService}
        />
      )}

      {/* Data — Service cards grid */}
      {!isLoading && !error && data.length > 0 && (
        <>
          <Grid>
            {data.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </Grid>

          {/* Pagination — FR-5 */}
          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </Section>
  );
}
