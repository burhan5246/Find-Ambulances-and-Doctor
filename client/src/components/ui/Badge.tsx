import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { ServiceType } from '../../types/service';

interface BadgeProps {
  type: ServiceType;
}

const StyledBadge = styled.span<{ $type: ServiceType }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.normal};
  text-transform: capitalize;
  letter-spacing: 0.05em;
  border-radius: ${theme.radii.full};
  background: ${(p) =>
    p.$type === 'ambulance' ? theme.colors.ambulance.bg : theme.colors.doctor.bg};
  color: ${(p) =>
    p.$type === 'ambulance' ? theme.colors.ambulance.text : theme.colors.doctor.text};
  border: 1px solid
    ${(p) =>
      p.$type === 'ambulance' ? theme.colors.ambulance.border : theme.colors.doctor.border};
`;

const Dot = styled.span<{ $type: ServiceType }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) =>
    p.$type === 'ambulance' ? theme.colors.ambulance.badge : theme.colors.doctor.badge};
`;

export function Badge({ type }: BadgeProps) {
  return (
    <StyledBadge $type={type} aria-label={`Type: ${type}`}>
      <Dot $type={type} aria-hidden="true" />
      {type}
    </StyledBadge>
  );
}
