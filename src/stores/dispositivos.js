import { defineStore } from 'pinia'
import apiClient from '../config/axios'
import API_CONFIG from '../config/api'

export const useDispositivosStore = defineStore('dispositivos', {
  state: () => ({
    dispositivos: [],
    isLoading: false,
    error: null,
    currentDispositivo: null
  }),

  getters: {
    hasError: (state) => !!state.error,
    totalDispositivos: (state) => state.dispositivos.length,
    dispositivosComLocalizacao: (state) => state.dispositivos.filter(disp => disp.nomeDaLocalizacaoDoDispositivo),
    dispositivosSemLocalizacao: (state) => state.dispositivos.filter(disp => !disp.nomeDaLocalizacaoDoDispositivo)
  },

  actions: {
    // Listar todos os dispositivos
    async listarDispositivos() {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get(
          API_CONFIG.ENDPOINTS.DISPOSITIVO.LISTAR
        )

        this.dispositivos = response.data || []
        return { success: true, data: this.dispositivos }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao carregar dispositivos'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Buscar dispositivo por código público
    buscarDispositivoPorCodigo(codigoPublico) {
      return this.dispositivos.find(disp => disp.codigoPublicoDispositivo === codigoPublico)
    },

    // Definir dispositivo atual
    setCurrentDispositivo(dispositivo) {
      this.currentDispositivo = dispositivo
    },

    // Limpar erro
    clearError() {
      this.error = null
    },

    // Limpar dispositivo atual
    clearCurrentDispositivo() {
      this.currentDispositivo = null
    },

    // Filtrar dispositivos por localização
    filtrarDispositivosPorLocalizacao(nomeLocalizacao) {
      if (!nomeLocalizacao) return this.dispositivos
      return this.dispositivos.filter(disp => 
        disp.nomeDaLocalizacaoDoDispositivo === nomeLocalizacao
      )
    },

    // Obter estatísticas dos dispositivos
    getEstatisticas() {
      const total = this.dispositivos.length
      const comLocalizacao = this.dispositivosComLocalizacao.length
      const semLocalizacao = this.dispositivosSemLocalizacao.length
      
      return {
        total,
        comLocalizacao,
        semLocalizacao,
        percentualComLocalizacao: total > 0 ? Math.round((comLocalizacao / total) * 100) : 0
      }
    }
  }
})