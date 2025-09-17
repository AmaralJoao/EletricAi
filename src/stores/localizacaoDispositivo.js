import { defineStore } from 'pinia'
import apiClient from '../config/axios'
import API_CONFIG from '../config/api'

export const useLocalizacaoDispositivoStore = defineStore('localizacaoDispositivo', {
  state: () => ({
    localizacoesDispositivos: [],
    isLoading: false,
    error: null,
    currentLocalizacaoDispositivo: null
  }),

  getters: {
    hasError: (state) => !!state.error,
    totalLocalizacoesDispositivos: (state) => state.localizacoesDispositivos.length,
    localizacoesDispositivosComNome: (state) => state.localizacoesDispositivos.filter(loc => loc.nomeDaLocalizacaoDoDispositivo),
    localizacoesDispositivosSemNome: (state) => state.localizacoesDispositivos.filter(loc => !loc.nomeDaLocalizacaoDoDispositivo)
  },

  actions: {
    // Listar localizações de dispositivos do usuário
    async listarLocalizacoesDispositivos() {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.get(
          API_CONFIG.ENDPOINTS.LOCALIZACAO_DISPOSITIVO.LISTAR
        )

        this.localizacoesDispositivos = response.data || []
        return { success: true, data: this.localizacoesDispositivos }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao carregar localizações dos dispositivos'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Cadastrar localização de dispositivo
    async cadastrarLocalizacaoDispositivo(dados) {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.post(
          API_CONFIG.ENDPOINTS.LOCALIZACAO_DISPOSITIVO.CADASTRAR,
          dados
        )

        // Atualizar a lista após cadastrar
        await this.listarLocalizacoesDispositivos()
        
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao cadastrar localização do dispositivo'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Editar localização de dispositivo
    async editarLocalizacaoDispositivo(dados) {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.post(
          API_CONFIG.ENDPOINTS.LOCALIZACAO_DISPOSITIVO.EDITAR,
          dados
        )

        // Atualizar a lista após editar
        await this.listarLocalizacoesDispositivos()
        
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao editar localização do dispositivo'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Buscar localização de dispositivo por código público
    buscarLocalizacaoDispositivoPorCodigo(codigoPublico) {
      return this.localizacoesDispositivos.find(loc => 
        loc.codigoPublicoLocalizacaoDoDispositivo === codigoPublico
      )
    },

    // Definir localização de dispositivo atual
    setCurrentLocalizacaoDispositivo(localizacao) {
      this.currentLocalizacaoDispositivo = localizacao
    },

    // Limpar erro
    clearError() {
      this.error = null
    },

    // Limpar localização atual
    clearCurrentLocalizacaoDispositivo() {
      this.currentLocalizacaoDispositivo = null
    },

    // Filtrar localizações por dispositivo
    filtrarLocalizacoesPorDispositivo(codigoPublicoDispositivo) {
      if (!codigoPublicoDispositivo) return this.localizacoesDispositivos
      return this.localizacoesDispositivos.filter(loc => 
        loc.codigoPublicoDispositivo === codigoPublicoDispositivo
      )
    },

    // Obter estatísticas das localizações de dispositivos
    getEstatisticas() {
      const total = this.localizacoesDispositivos.length
      const comNome = this.localizacoesDispositivosComNome.length
      const semNome = this.localizacoesDispositivosSemNome.length
      
      return {
        total,
        comNome,
        semNome,
        percentualComNome: total > 0 ? Math.round((comNome / total) * 100) : 0
      }
    }
  }
})

