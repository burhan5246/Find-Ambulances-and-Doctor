import styled, { css, keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const variantStyles = {
  primary: css`
    background: linear-gradient(135deg, ${theme.colors.primary[600]}, ${theme.colors.primary[700]});
    color: white;
    border: none;
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, ${theme.colors.primary[700]}, ${theme.colors.primary[800]});
      transform: translateY(-1px);
      box-shadow: ${theme.shadows.md};
    }
  `,
  secondary: css`
    background: white;
    color: ${theme.colors.gray[700]};
    border: 1px solid ${theme.colors.gray[200]};
    &:hover:not(:disabled) {
      background: ${theme.colors.gray[50]};
      border-color: ${theme.colors.gray[300]};
    }
  `,
  danger: css`
    background: linear-gradient(135deg, ${theme.colors.error}, #dc2626);
    color: white;
    border: none;
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      transform: translateY(-1px);
    }
  `,
  ghost: css`
    background: transparent;
    color: ${theme.colors.gray[600]};
    border: none;
    &:hover:not(:disabled) {
      background: ${theme.colors.gray[100]};
      color: ${theme.colors.gray[800]};
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: 0.375rem 0.75rem;
    font-size: ${theme.fontSizes.sm};
  `,
  md: css`
    padding: 0.5rem 1rem;
    font-size: ${theme.fontSizes.md};
  `,
  lg: css`
    padding: 0.75rem 1.5rem;
    font-size: ${theme.fontSizes.lg};
  `,
};

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $isLoading: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: ${theme.radii.md};
  font-weight: ${theme.fontWeights.medium};
  font-family: ${theme.fonts.body};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  width: ${(p) => (p.$fullWidth ? '100%' : 'auto')};
  opacity: ${(p) => (p.$isLoading ? 0.7 : 1)};
  pointer-events: ${(p) => (p.$isLoading ? 'none' : 'auto')};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  ${(p) => variantStyles[p.$variant]}
  ${(p) => sizeStyles[p.$size]}
`;

const LoadingSpinner = styled.span`
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $isLoading={isLoading}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner aria-hidden="true" />}
      {children}
    </StyledButton>
  );
}
