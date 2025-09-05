# ELETRIC AI - Sistema de Gerenciamento Elétrico

Sistema de gerenciamento elétrico inteligente desenvolvido com Vue.js 3, focado em monitoramento e análise de consumo elétrico.

## 🚀 Características

- **Interface Moderna**: Design com tema elétrico e animações
- **Autenticação Segura**: Sistema de login com token UUID
- **Responsivo**: Interface adaptável para diferentes dispositivos
- **Vue.js 3**: Utilizando Composition API e JavaScript puro
- **Pinia**: Gerenciamento de estado reativo
- **Vue Router**: Navegação entre páginas
- **Axios**: Comunicação com API REST

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- API REST rodando em `http://localhost:8080`

## 🛠️ Instalação

1. **Clone o repositório** (se aplicável)
2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Execute o projeto em modo de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**:
   - Abra seu navegador em `http://localhost:3000`

## 🔧 Configuração da API

O sistema está configurado para se comunicar com a API em:
- **URL Base**: `http://localhost:8080`
- **Endpoint de Login**: `POST /open/api/autenticar/usuario/login`

### Formato da Requisição de Login:
```json
{
  "emaiUsuario": "usuario@email.com",
  "senha": "minhaSenhaSecreta"
}
```

### Formato da Resposta:
```json
{
  "token": "48e67c04-b14f-45ac-8097-15fed1d7f59b"
}
```

## 📍 API de Localizações

### Criar Nova Localização:
```json
POST /auth/api/localizacao/novalocalizacao
{
  "descricao": "Casa Principal",
  "cep": "12345-678",
  "cidade": "São Paulo",
  "nomeDaRua": "Rua das Flores",
  "numero": "123",
  "complemento": "Apto 101"
}
```

### Listar Localizações:
```json
GET /auth/api/localizacao/listarlocalizacao
// Retorna array de localizações com codigoPublico
```

### Editar Localização:
```json
POST /auth/api/localizacao/editarlocalizacao
{
  "codigoPublicoLocalizacao": "C4B5T4MAQHFXESH",
  "status": true,
  "descricao": "Casa Principal Atualizada",
  "cep": "12345-678",
  "cidade": "São Paulo",
  "nomeDaRua": "Rua das Flores",
  "numero": 123,
  "complemento": "Apto 101"
}
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── views/              # Páginas da aplicação
│   ├── Login.vue       # Tela de login
│   └── Dashboard.vue   # Dashboard principal
├── stores/             # Gerenciamento de estado (Pinia)
│   └── auth.js         # Store de autenticação
├── router/             # Configuração de rotas
│   └── index.js        # Definição das rotas
├── App.vue             # Componente raiz
├── main.js             # Ponto de entrada
└── style.css           # Estilos globais
```

## 🎨 Funcionalidades da Tela de Login

### Validações Implementadas:
- ✅ Email obrigatório e formato válido
- ✅ Senha obrigatória (mínimo 6 caracteres)
- ✅ Feedback visual de erros
- ✅ Mensagens de erro da API

### Recursos Visuais:
- ⚡ Animações elétricas de fundo
- 🔒 Toggle de visibilidade da senha
- 💫 Efeitos de glow e pulse
- 📱 Design responsivo
- 🎯 Estados de loading

### Gerenciamento de Estado:
- 🔐 Armazenamento seguro do token
- 🚪 Sistema de logout
- 🛡️ Guard de autenticação nas rotas
- ⚠️ Tratamento de erros

## 🔐 Segurança

- Token armazenado no `localStorage`
- Validação de rotas protegidas
- Limpeza automática de dados na saída
- Tratamento seguro de erros de API

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🎯 Próximos Passos

- [ ] Implementar recuperação de senha
- [ ] Adicionar registro de novos usuários
- [ ] Desenvolver funcionalidades do dashboard
- [ ] Implementar monitoramento em tempo real
- [ ] Adicionar relatórios e gráficos
- [ ] Configurar notificações push

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato através dos canais oficiais do projeto.

---

**ELETRIC AI** - Energizando o futuro com inteligência artificial ⚡

