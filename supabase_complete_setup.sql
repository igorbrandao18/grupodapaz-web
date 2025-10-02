-- ============================================
-- CONFIGURAÇÃO COMPLETA DO SUPABASE
-- Grupo da Paz - Sistema de Portais
-- ============================================
-- Execute este script completo no Supabase SQL Editor
-- Ele vai criar todas as tabelas, políticas e dados iniciais

-- 1. LIMPAR TABELAS EXISTENTES (se houver)
-- ============================================
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS plans CASCADE;

-- Remover funções e triggers existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. CRIAR TABELA DE PLANOS
-- ============================================
CREATE TABLE plans (
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

-- 3. INSERIR PLANOS INICIAIS
-- ============================================
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
  (
    'Plano Essencial',
    'R$ 149,90',
    '/mês',
    'Proteção para você e sua família com serviços completos',
    3,
    true,
    true,
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop',
    ARRAY['Até 3 dependentes', 'Velório premium', 'Cremação ou sepultamento', 'Transporte estadual', 'Floricultura inclusa', 'Assistência psicológica'],
    2
  ),
  (
    'Plano Premium',
    'R$ 249,90',
    '/mês',
    'Proteção familiar ampliada com serviços premium e personalizados',
    6,
    false,
    true,
    'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&h=600&fit=crop',
    ARRAY['Até 6 dependentes', 'Velório VIP', 'Cremação e sepultamento', 'Transporte nacional', 'Floricultura premium', 'Assistência jurídica', 'Cerimônia personalizada', 'Memorial digital'],
    3
  );

-- 4. CRIAR TABELA DE PERFIS
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  plan_id INTEGER REFERENCES plans(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. HABILITAR ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- 6. POLÍTICAS DE SEGURANÇA - PROFILES
-- ============================================

-- Usuários podem ler seu próprio perfil
CREATE POLICY "Users can read own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Admins podem ler todos os perfis
CREATE POLICY "Admins can read all profiles" 
  ON profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem atualizar todos os perfis
CREATE POLICY "Admins can update all profiles" 
  ON profiles FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Permitir inserção de novos perfis (necessário para signup)
CREATE POLICY "Enable insert for authenticated users" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 7. POLÍTICAS DE SEGURANÇA - PLANS
-- ============================================

-- Todos podem ler planos ativos (público)
CREATE POLICY "Anyone can read active plans" 
  ON plans FOR SELECT 
  USING (active = true);

-- Admins podem ler todos os planos
CREATE POLICY "Admins can read all plans" 
  ON plans FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem inserir planos
CREATE POLICY "Admins can insert plans" 
  ON plans FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem atualizar planos
CREATE POLICY "Admins can update plans" 
  ON plans FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem deletar planos
CREATE POLICY "Admins can delete plans" 
  ON plans FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 8. FUNÇÃO E TRIGGER PARA CRIAR PERFIL AUTOMATICAMENTE
-- ============================================
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

-- 9. CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_plan_id ON profiles(plan_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_plans_active_display_order ON plans(active, display_order);

-- 10. VERIFICAR DADOS
-- ============================================
SELECT 'Setup completo!' as status;
SELECT * FROM plans ORDER BY display_order;
SELECT COUNT(*) as total_plans FROM plans;
