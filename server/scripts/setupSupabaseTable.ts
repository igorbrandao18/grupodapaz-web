import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseDatabaseUrl = process.env.SUPABASE_DATABASE_URL || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

if (!supabaseDatabaseUrl) {
  console.error('SUPABASE_DATABASE_URL is required');
  process.exit(1);
}

// Use the Postgres connection for raw SQL
import postgres from 'postgres';

async function setupTable() {
  console.log('🔌 Connecting to Supabase database...');
  
  const sql = postgres(supabaseDatabaseUrl);
  
  try {
    console.log('📝 Creating plans table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS plans (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price TEXT NOT NULL,
        period TEXT NOT NULL,
        popular BOOLEAN DEFAULT false,
        image TEXT,
        features TEXT[] NOT NULL,
        display_order INTEGER NOT NULL
      );
    `;
    
    console.log('✅ Table created successfully!');
    
    console.log('📥 Inserting initial plans data...');
    
    await sql`
      INSERT INTO plans (name, price, period, popular, image, features, display_order)
      VALUES 
        ('Plano Básico', 'R$ 89,90', '/mês', false, 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop', ARRAY['Cobertura individual', 'Velório 24h', 'Sepultamento', 'Transporte local', 'Assistência documental'], 1),
        ('Plano Essencial', 'R$ 149,90', '/mês', true, 'https://images.unsplash.com/photo-1455659817273-f96807779a3c?w=800&h=600&fit=crop', ARRAY['Até 3 dependentes', 'Velório premium', 'Cremação ou sepultamento', 'Transporte estadual', 'Floricultura inclusa', 'Assistência psicológica'], 2),
        ('Plano Premium', 'R$ 249,90', '/mês', false, 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&h=600&fit=crop', ARRAY['Até 6 dependentes', 'Velório VIP', 'Cremação e sepultamento', 'Transporte nacional', 'Floricultura premium', 'Assistência jurídica', 'Cerimônia personalizada', 'Memorial digital'], 3)
      ON CONFLICT DO NOTHING;
    `;
    
    console.log('✅ Data inserted successfully!');
    
    console.log('🔍 Verifying data...');
    const plans = await sql`SELECT * FROM plans ORDER BY display_order`;
    
    console.log(`\n✅ Found ${plans.length} plans in database:`);
    plans.forEach((plan: any) => {
      console.log(`   - ${plan.name} (${plan.price}${plan.period})`);
    });
    
    await sql.end();
    console.log('\n🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    await sql.end();
    process.exit(1);
  }
}

setupTable();
