import { defineStore } from 'pinia'
import apiClient from '../config/axios'
import API_CONFIG from '../config/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('eletric_ai_token') || null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    hasError: (state) => !!state.error
  },

  actions: {
    async login(email, password) {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.post(
          API_CONFIG.ENDPOINTS.LOGIN, 
          {
            emaiUsuario: email,
            senha: password
          }
        )

        if (response.data && response.data.token) {
          this.token = response.data.token
          localStorage.setItem('eletric_ai_token', this.token)
          return { success: true }
        } else {
          throw new Error('Token não recebido do servidor')
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.token = null
      localStorage.removeItem('eletric_ai_token')
    },

    clearError() {
      this.error = null
    }
  }
})
