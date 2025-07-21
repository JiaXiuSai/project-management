import config from '../config/index.js'

// Custom error class for API errors
export class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.timestamp = new Date().toISOString()
  }
}

// Validation error class
export class ValidationError extends ApiError {
  constructor(message) {
    super(message, 400)
  }
}

// Not found error class
export class NotFoundError extends ApiError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404)
  }
}

// Conflict error class
export class ConflictError extends ApiError {
  constructor(message) {
    super(message, 409)
  }
}

// Main error handling middleware
export const errorHandler = (err, req, res, _next) => {
  let error = { ...err }
  error.message = err.message

  // Log error
  console.error('Error:', err.message)

  // Joi validation error
  if (err.isJoi) {
    const message = err.details.map((detail) => detail.message).join(', ')
    error = new ValidationError(message)
  }

  // Default error
  if (!error.statusCode) {
    error.statusCode = 500
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    error: error.message || 'Internal server error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
    timestamp: error.timestamp || new Date().toISOString(),
  })
}

// Async error wrapper
export const asyncHandler = (fn) => (req, res, _next) => {
  Promise.resolve(fn(req, res, _next)).catch(_next)
}

// 404 handler for undefined routes
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString(),
  })
}
