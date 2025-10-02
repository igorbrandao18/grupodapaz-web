import { stripe } from '../lib/stripe';
import { supabaseAdmin } from '../lib/supabaseServer';

async function syncStripeProducts() {
  console.log('🚀 Sincronizando planos com Stripe...\n');

  try {
    // 1. Buscar todos os planos do Supabase
    const { data: plans, error } = await supabaseAdmin
      .from('plans')
      .select('*')
      .order('display_order');

    if (error || !plans) {
      throw new Error('Erro ao buscar planos do Supabase: ' + error?.message);
    }

    console.log(`📦 Encontrados ${plans.length} planos no Supabase\n`);

    // 2. Para cada plano, criar/atualizar no Stripe
    for (const plan of plans) {
      console.log(`\n📝 Processando: ${plan.name}`);

      let productId = plan.stripe_product_id;
      let priceId = plan.stripe_price_id;

      // Converter preço R$ 89,90 para centavos (8990)
      const priceMatch = plan.price.match(/R\$\s*([\d,]+)/);
      if (!priceMatch) {
        console.log(`   ⚠️  Formato de preço inválido: ${plan.price}`);
        continue;
      }

      const priceValue = parseFloat(priceMatch[1].replace(',', '.'));
      const priceInCents = Math.round(priceValue * 100);

      // 3. Criar ou buscar produto
      if (!productId) {
        console.log('   📦 Criando produto no Stripe...');
        const product = await stripe.products.create({
          name: plan.name,
          description: plan.description || undefined,
          metadata: {
            supabase_plan_id: plan.id.toString(),
            dependents: plan.dependents.toString(),
          },
        });
        productId = product.id;
        console.log(`   ✅ Produto criado: ${productId}`);
      } else {
        console.log(`   ✓ Produto já existe: ${productId}`);
      }

      // 4. Criar price (sempre criar novo se não existir)
      if (!priceId) {
        console.log('   💰 Criando price no Stripe...');
        const price = await stripe.prices.create({
          product: productId,
          unit_amount: priceInCents,
          currency: 'brl',
          recurring: {
            interval: 'month',
          },
          metadata: {
            supabase_plan_id: plan.id.toString(),
          },
        });
        priceId = price.id;
        console.log(`   ✅ Price criado: ${priceId} (R$ ${priceValue.toFixed(2)}/mês)`);
      } else {
        console.log(`   ✓ Price já existe: ${priceId}`);
      }

      // 5. Atualizar plano no Supabase com IDs do Stripe
      console.log('   🔄 Atualizando Supabase...');
      console.log(`   ID do plano: ${plan.id}`);
      const { data: updateResult, error: updateError } = await supabaseAdmin
        .from('plans')
        .update({
          stripe_product_id: productId,
          stripe_price_id: priceId,
        })
        .eq('id', plan.id)
        .select();

      if (updateError) {
        console.log(`   ❌ Erro ao atualizar: ${updateError.message}`);
        console.log(`   Detalhes:`, updateError);
      } else {
        console.log('   ✅ Supabase atualizado');
        console.log(`   Dados salvos:`, updateResult);
      }
    }

    console.log('\n\n✅ Sincronização concluída com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`   • ${plans.length} planos sincronizados`);
    console.log(`   • Produtos e prices criados no Stripe`);
    console.log(`   • IDs salvos no Supabase\n`);

    console.log('🎯 Agora você pode testar o checkout clicando em "Contratar Plano"!\n');

  } catch (error: any) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
}

syncStripeProducts();
