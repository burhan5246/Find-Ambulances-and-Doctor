import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.gray[400]};
  pointer-events: none;
  display: flex;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 2.75rem;
  font-size: ${theme.fontSizes.md};
  font-family: ${theme.fonts.body};
  color: ${theme.colors.gray[800]};
  background: white;
  border: 1.5px solid ${theme.colors.gray[200]};
  border-radius: ${theme.radii.lg};
  outline: none;
  transition: all ${theme.transitions.fast};

  &::placeholder {
    color: ${theme.colors.gray[400]};
  }

  &:focus {
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  background: transparent;
  border-radius: ${theme.radii.md};
  color: ${theme.colors.gray[400]};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[600]};
  }
`;

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search by title or location...',
}: SearchInputProps) {
  return (
    <Wrapper>
      <SearchIcon>
        <Search size={18} />
      </SearchIcon>
      <StyledInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search services"
      />
      {value && (
        <ClearButton onClick={() => onChange('')} aria-label="Clear search">
          <X size={16} />
        </ClearButton>
      )}
    </Wrapper>
  );
}
