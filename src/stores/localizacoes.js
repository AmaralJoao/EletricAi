import { defineStore } from 'pinia'
import apiClient from '../config/axios'
import API_CONFIG from '../config/api'

export const useLocalizacoesStore = defineStore('localizacoes', {
  state: () => ({
    localizacoes: [],
    isLoading: false,
    error: null,
    currentLocalizacao: null
  }),

  getters: {
    hasError: (state) => !!state.error,
    localizacoesAtivas: (state) => state.localizacoes.filter(loc => loc.status === true),
    totalLocalizacoes: (state) => state.localizacoes.length
  },

  actions: {
    // Listar todas as localizações
    async listarLocalizacoes() {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get(
          API_CONFIG.ENDPOINTS.LOCALIZACAO.LISTAR
        )

        this.localizacoes = response.data || []
        return { success: true, data: this.localizacoes }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao carregar localizações'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Criar nova localização
    async criarLocalizacao(dadosLocalizacao) {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.post(
          API_CONFIG.ENDPOINTS.LOCALIZACAO.NOVA,
          dadosLocalizacao
        )

        // Adicionar a nova localização à lista
        if (response.data) {
          this.localizacoes.push(response.data)
        }

        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao criar localização'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Editar localização existente
    async editarLocalizacao(codigoPublico, dadosLocalizacao) {
      this.isLoading = true
      this.error = null

      try {
        const payload = {
          codigoPublicoLocalizacao: codigoPublico, // Código da localização a ser editada
          ...dadosLocalizacao
        }

        const response = await apiClient.post(
          API_CONFIG.ENDPOINTS.LOCALIZACAO.EDITAR,
          payload
        )

        // Atualizar a localização na lista
        if (response.data) {
          const index = this.localizacoes.findIndex(loc => loc.codigoPublico === codigoPublico)
          if (index !== -1) {
            this.localizacoes[index] = response.data
          }
        }

        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao editar localização'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Buscar localização por código público
    buscarLocalizacaoPorCodigo(codigoPublico) {
      return this.localizacoes.find(loc => loc.codigoPublico === codigoPublico)
    },

    // Definir localização atual
    setCurrentLocalizacao(localizacao) {
      this.currentLocalizacao = localizacao
    },

    // Limpar erro
    clearError() {
      this.error = null
    },

    // Limpar localização atual
    clearCurrentLocalizacao() {
      this.currentLocalizacao = null
    }
  }
})
