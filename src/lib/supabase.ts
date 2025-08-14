import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  updated_at: string
  stripe_customer_id?: string
  credits: number
  created_at: string
}

export interface Model {
  id: number
  name: string
  internal_name: string
  input_price_per_million_tokens: number
  output_price_per_million_tokens: number
  active: boolean
  created_at: string
}

export interface ApiKey {
  id: string
  user_id: string
  name: string
  key_prefix: string
  key_hash: string
  revoked: boolean
  expires_at?: string
  last_used_at?: string
  created_at: string
}

export interface UsageLog {
  id: number
  api_key_id: string
  model_id: number
  user_id: string
  prompt_tokens: number
  completion_tokens: number
  cost: number
  created_at: string
}

export interface Service {
  id: number
  name: string
  description?: string
  status: 'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage'
  uptime: number
  last_updated: string
}

export interface Incident {
  id: number
  title: string
  description?: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  severity: 'critical' | 'high' | 'medium' | 'low'
  created_at: string
  updated_at: string
  resolved_at?: string
}

export interface AuthState {
  user: User | null
  loading: boolean
}