import Joi from 'joi'

// Project validation schema
export const projectSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Project name is required',
    'string.max': 'Project name must be less than 100 characters',
    'any.required': 'Project name is required',
  }),
  description: Joi.string().trim().max(1000).optional().allow('').default(''),
  status: Joi.string()
    .valid(
      'Backlog',
      'Planning',
      'In Progress',
      'On Hold',
      'Under Review',
      'Completed',
      'Cancelled'
    )
    .required(),
})

// Project update schema (all fields optional)
export const projectUpdateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).optional(),
  description: Joi.string().trim().max(1000).optional().allow(''),
  status: Joi.string()
    .valid(
      'Backlog',
      'Planning',
      'In Progress',
      'On Hold',
      'Under Review',
      'Completed',
      'Cancelled'
    )
    .optional(),
})

// Status update schema
export const statusUpdateSchema = Joi.object({
  status: Joi.string()
    .valid(
      'Backlog',
      'Planning',
      'In Progress',
      'On Hold',
      'Under Review',
      'Completed',
      'Cancelled'
    )
    .required(),
})

// Available statuses
export const AVAILABLE_STATUSES = [
  'Backlog',
  'Planning',
  'In Progress',
  'On Hold',
  'Under Review',
  'Completed',
  'Cancelled',
]

// Project class for data management
export class Project {
  constructor(data) {
    this.id = data.id
    this.name = data.name?.trim() || ''
    this.description = data.description?.trim() || ''
    this.status = data.status || 'Backlog'
  }

  // Validate project data
  static validate(data) {
    return projectSchema.validate(data)
  }

  // Validate project update data
  static validateUpdate(data) {
    return projectUpdateSchema.validate(data)
  }

  // Validate status update
  static validateStatusUpdate(data) {
    return statusUpdateSchema.validate(data)
  }

  // Check if project name is unique
  static isNameUnique(name, projects, excludeId = null) {
    return !projects.some(
      (project) => project.id !== excludeId && project.name.toLowerCase() === name.toLowerCase()
    )
  }

  // Get full project data
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
    }
  }
}
