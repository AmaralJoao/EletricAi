<template>
  <div class="login-container">
    <!-- Efeito de fundo elétrico -->
    <div class="electric-background">
      <div class="lightning lightning-1"></div>
      <div class="lightning lightning-2"></div>
      <div class="lightning lightning-3"></div>
    </div>

    <div class="login-card">
      <!-- Logo e título -->
      <div class="login-header">
        <div class="logo-container">
          <div class="electric-logo">
            <div class="bolt-icon">⚡</div>
            <div class="circuit-lines">
              <div class="line line-1"></div>
              <div class="line line-2"></div>
              <div class="line line-3"></div>
            </div>
          </div>
        </div>
        <h1 class="app-title electric-glow">ELETRIC AI</h1>
        <p class="app-subtitle">Sistema de Gerenciamento Elétrico Inteligente</p>
      </div>

      <!-- Formulário de login -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <div class="input-container">
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-input"
              :class="{ 'error': errors.email }"
              placeholder="usuario@email.com"
              required
              @input="clearError('email')"
            />
            <div class="input-glow"></div>
          </div>
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Senha</label>
          <div class="input-container">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'error': errors.password }"
              placeholder="Digite sua senha"
              required
              @input="clearError('password')"
            />
            <button
              type="button"
              class="password-toggle"
              @click="togglePassword"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
            <div class="input-glow"></div>
          </div>
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <!-- Mensagem de erro global -->
        <div v-if="authStore.hasError" class="error-alert">
          <div class="error-icon">⚠️</div>
          <span>{{ authStore.error }}</span>
        </div>

        <!-- Botão de login -->
        <button
          type="submit"
          class="login-button"
          :class="{ 'loading': authStore.isLoading }"
          :disabled="authStore.isLoading"
        >
          <span v-if="!authStore.isLoading" class="button-text">
            <span class="button-icon">⚡</span>
            Conectar ao Sistema
          </span>
          <span v-else class="loading-spinner">
            <div class="spinner"></div>
            Conectando...
          </span>
        </button>

        <!-- Links adicionais -->
        <div class="login-links">
          <a href="#" class="link">Esqueceu sua senha?</a>
          <a href="#" class="link">Criar nova conta</a>
        </div>
      </form>
    </div>

    <!-- Footer -->
    <div class="login-footer">
      <p>&copy; 2024 ELETRIC AI. Todos os direitos reservados.</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    // Estado do formulário
    const form = reactive({
      email: '',
      password: ''
    })

    // Estado da UI
    const showPassword = ref(false)
    const errors = reactive({})

    // Validação do formulário
    const validateForm = () => {
      const newErrors = {}

      if (!form.email) {
        newErrors.email = 'Email é obrigatório'
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = 'Email inválido'
      }

      if (!form.password) {
        newErrors.password = 'Senha é obrigatória'
      } else if (form.password.length < 6) {
        newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
      }

      Object.assign(errors, newErrors)
      return Object.keys(newErrors).length === 0
    }

    // Limpar erro específico
    const clearError = (field) => {
      if (errors[field]) {
        delete errors[field]
      }
      authStore.clearError()
    }

    // Alternar visibilidade da senha
    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    // Processar login
    const handleLogin = async () => {
      if (!validateForm()) {
        return
      }

      const result = await authStore.login(form.email, form.password)
      
      if (result.success) {
        router.push('/dashboard')
      }
    }

    return {
      form,
      errors,
      showPassword,
      authStore,
      clearError,
      togglePassword,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px;
  overflow: hidden;
}

/* Efeito de fundo elétrico */
.electric-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.lightning {
  position: absolute;
  width: 2px;
  height: 100px;
  background: linear-gradient(to bottom, transparent, #00d4ff, transparent);
  animation: lightning 3s ease-in-out infinite;
}

.lightning-1 {
  left: 10%;
  top: 20%;
  animation-delay: 0s;
}

.lightning-2 {
  right: 15%;
  top: 40%;
  animation-delay: 1s;
}

.lightning-3 {
  left: 80%;
  top: 60%;
  animation-delay: 2s;
}

/* Card de login */
.login-card {
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 1;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  padding: 1px;
  background: linear-gradient(45deg, #00d4ff, #7c3aed, #00d4ff);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  z-index: -1;
}

/* Header do login */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-container {
  margin-bottom: 20px;
}

.electric-logo {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 80px;
}

.bolt-icon {
  font-size: 48px;
  color: #00d4ff;
  animation: electric-glow 2s ease-in-out infinite;
  position: relative;
  z-index: 2;
}

.circuit-lines {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
}

.line {
  position: absolute;
  background: #00d4ff;
  opacity: 0.6;
}

.line-1 {
  width: 60px;
  height: 2px;
  top: 20px;
  left: 20px;
  transform: rotate(45deg);
}

.line-2 {
  width: 40px;
  height: 2px;
  top: 40px;
  right: 20px;
  transform: rotate(-45deg);
}

.line-3 {
  width: 30px;
  height: 2px;
  bottom: 20px;
  left: 35px;
  transform: rotate(90deg);
}

.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #00d4ff, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-subtitle {
  color: #a0a0a0;
  font-size: 1rem;
  font-weight: 400;
}

/* Formulário */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  color: #ffffff;
  font-weight: 500;
  font-size: 0.9rem;
}

.input-container {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 15px 20px;
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 10px;
  color: #ffffff;
  font-size: 1rem;
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
  border-radius: 10px;
  background: linear-gradient(45deg, transparent, rgba(0, 212, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.form-input:focus + .input-glow {
  opacity: 1;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #00d4ff;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
}

.error-message {
  color: #ff4757;
  font-size: 0.8rem;
  margin-top: 5px;
}

.error-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid #ff4757;
  border-radius: 10px;
  padding: 15px;
  color: #ff4757;
  font-size: 0.9rem;
}

.error-icon {
  font-size: 1.2rem;
}

/* Botão de login */
.login-button {
  width: 100%;
  padding: 18px;
  background: linear-gradient(45deg, #00d4ff, #7c3aed);
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button.loading {
  cursor: not-allowed;
  opacity: 0.8;
}

.button-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.button-icon {
  font-size: 1.3rem;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Links */
.login-links {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.link {
  color: #00d4ff;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.link:hover {
  color: #ffffff;
  text-shadow: 0 0 5px #00d4ff;
}

/* Footer */
.login-footer {
  margin-top: 40px;
  text-align: center;
  color: #666;
  font-size: 0.8rem;
}

/* Responsividade */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .app-title {
    font-size: 2rem;
  }
  
  .login-links {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style>

