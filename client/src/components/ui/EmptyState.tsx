import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
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
  background: ${theme.colors.gray[100]};
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.gray[400]};
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

export function EmptyState({
  title = 'No results found',
  message = 'Try adjusting your search or filter to find what you\'re looking for.',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Wrapper role="status">
      <IconWrapper>
        <Inbox size={36} />
      </IconWrapper>
      <Title>{title}</Title>
      <Message>{message}</Message>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Wrapper>
  );
}
