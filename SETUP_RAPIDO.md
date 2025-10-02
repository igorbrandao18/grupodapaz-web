# ⚡ SETUP RÁPIDO - Supabase (2 minutos)

## 🎯 Execute APENAS ESTES 2 SQLs no Supabase

### 1️⃣ Acesse o SQL Editor do Supabase
- Vá em: https://supabase.com/dashboard
- Selecione seu projeto
- Clique em **SQL Editor** (menu lateral)
- Clique em **New Query**

---

### 2️⃣ COPIE E EXECUTE - SQL 1 (Criar Tabelas)

```sql
-- CRIAR TABELAS
CREATE TABLE plans (
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

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  plan_id INTEGER REFERENCES plans(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable insert for authenticated users" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Anyone can read active plans" ON plans FOR SELECT USING (active = true);

-- TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

✅ Clique em **RUN**

---

### 3️⃣ VOLTE AQUI E ME AVISE

Depois que executar o SQL acima, me avise que executou e eu vou:
1. Inserir os 3 planos automaticamente
2. Te ajudar a criar o usuário admin
3. Você vai poder acessar o portal!

---

**É só isso! Execute o SQL 1 e me avise.** 🚀
