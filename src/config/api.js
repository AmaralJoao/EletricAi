// Configuração da API
const API_CONFIG = {
  // URL base da API
  BASE_URL: import.meta.env.DEV 
    ? '/api' // Em desenvolvimento, usa o proxy do Vite
    : 'http://localhost:8080', // Em produção, usa a URL direta
  
  // Endpoints
  ENDPOINTS: {
    LOGIN: '/open/api/autenticar/usuario/login',
    LOCALIZACAO: {
      NOVA: '/auth/api/localizacao/novalocalizacao',
      LISTAR: '/auth/api/localizacao/listarlocalizacao',
      EDITAR: '/auth/api/localizacao/editarlocalizacao'
    }
  },
  
  // Configurações do Axios
  AXIOS_CONFIG: {
    timeout: 10000, // 10 segundos
    headers: {
      'Content-Type': 'application/json'
    }
  }
}

export default API_CONFIG
