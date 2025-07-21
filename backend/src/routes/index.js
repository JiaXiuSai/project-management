import express from 'express'

import config from '../config/index.js'
import projectRoutes from './projects.js'
import statusRoutes from './statuses.js'

const router = express.Router()

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  })
})

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Verlata API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      projects: '/api/projects',
      statuses: '/api/statuses',
    },
    timestamp: new Date().toISOString(),
  })
})

// Mount route modules
router.use('/projects', projectRoutes)
router.use('/statuses', statusRoutes)

export default router
