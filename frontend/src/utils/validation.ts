import { z } from 'zod'

export const projectFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters')
    .trim(),
  description: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
})

export type ProjectFormData = z.infer<typeof projectFormSchema>

export const searchFormSchema = z.object({
  search: z.string().optional(),
})

export type SearchFormData = z.infer<typeof searchFormSchema>

export const getFieldError = (
  errors: Record<string, { message?: string }>,
  fieldName: string
): string | undefined => {
  return errors[fieldName]?.message
}

export const createFieldProps = (
  register: (name: keyof ProjectFormData) => object,
  errors: Record<string, { message?: string }>,
  fieldName: keyof ProjectFormData,
  additionalProps: Record<string, unknown> = {}
) => ({
  ...register(fieldName),
  className: `border rounded px-2 py-1 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors h-[32px] ${
    getFieldError(errors, fieldName) ? 'border-coral' : ''
  } ${additionalProps.className || ''}`,
  ...additionalProps,
})
