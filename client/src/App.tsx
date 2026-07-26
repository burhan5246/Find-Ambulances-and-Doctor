
// @ts-nocheck
import { useState, useCallback } from 'react';
import { GlobalStyles } from './styles/GlobalStyles';
import { Header, Container } from './components/layout';
import { Modal, ConfirmDialog, ToastContainer } from './components/ui';
import { ServiceList } from './features/services/components/ServiceList';
import { ServiceFilters } from './features/services/components/ServiceFilters';
import { ServiceForm } from './features/services/components/ServiceForm';
import { useServices } from './features/services/hooks/useServices';
import { useServiceForm } from './features/services/hooks/useServiceForm';
import type { Service, CreateServiceInput } from './types/service';

function App() {
  // Service list state
  const {
    data,
    pagination,
    totals,
    isLoading,
    error,
    typeFilter,
    searchQuery,
    setPage,
    setTypeFilter,
    setSearchQuery,
    refetch,
  } = useServices();

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  // Stable callback for form operations — memoized to prevent cascading re-renders
  const handleFormSuccess = useCallback(() => {
    refetch();
    setIsFormOpen(false);
    setEditingService(null);
    setDeletingService(null);
  }, [refetch]);

  // Form operations
  const {
    isSubmitting,
    fieldErrors,
    handleCreate,
    handleUpdate,
    handleDelete,
    clearFieldErrors,
  } = useServiceForm(handleFormSuccess);

  // Handlers
  const handleAddService = useCallback(() => {
    setEditingService(null);
    clearFieldErrors();
    setIsFormOpen(true);
  }, [clearFieldErrors]);

  const handleEditService = useCallback(
    (service: Service) => {
      setEditingService(service);
      clearFieldErrors();
      setIsFormOpen(true);
    },
    [clearFieldErrors]
  );

  const handleDeleteService = useCallback((service: Service) => {
    setDeletingService(service);
  }, []);

  const handleFormSubmit = useCallback(
    async (formData: CreateServiceInput) => {
      if (editingService) {
        await handleUpdate(editingService.id, formData);
      } else {
        await handleCreate(formData);
      }
    },
    [editingService, handleCreate, handleUpdate]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (deletingService) {
      await handleDelete(deletingService.id);
    }
  }, [deletingService, handleDelete]);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingService(null);
    clearFieldErrors();
  }, [clearFieldErrors]);

  const handleCancelDelete = useCallback(() => {
    setDeletingService(null);
  }, []);

  return (
    <>
      <GlobalStyles />

      {/* <Header onAddService={handleAddService} /> */}

      <Container>
        <ServiceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddService={handleAddService}
        />

        <ServiceList
          data={data}
          pagination={pagination}
          totals={totals}
          isLoading={isLoading}
          error={error}
          onPageChange={setPage}
          onEdit={handleEditService}
          onDelete={handleDeleteService}
          onRetry={refetch}
          onAddService={handleAddService}
          activeTypeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
        />
      </Container>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingService ? 'Edit Service' : 'Add New Service'}
      >
        <ServiceForm
          service={editingService}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          isSubmitting={isSubmitting}
          fieldErrors={fieldErrors}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingService}
        title="Delete Service"
        message={
          deletingService
            ? `Are you sure you want to delete "${deletingService.title}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isSubmitting}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </>
  );
}

export default App;
