import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // API configuration
  apiPrefix: '/api',

  // Development settings
  addDelay: process.env.NODE_ENV === 'development' && process.env.ADD_DELAY === 'true',
  delayMs: parseInt(process.env.DELAY_MS) || 1000,
}

export default config
