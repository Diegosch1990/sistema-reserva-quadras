import { createClient } from '@supabase/supabase-js'

// Carrega as variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL || 'https://ykcmuodyowxzfenvmkjz.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

// Cria o cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
