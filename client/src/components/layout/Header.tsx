import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Plus, Heart } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onAddService: () => void;
}

const StyledHeader = styled.header`
  background: linear-gradient(135deg, ${theme.colors.primary[700]}, ${theme.colors.primary[900]});
  color: white;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  box-shadow: ${theme.shadows.md};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
`;

const LogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${theme.radii.lg};
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
`;

const AppTitle = styled.h1`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: white;
  margin: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const Subtitle = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: rgba(255, 255, 255, 0.7);
  font-weight: ${theme.fontWeights.normal};
  display: block;
`;

export function Header({ onAddService }: HeaderProps) {
  return (
    <StyledHeader>
      <HeaderInner>
        <LogoGroup>
          <LogoIcon>
            <Heart size={22} fill="rgba(255,255,255,0.9)" stroke="none" />
          </LogoIcon>
          <div>
            <AppTitle>Emergency Services</AppTitle>
            <Subtitle>Find nearby ambulances & doctors</Subtitle>
          </div>
        </LogoGroup>
        <Button
          variant="secondary"
          onClick={onAddService}
          aria-label="Add new service"
        >
          <Plus size={18} />
          Add Service
        </Button>
      </HeaderInner>
    </StyledHeader>
  );
}
