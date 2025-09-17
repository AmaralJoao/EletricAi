<template>
  <div class="configuracoes">
    <header class="configuracoes-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="electric-logo" @click="irParaDashboard">
            <span class="bolt-icon">⚡</span>
            <h1 class="app-title">ELETRIC AI</h1>
          </div>
        </div>
        <div class="user-section">
          <span class="welcome-text">Configurações</span>
          <button @click="handleLogout" class="logout-button">
            <span class="logout-icon">🚪</span>
            Sair
          </button>
        </div>
      </div>
    </header>

    <main class="configuracoes-main">
      <div class="configuracoes-content">
        <!-- Menu lateral -->
        <aside class="configuracoes-sidebar">
          <nav class="sidebar-nav">
            <h3 class="sidebar-title">Configurações</h3>
            <ul class="nav-list">
              <li class="nav-item">
                <button 
                  @click="activeTab = 'localizacoes'"
                  :class="{ 'active': activeTab === 'localizacoes' }"
                  class="nav-button"
                >
                  <span class="nav-icon">📍</span>
                  Localizações
                </button>
              </li>
              <li class="nav-item">
                <button 
                  @click="activeTab = 'dispositivos'"
                  :class="{ 'active': activeTab === 'dispositivos' }"
                  class="nav-button"
                >
                  <span class="nav-icon">🔌</span>
                  Meus Dispositivos
                </button>
              </li>
              <li class="nav-item">
                <button 
                  @click="activeTab = 'localizacao-dispositivos'"
                  :class="{ 'active': activeTab === 'localizacao-dispositivos' }"
                  class="nav-button"
                >
                  <span class="nav-icon">📍</span>
                  Localizações Dispositivos
                </button>
              </li>
              <li class="nav-item">
                <button 
                  @click="activeTab = 'usuarios'"
                  :class="{ 'active': activeTab === 'usuarios' }"
                  class="nav-button"
                >
                  <span class="nav-icon">👥</span>
                  Usuários
                </button>
              </li>
              <li class="nav-item">
                <button 
                  @click="activeTab = 'sistema'"
                  :class="{ 'active': activeTab === 'sistema' }"
                  class="nav-button"
                >
                  <span class="nav-icon">⚙️</span>
                  Sistema
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <!-- Conteúdo principal -->
        <section class="configuracoes-panel">
          <!-- Painel de Localizações -->
          <div v-if="activeTab === 'localizacoes'" class="panel-content">
            <div class="panel-header">
              <h2 class="panel-title">
                <span class="title-icon">📍</span>
                Gerenciar Localizações
              </h2>
              <button @click="abrirModalNovaLocalizacao" class="btn-primary">
                <span class="btn-icon">➕</span>
                Nova Localização
              </button>
            </div>

            <!-- Lista de localizações -->
            <div class="localizacoes-container">
              <div v-if="localizacoesStore.isLoading" class="loading-container">
                <div class="loading-spinner">
                  <div class="spinner"></div>
                  <span>Carregando localizações...</span>
                </div>
              </div>

              <div v-else-if="localizacoesStore.localizacoes.length === 0" class="empty-state">
                <div class="empty-icon">📍</div>
                <h3>Nenhuma localização encontrada</h3>
                <p>Comece criando sua primeira localização</p>
                <button @click="abrirModalNovaLocalizacao" class="btn-primary">
                  <span class="btn-icon">➕</span>
                  Criar Primeira Localização
                </button>
              </div>

              <div v-else class="localizacoes-grid">
                <div 
                  v-for="localizacao in localizacoesStore.localizacoes" 
                  :key="localizacao.codigoPublico || localizacao.descricao"
                  class="localizacao-card"
                >
                  <div class="card-header">
                    <h3 class="localizacao-nome">{{ localizacao.descricao }}</h3>
                    <div class="card-actions">
                      <button 
                        @click="editarLocalizacao(localizacao)"
                        class="btn-edit"
                        title="Editar localização"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                  
                  <div class="card-body">
                    <div class="endereco-info">
                      <div class="endereco-item">
                        <span class="endereco-label">Endereço:</span>
                        <span class="endereco-value">
                          {{ localizacao.nomeDaRua }}, {{ localizacao.numero }}
                        </span>
                      </div>
                      <div class="endereco-item">
                        <span class="endereco-label">Cidade:</span>
                        <span class="endereco-value">{{ localizacao.cidade }}</span>
                      </div>
                      <div class="endereco-item">
                        <span class="endereco-label">CEP:</span>
                        <span class="endereco-value">{{ localizacao.cep }}</span>
                      </div>
                      <div v-if="localizacao.complemento" class="endereco-item">
                        <span class="endereco-label">Complemento:</span>
                        <span class="endereco-value">{{ localizacao.complemento }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="card-footer">
                    <div class="status-badge" :class="{ 'active': localizacao.status }">
                      {{ localizacao.status ? 'Ativa' : 'Inativa' }}
                    </div>
                    <div v-if="localizacao.codigoPublico" class="codigo-info">
                      <span class="codigo-label">Código:</span>
                      <code class="codigo-value">{{ localizacao.codigoPublico }}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Painel de Dispositivos -->
          <div v-else-if="activeTab === 'dispositivos'" class="panel-content">
            <div class="panel-header">
              <h2 class="panel-title">
                <span class="title-icon">🔌</span>
                Meus Dispositivos
              </h2>
              <div class="panel-actions">
                <button class="btn-primary" @click="showVincular = true">
                  <span class="btn-icon">➕</span>
                  Vincular Dispositivo
                </button>
                <button class="btn-secondary" @click="recarregarDispositivos">
                  <span class="btn-icon">🔄</span>
                  Atualizar
                </button>
              </div>
            </div>

            <!-- Modal de vinculação de Chip ID -->
            <div v-if="showVincular" class="chip-modal-overlay" @click="cancelarVinculo">
              <div class="chip-modal-container" @click.stop>
                <div class="chip-modal-header">
                  <h3 class="chip-modal-title">
                    <span class="title-icon">🔗</span>
                    Vincular Dispositivo
                  </h3>
                  <button @click="cancelarVinculo" class="close-button">
                    <span class="close-icon">✕</span>
                  </button>
                </div>
                <form @submit.prevent="handleVincular" class="chip-modal-form">
                  <label class="form-label" for="chipIdInput">
                    <span class="label-icon">🧩</span>
                    Chip ID
                  </label>
                  <div class="input-container">
                    <input
                      id="chipIdInput"
                      v-model="chipId"
                      type="text"
                      placeholder="Informe o Chip ID"
                      class="form-input"
                      required
                      autofocus
                    />
                    <div class="input-glow"></div>
                  </div>
                  <div class="chip-modal-actions">
                    <button type="button" class="btn-secondary" @click="cancelarVinculo" :disabled="dispositivosStore.isLoading">
                      Cancelar
                    </button>
                    <button type="submit" class="btn-primary" :disabled="dispositivosStore.isLoading">
                      Vincular
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Alerta de erro -->
            <div v-if="dispositivosStore.hasError" class="error-alert">
              <div class="error-icon">⚠️</div>
              <span>{{ dispositivosStore.error }}</span>
            </div>

            <!-- Lista de dispositivos -->
            <div class="dispositivos-container">
              <div v-if="dispositivosStore.isLoading" class="loading-container">
                <div class="loading-spinner">
                  <div class="spinner"></div>
                  <span>Carregando dispositivos...</span>
                </div>
              </div>

              <div v-else-if="dispositivosStore.dispositivos.length === 0" class="empty-state">
                <div class="empty-icon">🔌</div>
                <h3>Nenhum dispositivo encontrado</h3>
                <p>Vincule seu primeiro dispositivo usando o Chip ID</p>
                <button @click="showVincular = true" class="btn-primary">
                  <span class="btn-icon">➕</span>
                  Vincular Primeiro Dispositivo
                </button>
              </div>

              <div v-else class="dispositivos-grid">
                <div 
                  v-for="dispositivo in dispositivosStore.dispositivos" 
                  :key="dispositivo.codigoPublicoDispositivo"
                  class="dispositivo-card"
                >
                  <div class="card-header">
                    <h3 class="dispositivo-nome">{{ dispositivo.nomeDoDispositivo }}</h3>
                    <div class="card-actions">
                      <span class="modelo-badge">{{ dispositivo.modeloDispositivo }}</span>
                    </div>
                  </div>
                  
                  <div class="card-body">
                    <div class="dispositivo-info">
                      <div class="info-item">
                        <span class="info-label">Modelo:</span>
                        <span class="info-value">{{ dispositivo.modeloDispositivo }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Versão:</span>
                        <span class="info-value">{{ dispositivo.versaoDoDispositivo }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Localização:</span>
                        <span class="info-value">
                          {{ dispositivo.nomeDaLocalizacaoDoDispositivo || 'Não vinculado' }}
                        </span>
                      </div>
                      <div v-if="dispositivo.nomeDaRua" class="info-item">
                        <span class="info-label">Endereço:</span>
                        <span class="info-value">
                          {{ dispositivo.nomeDaRua }}, {{ dispositivo.numero }}
                          <template v-if="dispositivo.complemento"> - {{ dispositivo.complemento }}</template>
                        </span>
                      </div>
                      <div v-if="dispositivo.cidade" class="info-item">
                        <span class="info-label">Cidade:</span>
                        <span class="info-value">{{ dispositivo.cidade }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="card-footer">
                    <div class="codigo-info">
                      <span class="codigo-label">Código:</span>
                      <code class="codigo-value">{{ dispositivo.codigoPublicoDispositivo }}</code>
                    </div>
                    <div class="status-badge" :class="{ 'vinculado': dispositivo.nomeDaLocalizacaoDoDispositivo }">
                      {{ dispositivo.nomeDaLocalizacaoDoDispositivo ? 'Vinculado' : 'Não vinculado' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Painel de Localizações de Dispositivos -->
          <div v-else-if="activeTab === 'localizacao-dispositivos'" class="panel-content">
            <div class="panel-header">
              <h2 class="panel-title">
                <span class="title-icon">📍</span>
                Localizações dos Dispositivos
              </h2>
              <div class="panel-actions">
                <button class="btn-primary" @click="abrirModalNovaLocalizacaoDispositivo">
                  <span class="btn-icon">➕</span>
                  Nova Localização
                </button>
                <button class="btn-secondary" @click="recarregarLocalizacoesDispositivos">
                  <span class="btn-icon">🔄</span>
                  Atualizar
                </button>
              </div>
            </div>

            <!-- Alerta de erro -->
            <div v-if="localizacaoDispositivoStore.hasError" class="error-alert">
              <div class="error-icon">⚠️</div>
              <span>{{ localizacaoDispositivoStore.error }}</span>
            </div>

            <!-- Lista de localizações de dispositivos -->
            <div class="localizacoes-container">
              <div v-if="localizacaoDispositivoStore.isLoading" class="loading-container">
                <div class="loading-spinner">
                  <div class="spinner"></div>
                  <span>Carregando localizações...</span>
                </div>
              </div>

              <div v-else-if="localizacaoDispositivoStore.localizacoesDispositivos.length === 0" class="empty-state">
                <div class="empty-icon">📍</div>
                <h3>Nenhuma localização encontrada</h3>
                <p>Crie sua primeira localização para um dispositivo</p>
                <button @click="abrirModalNovaLocalizacaoDispositivo" class="btn-primary">
                  <span class="btn-icon">➕</span>
                  Criar Primeira Localização
                </button>
              </div>

              <div v-else class="localizacoes-grid">
                <div 
                  v-for="localizacao in localizacaoDispositivoStore.localizacoesDispositivos" 
                  :key="localizacao.codigoPublicoDispositivo"
                  class="localizacao-card"
                >
                  <div class="card-header">
                    <h3 class="localizacao-nome">
                      {{ localizacao.nomeDaLocalizacaoDoDispositivo || 'Sem nome' }}
                    </h3>
                    <div class="card-actions">
                      <button 
                        @click="editarLocalizacaoDispositivoNova(localizacao)"
                        class="btn-edit"
                        title="Editar localização"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                  
                  <div class="card-body">
                    <div class="endereco-info">
                      <div class="endereco-item">
                        <span class="endereco-label">Dispositivo:</span>
                        <span class="endereco-value">{{ localizacao.nomeDoDispositivo }}</span>
                      </div>
                      <div class="endereco-item">
                        <span class="endereco-label">Modelo:</span>
                        <span class="endereco-value">{{ localizacao.modeloDispositivo }}</span>
                      </div>
                      <div class="endereco-item">
                        <span class="endereco-label">Versão:</span>
                        <span class="endereco-value">{{ localizacao.versaoDoDispositivo }}</span>
                      </div>
                      <div v-if="localizacao.cidade" class="endereco-item">
                        <span class="endereco-label">Cidade:</span>
                        <span class="endereco-value">{{ localizacao.cidade }}</span>
                      </div>
                      <div v-if="localizacao.nomeDaRua" class="endereco-item">
                        <span class="endereco-label">Endereço:</span>
                        <span class="endereco-value">
                          {{ localizacao.nomeDaRua }}, {{ localizacao.numero }}
                          <template v-if="localizacao.complemento"> - {{ localizacao.complemento }}</template>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="card-footer">
                    <div class="status-badge" :class="{ 'active': localizacao.nomeDaLocalizacaoDoDispositivo }">
                      {{ localizacao.nomeDaLocalizacaoDoDispositivo ? 'Configurado' : 'Não configurado' }}
                    </div>
                    <div v-if="localizacao.codigoPublicoDispositivo" class="codigo-info">
                      <span class="codigo-label">Código:</span>
                      <code class="codigo-value">{{ localizacao.codigoPublicoDispositivo }}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Outros painéis (placeholder) -->
          <div v-else-if="activeTab === 'usuarios'" class="panel-content">
            <div class="panel-header">
              <h2 class="panel-title">
                <span class="title-icon">👥</span>
                Gerenciar Usuários
              </h2>
            </div>
            <div class="coming-soon">
              <div class="coming-soon-icon">🚧</div>
              <h3>Em Desenvolvimento</h3>
              <p>Esta funcionalidade estará disponível em breve</p>
            </div>
          </div>

          <div v-else-if="activeTab === 'sistema'" class="panel-content">
            <div class="panel-header">
              <h2 class="panel-title">
                <span class="title-icon">⚙️</span>
                Configurações do Sistema
              </h2>
            </div>
            <div class="coming-soon">
              <div class="coming-soon-icon">🚧</div>
              <h3>Em Desenvolvimento</h3>
              <p>Esta funcionalidade estará disponível em breve</p>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Modal para Nova/Editar Localização -->
    <LocalizacaoModal 
      v-if="showModal"
      :localizacao="localizacaoEditando"
      :isEditing="isEditing"
      @close="fecharModal"
      @save="salvarLocalizacao"
    />

    <!-- Modal para Localização do Dispositivo -->
    <DispositivoLocalizacaoModal 
      v-if="showDispositivoLocalizacaoModal"
      :dispositivo="dispositivoEditando"
      :isEditing="isEditingDispositivoLocalizacao"
      :localizacaoDispositivo="localizacaoDispositivoEditando"
      @close="fecharDispositivoLocalizacaoModal"
      @save="salvarLocalizacaoDispositivo"
    />

    <!-- Modal para Localização de Dispositivo -->
    <LocalizacaoDispositivoModal 
      v-if="showLocalizacaoDispositivoModal"
      :localizacaoDispositivo="localizacaoDispositivoEditandoModal"
      :isEditing="isEditingLocalizacaoDispositivo"
      @close="fecharLocalizacaoDispositivoModal"
      @save="salvarLocalizacaoDispositivoModal"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useLocalizacoesStore } from '../stores/localizacoes'
import { useDispositivosStore } from '../stores/dispositivos'
import { useLocalizacaoDispositivoStore } from '../stores/localizacaoDispositivo'
import LocalizacaoModal from '../components/LocalizacaoModal.vue'
import DispositivoLocalizacaoModal from '../components/DispositivoLocalizacaoModal.vue'
import LocalizacaoDispositivoModal from '../components/LocalizacaoDispositivoModal.vue'

export default {
  name: 'Configuracoes',
  components: {
    LocalizacaoModal,
    DispositivoLocalizacaoModal,
    LocalizacaoDispositivoModal
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const localizacoesStore = useLocalizacoesStore()
    const dispositivosStore = useDispositivosStore()
    const localizacaoDispositivoStore = useLocalizacaoDispositivoStore()

    // Estado da UI
    const activeTab = ref('localizacoes')
    const showModal = ref(false)
    const isEditing = ref(false)
    const localizacaoEditando = ref(null)
    const chipId = ref('')
    const showVincular = ref(false)
    const showDispositivoLocalizacaoModal = ref(false)
    const dispositivoEditando = ref(null)
    const localizacaoDispositivoEditando = ref(null)
    const isEditingDispositivoLocalizacao = ref(false)
    const showLocalizacaoDispositivoModal = ref(false)
    const localizacaoDispositivoEditandoModal = ref(null)
    const isEditingLocalizacaoDispositivo = ref(false)

    // Carregar localizações ao montar o componente
    onMounted(async () => {
      await localizacoesStore.listarLocalizacoes()
      await dispositivosStore.listarDispositivos()
      await localizacaoDispositivoStore.listarLocalizacoesDispositivos()
    })

    // Função de logout
    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }

    // Ir para dashboard (tela inicial)
    const irParaDashboard = () => {
      router.push('/')
    }

    // Abrir modal para nova localização
    const abrirModalNovaLocalizacao = () => {
      isEditing.value = false
      localizacaoEditando.value = null
      showModal.value = true
    }

    // Editar localização existente
    const editarLocalizacao = (localizacao) => {
      isEditing.value = true
      localizacaoEditando.value = { ...localizacao }
      showModal.value = true
    }

    // Fechar modal
    const fecharModal = () => {
      showModal.value = false
      isEditing.value = false
      localizacaoEditando.value = null
      localizacoesStore.clearError()
    }

    // Salvar localização (nova ou edição)
    const salvarLocalizacao = async (dadosLocalizacao) => {
      let result
      
      if (isEditing.value) {
        result = await localizacoesStore.editarLocalizacao(
          localizacaoEditando.value.codigoPublico,
          dadosLocalizacao
        )
      } else {
        result = await localizacoesStore.criarLocalizacao(dadosLocalizacao)
      }

      if (result.success) {
        fecharModal()
        // Recarregar a lista
        await localizacoesStore.listarLocalizacoes()
      }
    }

    // Recarregar dispositivos
    const recarregarDispositivos = async () => {
      await dispositivosStore.listarDispositivos()
    }

    // Vincular dispositivo
    const handleVincular = async () => {
      if (!chipId.value.trim()) return
      const result = await dispositivosStore.vincularDispositivo(chipId.value.trim())
      if (result.success) {
        chipId.value = ''
        showVincular.value = false
        // Recarregar a lista de dispositivos
        await dispositivosStore.listarDispositivos()
        // Abrir modal para cadastrar localização do dispositivo
        dispositivoEditando.value = result.data
        isEditingDispositivoLocalizacao.value = false
        localizacaoDispositivoEditando.value = null
        showDispositivoLocalizacaoModal.value = true
      }
    }

    const cancelarVinculo = () => {
      chipId.value = ''
      showVincular.value = false
      dispositivosStore.clearError()
    }

    // Editar localização do dispositivo
    const editarLocalizacaoDispositivo = (dispositivo) => {
      dispositivoEditando.value = dispositivo
      isEditingDispositivoLocalizacao.value = true
      // Simular dados da localização do dispositivo (você pode ajustar conforme sua API)
      localizacaoDispositivoEditando.value = {
        codigoPublicoLocalizacaoDoDispositivo: dispositivo.codigoPublicoLocalizacaoDoDispositivo || 'temp-id',
        codigoPublicoLocalizacao: dispositivo.codigoPublicoLocalizacao || '',
        nomeDaLocalizacaoDoDispositivo: dispositivo.nomeDaLocalizacaoDoDispositivo || ''
      }
      showDispositivoLocalizacaoModal.value = true
    }

    // Fechar modal de localização do dispositivo
    const fecharDispositivoLocalizacaoModal = () => {
      showDispositivoLocalizacaoModal.value = false
      dispositivoEditando.value = null
      localizacaoDispositivoEditando.value = null
      isEditingDispositivoLocalizacao.value = false
      dispositivosStore.clearError()
    }

    // Salvar localização do dispositivo
    const salvarLocalizacaoDispositivo = async (dadosLocalizacao) => {
      // O modal já chama a API apropriada baseada na escolha do usuário
      // Aqui apenas fechamos o modal e recarregamos os dados
      fecharDispositivoLocalizacaoModal()
      
      // Recarregar apenas a lista de dispositivos
      await dispositivosStore.listarDispositivos()
    }

    // Recarregar localizações de dispositivos
    const recarregarLocalizacoesDispositivos = async () => {
      await localizacaoDispositivoStore.listarLocalizacoesDispositivos()
    }

    // Abrir modal para nova localização de dispositivo
    const abrirModalNovaLocalizacaoDispositivo = () => {
      isEditingLocalizacaoDispositivo.value = false
      localizacaoDispositivoEditandoModal.value = null
      showLocalizacaoDispositivoModal.value = true
    }

    // Editar localização de dispositivo (nova aba)
    const editarLocalizacaoDispositivoNova = (localizacao) => {
      isEditingLocalizacaoDispositivo.value = true
      localizacaoDispositivoEditandoModal.value = { ...localizacao }
      showLocalizacaoDispositivoModal.value = true
    }

    // Fechar modal de localização de dispositivo
    const fecharLocalizacaoDispositivoModal = () => {
      showLocalizacaoDispositivoModal.value = false
      localizacaoDispositivoEditandoModal.value = null
      isEditingLocalizacaoDispositivo.value = false
      localizacaoDispositivoStore.clearError()
    }

    // Salvar localização de dispositivo
    const salvarLocalizacaoDispositivoModal = async (dados) => {
      fecharLocalizacaoDispositivoModal()
      await localizacaoDispositivoStore.listarLocalizacoesDispositivos()
    }

    return {
      activeTab,
      showModal,
      isEditing,
      localizacaoEditando,
      authStore,
      localizacoesStore,
      dispositivosStore,
      handleLogout,
      irParaDashboard,
      abrirModalNovaLocalizacao,
      editarLocalizacao,
      fecharModal,
      salvarLocalizacao,
      recarregarDispositivos,
      chipId,
      handleVincular,
      showVincular,
      cancelarVinculo,
      showDispositivoLocalizacaoModal,
      dispositivoEditando,
      localizacaoDispositivoEditando,
      isEditingDispositivoLocalizacao,
      editarLocalizacaoDispositivo,
      fecharDispositivoLocalizacaoModal,
      salvarLocalizacaoDispositivo,
      localizacaoDispositivoStore,
      recarregarLocalizacoesDispositivos,
      abrirModalNovaLocalizacaoDispositivo,
      editarLocalizacaoDispositivoNova,
      showLocalizacaoDispositivoModal,
      localizacaoDispositivoEditandoModal,
      isEditingLocalizacaoDispositivo,
      fecharLocalizacaoDispositivoModal,
      salvarLocalizacaoDispositivoModal
    }
  }
}
</script>

<style scoped>
.configuracoes {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%);
  color: #ffffff;
}

.configuracoes-header {
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
  padding: 20px 0;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
}

.electric-logo {
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 8px;
}

.electric-logo:hover {
  background: rgba(0, 212, 255, 0.1);
  transform: scale(1.05);
}

.bolt-icon {
  font-size: 2rem;
  color: #00d4ff;
  animation: electric-glow 2s ease-in-out infinite;
}

.app-title {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(45deg, #00d4ff, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.welcome-text {
  color: #a0a0a0;
  font-size: 0.9rem;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid #ff4757;
  border-radius: 8px;
  padding: 10px 15px;
  color: #ff4757;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.logout-button:hover {
  background: rgba(255, 71, 87, 0.2);
  transform: translateY(-1px);
}

.logout-icon {
  font-size: 1rem;
}

.configuracoes-main {
  padding: 40px 20px;
}

.configuracoes-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
}

/* Sidebar */
.configuracoes-sidebar {
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 15px;
  padding: 25px;
  height: fit-content;
}

.sidebar-title {
  color: #00d4ff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 8px;
}

.nav-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  color: #a0a0a0;
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  text-align: left;
}

.nav-button:hover {
  background: rgba(0, 212, 255, 0.1);
  color: #ffffff;
}

.nav-button.active {
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
  border: 1px solid rgba(0, 212, 255, 0.3);
}

.nav-icon {
  font-size: 1.1rem;
}

/* Painel principal */
.configuracoes-panel {
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 15px;
  padding: 30px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
}

.title-icon {
  font-size: 1.8rem;
  color: #00d4ff;
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
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 212, 255, 0.3);
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
}

.btn-secondary:hover {
  background: rgba(124, 58, 237, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
}

.btn-icon {
  font-size: 1.1rem;
}

.panel-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Alerta de erro */
.error-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid rgba(255, 71, 87, 0.3);
  border-radius: 8px;
  padding: 15px 20px;
  margin-bottom: 20px;
  color: #ff4757;
}

.error-icon {
  font-size: 1.2rem;
}

/* Modal de Chip ID */
.chip-modal-overlay {
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

.chip-modal-container {
  width: 100%;
  max-width: 460px;
  background: rgba(15, 15, 35, 0.98);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
}

.chip-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.25);
}

.chip-modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
}

.chip-modal-form {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chip-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 12px;
}

@media (max-width: 480px) {
  .chip-modal-container {
    max-width: 100%;
  }
}

/* Estados de loading e vazio */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: #a0a0a0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 212, 255, 0.3);
  border-top: 3px solid #00d4ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #a0a0a0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  color: #ffffff;
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.empty-state p {
  margin-bottom: 25px;
  font-size: 1rem;
}

/* Grid de localizações */
.localizacoes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

/* Grid de dispositivos */
.dispositivos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.localizacao-card {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.localizacao-card:hover {
  transform: translateY(-3px);
  border-color: #00d4ff;
  box-shadow: 0 10px 25px rgba(0, 212, 255, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.localizacao-nome {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn-edit {
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 6px;
  padding: 8px;
  color: #00d4ff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-edit:hover {
  background: rgba(0, 212, 255, 0.2);
  transform: scale(1.1);
}

.endereco-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.endereco-item {
  display: flex;
  gap: 8px;
}

.endereco-label {
  color: #a0a0a0;
  font-size: 0.9rem;
  font-weight: 500;
  min-width: 80px;
}

.endereco-value {
  color: #ffffff;
  font-size: 0.9rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid rgba(0, 212, 255, 0.2);
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
  border: 1px solid rgba(255, 71, 87, 0.3);
}

.status-badge.active {
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
  border: 1px solid rgba(0, 212, 255, 0.3);
}

.status-badge.vinculado {
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
  border: 1px solid rgba(0, 212, 255, 0.3);
}

/* Cards de dispositivos */
.dispositivo-card {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.dispositivo-card:hover {
  transform: translateY(-3px);
  border-color: #00d4ff;
  box-shadow: 0 10px 25px rgba(0, 212, 255, 0.2);
}

.dispositivo-nome {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.modelo-badge {
  background: rgba(124, 58, 237, 0.2);
  color: #7c3aed;
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.dispositivo-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  gap: 8px;
}

.info-label {
  color: #a0a0a0;
  font-size: 0.9rem;
  font-weight: 500;
  min-width: 80px;
}

.info-value {
  color: #ffffff;
  font-size: 0.9rem;
}

.codigo-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.codigo-label {
  color: #a0a0a0;
  font-size: 0.8rem;
}

.codigo-value {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  color: #00d4ff;
  font-family: 'Courier New', monospace;
}

/* Estado "Em desenvolvimento" */
.coming-soon {
  text-align: center;
  padding: 80px 20px;
  color: #a0a0a0;
}

.coming-soon-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.coming-soon h3 {
  color: #ffffff;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.coming-soon p {
  font-size: 1rem;
}

/* Responsividade */
@media (max-width: 1024px) {
  .configuracoes-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .configuracoes-sidebar {
    order: 2;
  }
  
  .configuracoes-panel {
    order: 1;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .user-section {
    flex-direction: column;
    gap: 15px;
  }
  
  .panel-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .localizacoes-grid {
    grid-template-columns: 1fr;
  }
}
</style>

