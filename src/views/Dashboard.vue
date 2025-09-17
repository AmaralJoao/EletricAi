<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="electric-logo" @click="irParaDashboard">
            <span class="bolt-icon">⚡</span>
            <h1 class="app-title">ELETRIC AI</h1>
          </div>
        </div>
        <div class="user-section">
          <span class="welcome-text">Bem-vindo ao sistema!</span>
          <button @click="handleLogout" class="logout-button">
            <span class="logout-icon">🚪</span>
            Sair
          </button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="dashboard-content">
        <div class="welcome-card">
          <div class="card-header">
            <h2 class="card-title">Sistema Conectado com Sucesso!</h2>
            <div class="status-indicator">
              <div class="status-dot"></div>
              <span>Online</span>
            </div>
          </div>
          <div class="card-body">
            <p class="success-message">
              🎉 Login realizado com sucesso! Você está conectado ao sistema ELETRIC AI.
            </p>
            <div class="token-info">
              <h3>Informações da Sessão:</h3>
              <div class="token-display">
                <label>Token de Acesso:</label>
                <code class="token-value">{{ maskedToken }}</code>
              </div>
            </div>
          </div>
        </div>


        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Monitoramento</h3>
            <p>Monitore o consumo elétrico em tempo real</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Relatórios</h3>
            <p>Gere relatórios detalhados de consumo</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3>IA Preditiva</h3>
            <p>Análise inteligente com machine learning</p>
          </div>
          <div class="feature-card" @click="irParaConfiguracoes">
            <div class="feature-icon">⚙️</div>
            <h3>Configurações</h3>
            <p>Configure alertas e preferências</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    // Mascarar o token para exibição
    const maskedToken = computed(() => {
      if (!authStore.token) return 'N/A'
      const token = authStore.token
      return token.substring(0, 8) + '...' + token.substring(token.length - 8)
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

    // Ir para configurações
    const irParaConfiguracoes = () => {
      router.push('/configuracoes')
    }

    return {
      authStore,
      maskedToken,
      handleLogout,
      irParaDashboard,
      irParaConfiguracoes
    }
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%);
  color: #ffffff;
}

.dashboard-header {
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
  padding: 20px 0;
}

.header-content {
  max-width: 1200px;
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

.dashboard-main {
  padding: 40px 20px;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #00d4ff;
  font-size: 0.9rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #00d4ff;
  border-radius: 50%;
  animation: electric-pulse 2s ease-in-out infinite;
}

.success-message {
  font-size: 1.1rem;
  color: #a0a0a0;
  margin-bottom: 25px;
  line-height: 1.6;
}

.token-info h3 {
  color: #ffffff;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.token-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.token-display label {
  color: #a0a0a0;
  font-size: 0.9rem;
  font-weight: 500;
}

.token-value {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  padding: 12px 15px;
  color: #00d4ff;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  word-break: break-all;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.feature-card {
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: #00d4ff;
  box-shadow: 0 15px 30px rgba(0, 212, 255, 0.2);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #00d4ff;
}

.feature-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #ffffff;
}

.feature-card p {
  color: #a0a0a0;
  font-size: 0.9rem;
  line-height: 1.5;
}


/* Responsividade */
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
  
  .card-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}

/* Animações */
@keyframes electric-glow {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.7; 
    transform: scale(1.1);
  }
}

@keyframes electric-pulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.5; 
    transform: scale(1.2);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
