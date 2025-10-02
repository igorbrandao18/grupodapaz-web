const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function executeSQLViaAPI(sql: string) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ query: sql })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SQL failed: ${error}`);
  }

  return response.json();
}

async function setupComplete() {
  console.log('🚀 Configurando Supabase via API REST...\n');

  try {
    // SQL completo em uma única execução
    const fullSQL = `
-- 1. Criar tabelas
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

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  plan_id INTEGER REFERENCES plans(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- 3. Políticas
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
CREATE POLICY "Enable insert for authenticated users" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can read active plans" ON plans;
CREATE POLICY "Anyone can read active plans" ON plans FOR SELECT USING (active = true);

-- 4. Função e trigger
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

-- 5. Inserir planos
DELETE FROM plans;
INSERT INTO plans (name, price, period, description, dependents, popular, active, image, features, display_order) VALUES
('Plano Básico','R$ 89,90','/mês','Proteção individual com serviços essenciais de funeral',1,false,true,'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',ARRAY['Cobertura individual','Velório 24h','Sepultamento','Transporte local','Assistência documental'],1),
('Plano Essencial','R$ 149,90','/mês','Proteção para você e sua família com serviços completos',3,true,true,'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',ARRAY['Até 3 dependentes','Velório premium','Cremação ou sepultamento','Transporte estadual','Floricultura inclusa','Assistência psicológica'],2),
('Plano Premium','R$ 249,90','/mês','Proteção familiar ampliada com serviços premium e personalizados',6,false,true,'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800',ARRAY['Até 6 dependentes','Velório VIP','Cremação e sepultamento','Transporte nacional','Floricultura premium','Assistência jurídica','Cerimônia personalizada','Memorial digital'],3);
`;

    console.log('Executando SQL...');
    await executeSQLViaAPI(fullSQL);
    
    console.log('\n✅ SUCESSO! Tudo configurado!\n');
    console.log('📊 Criado:');
    console.log('   ✅ Tabela plans com 3 planos');
    console.log('   ✅ Tabela profiles');
    console.log('   ✅ Políticas RLS');
    console.log('   ✅ Trigger automático\n');

  } catch (error: any) {
    // Se exec_sql não existir, vamos criar os dados via insert direto
    console.log('⚠️  exec_sql não disponível, usando insert direto...\n');
    
    try {
      const { supabaseAdmin } = await import('../lib/supabaseServer.js');
      
      // Deletar planos existentes
      await supabaseAdmin.from('plans').delete().neq('id', 0);
      
      // Inserir planos
      const { error: insertError } = await supabaseAdmin.from('plans').insert([
        {
          id: 1,
          name: 'Plano Básico',
          price: 'R$ 89,90',
          period: '/mês',
          description: 'Proteção individual com serviços essenciais de funeral',
          dependents: 1,
          popular: false,
          active: true,
          image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
          features: ['Cobertura individual', 'Velório 24h', 'Sepultamento', 'Transporte local', 'Assistência documental'],
          display_order: 1
        },
        {
          id: 2,
          name: 'Plano Essencial',
          price: 'R$ 149,90',
          period: '/mês',
          description: 'Proteção para você e sua família com serviços completos',
          dependents: 3,
          popular: true,
          active: true,
          image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
          features: ['Até 3 dependentes', 'Velório premium', 'Cremação ou sepultamento', 'Transporte estadual', 'Floricultura inclusa', 'Assistência psicológica'],
          display_order: 2
        },
        {
          id: 3,
          name: 'Plano Premium',
          price: 'R$ 249,90',
          period: '/mês',
          description: 'Proteção familiar ampliada com serviços premium e personalizados',
          dependents: 6,
          popular: false,
          active: true,
          image: 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800',
          features: ['Até 6 dependentes', 'Velório VIP', 'Cremação e sepultamento', 'Transporte nacional', 'Floricultura premium', 'Assistência jurídica', 'Cerimônia personalizada', 'Memorial digital'],
          display_order: 3
        }
      ]);

      if (insertError) {
        throw insertError;
      }

      console.log('✅ Planos inseridos com sucesso!\n');
      
    } catch (fallbackError: any) {
      console.error('❌ Erro:', fallbackError.message);
      console.log('\n📝 As tabelas precisam ser criadas manualmente no Supabase.');
      console.log('   Execute o SQL do arquivo supabase_complete_setup.sql\n');
    }
  }
}

setupComplete();
