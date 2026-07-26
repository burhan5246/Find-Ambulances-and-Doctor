import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

interface SpinnerProps {
  size?: number;
  message?: string;
}

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing['3xl']} ${theme.spacing.md};
`;

const SpinnerCircle = styled.div<{ $size: number }>`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border: 3px solid ${theme.colors.gray[200]};
  border-top-color: ${theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Message = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray[500]};
`;

export function Spinner({ size = 40, message = 'Loading...' }: SpinnerProps) {
  return (
    <Wrapper role="status" aria-label={message}>
      <SpinnerCircle $size={size} />
      <Message>{message}</Message>
    </Wrapper>
  );
}
