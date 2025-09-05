import axios from 'axios'
import API_CONFIG from './api'

// Criar instância do axios com configurações base
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.AXIOS_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token de autorização automaticamente
apiClient.interceptors.request.use(
  (config) => {
    // Obter token do localStorage
    const token = localStorage.getItem('eletric_ai_token')
    
    // Adicionar header de autorização se o token existir
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar respostas e erros
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Se receber 401 (Unauthorized), limpar token e redirecionar para login
    if (error.response?.status === 401) {
      localStorage.removeItem('eletric_ai_token')
      // Redirecionar para login se não estiver na página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient

