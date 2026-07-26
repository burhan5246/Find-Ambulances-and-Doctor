import { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import { CheckCircle, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';

interface ToastData {
  id: number;
  type: ToastType;
  message: string;
}

// Simple module-level state for toast notifications
let toastListeners: Array<(toast: ToastData) => void> = [];
let toastId = 0;

export function showToast(type: ToastType, message: string): void {
  const toast: ToastData = { id: ++toastId, type, message };
  toastListeners.forEach((listener) => listener(toast));
}

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
`;

const Container = styled.div`
  position: fixed;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const ToastItem = styled.div<{ $type: ToastType; $exiting: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: white;
  border-radius: ${theme.radii.lg};
  box-shadow: ${theme.shadows.lg};
  border-left: 4px solid ${(p) => (p.$type === 'success' ? theme.colors.success : theme.colors.error)};
  min-width: 300px;
  max-width: 420px;
  animation: ${(p) => (p.$exiting ? slideOut : slideIn)} 0.3s ease forwards;
`;

const IconWrapper = styled.div<{ $type: ToastType }>`
  color: ${(p) => (p.$type === 'success' ? theme.colors.success : theme.colors.error)};
  display: flex;
  flex-shrink: 0;
`;

const ToastMessage = styled.p`
  flex: 1;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray[700]};
  margin: 0;
`;

const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background: transparent;
  color: ${theme.colors.gray[400]};
  cursor: pointer;
  padding: 0.25rem;
  flex-shrink: 0;

  &:hover {
    color: ${theme.colors.gray[600]};
  }
`;

/** Toast container — renders at the app root level */
export function ToastContainer() {
  const [toasts, setToasts] = useState<(ToastData & { exiting: boolean })[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  useEffect(() => {
    const listener = (toast: ToastData) => {
      setToasts((prev) => [...prev, { ...toast, exiting: false }]);

      // Auto-remove after 4 seconds
      setTimeout(() => {
        removeToast(toast.id);
      }, 4000);
    };

    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, [removeToast]);

  return (
    <Container aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} $type={toast.type} $exiting={toast.exiting}>
          <IconWrapper $type={toast.type}>
            {toast.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
          </IconWrapper>
          <ToastMessage>{toast.message}</ToastMessage>
          <CloseBtn onClick={() => removeToast(toast.id)} aria-label="Dismiss notification">
            <X size={16} />
          </CloseBtn>
        </ToastItem>
      ))}
    </Container>
  );
}
