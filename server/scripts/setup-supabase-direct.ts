import { supabaseAdmin } from "../lib/supabaseServer";

async function executeSQLDirect() {
  console.log('🚀 Executando configuração SQL direta no Supabase...\n');

  try {
    // 1. Deletar planos existentes
    console.log('1️⃣ Limpando planos existentes...');
    await supabaseAdmin.from('plans').delete().neq('id', 0);
    console.log('   ✅ Planos removidos\n');

    // 2. Inserir planos
    console.log('2️⃣ Criando planos...');
    const plans = [
      {
        id: 1,
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
        id: 2,
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
        id: 3,
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
      .insert(plans);

    if (insertError) {
      console.error('   ❌ Erro ao inserir planos:', insertError.message);
      throw insertError;
    }
    console.log('   ✅ 3 planos criados com sucesso!\n');

    // 3. Verificar
    console.log('3️⃣ Verificando planos criados...');
    const { data: allPlans, error: verifyError } = await supabaseAdmin
      .from('plans')
      .select('*')
      .order('display_order');

    if (verifyError) {
      throw verifyError;
    }

    console.log(`   ✅ Total de planos no banco: ${allPlans?.length || 0}\n`);
    allPlans?.forEach(plan => {
      console.log(`      ${plan.popular ? '⭐' : '  '} ${plan.name} - ${plan.price} (${plan.dependents} ${plan.dependents === 1 ? 'pessoa' : 'dependentes'})`);
    });

    console.log('\n✅ Configuração concluída com sucesso!');
    console.log('\n📝 PRÓXIMOS PASSOS:');
    console.log('   1. No Supabase Dashboard, vá em Authentication > Users');
    console.log('   2. Clique em "Add User" e crie um usuário');
    console.log('   3. Email: admin@grupodapaz.com (ou outro)');
    console.log('   4. Marque "Auto Confirm User"');
    console.log('   5. Depois execute no SQL Editor:');
    console.log('      UPDATE profiles SET role = \'admin\' WHERE email = \'admin@grupodapaz.com\';');
    console.log('\n   Depois disso, faça login na aplicação! 🚀\n');

  } catch (error: any) {
    console.error('\n❌ Erro:', error.message);
    if (error.hint) console.error('   Dica:', error.hint);
    if (error.details) console.error('   Detalhes:', error.details);
    process.exit(1);
  }
}

executeSQLDirect();
