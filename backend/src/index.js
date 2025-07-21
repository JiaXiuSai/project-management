import cors from 'cors'
import express from 'express'

import config from './config/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import routes from './routes/index.js'

const app = express()

// CORS middleware - allow all origins
app.use(cors())

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// API routes
app.use(config.apiPrefix, routes)

// 404 handler for undefined routes
app.use(notFoundHandler)

// Error handling middleware (must be last)
app.use(errorHandler)

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('Shutting down gracefully')
  process.exit(0)
})

// Unhandled promise rejection handler
process.on('unhandledRejection', (err, _promise) => {
  console.error('Unhandled Promise Rejection:', err)
  process.exit(1)
})

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

const PORT = config.port

app.listen(PORT, () => {
  console.log(`Environment: ${config.nodeEnv}`)
  console.log(`API Base URL: http://localhost:${PORT}${config.apiPrefix}`)
  console.log(`Development Delay: ${config.addDelay ? 'Enabled' : 'Disabled'}`)
  // Should use Swagger
  if (config.nodeEnv === 'development') {
    console.log('\nAvailable endpoints:')
    console.log(`   GET  ${config.apiPrefix}/health`)
    console.log(`   GET  ${config.apiPrefix}/`)
    console.log(`   GET  ${config.apiPrefix}/projects`)
    console.log(`   GET  ${config.apiPrefix}/projects/:id`)
    console.log(`   POST ${config.apiPrefix}/projects`)
    console.log(`   PUT  ${config.apiPrefix}/projects/:id`)
    console.log(`   PATCH ${config.apiPrefix}/projects/:id/status`)
    console.log(`   DELETE ${config.apiPrefix}/projects/:id`)
    console.log(`   GET  ${config.apiPrefix}/statuses`)
  }
})
