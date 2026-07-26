import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import { Plus, Search } from 'lucide-react';

interface ServiceFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddService: () => void;
}

const Container = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%);
  border-radius: ${theme.radii.xl};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing['2xl']};
  box-shadow: 0 10px 30px rgba(15, 118, 110, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.xl};
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Title = styled.h2`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: white;
  margin: 0;
  font-family: ${theme.fonts.heading};
`;

const Subtitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  line-height: 1.5;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.primary[600]};
  pointer-events: none;
  display: flex;
  z-index: 2;
`;

const StyledSearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md} 3rem;
  font-size: ${theme.fontSizes.md};
  font-family: ${theme.fonts.body};
  color: ${theme.colors.gray[900]};
  background: white;
  border: 2px solid white;
  border-radius: ${theme.radii.lg};
  outline: none;
  transition: all ${theme.transitions.normal};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &::placeholder {
    color: ${theme.colors.gray[400]};
  }

  &:focus {
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 8px 20px rgba(15, 118, 110, 0.25);
    outline: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md} ${theme.spacing.sm} 2.5rem;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.lg};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
    border-top: none;
    padding-top: 0;
  }
`;

const AddServiceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: linear-gradient(135deg, ${theme.colors.accent[500]} 0%, ${theme.colors.accent[600]} 100%);
  color: white;
  border: none;
  border-radius: ${theme.radii.lg};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  font-family: ${theme.fonts.body};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  box-shadow: 0 4px 12px rgba(255, 122, 61, 0.3);
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 122, 61, 0.4);
    background: linear-gradient(135deg, ${theme.colors.accent[600]} 0%, ${theme.colors.accent[700]} 100%);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(255, 122, 61, 0.3);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
    padding: ${theme.spacing.md} ${theme.spacing.lg};
  }
`;


export function ServiceFilters({
  searchQuery,
  onSearchChange,
  onAddService,
}: ServiceFiltersProps) {
  return (
    <Container>
      <Content>
        <Header>
          <Title>Find Nearby Services</Title>
          <Subtitle>Search by name or location to find ambulances and doctors instantly</Subtitle>
        </Header>
        <SearchWrapper>
          <SearchIconWrapper>
            <Search size={20} />
          </SearchIconWrapper>
          <StyledSearchInput
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or location..."
            aria-label="Search services"
          />
        </SearchWrapper>
        <Footer>
          <div style={{ flex: 1 }} />
          <AddServiceButton
            onClick={onAddService}
            aria-label="Add new service"
            title="Add new ambulance or doctor service"
          >
            <Plus size={20} />
            Add Service
          </AddServiceButton>
        </Footer>
      </Content>
    </Container>
  );
}
