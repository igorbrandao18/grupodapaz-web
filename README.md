# Grupo da Paz - Sistema Web

Sistema web completo para o Grupo da Paz, empresa especializada em serviços funerários e planos de proteção familiar. A aplicação oferece uma plataforma moderna com portais para clientes e administradores, integrada com Supabase para autenticação e dados, e Stripe para processamento de pagamentos.

## 🚀 Funcionalidades

### Site Institucional
- **Landing Page**: Apresentação dos serviços e planos
- **Planos de Proteção**: Visualização detalhada dos planos disponíveis
- **Serviços**: Informações sobre os serviços oferecidos
- **Unidades**: Localização das unidades físicas
- **FAQ**: Perguntas frequentes
- **Contato**: Formulário de contato e informações

### Portal do Cliente
- **Dashboard Pessoal**: Visualização de informações pessoais
- **Plano Contratado**: Detalhes do plano ativo
- **Benefícios**: Lista de benefícios inclusos
- **Histórico**: Acompanhamento de serviços utilizados

### Portal Administrativo
- **Dashboard**: Métricas e estatísticas gerais
- **Gerenciamento de Clientes**: CRUD completo de clientes
- **Gerenciamento de Planos**: Criação e edição de planos
- **Atribuição de Planos**: Associar planos aos clientes
- **Controle de Acesso**: Gerenciar permissões de usuários

## 🛠️ Tecnologias

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **Radix UI** - Componentes acessíveis
- **Framer Motion** - Animações
- **React Query** - Gerenciamento de estado servidor
- **Wouter** - Roteamento

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipagem estática
- **Drizzle ORM** - ORM para banco de dados

### Banco de Dados e Serviços
- **PostgreSQL** - Banco de dados principal
- **Supabase** - Backend-as-a-Service
  - Autenticação
  - Banco de dados
  - Storage
  - Realtime
- **Stripe** - Processamento de pagamentos
- **Resend** - Envio de emails

## 📁 Estrutura do Projeto

```
PazEternal/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── lib/            # Utilitários e configurações
│   │   └── hooks/          # Custom hooks
├── server/                 # Backend Express
│   ├── lib/                # Bibliotecas e configurações
│   ├── routes.ts           # Definição de rotas
│   └── index.ts            # Ponto de entrada
├── shared/                 # Código compartilhado
│   └── schema.ts           # Schemas de validação
└── attached_assets/        # Assets do projeto
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Conta no Stripe (opcional)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/igorbrandao18/grupodapaz-web.git
cd grupodapaz-web
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
# Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Database
DATABASE_URL=sua_url_do_postgresql

# Stripe (opcional)
STRIPE_SECRET_KEY=sua_chave_secreta_stripe
STRIPE_WEBHOOK_SECRET=sua_chave_webhook_stripe

# Resend (opcional)
RESEND_API_KEY=sua_chave_resend
```

4. **Configure o banco de dados**
Execute os scripts SQL no Supabase:
- `supabase_setup.sql` - Configuração inicial
- `supabase_auth_setup.sql` - Configuração de autenticação

5. **Execute o projeto**
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Build para produção
npm run start        # Executa build de produção
npm run check        # Verificação de tipos TypeScript
npm run db:push      # Sincroniza schema com banco
```

## 📊 Banco de Dados

### Tabelas Principais

- **profiles**: Perfis de usuários
- **plans**: Planos de proteção
- **contacts**: Contatos/leads
- **subscriptions**: Assinaturas Stripe

### Configuração RLS
O projeto utiliza Row Level Security (RLS) do Supabase para garantir que:
- Usuários só acessem seus próprios dados
- Administradores tenham acesso total
- Dados sensíveis sejam protegidos

## 🔐 Autenticação

### Fluxo de Autenticação
1. Usuário faz login/cadastro
2. Supabase Auth cria sessão
3. Trigger cria perfil automaticamente
4. Sistema redireciona baseado na role:
   - `client` → Portal do Cliente
   - `admin` → Portal Administrativo

### Roles Disponíveis
- **client**: Acesso ao portal do cliente
- **admin**: Acesso completo ao sistema

## 💳 Integração Stripe

### Funcionalidades
- Criação de produtos e preços
- Processamento de pagamentos
- Webhooks para atualizações
- Gerenciamento de assinaturas

### Configuração
1. Crie uma conta no Stripe
2. Configure as chaves no `.env`
3. Execute o script de sincronização:
```bash
npm run sync-stripe-products
```

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- **Desktop**: Experiência completa
- **Tablet**: Interface adaptada
- **Mobile**: Navegação otimizada

## 🎨 Design System

### Componentes
- Baseados em Radix UI
- Customizados com Tailwind CSS
- Acessibilidade garantida
- Temas claro/escuro

### Cores
- Primária: Tons de azul
- Secundária: Tons de verde
- Neutras: Cinzas e brancos

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas
- **Netlify**: Build estático
- **Railway**: Full-stack
- **Heroku**: Backend + frontend

## 📈 Monitoramento

### Métricas Disponíveis
- Usuários ativos
- Planos contratados
- Conversões
- Performance

### Logs
- Requests da API
- Erros de autenticação
- Transações Stripe

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Entre em contato: contato@grupodapaz.com

## 🔄 Changelog

### v1.0.0
- ✅ Sistema completo de portais
- ✅ Autenticação com Supabase
- ✅ Integração com Stripe
- ✅ Design responsivo
- ✅ Sistema de planos
- ✅ Gerenciamento de clientes

---

**Desenvolvido com ❤️ para o Grupo da Paz**
