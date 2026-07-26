import styled from 'styled-components';
import { theme } from '../../styles/theme';

const StyledContainer = styled.main`
  max-width: 1600px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
  flex: 1;
  width: 100%;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
  }
`;

export function Container({ children }: { children: React.ReactNode }) {
  return <StyledContainer>{children}</StyledContainer>;
}
