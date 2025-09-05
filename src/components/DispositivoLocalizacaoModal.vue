<template>
  <div class="modal-overlay" @click="fecharModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">
          <span class="title-icon">📍</span>
          {{ isEditing ? 'Editar Localização do Dispositivo' : 'Cadastrar Localização do Dispositivo' }}
        </h2>
        <button @click="fecharModal" class="close-button">
          <span class="close-icon">✕</span>
        </button>
      </div>

      <form @submit.prevent="salvarLocalizacao" class="modal-form">
        <div class="form-content">
          <!-- Informações do Dispositivo -->
          <div class="device-info">
            <h3 class="info-title">
              <span class="info-icon">🔌</span>
              Dispositivo
            </h3>
            <div class="info-item">
              <span class="info-label">Nome:</span>
              <span class="info-value">{{ dispositivo?.nomeDoDispositivo }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Modelo:</span>
              <span class="info-value">{{ dispositivo?.modeloDispositivo }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Versão:</span>
              <span class="info-value">{{ dispositivo?.versaoDoDispositivo }}</span>
            </div>
          </div>


          <!-- Opção: Usar localização existente ou criar nova -->
          <div class="form-group">
            <div class="radio-group">
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="form.tipoLocalizacao"
                  value="nova"
                  @change="onTipoLocalizacaoChange"
                />
                <span class="radio-custom"></span>
                <span class="radio-text">Criar nova localização do dispositivo</span>
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="form.tipoLocalizacao"
                  value="existente"
                  @change="onTipoLocalizacaoChange"
                />
                <span class="radio-custom"></span>
                <span class="radio-text">Usar localização de dispositivo existente</span>
              </label>
            </div>
          </div>

          <!-- CASO 1: Criar nova localização do dispositivo -->
          <div v-if="form.tipoLocalizacao === 'nova'">
            <!-- Nome da Localização do Dispositivo -->
            <div class="form-group">
              <label for="nomeLocalizacaoDispositivo" class="form-label">
                <span class="label-icon">📝</span>
                Nome da Localização do Dispositivo *
              </label>
              <div class="input-container">
                <input
                  id="nomeLocalizacaoDispositivo"
                  v-model="form.nomeDaLocalizacaoDoDispositivo"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.nomeDaLocalizacaoDoDispositivo }"
                  placeholder="Ex: Medidor na Sala de Estar"
                  required
                  @input="clearError('nomeDaLocalizacaoDoDispositivo')"
                />
                <div class="input-glow"></div>
              </div>
              <span v-if="errors.nomeDaLocalizacaoDoDispositivo" class="error-message">{{ errors.nomeDaLocalizacaoDoDispositivo }}</span>
            </div>

            <!-- Seleção de Localização para Vincular -->
            <div class="form-group">
              <label for="localizacaoParaVincular" class="form-label">
                <span class="label-icon">🏠</span>
                Vincular com Localização *
              </label>
              <div class="input-container">
                <select
                  id="localizacaoParaVincular"
                  v-model="form.codigoPublicoLocalizacao"
                  class="form-select"
                  :class="{ 'error': errors.codigoPublicoLocalizacao }"
                  required
                  @change="clearError('codigoPublicoLocalizacao')"
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
                <div class="input-glow"></div>
              </div>
              <span v-if="errors.codigoPublicoLocalizacao" class="error-message">{{ errors.codigoPublicoLocalizacao }}</span>
            </div>
          </div>

          <!-- CASO 2: Usar localização de dispositivo existente -->
          <div v-if="form.tipoLocalizacao === 'existente'">
            <!-- Seleção de Localização de Dispositivo Existente -->
            <div class="form-group">
              <label for="localizacaoExistente" class="form-label">
                <span class="label-icon">📍</span>
                Localização do Dispositivo Existente *
              </label>
              <div class="input-container">
                <select
                  id="localizacaoExistente"
                  v-model="form.codigoPublicoLocalizacaoDoDispositivo"
                  class="form-select"
                  :class="{ 'error': errors.codigoPublicoLocalizacaoDoDispositivo }"
                  required
                  @change="clearError('codigoPublicoLocalizacaoDoDispositivo')"
                >
                  <option value="">Selecione uma localização de dispositivo</option>
                  <option 
                    v-for="locDisp in localizacoesDispositivosDisponiveis" 
                    :key="locDisp.codigoPublicoLocalizacaoDoDispositivo"
                    :value="locDisp.codigoPublicoLocalizacaoDoDispositivo"
                  >
                    {{ locDisp.nomeDaLocalizacaoDoDispositivo }}
                  </option>
                </select>
                <div class="input-glow"></div>
              </div>
              <span v-if="errors.codigoPublicoLocalizacaoDoDispositivo" class="error-message">{{ errors.codigoPublicoLocalizacaoDoDispositivo }}</span>
            </div>
          </div>
        </div>

        <!-- Mensagem de erro global -->
        <div v-if="dispositivosStore.hasError" class="error-alert">
          <div class="error-icon">⚠️</div>
          <span>{{ dispositivosStore.error }}</span>
        </div>

        <!-- Botões de ação -->
        <div class="modal-actions">
          <button type="button" @click="fecharModal" class="btn-secondary">
            <span class="btn-icon">❌</span>
            Cancelar
          </button>
          <button 
            type="submit" 
            class="btn-primary"
            :class="{ 'loading': dispositivosStore.isLoading }"
            :disabled="dispositivosStore.isLoading"
          >
            <span v-if="!dispositivosStore.isLoading" class="button-text">
              <span class="btn-icon">💾</span>
              {{ isEditing ? 'Salvar Alterações' : 'Cadastrar Localização' }}
            </span>
            <span v-else class="loading-spinner">
              <div class="spinner"></div>
              {{ isEditing ? 'Salvando...' : 'Cadastrando...' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useDispositivosStore } from '../stores/dispositivos'
import { useLocalizacoesStore } from '../stores/localizacoes'

export default {
  name: 'DispositivoLocalizacaoModal',
  props: {
    dispositivo: {
      type: Object,
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    localizacaoDispositivo: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const dispositivosStore = useDispositivosStore()
    const localizacoesStore = useLocalizacoesStore()
    const isEditingComputed = computed(() => props.isEditing)

    // Estado do formulário
    const form = reactive({
      codigoPublicoLocalizacao: '',
      tipoLocalizacao: 'nova', // 'existente' ou 'nova'
      codigoPublicoLocalizacaoDoDispositivo: '',
      nomeDaLocalizacaoDoDispositivo: ''
    })

    // Estado dos erros
    const errors = reactive({})

    // Localizações disponíveis
    const localizacoesDisponiveis = computed(() => localizacoesStore.localizacoesAtivas)
    
    // Localizações de dispositivos disponíveis (todas, sem filtro)
    const localizacoesDispositivosDisponiveis = computed(() => {
      return dispositivosStore.localizacoesDispositivos
    })

    // Inicializar formulário
    const inicializarFormulario = () => {
      if (props.isEditing && props.localizacaoDispositivo) {
        Object.assign(form, {
          codigoPublicoLocalizacao: props.localizacaoDispositivo.codigoPublicoLocalizacao || '',
          tipoLocalizacao: 'existente',
          codigoPublicoLocalizacaoDoDispositivo: props.localizacaoDispositivo.codigoPublicoLocalizacaoDoDispositivo || '',
          nomeDaLocalizacaoDoDispositivo: props.localizacaoDispositivo.nomeDaLocalizacaoDoDispositivo || ''
        })
      } else {
        Object.assign(form, {
          codigoPublicoLocalizacao: '',
          tipoLocalizacao: 'nova',
          codigoPublicoLocalizacaoDoDispositivo: '',
          nomeDaLocalizacaoDoDispositivo: ''
        })
      }
    }

    // Handlers para mudanças
    const onTipoLocalizacaoChange = async () => {
      // Limpar campos quando mudar o tipo
      form.codigoPublicoLocalizacaoDoDispositivo = ''
      form.nomeDaLocalizacaoDoDispositivo = ''
      form.codigoPublicoLocalizacao = ''
      
      // CASO 2: Se selecionou "usar localização existente", carregar as localizações de dispositivos
      if (form.tipoLocalizacao === 'existente') {
        await dispositivosStore.listarLocalizacoesDispositivos()
      }
    }

    // Validação do formulário
    const validarFormulario = () => {
      const newErrors = {}

      if (form.tipoLocalizacao === 'nova') {
        // CASO 1: Criar nova localização do dispositivo
        if (!form.nomeDaLocalizacaoDoDispositivo.trim()) {
          newErrors.nomeDaLocalizacaoDoDispositivo = 'Nome da localização do dispositivo é obrigatório'
        } else if (form.nomeDaLocalizacaoDoDispositivo.trim().length < 3) {
          newErrors.nomeDaLocalizacaoDoDispositivo = 'Nome deve ter pelo menos 3 caracteres'
        }
        
        if (!form.codigoPublicoLocalizacao) {
          newErrors.codigoPublicoLocalizacao = 'Selecione uma localização para vincular'
        }
      } else if (form.tipoLocalizacao === 'existente') {
        // CASO 2: Usar localização de dispositivo existente
        if (!form.codigoPublicoLocalizacaoDoDispositivo) {
          newErrors.codigoPublicoLocalizacaoDoDispositivo = 'Selecione uma localização de dispositivo existente'
        }
      }

      Object.assign(errors, newErrors)
      return Object.keys(newErrors).length === 0
    }

    // Limpar erro específico
    const clearError = (field) => {
      if (errors[field]) {
        delete errors[field]
      }
      dispositivosStore.clearError()
    }

    // Fechar modal
    const fecharModal = () => {
      emit('close')
    }

    // Salvar localização do dispositivo
    const salvarLocalizacao = async () => {
      if (!validarFormulario()) {
        return
      }

      // Verificar se temos o código público do dispositivo
      const codigoPublicoDispositivo = props.dispositivo?.codigoPublicoDispositivo || 
                                      props.dispositivo?.codigoDispositivo || 
                                      props.dispositivo?.id

      if (!codigoPublicoDispositivo) {
        console.error('Código público do dispositivo não encontrado:', props.dispositivo)
        dispositivosStore.error = 'Erro: Código do dispositivo não encontrado'
        return
      }

      if (isEditingComputed.value) {
        // Edição: sempre usar localização existente
        const dadosLocalizacao = {
          codigoPublicoLocalizacaoDoDispositivo: form.codigoPublicoLocalizacaoDoDispositivo,
          codigoPublicoLocalizacao: form.codigoPublicoLocalizacao,
          codigoPublicoDispositivo: codigoPublicoDispositivo,
          nomeDaLocalizacaoDoDispositivo: form.nomeDaLocalizacaoDoDispositivo.trim()
        }
        
        // Chamar endpoint de edição
        const result = await dispositivosStore.editarLocalizacaoDispositivo(dadosLocalizacao)
        if (result.success) {
          emit('save', result.data)
        }
      } else {
        // Criação: baseada na escolha do usuário
        if (form.tipoLocalizacao === 'nova') {
          // CASO 1: Criar nova localização do dispositivo
          const dadosLocalizacao = {
            codigoPublicoLocalizacao: form.codigoPublicoLocalizacao,
            codigoPublicoDispositivo: codigoPublicoDispositivo,
            nomeDaLocalizacaoDoDispositivo: form.nomeDaLocalizacaoDoDispositivo.trim()
          }
          
          // Chamar endpoint de criação
          const result = await dispositivosStore.cadastrarLocalizacaoDispositivo(dadosLocalizacao)
          if (result.success) {
            emit('save', result.data)
          }
        } else if (form.tipoLocalizacao === 'existente') {
          // CASO 2: Usar localização de dispositivo existente
          const dadosLocalizacao = {
            codigoPublicoLocalizacaoDoDispositivo: form.codigoPublicoLocalizacaoDoDispositivo,
            codigoPublicoDispositivo: codigoPublicoDispositivo
          }
          
          // Para localização existente, apenas emitir o evento (não precisa chamar API)
          emit('save', dadosLocalizacao)
        }
      }
    }

    // Observar mudanças nas props
    watch(() => [props.dispositivo, props.localizacaoDispositivo], inicializarFormulario, { immediate: true })

    // Inicializar ao montar
    onMounted(async () => {
      inicializarFormulario()
      // Carregar localizações de dispositivos apenas se necessário
      if (form.tipoLocalizacao === 'existente') {
        await dispositivosStore.listarLocalizacoesDispositivos()
      }
    })

    return {
      form,
      errors,
      isEditing: isEditingComputed,
      dispositivosStore,
      localizacoesDisponiveis,
      localizacoesDispositivosDisponiveis,
      onTipoLocalizacaoChange,
      clearError,
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
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: rgba(15, 15, 35, 0.98);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.4rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.title-icon {
  font-size: 1.6rem;
  color: #00d4ff;
}

.close-button {
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid rgba(255, 71, 87, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: #ff4757;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.close-button:hover {
  background: rgba(255, 71, 87, 0.2);
  transform: scale(1.1);
}

.close-icon {
  font-size: 1rem;
}

.modal-form {
  padding: 30px;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 30px;
}

.device-info {
  background: rgba(26, 26, 62, 0.5);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
}

.info-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #00d4ff;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 15px 0;
}

.info-icon {
  font-size: 1.2rem;
}

.info-item {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
}

.info-label {
  color: #a0a0a0;
  font-size: 0.9rem;
  font-weight: 500;
  min-width: 60px;
}

.info-value {
  color: #ffffff;
  font-size: 0.9rem;
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
  font-weight: 500;
  font-size: 0.9rem;
}

.label-icon {
  font-size: 1rem;
  color: #00d4ff;
}

.input-container {
  position: relative;
}

.form-input,
.form-select {
  width: 100%;
  padding: 12px 15px;
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-select {
  cursor: pointer;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

.form-input.error,
.form-select.error {
  border-color: #ff4757;
  box-shadow: 0 0 0 3px rgba(255, 71, 87, 0.1);
}

.form-input::placeholder {
  color: #666;
}

.form-select option {
  background: rgba(26, 26, 62, 0.9);
  color: #ffffff;
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

.form-input:focus + .input-glow,
.form-select:focus + .input-glow {
  opacity: 1;
}

.error-message {
  color: #ff4757;
  font-size: 0.8rem;
  margin-top: 5px;
}

/* Radio buttons personalizados */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #ffffff;
  font-size: 0.9rem;
}

.radio-label input[type="radio"] {
  display: none;
}

.radio-custom {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-radius: 50%;
  background: rgba(26, 26, 62, 0.8);
  position: relative;
  transition: all 0.3s ease;
}

.radio-label input[type="radio"]:checked + .radio-custom {
  background: #00d4ff;
  border-color: #00d4ff;
}

.radio-label input[type="radio"]:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: #ffffff;
  border-radius: 50%;
}

.radio-text {
  user-select: none;
}

/* Alerta de erro */
.error-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid #ff4757;
  border-radius: 8px;
  padding: 15px;
  color: #ff4757;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.error-icon {
  font-size: 1.2rem;
}

/* Botões de ação */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 212, 255, 0.3);
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 12px 20px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
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

.btn-primary.loading {
  cursor: not-allowed;
  opacity: 0.8;
}

.button-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  font-size: 1rem;
}

.loading-spinner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
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
@media (max-width: 768px) {
  .modal-container {
    margin: 10px;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 20px;
  }
  
  .modal-form {
    padding: 20px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-secondary,
  .btn-primary {
    justify-content: center;
  }
}
</style>
