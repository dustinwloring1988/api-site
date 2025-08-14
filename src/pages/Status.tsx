import React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Service {
  id: number
  name: string
  description: string | null
  status: 'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage'
  uptime: number
  last_updated: string
}

interface Incident {
  id: number
  title: string
  description: string | null
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  severity: 'critical' | 'high' | 'medium' | 'low'
  created_at: string
  updated_at: string
  resolved_at: string | null
}

export function Status() {
  const [services, setServices] = useState<Service[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        setLoading(true)
        
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .order('id', { ascending: true })

        if (servicesError) throw servicesError

        // Fetch incidents
        const { data: incidentsData, error: incidentsError } = await supabase
          .from('incidents')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        if (incidentsError) throw incidentsError

        setServices(servicesData || [])
        setIncidents(incidentsData || [])
      } catch (err) {
        console.error('Error fetching status data:', err)
        setError('Failed to load status data')
      } finally {
        setLoading(false)
      }
    }

    fetchStatusData()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'degraded_performance':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'partial_outage':
      case 'major_outage':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-50'
      case 'degraded_performance':
        return 'text-yellow-600 bg-yellow-50'
      case 'partial_outage':
      case 'major_outage':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case 'investigating':
        return 'text-orange-600 bg-orange-50'
      case 'identified':
        return 'text-yellow-600 bg-yellow-50'
      case 'monitoring':
        return 'text-blue-600 bg-blue-50'
      case 'resolved':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getOverallStatus = () => {
    if (services.some(s => s.status === 'major_outage')) {
      return { status: 'Major Outage', icon: <XCircle className="h-8 w-8 text-red-500" />, color: 'text-red-600' }
    }
    if (services.some(s => s.status === 'partial_outage')) {
      return { status: 'Partial Outage', icon: <XCircle className="h-8 w-8 text-red-500" />, color: 'text-red-600' }
    }
    if (services.some(s => s.status === 'degraded_performance')) {
      return { status: 'Degraded Performance', icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />, color: 'text-yellow-600' }
    }
    return { status: 'All Systems Operational', icon: <CheckCircle className="h-8 w-8 text-green-500" />, color: 'text-green-600' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const overallStatus = getOverallStatus()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
            <p className="text-gray-600 mt-2">Current status of GPT API services and infrastructure</p>
          </div>

          {/* Overall Status */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
            <div className="flex items-center space-x-3">
              {overallStatus.icon}
              <div>
                <h2 className={`text-xl font-semibold ${overallStatus.color}`}>{overallStatus.status}</h2>
                <p className="text-gray-600">Last updated: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Services Status */}
          <div className="bg-white rounded-xl border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Services</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600">
                        {service.description && `${service.description} • `}
                        Uptime: {service.uptime}%
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                    {service.status.replace('_', ' ').charAt(0).toUpperCase() + service.status.replace('_', ' ').slice(1)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Incidents */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Incidents</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {incidents.map((incident, index) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{incident.title}</h4>
                      {incident.description && (
                        <p className="text-gray-600 text-sm mb-2">{incident.description}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getIncidentStatusColor(incident.status)}`}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <span>Created: {formatDate(incident.created_at)}</span>
                    <span>Updated: {formatDate(incident.updated_at)}</span>
                    {incident.resolved_at && (
                      <span>Resolved: {formatDate(incident.resolved_at)}</span>
                    )}
                  </div>
                </motion.div>
              ))}
              {incidents.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <p>No recent incidents to display</p>
                </div>
              )}
            </div>
          </div>

          {/* Subscribe to Updates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Stay Updated</h3>
            <p className="text-blue-700 mb-4">
              Subscribe to receive notifications about service updates and planned maintenance.
            </p>
            <div className="flex space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}