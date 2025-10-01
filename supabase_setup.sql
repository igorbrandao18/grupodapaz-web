-- SQL para criar e configurar a tabela de planos no Supabase
-- Execute este SQL no Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- Criar a tabela de planos com todos os campos necessários
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

-- Inserir os 3 planos iniciais
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
  )
ON CONFLICT DO NOTHING;

-- Criar índice para melhorar performance de consultas por status e ordem
CREATE INDEX IF NOT EXISTS idx_plans_active_display_order ON plans(active, display_order);

-- Verificar os dados inseridos
SELECT * FROM plans ORDER BY display_order;
