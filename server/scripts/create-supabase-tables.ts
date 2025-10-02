import postgres from 'postgres';

const databaseUrl = process.env.SUPABASE_DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ SUPABASE_DATABASE_URL não encontrada');
  process.exit(1);
}

// Extrair senha da URL e reconstruir
const urlParts = databaseUrl.match(/postgresql:\/\/postgres:(.+)@(.+)/);
if (!urlParts) {
  console.error('❌ URL do banco inválida');
  process.exit(1);
}

async function setupDatabase() {
  console.log('🚀 Conectando ao PostgreSQL do Supabase...\n');
  
  const sql = postgres(databaseUrl.replace('[YOUR-PASSWORD]', urlParts[1]), {
    ssl: 'require'
  });

  try {
    // 1. Criar tabela plans
    console.log('1️⃣ Criando tabela plans...');
    await sql`
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
      )
    `;
    console.log('   ✅ Tabela plans criada\n');

    // 2. Criar tabela profiles
    console.log('2️⃣ Criando tabela profiles...');
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        full_name TEXT,
        phone TEXT,
        role TEXT NOT NULL DEFAULT 'client',
        plan_id INTEGER REFERENCES plans(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('   ✅ Tabela profiles criada\n');

    // 3. Habilitar RLS
    console.log('3️⃣ Habilitando RLS...');
    await sql`ALTER TABLE profiles ENABLE ROW LEVEL SECURITY`;
    await sql`ALTER TABLE plans ENABLE ROW LEVEL SECURITY`;
    console.log('   ✅ RLS habilitado\n');

    // 4. Criar políticas
    console.log('4️⃣ Criando políticas de segurança...');
    await sql`
      DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
      CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id)
    `;
    await sql`
      DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
      CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id)
    `;
    await sql`
      DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
      CREATE POLICY "Enable insert for authenticated users" ON profiles FOR INSERT WITH CHECK (auth.uid() = id)
    `;
    await sql`
      DROP POLICY IF EXISTS "Anyone can read active plans" ON plans;
      CREATE POLICY "Anyone can read active plans" ON plans FOR SELECT USING (active = true)
    `;
    console.log('   ✅ Políticas criadas\n');

    // 5. Criar função e trigger
    console.log('5️⃣ Criando trigger para perfis automáticos...');
    await sql`
      CREATE OR REPLACE FUNCTION public.handle_new_user() 
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.profiles (id, email, role)
        VALUES (NEW.id, NEW.email, 'client');
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER
    `;
    await sql`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users`;
    await sql`
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()
    `;
    console.log('   ✅ Trigger criado\n');

    // 6. Inserir planos
    console.log('6️⃣ Inserindo planos iniciais...');
    await sql`DELETE FROM plans`;
    await sql`
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
    `;
    console.log('   ✅ 3 planos inseridos\n');

    // 7. Verificar
    const plans = await sql`SELECT * FROM plans ORDER BY display_order`;
    console.log('✅ SUCESSO! Configuração completa!\n');
    console.log('📊 Planos criados:');
    plans.forEach(plan => {
      console.log(`   ${plan.popular ? '⭐' : '  '} ${plan.name} - ${plan.price}`);
    });

    console.log('\n🎯 PRÓXIMO PASSO - Criar usuário admin:');
    console.log('   1. Vá em https://supabase.com/dashboard');
    console.log('   2. Authentication > Users > Add User');
    console.log('   3. Email: admin@grupodapaz.com');
    console.log('   4. Crie uma senha e marque "Auto Confirm User"');
    console.log('   5. Depois me avise para tornar ele admin!\n');

    await sql.end();
    process.exit(0);

  } catch (error: any) {
    console.error('❌ Erro:', error.message);
    await sql.end();
    process.exit(1);
  }
}

setupDatabase();
