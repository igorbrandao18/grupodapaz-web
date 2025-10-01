# Integração Supabase - Grupo da Paz

Este projeto está integrado com Supabase para autenticação, armazenamento e realtime.

## Configuração

As seguintes variáveis de ambiente estão configuradas:
- `SUPABASE_URL` - URL do projeto Supabase
- `SUPABASE_ANON_KEY` - Chave pública (anon key)
- `SUPABASE_SERVICE_ROLE_KEY` - Chave privada (service role)
- `DATABASE_URL` - URL de conexão do banco de dados PostgreSQL

## Recursos Disponíveis

### 1. Autenticação (Auth)

**Frontend:**
```typescript
import { signInWithEmail, signUpWithEmail, signOut, getCurrentUser, onAuthStateChange } from '@/lib/supabaseAuth';

// Login
await signInWithEmail('email@example.com', 'senha');

// Cadastro
await signUpWithEmail('email@example.com', 'senha');

// Logout
await signOut();

// Obter usuário atual
const user = await getCurrentUser();

// Monitorar mudanças de autenticação
const unsubscribe = onAuthStateChange((user) => {
  console.log('User:', user);
});
```

**Backend:**
```typescript
import { requireAuth, verifySupabaseToken } from './lib/supabaseAuth';

// Proteger rota
app.get('/api/protected', requireAuth, (req, res) => {
  const user = (req as any).user;
  res.json({ user });
});

// Verificar token manualmente
const user = await verifySupabaseToken(token);
```

### 2. Storage (Armazenamento)

**Frontend:**
```typescript
import { uploadFile, getPublicUrl, deleteFile, listFiles } from '@/lib/supabaseStorage';

// Upload de arquivo
const file = document.querySelector('input[type="file"]').files[0];
await uploadFile('bucket-name', 'path/to/file.jpg', file);

// Obter URL pública
const url = await getPublicUrl('bucket-name', 'path/to/file.jpg');

// Listar arquivos
const files = await listFiles('bucket-name', 'folder/');

// Deletar arquivo
await deleteFile('bucket-name', 'path/to/file.jpg');
```

**Backend:**
```typescript
import { uploadFileServer, getSignedUrl, deleteFileServer } from './lib/supabaseStorage';

// Upload de arquivo
await uploadFileServer('bucket-name', 'path/to/file.jpg', buffer, 'image/jpeg');

// Obter URL assinada (temporária)
const url = await getSignedUrl('bucket-name', 'path/to/file.jpg', 3600);

// Deletar arquivos
await deleteFileServer('bucket-name', ['path/to/file1.jpg', 'path/to/file2.jpg']);
```

### 3. Realtime (Tempo Real)

**Frontend:**
```typescript
import { subscribeToChannel, unsubscribeFromChannel } from '@/lib/supabaseRealtime';

// Inscrever-se em mudanças
const channel = subscribeToChannel(
  'contacts',
  (payload) => console.log('Novo registro:', payload),
  (payload) => console.log('Registro atualizado:', payload),
  (payload) => console.log('Registro deletado:', payload)
);

// Cancelar inscrição
if (channel) unsubscribeFromChannel(channel);
```

## Próximos Passos

Para usar os recursos do Supabase:

1. **Configurar Políticas RLS (Row Level Security)** no painel do Supabase
2. **Criar buckets de Storage** para armazenar arquivos
3. **Habilitar Realtime** nas tabelas que precisam de atualizações em tempo real
4. **Configurar provedores de autenticação** (Google, GitHub, etc.) se necessário

## Arquitetura

- **Frontend**: Cliente Supabase inicializado via `/api/config/supabase`
- **Backend**: Cliente Supabase Admin com service role key
- **Database**: Drizzle ORM conectado ao PostgreSQL do Supabase
