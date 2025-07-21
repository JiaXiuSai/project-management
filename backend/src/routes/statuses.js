import express from 'express'

import { ProjectController } from '../controllers/ProjectController.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()

// GET /api/statuses - Get available statuses
router.get('/', asyncHandler(ProjectController.getStatuses))

export default router
