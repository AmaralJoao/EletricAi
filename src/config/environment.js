// Configurações de ambiente
export const ENV_CONFIG = {
  // URLs da API
  API_BASE_URL: 'http://localhost:8080',
  
  // Configurações da aplicação
  APP_NAME: 'ELETRIC AI',
  APP_VERSION: '1.0.0',
  
  // Configurações de desenvolvimento
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD
}

export default ENV_CONFIG

