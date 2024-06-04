'use client'
import { Auth } from '@supabase/auth-ui-react'
import { createClient } from '@/utils/supabase/server'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const Authentication = () => {
  const createServerClient = createClient()
  return (
    <Auth
      supabaseClient={createServerClient}
      theme='default'
      providers={[]}
      appearance={{ theme: ThemeSupa }}
    />
  )
}

export default Authentication
