import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase n'est pas configuré: SUPABASE_URL et SUPABASE_ANON_KEY ou SUPABASE_SERVICE_ROLE_KEY sont requis.",
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
