import { useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: ${theme.colors.overlay};
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  opacity: ${(p) => (p.$isOpen ? 1 : 0)};
  visibility: ${(p) => (p.$isOpen ? 'visible' : 'hidden')};
  transition: all ${theme.transitions.normal};
  padding: ${theme.spacing.md};
`;

const Dialog = styled.div`
  background: white;
  border-radius: ${theme.radii.xl};
  box-shadow: ${theme.shadows.xl};
  width: 100%;
  max-width: 420px;
  padding: ${theme.spacing.xl};
  text-align: center;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #fef2f2;
  margin: 0 auto ${theme.spacing.lg};
  color: ${theme.colors.error};
`;

const Title = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.sm};
`;

const Message = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray[500]};
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: center;
`;

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Keyboard handling — Escape to close + focus trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
        return;
      }

      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled)'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    },
    [onCancel]
  );

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Focus the cancel button after render
      requestAnimationFrame(() => {
        const cancelBtn = dialogRef.current?.querySelector<HTMLElement>('button');
        cancelBtn?.focus();
      });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';

      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <Overlay
      $isOpen={isOpen}
      onClick={onCancel}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <Dialog ref={dialogRef} onClick={(e) => e.stopPropagation()}>
        <IconWrapper>
          <AlertTriangle size={28} />
        </IconWrapper>
        <Title id="confirm-dialog-title">{title}</Title>
        <Message id="confirm-dialog-message">{message}</Message>
        <Actions>
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </Actions>
      </Dialog>
    </Overlay>
  );
}
