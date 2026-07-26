import styled from 'styled-components';
import { theme } from '../../styles/theme';

const StyledCard = styled.article`
  background: white;
  border-radius: ${theme.radii.lg};
  border: 1px solid ${theme.colors.gray[100]};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
  transition: all ${theme.transitions.normal};
  animation: slideUp 0.3s ease forwards;

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
    border-color: ${theme.colors.gray[200]};
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export function Card({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <StyledCard {...props}>{children}</StyledCard>;
}
