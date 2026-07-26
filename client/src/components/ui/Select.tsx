import { forwardRef } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const Label = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.gray[700]};
`;

const StyledSelect = styled.select<{ $hasError: boolean }>`
  padding: 0.625rem 0.875rem;
  font-size: ${theme.fontSizes.md};
  font-family: ${theme.fonts.body};
  color: ${theme.colors.gray[800]};
  background: white;
  border: 1.5px solid ${(p) => (p.$hasError ? theme.colors.error : theme.colors.gray[200])};
  border-radius: ${theme.radii.md};
  outline: none;
  transition: all ${theme.transitions.fast};
  width: 100%;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;

  &:focus {
    border-color: ${(p) => (p.$hasError ? theme.colors.error : theme.colors.primary[500])};
    box-shadow: 0 0 0 3px ${(p) =>
      p.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(20, 184, 166, 0.1)'};
  }

  &:disabled {
    background-color: ${theme.colors.gray[50]};
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.error};
`;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, id, ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <Wrapper>
        <Label htmlFor={selectId}>{label}</Label>
        <StyledSelect
          ref={ref}
          id={selectId}
          $hasError={!!error}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </StyledSelect>
        {error && (
          <ErrorText id={`${selectId}-error`} role="alert">
            {error}
          </ErrorText>
        )}
      </Wrapper>
    );
  }
);

Select.displayName = 'Select';
