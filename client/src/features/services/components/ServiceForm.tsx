import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import type { Service, CreateServiceInput, ServiceType } from '../../../types/service';
import { Button, Input, TextArea, Select } from '../../../components/ui';

interface ServiceFormProps {
  service?: Service | null;
  onSubmit: (data: CreateServiceInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  fieldErrors: Record<string, string>;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
  padding-top: ${theme.spacing.md};
`;

const TYPE_OPTIONS = [
  { value: 'ambulance', label: 'Ambulance' },
  { value: 'doctor', label: 'Doctor' },
];

/** Client-side validation — catches obvious issues before network round-trip */
function validateForm(
  title: string,
  description: string,
  location: string,
  type: string
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!title.trim() || title.trim().length < 2) {
    errors.title = 'Title must be at least 2 characters';
  }
  if (!description.trim() || description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }
  if (!location.trim() || location.trim().length < 2) {
    errors.location = 'Location must be at least 2 characters';
  }
  if (!type) {
    errors.type = 'Type is required';
  }

  return errors;
}

export function ServiceForm({
  service,
  onSubmit,
  onCancel,
  isSubmitting,
  fieldErrors,
}: ServiceFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<ServiceType | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Pre-populate form when editing
  useEffect(() => {
    if (service) {
      setTitle(service.title);
      setDescription(service.description);
      setLocation(service.location);
      setType(service.type);
      setImageUrl(service.imageUrl || '');
    } else {
      setTitle('');
      setDescription('');
      setLocation('');
      setType('');
      setImageUrl('');
    }
    setLocalErrors({});
  }, [service]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Client-side validation first — avoids unnecessary network round-trip
      const validationErrors = validateForm(title, description, location, type);
      if (Object.keys(validationErrors).length > 0) {
        setLocalErrors(validationErrors);
        return;
      }

      setLocalErrors({});

      const data: CreateServiceInput = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        type: type as ServiceType, // Safe — validated above that type is not empty
        ...(imageUrl.trim() && { imageUrl: imageUrl.trim() }),
      };

      onSubmit(data);
    },
    [title, description, location, type, imageUrl, onSubmit]
  );

  const isEditing = !!service;

  // Merge local + server errors (server errors take priority)
  const mergedErrors = { ...localErrors, ...fieldErrors };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., City Emergency Ambulance"
        error={mergedErrors.title}
        required
      />
      <TextArea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the service, specialization, and coverage area..."
        error={mergedErrors.description}
        required
      />
      <Input
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="e.g., 123 Main Street, Downtown"
        error={mergedErrors.location}
        required
      />
      <Select
        label="Type"
        value={type}
        onChange={(e) => setType(e.target.value as ServiceType)}
        options={TYPE_OPTIONS}
        error={mergedErrors.type}
        required
      />
      <Input
        label="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="https://example.com/image.jpg (optional)"
        error={mergedErrors.imageUrl}
        helperText="Optional — provide a URL to an image of the service"
        type="url"
      />
      <Actions>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {isEditing ? 'Update Service' : 'Create Service'}
        </Button>
      </Actions>
    </Form>
  );
}
