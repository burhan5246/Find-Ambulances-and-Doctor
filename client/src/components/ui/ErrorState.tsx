import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing['3xl']} ${theme.spacing.xl};
  text-align: center;
  animation: fadeIn 0.3s ease;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fef2f2;
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.error};
`;

const Title = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.gray[700]};
  margin-bottom: ${theme.spacing.sm};
`;

const Message = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray[500]};
  max-width: 320px;
  margin-bottom: ${theme.spacing.lg};
`;

export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn\'t load the data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Wrapper role="alert">
      <IconWrapper>
        <AlertTriangle size={36} />
      </IconWrapper>
      <Title>{title}</Title>
      <Message>{message}</Message>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Wrapper>
  );
}
