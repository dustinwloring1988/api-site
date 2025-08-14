import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface ApiKey {
  id: string
  name: string
  key_prefix: string
  revoked: boolean
  expires_at: string | null
  last_used_at: string | null
  created_at: string
}

export interface UsageData {
  tokensThisMonth: number
  costThisMonth: number
  requestsThisMonth: number
  modelsUsed: string[]
}

export interface Model {
  id: number
  name: string
  internal_name: string
  input_price_per_million_tokens: number
  output_price_per_million_tokens: number
  active: boolean
}

export interface Profile {
  id: string
  credits: number
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

export function useSupabaseData() {
  const { user } = useAuth()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [usageData, setUsageData] = useState<UsageData>({
    tokensThisMonth: 0,
    costThisMonth: 0,
    requestsThisMonth: 0,
    modelsUsed: []
  })
  const [models, setModels] = useState<Model[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user profile
  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Failed to fetch profile')
    }
  }

  // Fetch API keys
  const fetchApiKeys = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .eq('revoked', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      setApiKeys(data || [])
    } catch (err) {
      console.error('Error fetching API keys:', err)
      setError('Failed to fetch API keys')
    }
  }

  // Fetch usage data for current month
  const fetchUsageData = async () => {
    if (!user) return

    try {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: usageLogs, error } = await supabase
        .from('usage_logs')
        .select(`
          prompt_tokens,
          completion_tokens,
          cost,
          models (internal_name)
        `)
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())

      if (error) throw error

      if (usageLogs) {
        const totalTokens = usageLogs.reduce((sum, log) => 
          sum + log.prompt_tokens + log.completion_tokens, 0
        )
        const totalCost = usageLogs.reduce((sum, log) => 
          sum + parseFloat(log.cost.toString()), 0
        )
        const uniqueModels = [...new Set(usageLogs.map(log => 
          log.models?.internal_name
        ).filter(Boolean))]

        setUsageData({
          tokensThisMonth: totalTokens,
          costThisMonth: totalCost,
          requestsThisMonth: usageLogs.length,
          modelsUsed: uniqueModels
        })
      }
    } catch (err) {
      console.error('Error fetching usage data:', err)
      setError('Failed to fetch usage data')
    }
  }

  // Fetch available models
  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      setModels(data || [])
    } catch (err) {
      console.error('Error fetching models:', err)
      setError('Failed to fetch models')
    }
  }

  // Create new API key
  const createApiKey = async (name: string) => {
    if (!user) return null

    try {
      // Generate a random key prefix and hash
      const keyPrefix = `gpt_${Math.random() > 0.5 ? 'live' : 'test'}_${Math.random().toString(36).substring(2, 18)}`
      const keyHash = `hash_${Math.random().toString(36).substring(2, 32)}`

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          name,
          key_prefix: keyPrefix,
          key_hash: keyHash
        })
        .select()
        .single()

      if (error) throw error
      
      // Refresh API keys
      await fetchApiKeys()
      return data
    } catch (err) {
      console.error('Error creating API key:', err)
      setError('Failed to create API key')
      return null
    }
  }

  // Delete API key
  const deleteApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ revoked: true })
        .eq('id', keyId)
        .eq('user_id', user?.id)

      if (error) throw error
      
      // Refresh API keys
      await fetchApiKeys()
      return true
    } catch (err) {
      console.error('Error deleting API key:', err)
      setError('Failed to delete API key')
      return false
    }
  }

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      await Promise.all([
        fetchProfile(),
        fetchApiKeys(),
        fetchUsageData(),
        fetchModels()
      ])

      setLoading(false)
    }

    loadData()
  }, [user])

  return {
    apiKeys,
    usageData,
    models,
    profile,
    loading,
    error,
    createApiKey,
    deleteApiKey,
    refetch: () => {
      if (user) {
        fetchProfile()
        fetchApiKeys()
        fetchUsageData()
        fetchModels()
      }
    }
  }
}