<template>
  <div class="modal-overlay" @click="fecharModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">
          <span class="title-icon">📍</span>
          {{ isEditing ? 'Editar Localização' : 'Nova Localização' }}
        </h3>
        <button @click="fecharModal" class="close-button">
          <span class="close-icon">✕</span>
        </button>
      </div>

      <form @submit.prevent="salvarLocalizacao" class="modal-form">
        <div class="form-group">
          <label class="form-label" for="dispositivoSelect">
            <span class="label-icon">🔌</span>
            Dispositivo
          </label>
          <select
            id="dispositivoSelect"
            v-model="formData.codigoPublicoDispositivo"
            class="form-select"
            required
            :disabled="isEditing"
          >
            <option value="">Selecione um dispositivo</option>
            <option 
              v-for="dispositivo in dispositivosDisponiveis" 
              :key="dispositivo.codigoPublicoDispositivo"
              :value="dispositivo.codigoPublicoDispositivo"
            >
              {{ dispositivo.nomeDoDispositivo }} ({{ dispositivo.modeloDispositivo }})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="localizacaoSelect">
            <span class="label-icon">📍</span>
            Localização
          </label>
          <select
            id="localizacaoSelect"
            v-model="formData.codigoPublicoLocalizacao"
            class="form-select"
            required
          >
            <option value="">Selecione uma localização</option>
            <option 
              v-for="localizacao in localizacoesDisponiveis" 
              :key="localizacao.codigoPublico"
              :value="localizacao.codigoPublico"
            >
              {{ localizacao.descricao }} - {{ localizacao.cidade }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="nomeLocalizacaoInput">
            <span class="label-icon">🏷️</span>
            Nome da Localização do Dispositivo
          </label>
          <div class="input-container">
            <input
              id="nomeLocalizacaoInput"
              v-model="formData.nomeDaLocalizacaoDoDispositivo"
              type="text"
              placeholder="Ex: Quarto Principal, Cozinha, etc."
              class="form-input"
              required
              maxlength="100"
            />
            <div class="input-glow"></div>
          </div>
        </div>

        <!-- Alerta de erro -->
        <div v-if="error" class="error-alert">
          <div class="error-icon">⚠️</div>
          <span>{{ error }}</span>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-secondary" @click="fecharModal" :disabled="isLoading">
            Cancelar
          </button>
          <button type="submit" class="btn-primary" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-small"></span>
            {{ isEditing ? 'Salvar Alterações' : 'Criar Localização' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useDispositivosStore } from '../stores/dispositivos'
import { useLocalizacoesStore } from '../stores/localizacoes'
import { useLocalizacaoDispositivoStore } from '../stores/localizacaoDispositivo'

export default {
  name: 'LocalizacaoDispositivoModal',
  props: {
    localizacaoDispositivo: {
      type: Object,
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const dispositivosStore = useDispositivosStore()
    const localizacoesStore = useLocalizacoesStore()
    const localizacaoDispositivoStore = useLocalizacaoDispositivoStore()

    const isLoading = ref(false)
    const error = ref('')

    const formData = ref({
      codigoPublicoDispositivo: '',
      codigoPublicoLocalizacao: '',
      nomeDaLocalizacaoDoDispositivo: '',
      codigoPublicoLocalizacaoDoDispositivo: ''
    })

    // Computed para dispositivos disponíveis
    const dispositivosDisponiveis = computed(() => {
      return dispositivosStore.dispositivos.filter(disp => 
        !disp.nomeDaLocalizacaoDoDispositivo || 
        (props.isEditing && disp.codigoPublicoDispositivo === formData.value.codigoPublicoDispositivo)
      )
    })

    // Computed para localizações disponíveis
    const localizacoesDisponiveis = computed(() => {
      return localizacoesStore.localizacoes.filter(loc => loc.status)
    })

    // Carregar dados iniciais
    onMounted(async () => {
      await dispositivosStore.listarDispositivos()
      await localizacoesStore.listarLocalizacoes()
      
      if (props.isEditing && props.localizacaoDispositivo) {
        formData.value = {
          codigoPublicoDispositivo: props.localizacaoDispositivo.codigoPublicoDispositivo || '',
          codigoPublicoLocalizacao: props.localizacaoDispositivo.codigoPublicoLocalizacao || '',
          nomeDaLocalizacaoDoDispositivo: props.localizacaoDispositivo.nomeDaLocalizacaoDoDispositivo || '',
          codigoPublicoLocalizacaoDoDispositivo: props.localizacaoDispositivo.codigoPublicoLocalizacaoDoDispositivo || ''
        }
      }
    })

    // Watch para limpar erro quando formData muda
    watch(formData, () => {
      if (error.value) {
        error.value = ''
      }
    }, { deep: true })

    // Fechar modal
    const fecharModal = () => {
      if (isLoading.value) return
      emit('close')
    }

    // Salvar localização
    const salvarLocalizacao = async () => {
      if (isLoading.value) return

      isLoading.value = true
      error.value = ''

      try {
        let result

        if (props.isEditing) {
          result = await localizacaoDispositivoStore.editarLocalizacaoDispositivo({
            codigoPublicoLocalizacaoDoDispositivo: formData.value.codigoPublicoLocalizacaoDoDispositivo,
            codigoPublicoLocalizacao: formData.value.codigoPublicoLocalizacao,
            nomeDaLocalizacaoDoDispositivo: formData.value.nomeDaLocalizacaoDoDispositivo
          })
        } else {
          result = await localizacaoDispositivoStore.cadastrarLocalizacaoDispositivo({
            codigoPublicoLocalizacao: formData.value.codigoPublicoLocalizacao,
            codigoPublicoDispositivo: formData.value.codigoPublicoDispositivo,
            nomeDaLocalizacaoDoDispositivo: formData.value.nomeDaLocalizacaoDoDispositivo
          })
        }

        if (result.success) {
          emit('save', result.data)
        } else {
          error.value = result.error
        }
      } catch (err) {
        error.value = 'Erro inesperado ao salvar localização'
        console.error('Erro ao salvar localização:', err)
      } finally {
        isLoading.value = false
      }
    }

    return {
      isLoading,
      error,
      formData,
      dispositivosDisponiveis,
      localizacoesDisponiveis,
      fecharModal,
      salvarLocalizacao
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 20px;
}

.modal-container {
  width: 100%;
  max-width: 500px;
  background: rgba(15, 15, 35, 0.98);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 25px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.25);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 600;
}

.title-icon {
  font-size: 1.5rem;
  color: #00d4ff;
}

.close-button {
  background: none;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.close-button:hover {
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
}

.modal-form {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
}

.label-icon {
  font-size: 1rem;
  color: #00d4ff;
}

.form-select {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  padding: 12px 15px;
  color: #ffffff;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-select:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
}

.form-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-container {
  position: relative;
}

.form-input {
  width: 100%;
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  padding: 12px 15px;
  color: #ffffff;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
}

.form-input::placeholder {
  color: #a0a0a0;
}

.input-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  background: linear-gradient(45deg, transparent, rgba(0, 212, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.form-input:focus + .input-glow {
  opacity: 1;
}

.error-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid rgba(255, 71, 87, 0.3);
  border-radius: 8px;
  padding: 15px 20px;
  color: #ff4757;
}

.error-icon {
  font-size: 1.2rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 15px;
  border-top: 1px solid rgba(0, 212, 255, 0.2);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(45deg, #00d4ff, #7c3aed);
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  color: #ffffff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 212, 255, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 8px;
  padding: 12px 20px;
  color: #7c3aed;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(124, 58, 237, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsividade */
@media (max-width: 480px) {
  .modal-container {
    max-width: 100%;
    margin: 10px;
  }
  
  .modal-header {
    padding: 15px 20px;
  }
  
  .modal-form {
    padding: 20px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>

