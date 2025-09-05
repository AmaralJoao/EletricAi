<template>
  <div class="modal-overlay" @click="fecharModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">
          <span class="title-icon">📍</span>
          {{ isEditing ? 'Editar Localização' : 'Nova Localização' }}
        </h2>
        <button @click="fecharModal" class="close-button">
          <span class="close-icon">✕</span>
        </button>
      </div>

      <form @submit.prevent="salvarLocalizacao" class="modal-form">
        <div class="form-grid">
          <!-- Descrição -->
          <div class="form-group full-width">
            <label for="descricao" class="form-label">
              <span class="label-icon">📝</span>
              Descrição *
            </label>
            <div class="input-container">
              <input
                id="descricao"
                v-model="form.descricao"
                type="text"
                class="form-input"
                :class="{ 'error': errors.descricao }"
                placeholder="Ex: Casa Principal, Escritório, Loja..."
                required
                @input="clearError('descricao')"
              />
              <div class="input-glow"></div>
            </div>
            <span v-if="errors.descricao" class="error-message">{{ errors.descricao }}</span>
          </div>

          <!-- CEP -->
          <div class="form-group">
            <label for="cep" class="form-label">
              <span class="label-icon">📮</span>
              CEP *
            </label>
            <div class="input-container">
              <input
                id="cep"
                v-model="form.cep"
                type="text"
                class="form-input"
                :class="{ 'error': errors.cep }"
                placeholder="00000-000"
                maxlength="9"
                required
                @input="formatarCep"
                @blur="buscarCep"
              />
              <div class="input-glow"></div>
            </div>
            <span v-if="errors.cep" class="error-message">{{ errors.cep }}</span>
          </div>

          <!-- Cidade -->
          <div class="form-group">
            <label for="cidade" class="form-label">
              <span class="label-icon">🏙️</span>
              Cidade *
            </label>
            <div class="input-container">
              <input
                id="cidade"
                v-model="form.cidade"
                type="text"
                class="form-input"
                :class="{ 'error': errors.cidade }"
                placeholder="Nome da cidade"
                required
                @input="clearError('cidade')"
              />
              <div class="input-glow"></div>
            </div>
            <span v-if="errors.cidade" class="error-message">{{ errors.cidade }}</span>
          </div>

          <!-- Nome da Rua -->
          <div class="form-group">
            <label for="nomeDaRua" class="form-label">
              <span class="label-icon">🛣️</span>
              Nome da Rua *
            </label>
            <div class="input-container">
              <input
                id="nomeDaRua"
                v-model="form.nomeDaRua"
                type="text"
                class="form-input"
                :class="{ 'error': errors.nomeDaRua }"
                placeholder="Nome da rua, avenida, etc."
                required
                @input="clearError('nomeDaRua')"
              />
              <div class="input-glow"></div>
            </div>
            <span v-if="errors.nomeDaRua" class="error-message">{{ errors.nomeDaRua }}</span>
          </div>

          <!-- Número -->
          <div class="form-group">
            <label for="numero" class="form-label">
              <span class="label-icon">🔢</span>
              Número *
            </label>
            <div class="input-container">
              <input
                id="numero"
                v-model="form.numero"
                type="text"
                class="form-input"
                :class="{ 'error': errors.numero }"
                placeholder="123"
                required
                @input="clearError('numero')"
              />
              <div class="input-glow"></div>
            </div>
            <span v-if="errors.numero" class="error-message">{{ errors.numero }}</span>
          </div>

          <!-- Complemento -->
          <div class="form-group">
            <label for="complemento" class="form-label">
              <span class="label-icon">🏠</span>
              Complemento
            </label>
            <div class="input-container">
              <input
                id="complemento"
                v-model="form.complemento"
                type="text"
                class="form-input"
                placeholder="Apto, sala, bloco, etc. (opcional)"
                @input="clearError('complemento')"
              />
              <div class="input-glow"></div>
            </div>
            <span v-if="errors.complemento" class="error-message">{{ errors.complemento }}</span>
          </div>

          <!-- Status (apenas para edição) -->
          <div v-if="isEditing" class="form-group">
            <label class="form-label">
              <span class="label-icon">⚡</span>
              Status
            </label>
            <div class="checkbox-container">
              <label class="checkbox-label">
                <input
                  v-model="form.status"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">Localização ativa</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Mensagem de erro global -->
        <div v-if="localizacoesStore.hasError" class="error-alert">
          <div class="error-icon">⚠️</div>
          <span>{{ localizacoesStore.error }}</span>
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
            :class="{ 'loading': localizacoesStore.isLoading }"
            :disabled="localizacoesStore.isLoading"
          >
            <span v-if="!localizacoesStore.isLoading" class="button-text">
              <span class="btn-icon">💾</span>
              {{ isEditing ? 'Salvar Alterações' : 'Criar Localização' }}
            </span>
            <span v-else class="loading-spinner">
              <div class="spinner"></div>
              {{ isEditing ? 'Salvando...' : 'Criando...' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useLocalizacoesStore } from '../stores/localizacoes'

export default {
  name: 'LocalizacaoModal',
  props: {
    localizacao: {
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
    const localizacoesStore = useLocalizacoesStore()
    const isEditingComputed = computed(() => props.isEditing)

    // Estado do formulário
    const form = reactive({
      descricao: '',
      cep: '',
      cidade: '',
      nomeDaRua: '',
      numero: '',
      complemento: '',
      status: true
    })

    // Estado dos erros
    const errors = reactive({})

    // Inicializar formulário
    const inicializarFormulario = () => {
      if (props.isEditing && props.localizacao) {
        Object.assign(form, {
          descricao: props.localizacao.descricao || '',
          cep: props.localizacao.cep || '',
          cidade: props.localizacao.cidade || '',
          nomeDaRua: props.localizacao.nomeDaRua || '',
          numero: props.localizacao.numero?.toString() || '',
          complemento: props.localizacao.complemento || '',
          status: props.localizacao.status !== false
        })
      } else {
        Object.assign(form, {
          descricao: '',
          cep: '',
          cidade: '',
          nomeDaRua: '',
          numero: '',
          complemento: '',
          status: true
        })
      }
    }

    // Formatar CEP
    const formatarCep = (event) => {
      let value = event.target.value.replace(/\D/g, '')
      if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8)
      }
      form.cep = value
      clearError('cep')
    }

    // Buscar CEP (simulação - você pode integrar com uma API real)
    const buscarCep = async () => {
      if (form.cep.length === 9) {
        // Aqui você pode integrar com uma API de CEP como ViaCEP
        // Por enquanto, apenas limpa os erros
        clearError('cep')
      }
    }

    // Validação do formulário
    const validarFormulario = () => {
      const newErrors = {}

      if (!form.descricao.trim()) {
        newErrors.descricao = 'Descrição é obrigatória'
      } else if (form.descricao.trim().length < 3) {
        newErrors.descricao = 'Descrição deve ter pelo menos 3 caracteres'
      }

      if (!form.cep.trim()) {
        newErrors.cep = 'CEP é obrigatório'
      } else if (!/^\d{5}-\d{3}$/.test(form.cep)) {
        newErrors.cep = 'CEP deve estar no formato 00000-000'
      }

      if (!form.cidade.trim()) {
        newErrors.cidade = 'Cidade é obrigatória'
      } else if (form.cidade.trim().length < 2) {
        newErrors.cidade = 'Cidade deve ter pelo menos 2 caracteres'
      }

      if (!form.nomeDaRua.trim()) {
        newErrors.nomeDaRua = 'Nome da rua é obrigatório'
      } else if (form.nomeDaRua.trim().length < 3) {
        newErrors.nomeDaRua = 'Nome da rua deve ter pelo menos 3 caracteres'
      }

      if (!form.numero.trim()) {
        newErrors.numero = 'Número é obrigatório'
      } else if (!/^\d+$/.test(form.numero)) {
        newErrors.numero = 'Número deve conter apenas dígitos'
      }

      Object.assign(errors, newErrors)
      return Object.keys(newErrors).length === 0
    }

    // Limpar erro específico
    const clearError = (field) => {
      if (errors[field]) {
        delete errors[field]
      }
      localizacoesStore.clearError()
    }

    // Fechar modal
    const fecharModal = () => {
      emit('close')
    }

    // Salvar localização
    const salvarLocalizacao = async () => {
      if (!validarFormulario()) {
        return
      }

      // Preparar dados para envio
      const dadosLocalizacao = {
        descricao: form.descricao.trim(),
        cep: form.cep,
        cidade: form.cidade.trim(),
        nomeDaRua: form.nomeDaRua.trim(),
        numero: isEditingComputed.value ? parseInt(form.numero) : form.numero, // String para criação, int para edição
        complemento: form.complemento.trim() || null,
        status: form.status
      }

      emit('save', dadosLocalizacao)
    }

    // Observar mudanças na prop localizacao
    watch(() => props.localizacao, inicializarFormulario, { immediate: true })

    // Inicializar ao montar
    onMounted(() => {
      inicializarFormulario()
    })

    return {
      form,
      errors,
      isEditing: isEditingComputed,
      localizacoesStore,
      formatarCep,
      buscarCep,
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
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

.form-input {
  width: 100%;
  padding: 12px 15px;
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

.form-input.error {
  border-color: #ff4757;
  box-shadow: 0 0 0 3px rgba(255, 71, 87, 0.1);
}

.form-input::placeholder {
  color: #666;
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

.error-message {
  color: #ff4757;
  font-size: 0.8rem;
  margin-top: 5px;
}

/* Checkbox personalizado */
.checkbox-container {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #ffffff;
  font-size: 0.9rem;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-radius: 4px;
  background: rgba(26, 26, 62, 0.8);
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background: #00d4ff;
  border-color: #00d4ff;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-text {
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
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 15px;
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
