# Plano de Migração para Supabase

## 1. Preparação do Ambiente

### 1.1 Criar Projeto no Supabase
1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Crie um novo projeto
3. Guarde as credenciais:
   - URL do projeto
   - Chave anon/public
   - Chave service_role (para migrações)

### 1.2 Instalar Dependências
```bash
npm install @supabase/supabase-js
```

## 2. Estrutura do Banco de Dados

### 2.1 Criar Tabelas
```sql
-- Tabela de Quadras
create table courts (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price decimal not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabela de Reservas
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  court_id uuid references courts,
  date date not null,
  time time not null,
  whatsapp text,
  price decimal not null,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabela de Configurações
create table booking_settings (
  id uuid default uuid_generate_v4() primary key,
  max_bookings_per_day int,
  min_advance_hours int,
  max_advance_days int,
  slot_duration int,
  break_between_slots int,
  operating_hours jsonb,
  days_active jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Políticas de Segurança (RLS)
alter table courts enable row level security;
alter table bookings enable row level security;
alter table booking_settings enable row level security;

-- Políticas para courts
create policy "Courts são visíveis para todos"
  on courts for select
  using (true);

-- Políticas para bookings
create policy "Usuários podem ver suas próprias reservas"
  on bookings for select
  using (auth.uid() = user_id);

create policy "Usuários podem criar reservas"
  on bookings for insert
  with check (auth.uid() = user_id);

-- Políticas para booking_settings
create policy "Settings são visíveis para todos"
  on booking_settings for select
  using (true);
```

## 3. Configuração do Cliente

### 3.1 Criar arquivo de configuração do Supabase
Criar arquivo `utils/supabaseClient.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'SUA_URL_DO_PROJETO'
const supabaseKey = 'SUA_CHAVE_ANON'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 3.2 Atualizar Funções de Banco de Dados
Substituir `databaseUtils.js` por:
```javascript
import { supabase } from './supabaseClient'

// Função para listar objetos
export async function safeListObjects(objectType, limit = 100, descent = true) {
  try {
    switch (objectType) {
      case 'booking':
        const { data: bookings, error: bookingError } = await supabase
          .from('bookings')
          .select('*, courts(*)')
          .order('created_at', { ascending: !descent })
          .limit(limit)
        if (bookingError) throw bookingError
        return bookings

      case 'court':
        const { data: courts, error: courtError } = await supabase
          .from('courts')
          .select('*')
          .order('name')
          .limit(limit)
        if (courtError) throw courtError
        return courts

      case 'booking_settings':
        const { data: settings, error: settingsError } = await supabase
          .from('booking_settings')
          .select('*')
          .limit(1)
        if (settingsError) throw settingsError
        return settings
    }
  } catch (error) {
    console.error(`Error listing ${objectType}:`, error)
    return []
  }
}

// Função para criar objeto
export async function safeCreateObject(objectType, objectData) {
  try {
    const { data, error } = await supabase
      .from(objectType)
      .insert([objectData])
      .select()
    
    if (error) throw error
    return data[0]
  } catch (error) {
    console.error(`Error creating ${objectType}:`, error)
    throw error
  }
}
```

## 4. Autenticação

### 4.1 Atualizar Componente Login
```javascript
import { supabase } from '../utils/supabaseClient'

async function handleLogin(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}
```

## 5. Passos para Migração

1. **Preparação**
   - Backup dos dados existentes
   - Criar projeto no Supabase
   - Instalar dependências

2. **Banco de Dados**
   - Executar scripts SQL para criar tabelas
   - Configurar políticas de segurança
   - Migrar dados existentes

3. **Código**
   - Implementar cliente Supabase
   - Atualizar funções de banco de dados
   - Implementar autenticação
   - Testar todas as funcionalidades

4. **Testes**
   - Testar CRUD de quadras
   - Testar sistema de reservas
   - Testar autenticação
   - Testar políticas de segurança

## 6. Considerações de Segurança

- Nunca expor a chave `service_role`
- Usar variáveis de ambiente para as chaves
- Implementar validações no cliente e servidor
- Testar todas as políticas de RLS

## 7. Monitoramento

- Configurar alertas no Supabase
- Monitorar uso do banco de dados
- Configurar logs de erro
