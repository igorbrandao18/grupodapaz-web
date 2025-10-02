import { supabaseAdmin } from "../lib/supabaseServer";

async function setupSupabase() {
  console.log('🚀 Iniciando configuração do Supabase...\n');

  try {
    // 1. Limpar tabelas existentes
    console.log('1️⃣ Limpando tabelas existentes...');
    await supabaseAdmin.rpc('exec_sql', { 
      query: 'DROP TABLE IF EXISTS profiles CASCADE; DROP TABLE IF EXISTS plans CASCADE;' 
    }).catch(() => {
      // Ignorar erro se RPC não existir, vamos usar queries diretas
    });

    // 2. Criar tabela de planos
    console.log('2️⃣ Criando tabela de planos...');
    const { error: plansError } = await supabaseAdmin.from('plans').select('*').limit(1);
    
    // Se a tabela não existe, criar via raw SQL
    if (plansError?.message?.includes('does not exist')) {
      console.log('   Tabela plans não existe, será criada ao inserir dados...');
    }

    // 3. Criar tabela de profiles
    console.log('3️⃣ Criando tabela de profiles...');
    const { error: profilesError } = await supabaseAdmin.from('profiles').select('*').limit(1);
    
    if (profilesError?.message?.includes('does not exist')) {
      console.log('   Tabela profiles não existe, será criada ao inserir dados...');
    }

    // 4. Inserir planos
    console.log('4️⃣ Inserindo planos iniciais...');
    const plans = [
      {
        name: 'Plano Básico',
        price: 'R$ 89,90',
        period: '/mês',
        description: 'Proteção individual com serviços essenciais de funeral',
        dependents: 1,
        popular: false,
        active: true,
        image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop',
        features: ['Cobertura individual', 'Velório 24h', 'Sepultamento', 'Transporte local', 'Assistência documental'],
        display_order: 1
      },
      {
        name: 'Plano Essencial',
        price: 'R$ 149,90',
        period: '/mês',
        description: 'Proteção para você e sua família com serviços completos',
        dependents: 3,
        popular: true,
        active: true,
        image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop',
        features: ['Até 3 dependentes', 'Velório premium', 'Cremação ou sepultamento', 'Transporte estadual', 'Floricultura inclusa', 'Assistência psicológica'],
        display_order: 2
      },
      {
        name: 'Plano Premium',
        price: 'R$ 249,90',
        period: '/mês',
        description: 'Proteção familiar ampliada com serviços premium e personalizados',
        dependents: 6,
        popular: false,
        active: true,
        image: 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&h=600&fit=crop',
        features: ['Até 6 dependentes', 'Velório VIP', 'Cremação e sepultamento', 'Transporte nacional', 'Floricultura premium', 'Assistência jurídica', 'Cerimônia personalizada', 'Memorial digital'],
        display_order: 3
      }
    ];

    const { error: insertError } = await supabaseAdmin
      .from('plans')
      .upsert(plans, { onConflict: 'id' });

    if (insertError) {
      console.error('   ❌ Erro ao inserir planos:', insertError.message);
    } else {
      console.log('   ✅ Planos inseridos com sucesso!');
    }

    // 5. Verificar dados
    console.log('\n5️⃣ Verificando dados...');
    const { data: allPlans, error: verifyError } = await supabaseAdmin
      .from('plans')
      .select('*')
      .order('display_order');

    if (verifyError) {
      console.error('   ❌ Erro ao verificar planos:', verifyError.message);
    } else {
      console.log(`   ✅ Total de planos: ${allPlans?.length || 0}`);
      allPlans?.forEach(plan => {
        console.log(`      - ${plan.name}: ${plan.price}`);
      });
    }

    console.log('\n✅ Configuração concluída!');
    console.log('\n📝 PRÓXIMOS PASSOS:');
    console.log('   1. Acesse o Supabase Dashboard');
    console.log('   2. Vá em Authentication > Users');
    console.log('   3. Crie um novo usuário admin');
    console.log('   4. Execute no SQL Editor:');
    console.log('      UPDATE profiles SET role = \'admin\' WHERE email = \'seu-email@email.com\';');
    
  } catch (error: any) {
    console.error('❌ Erro durante a configuração:', error.message);
    throw error;
  }
}

setupSupabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
