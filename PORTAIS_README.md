# Sistema de Portais - Grupo da Paz

Sistema completo de autenticação e portais administrativo e de cliente integrado com Supabase.

## 📋 Estrutura

### Portais Criados

1. **Portal do Cliente** (`/portal`)
   - Visualizar informações pessoais
   - Ver plano contratado
   - Acessar benefícios
   - Informações de contato

2. **Portal Administrativo** (`/admin`)
   - Dashboard com estatísticas
   - Gerenciar clientes (`/admin/clients`)
   - Gerenciar planos (`/admin/plans`)
   - Atribuir planos a clientes
   - Alterar permissões (admin/cliente)

3. **Sistema de Autenticação** (`/login`)
   - Login com email e senha
   - Cadastro de novos usuários
   - Proteção de rotas
   - Gerenciamento de sessão via Supabase Auth

## 🚀 Configuração do Supabase

### Passo 1: Executar SQL de Configuração de Planos

No Supabase SQL Editor, execute o arquivo `supabase_setup.sql`:

```sql
-- Criar tabela de planos com todos os campos
CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  period TEXT NOT NULL DEFAULT '/mês',
  description TEXT,
  dependents INTEGER NOT NULL DEFAULT 1,
  popular BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  image TEXT,
  features TEXT[] NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir planos iniciais
INSERT INTO plans (name, price, period, description, dependents, popular, active, image, features, display_order)
VALUES 
  (
    'Plano Básico',
    'R$ 89,90',
    '/mês',
    'Proteção individual com serviços essenciais de funeral',
    1,
    false,
    true,
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop',
    ARRAY['Cobertura individual', 'Velório 24h', 'Sepultamento', 'Transporte local', 'Assistência documental'],
    1
  ),
  -- ... outros planos
;
```

### Passo 2: Executar SQL de Autenticação

No Supabase SQL Editor, execute o arquivo `supabase_auth_setup.sql`:

```sql
-- 1. Criar tabela de perfis
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  plan_id INTEGER REFERENCES plans(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas de segurança
-- (Ver arquivo completo supabase_auth_setup.sql)

-- 4. Criar trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Passo 3: Criar Primeiro Usuário Admin

1. No Supabase Authentication, crie um novo usuário:
   - Email: `admin@grupodapaz.com` (ou outro de sua escolha)
   - Senha: Defina uma senha segura
   - Confirme o email manualmente no painel

2. No SQL Editor, execute:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@grupodapaz.com';
```

## 🔑 Variáveis de Ambiente

As variáveis de ambiente já estão configuradas no Replit Secrets:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Não é necessário configurar nada adicional!

## 📱 Como Usar

### Acessar como Cliente

1. Acesse a home page
2. Clique em "Portal do Cliente"
3. Crie uma conta ou faça login
4. Você será redirecionado para `/portal`

### Acessar como Admin

1. Faça login com a conta de admin
2. Você será redirecionado automaticamente para `/admin`
3. No portal admin, você pode:
   - Ver estatísticas gerais
   - Gerenciar planos em `/admin/plans`
   - Gerenciar clientes em `/admin/clients`

### Gerenciar Clientes (Admin)

1. Acesse `/admin/clients`
2. Para cada cliente você pode:
   - Atribuir ou alterar plano
   - Promover para admin ou remover privilégios
   - Ver informações completas

## 🔒 Segurança

- **Row Level Security (RLS)** habilitado em todas as tabelas
- Usuários só podem ver/editar seus próprios dados
- Admins têm acesso total via políticas do Supabase
- Rotas protegidas com `ProtectedRoute` component
- Autenticação gerenciada pelo Supabase Auth

## 🎨 Funcionalidades

### Portal do Cliente
- ✅ Visualizar dados pessoais (nome, email, telefone)
- ✅ Ver plano contratado com detalhes
- ✅ Visualizar benefícios inclusos
- ✅ Informações de contato da empresa

### Portal Admin
- ✅ Dashboard com métricas
- ✅ Gerenciar todos os planos (CRUD completo)
- ✅ Gerenciar todos os clientes
- ✅ Atribuir planos aos clientes
- ✅ Alterar permissões (cliente ↔ admin)
- ✅ Ativar/desativar planos

### Sistema de Auth
- ✅ Login com email/senha
- ✅ Cadastro de novos usuários
- ✅ Perfis automáticos via trigger
- ✅ Proteção de rotas por role
- ✅ Logout seguro

## 📂 Estrutura de Arquivos

```
client/src/
├── lib/
│   └── auth-context.tsx        # Contexto de autenticação
├── components/
│   ├── protected-route.tsx     # Proteção de rotas
│   └── navigation.tsx          # Navegação com botão de login
├── pages/
│   ├── login.tsx              # Página de login/cadastro
│   ├── portal-client.tsx      # Portal do cliente
│   ├── portal-admin.tsx       # Dashboard admin
│   ├── admin-clients.tsx      # Gerenciar clientes
│   └── admin-plans.tsx        # Gerenciar planos

server/
└── routes.ts                  # APIs de profiles e plans

shared/
└── schema.ts                  # Schema de profiles
```

## 🔄 Fluxo de Autenticação

1. Usuário acessa `/login`
2. Faz cadastro ou login
3. Supabase Auth cria usuário
4. Trigger cria perfil automaticamente na tabela `profiles`
5. Sistema redireciona baseado na role:
   - `client` → `/portal`
   - `admin` → `/admin`

## 🎯 Próximos Passos

1. Execute os SQLs no Supabase
2. Crie o primeiro usuário admin
3. Teste o cadastro de cliente
4. Atribua um plano ao cliente no admin
5. Verifique se o cliente vê o plano no portal

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se as tabelas foram criadas no Supabase
2. Confirme que as políticas RLS estão ativas
3. Valide que o trigger está funcionando
4. Teste com um novo cadastro de usuário
