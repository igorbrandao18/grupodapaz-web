import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  console.log('Creating plans table in Supabase...');
  
  // Create the table
  const createTableSQL = `
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
  
  // Insert the data
  const insertDataSQL = `
    INSERT INTO plans (name, price, period, popular, image, features, display_order)
    VALUES 
      ('Plano Básico', 'R$ 89,90', '/mês', false, 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop', ARRAY['Cobertura individual', 'Velório 24h', 'Sepultamento', 'Transporte local', 'Assistência documental'], 1),
      ('Plano Essencial', 'R$ 149,90', '/mês', true, 'https://images.unsplash.com/photo-1455659817273-f96807779a3c?w=800&h=600&fit=crop', ARRAY['Até 3 dependentes', 'Velório premium', 'Cremação ou sepultamento', 'Transporte estadual', 'Floricultura inclusa', 'Assistência psicológica'], 2),
      ('Plano Premium', 'R$ 249,90', '/mês', false, 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&h=600&fit=crop', ARRAY['Até 6 dependentes', 'Velório VIP', 'Cremação e sepultamento', 'Transporte nacional', 'Floricultura premium', 'Assistência jurídica', 'Cerimônia personalizada', 'Memorial digital'], 3)
    ON CONFLICT DO NOTHING;
  `;

  try {
    // Try using RPC if available
    const { data: createResult, error: createError } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    });

    if (createError) {
      console.log('RPC method not available, trying direct table operations...');
      
      // Alternative: Just try to insert and let it fail if table doesn't exist
      const { data: insertResult, error: insertError } = await supabase
        .from('plans')
        .insert([
          {
            name: 'Plano Básico',
            price: 'R$ 89,90',
            period: '/mês',
            popular: false,
            image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop',
            features: ['Cobertura individual', 'Velório 24h', 'Sepultamento', 'Transporte local', 'Assistência documental'],
            display_order: 1
          },
          {
            name: 'Plano Essencial',
            price: 'R$ 149,90',
            period: '/mês',
            popular: true,
            image: 'https://images.unsplash.com/photo-1455659817273-f96807779a3c?w=800&h=600&fit=crop',
            features: ['Até 3 dependentes', 'Velório premium', 'Cremação ou sepultamento', 'Transporte estadual', 'Floricultura inclusa', 'Assistência psicológica'],
            display_order: 2
          },
          {
            name: 'Plano Premium',
            price: 'R$ 249,90',
            period: '/mês',
            popular: false,
            image: 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&h=600&fit=crop',
            features: ['Até 6 dependentes', 'Velório VIP', 'Cremação e sepultamento', 'Transporte nacional', 'Floricultura premium', 'Assistência jurídica', 'Cerimônia personalizada', 'Memorial digital'],
            display_order: 3
          }
        ]);

      if (insertError) {
        console.error('Error inserting data:', insertError);
        console.log('\n❌ Cannot create table programmatically.');
        console.log('\n📋 Please run this SQL manually in Supabase Dashboard:');
        console.log('   1. Go to https://supabase.com/dashboard');
        console.log('   2. Select your project');
        console.log('   3. Go to Database → SQL Editor');
        console.log('   4. Run the SQL from supabase_setup.sql file');
        process.exit(1);
      } else {
        console.log('✅ Plans inserted successfully!');
        console.log('Data:', insertResult);
      }
    } else {
      console.log('✅ Table created successfully!');
      
      // Now insert data
      const { data: insertResult, error: insertError } = await supabase.rpc('exec_sql', {
        sql: insertDataSQL
      });

      if (insertError) {
        console.error('Error inserting data:', insertError);
      } else {
        console.log('✅ Plans data inserted successfully!');
      }
    }

    // Verify the data
    const { data: plans, error: selectError } = await supabase
      .from('plans')
      .select('*')
      .order('display_order', { ascending: true });

    if (selectError) {
      console.error('Error fetching plans:', selectError);
    } else {
      console.log('\n✅ Plans in database:');
      console.log(plans);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

setupDatabase().then(() => {
  console.log('\n✅ Database setup complete!');
  process.exit(0);
}).catch((error) => {
  console.error('Setup failed:', error);
  process.exit(1);
});
