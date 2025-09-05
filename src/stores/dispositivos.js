import { defineStore } from 'pinia'
import apiClient from '../config/axios'
import API_CONFIG from '../config/api'

export const useDispositivosStore = defineStore('dispositivos', {
  state: () => ({
    dispositivos: [],
    localizacoesDispositivos: [],
    isLoading: false,
    error: null
  }),

  getters: {
    hasError: (state) => !!state.error,
    totalDispositivos: (state) => state.dispositivos.length,
    totalLocalizacoesDispositivos: (state) => state.localizacoesDispositivos.length
  },

  actions: {
    async listarDispositivos() {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.DISPOSITIVO.LISTAR)
        this.dispositivos = Array.isArray(response.data) ? response.data : []
        return { success: true, data: this.dispositivos }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao carregar dispositivos'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async vincularDispositivo(chipId) {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.post(
          API_CONFIG.ENDPOINTS.DISPOSITIVO.VINCULAR,
          { chipId }
        )
        // Alguns endpoints retornam o dispositivo criado/vinculado
        if (response.data) {
          this.dispositivos.push(response.data)
        }
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao vincular dispositivo'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async cadastrarLocalizacaoDispositivo(dadosLocalizacao) {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.post(
          API_CONFIG.ENDPOINTS.LOCALIZACAO_DISPOSITIVO.CADASTRAR,
          dadosLocalizacao
        )
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao cadastrar localização do dispositivo'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async editarLocalizacaoDispositivo(dadosLocalizacao) {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.post(
          API_CONFIG.ENDPOINTS.LOCALIZACAO_DISPOSITIVO.EDITAR,
          dadosLocalizacao
        )
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao editar localização do dispositivo'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async listarLocalizacoesDispositivos() {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.LOCALIZACAO_DISPOSITIVO.LISTAR)
        this.localizacoesDispositivos = Array.isArray(response.data) ? response.data : []
        return { success: true, data: this.localizacoesDispositivos }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao carregar localizações dos dispositivos'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})


