import express from 'express'

import { ProjectController } from '../controllers/ProjectController.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { projectSchema, projectUpdateSchema, statusUpdateSchema } from '../models/Project.js'

const router = express.Router()

// Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map((detail) => detail.message),
      })
    }
    req.body = value
    next()
  }
}

// GET /api/projects - Get all projects with search and pagination
router.get('/', asyncHandler(ProjectController.getProjects))

// GET /api/projects/:id - Get a specific project
router.get('/:id', asyncHandler(ProjectController.getProjectById))

// POST /api/projects - Create a new project
router.post('/', validateRequest(projectSchema), asyncHandler(ProjectController.createProject))

// PUT /api/projects/:id - Update a project
router.put(
  '/:id',
  validateRequest(projectUpdateSchema),
  asyncHandler(ProjectController.updateProject)
)

// PATCH /api/projects/:id/status - Update only the status
router.patch(
  '/:id/status',
  validateRequest(statusUpdateSchema),
  asyncHandler(ProjectController.updateProjectStatus)
)

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', asyncHandler(ProjectController.deleteProject))

export default router
