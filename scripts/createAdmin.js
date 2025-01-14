import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@admin.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: { role: 'admin' }
    })

    if (error) throw error
    console.log('Usuário admin criado com sucesso:', data)
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error)
  }
}

createAdminUser()
