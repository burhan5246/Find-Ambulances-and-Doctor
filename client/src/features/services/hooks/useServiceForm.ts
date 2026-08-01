import { useState, useCallback } from 'react';
import { servicesApi, ApiClientError } from '../../../api/servicesApi';
import type { Service, CreateServiceInput, UpdateServiceInput } from '../../../types/service';
import { showToast } from '../../../components/ui/Toast';

interface FieldErrors {
  [key: string]: string;
}

interface UseServiceFormReturn {
  isSubmitting: boolean;
  fieldErrors: FieldErrors;
  handleCreate: (input: CreateServiceInput) => Promise<Service | null>;
  handleUpdate: (id: number, input: UpdateServiceInput) => Promise<Service | null>;
  handleDelete: (id: number) => Promise<boolean>;
  clearFieldErrors: () => void;
}

/**
 * Custom hook for service form operations (create, update, delete).
 * Maps backend validation errors to field-level errors for inline display.
 */
export function useServiceForm(onSuccess: (isDeleted?: boolean) => void): UseServiceFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const clearFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  /** Map API validation error details to field-level errors */
  const handleApiError = useCallback((err: unknown): void => {
    if (err instanceof ApiClientError && err.details) {
      const errors: FieldErrors = {};
      for (const detail of err.details) {
        errors[detail.field] = detail.message;
      }
      setFieldErrors(errors);
    }

    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    showToast('error', message);
  }, []);

  const handleCreate = useCallback(
    async (input: CreateServiceInput): Promise<Service | null> => {
      setIsSubmitting(true);
      setFieldErrors({});

      try {
        const response = await servicesApi.createService(input);
        showToast('success', 'Service created successfully');
        onSuccess();
        return response.data || null;
      } catch (err) {
        handleApiError(err);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess, handleApiError]
  );

  const handleUpdate = useCallback(
    async (id: number, input: UpdateServiceInput): Promise<Service | null> => {
      setIsSubmitting(true);
      setFieldErrors({});

      try {
        const response = await servicesApi.updateService(id, input);
        showToast('success', 'Service updated successfully');
        onSuccess();
        return response.data || null;
      } catch (err) {
        handleApiError(err);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess, handleApiError]
  );

  const handleDelete = useCallback(
    async (id: number): Promise<boolean> => {
      setIsSubmitting(true);

      try {
        await servicesApi.deleteService(id);
        showToast('success', 'Service deleted successfully');
        onSuccess(true);
        return true;
      } catch (err) {
        handleApiError(err);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess, handleApiError]
  );

  return {
    isSubmitting,
    fieldErrors,
    handleCreate,
    handleUpdate,
    handleDelete,
    clearFieldErrors,
  };
}
