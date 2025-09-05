# Configuração de Headers de Autorização

## 🔐 Sistema de Autenticação

O sistema está configurado para enviar automaticamente o header `Authorization` com o Bearer token em todas as requisições autenticadas.

### 📋 Como Funciona

1. **Interceptor Global**: O arquivo `axios.js` configura um interceptor que adiciona automaticamente o header `Authorization: Bearer {token}` em todas as requisições.

2. **Token Storage**: O token é armazenado no `localStorage` com a chave `eletric_ai_token`.

3. **Auto-inclusão**: Todas as requisições feitas através do `apiClient` terão o header de autorização incluído automaticamente.

### 🛠️ Configuração Técnica

```javascript
// Interceptor de requisição
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eletric_ai_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)
```

### 📡 Endpoints que Requerem Autenticação

Todos os endpoints de localização requerem o header `Authorization`:

- **POST** `/auth/api/localizacao/novalocalizacao`
- **GET** `/auth/api/localizacao/listarlocalizacao`  
- **POST** `/auth/api/localizacao/editarlocalizacao`

### 🔧 Regras Especiais da API

- **Criação de Localização**: O campo `numero` deve ser enviado como string
- **Edição de Localização**: O campo `numero` deve ser enviado como integer
- **Identificação**: Use `codigoPublicoLocalizacao` para identificar a localização a ser editada
- **Resposta da API**: Retorna `codigoPublico` na listagem e edição

### 🔄 Tratamento de Erros

- **401 Unauthorized**: Token inválido ou expirado
  - Remove automaticamente o token do localStorage
  - Redireciona para a página de login

### 💡 Vantagens

- ✅ **Automático**: Não precisa adicionar headers manualmente
- ✅ **Consistente**: Todas as requisições seguem o mesmo padrão
- ✅ **Seguro**: Tratamento automático de tokens expirados
- ✅ **Centralizado**: Configuração em um local único
