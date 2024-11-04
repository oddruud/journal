// Extend the Window interface to include the config property
interface Window {
  config: {
    backEndUrl: string
    // Add other properties of config if needed
  }
}

// Define a type for the environment keys
type Environment = 'development' | 'production'

// config.js
const config: Record<Environment, { backEndUrl: string | undefined }> = {
  development: {
    backEndUrl: 'http://localhost:8080',
  },
  production: {
    backEndUrl: 'http://production.com',
  },
}

const environment: Environment = 'development'
window.config = {
  backEndUrl: config[environment].backEndUrl || 'http://localhost:8080',
}
