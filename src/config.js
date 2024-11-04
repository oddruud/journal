// config.js
const config = {
  development: {
    backEndUrl: 'http://localhost:8080',
  },
  production: {
    backEndUrl: process.env.PROD_BACKEND_URL,
  },
}

const environment = process.env.NODE_ENV || 'development'
window.config = config[environment]
