import { forwardRef } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
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

const StyledTextArea = styled.textarea<{ $hasError: boolean }>`
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
  min-height: 100px;
  resize: vertical;

  &::placeholder {
    color: ${theme.colors.gray[400]};
  }

  &:focus {
    border-color: ${(p) => (p.$hasError ? theme.colors.error : theme.colors.primary[500])};
    box-shadow: 0 0 0 3px ${(p) =>
      p.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(20, 184, 166, 0.1)'};
  }

  &:disabled {
    background: ${theme.colors.gray[50]};
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.error};
`;

const HelperText = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray[500]};
`;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <Wrapper>
        <Label htmlFor={inputId}>{label}</Label>
        <StyledTextArea
          ref={ref}
          id={inputId}
          $hasError={!!error}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <ErrorText id={`${inputId}-error`} role="alert">
            {error}
          </ErrorText>
        )}
        {helperText && !error && <HelperText>{helperText}</HelperText>}
      </Wrapper>
    );
  }
);

TextArea.displayName = 'TextArea';
