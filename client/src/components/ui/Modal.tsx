import { useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: ${theme.colors.overlay};
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${(p) => (p.$isOpen ? 1 : 0)};
  visibility: ${(p) => (p.$isOpen ? 'visible' : 'hidden')};
  transition: all ${theme.transitions.normal};
  padding: ${theme.spacing.md};
`;

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  background: white;
  border-radius: ${theme.radii.xl};
  box-shadow: ${theme.shadows.xl};
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  transform: ${(p) => (p.$isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)')};
  transition: transform ${theme.transitions.normal};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.gray[100]};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.fontSizes['xl']};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.gray[900]};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  border-radius: ${theme.radii.md};
  color: ${theme.colors.gray[400]};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[600]};
  }
`;

const ModalBody = styled.div`
  padding: ${theme.spacing.xl};
`;

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap: trap focus inside modal when open
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Focus first focusable element after render
      requestAnimationFrame(() => {
        const firstInput = modalRef.current?.querySelector<HTMLElement>(
          'input, select, textarea'
        );
        firstInput?.focus();
      });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';

      // Return focus to trigger element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <ModalContainer
        ref={modalRef}
        $isOpen={isOpen}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </CloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContainer>
    </Overlay>
  );
}
