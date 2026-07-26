import { z } from 'zod';

/**
 * Zod schemas for request validation.
 * These are the single source of truth for validation rules.
 * TypeScript types are inferred from these schemas via z.infer<>.
 */

/** Validate image URL — must be HTTP(S) to prevent javascript: and data: injection */
const imageUrlSchema = z
  .string()
  .url('Image URL must be a valid URL')
  .refine(
    (url) => url.startsWith('http://') || url.startsWith('https://'),
    'Image URL must use HTTP or HTTPS protocol'
  );

export const createServiceSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be at most 100 characters')
    .trim(),
  description: z
    .string({ required_error: 'Description is required' })
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be at most 500 characters')
    .trim(),
  location: z
    .string({ required_error: 'Location is required' })
    .min(2, 'Location must be at least 2 characters')
    .max(200, 'Location must be at most 200 characters')
    .trim(),
  type: z.enum(['ambulance', 'doctor'], {
    required_error: 'Type is required',
    invalid_type_error: "Type must be 'ambulance' or 'doctor'",
  }),
  imageUrl: imageUrlSchema
    .optional()
    .or(z.literal('')),
});

export const updateServiceSchema = z
  .object({
    title: z
      .string()
      .min(2, 'Title must be at least 2 characters')
      .max(100, 'Title must be at most 100 characters')
      .trim()
      .optional(),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must be at most 500 characters')
      .trim()
      .optional(),
    location: z
      .string()
      .min(2, 'Location must be at least 2 characters')
      .max(200, 'Location must be at most 200 characters')
      .trim()
      .optional(),
    type: z
      .enum(['ambulance', 'doctor'], {
        invalid_type_error: "Type must be 'ambulance' or 'doctor'",
      })
      .optional(),
    imageUrl: imageUrlSchema
      .optional()
      .nullable()
      .or(z.literal('')),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const listServicesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  type: z.enum(['ambulance', 'doctor']).optional(),
  search: z.string().max(200).optional(),
});

/** Schema for validating :id route parameter */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});

/** Inferred types from Zod schemas */
export type CreateServiceDto = z.infer<typeof createServiceSchema>;
export type UpdateServiceDto = z.infer<typeof updateServiceSchema>;
export type ListServicesQueryDto = z.infer<typeof listServicesQuerySchema>;
