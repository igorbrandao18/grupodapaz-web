-- ============================================
-- SETUP COMPLETO SUPABASE - GRUPO DA PAZ
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- 1. CRIAR TABELAS
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
  stripe_price_id TEXT,
  stripe_product_id TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  cpf TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  plan_id INTEGER REFERENCES plans(id),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  profile_id UUID NOT NULL,
  plan_id INTEGER NOT NULL REFERENCES plans(id),
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS dependents (
  id SERIAL PRIMARY KEY,
  profile_id UUID NOT NULL,
  name TEXT NOT NULL,
  cpf TEXT NOT NULL,
  birth_date TIMESTAMP WITH TIME ZONE,
  relationship TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER NOT NULL REFERENCES subscriptions(id),
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER NOT NULL REFERENCES subscriptions(id),
  stripe_invoice_id TEXT UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  hosted_invoice_url TEXT,
  invoice_pdf_url TEXT,
  pix_code TEXT,
  boleto_url TEXT,
  boleto_barcode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. HABILITAR RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dependents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS DE SEGURANÇA

-- Profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
CREATE POLICY "Enable insert for authenticated users" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Plans (público para leitura de ativos)
DROP POLICY IF EXISTS "Anyone can read active plans" ON plans;
CREATE POLICY "Anyone can read active plans" ON plans FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Admins can manage plans" ON plans;
CREATE POLICY "Admins can manage plans" ON plans FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;
CREATE POLICY "Admins can view all subscriptions" ON subscriptions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Dependents
DROP POLICY IF EXISTS "Users can manage own dependents" ON dependents;
CREATE POLICY "Users can manage own dependents" ON dependents FOR ALL USING (profile_id = auth.uid());

-- Payments
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM subscriptions WHERE id = subscription_id AND profile_id = auth.uid()
  )
);

-- Invoices
DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM subscriptions WHERE id = subscription_id AND profile_id = auth.uid()
  )
);

-- 4. FUNÇÃO E TRIGGER PARA CRIAR PROFILE AUTOMÁTICO
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. INSERIR PLANOS INICIAIS
DELETE FROM plans WHERE id IN (1, 2, 3);

INSERT INTO plans (
  id, name, price, period, description, dependents, popular, active, image, features, display_order
) VALUES
(
  1,
  'Plano Básico',
  'R$ 89,90',
  '/mês',
  'Proteção individual com serviços essenciais de funeral',
  1,
  false,
  true,
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop',
  ARRAY[
    'Cobertura individual',
    'Velório 24h',
    'Sepultamento',
    'Transporte local',
    'Assistência documental'
  ],
  1
),
(
  2,
  'Plano Essencial',
  'R$ 149,90',
  '/mês',
  'Proteção para você e sua família com serviços completos',
  3,
  true,
  true,
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop',
  ARRAY[
    'Até 3 dependentes',
    'Velório premium',
    'Cremação ou sepultamento',
    'Transporte estadual',
    'Floricultura inclusa',
    'Assistência psicológica'
  ],
  2
),
(
  3,
  'Plano Premium',
  'R$ 249,90',
  '/mês',
  'Proteção familiar ampliada com serviços premium e personalizados',
  6,
  false,
  true,
  'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&h=600&fit=crop',
  ARRAY[
    'Até 6 dependentes',
    'Velório VIP',
    'Cremação e sepultamento',
    'Transporte nacional',
    'Floricultura premium',
    'Assistência jurídica',
    'Cerimônia personalizada',
    'Memorial digital'
  ],
  3
);

-- Resetar sequência do ID
SELECT setval('plans_id_seq', (SELECT MAX(id) FROM plans));

-- ============================================
-- SETUP CONCLUÍDO! ✅
-- ============================================
-- Próximos passos:
-- 1. Criar um usuário em Authentication > Users
-- 2. Para tornar admin, execute:
--    UPDATE profiles SET role = 'admin' WHERE email = 'seu@email.com';
-- ============================================
