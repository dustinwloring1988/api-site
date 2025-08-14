import { useState, useEffect } from 'react'
import { supabase, type Service, type Incident, type Model, type ApiKey, type UsageLog, type Profile } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('id')

        if (error) throw error
        setServices(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return { services, loading, error }
}

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const { data, error } = await supabase
          .from('incidents')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) throw error
        setIncidents(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchIncidents()
  }, [])

  return { incidents, loading, error }
}

export function useModels() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchModels() {
      try {
        const { data, error } = await supabase
          .from('models')
          .select('*')
          .eq('active', true)
          .order('id')

        if (error) throw error
        setModels(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [])

  return { models, loading, error }
}

export function useApiKeys() {
  const { user } = useAuth()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setApiKeys([])
      setLoading(false)
      return
    }

    async function fetchApiKeys() {
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
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchApiKeys()
  }, [user])

  return { apiKeys, loading, error, refetch: () => {
    if (user) {
      setLoading(true)
      // Re-run the effect
    }
  }}
}

export function useUsageStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    tokensThisMonth: 0,
    costThisMonth: 0,
    requestsThisMonth: 0,
    modelsUsed: [] as string[]
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setStats({
        tokensThisMonth: 0,
        costThisMonth: 0,
        requestsThisMonth: 0,
        modelsUsed: []
      })
      setLoading(false)
      return
    }

    async function fetchUsageStats() {
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
            models!inner(internal_name)
          `)
          .eq('user_id', user.id)
          .gte('created_at', startOfMonth.toISOString())

        if (error) throw error

        const logs = usageLogs || []
        const tokensThisMonth = logs.reduce((sum, log) => sum + log.prompt_tokens + log.completion_tokens, 0)
        const costThisMonth = logs.reduce((sum, log) => sum + parseFloat(log.cost.toString()), 0)
        const requestsThisMonth = logs.length
        const modelsUsed = [...new Set(logs.map(log => (log.models as any).internal_name))]

        setStats({
          tokensThisMonth,
          costThisMonth,
          requestsThisMonth,
          modelsUsed
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchUsageStats()
  }, [user])

  return { stats, loading, error }
}

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          // If profile doesn't exist, create it
          if (error.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([{ id: user.id }])
              .select()
              .single()

            if (createError) throw createError
            setProfile(newProfile)
          } else {
            throw error
          }
        } else {
          setProfile(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  return { profile, loading, error }
}