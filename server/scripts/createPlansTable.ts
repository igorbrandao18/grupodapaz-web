import { supabaseAdmin } from '../lib/supabaseServer';

async function createPlansTable() {
  const { data, error } = await supabaseAdmin.rpc('exec_sql', {
    sql: `
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
    `
  });

  if (error) {
    console.error('Error creating table:', error);
    console.log('Trying alternative method...');
    
    const { error: createError } = await supabaseAdmin
      .from('plans')
      .select('*')
      .limit(1);
    
    if (createError) {
      console.error('Table does not exist. Please create it manually in Supabase dashboard.');
      console.error('SQL to run:');
      console.log(`
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

INSERT INTO plans (name, price, period, popular, image, features, display_order)
VALUES 
  ('Plano Básico', 'R$ 89,90', '/mês', false, 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop', ARRAY['Cobertura individual', 'Velório 24h', 'Sepultamento', 'Transporte local', 'Assistência documental'], 1),
  ('Plano Essencial', 'R$ 149,90', '/mês', true, 'https://images.unsplash.com/photo-1455659817273-f96807779a3c?w=800&h=600&fit=crop', ARRAY['Até 3 dependentes', 'Velório premium', 'Cremação ou sepultamento', 'Transporte estadual', 'Floricultura inclusa', 'Assistência psicológica'], 2),
  ('Plano Premium', 'R$ 249,90', '/mês', false, 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&h=600&fit=crop', ARRAY['Até 6 dependentes', 'Velório VIP', 'Cremação e sepultamento', 'Transporte nacional', 'Floricultura premium', 'Assistência jurídica', 'Cerimônia personalizada', 'Memorial digital'], 3);
      `);
    }
  } else {
    console.log('Table created successfully!', data);
  }
}

createPlansTable().then(() => process.exit(0));
