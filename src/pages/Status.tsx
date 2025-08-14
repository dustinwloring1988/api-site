import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react'
import { useServices, useIncidents } from '../hooks/useSupabaseData'

export function Status() {
  const { services, loading: servicesLoading } = useServices()
  const { incidents, loading: incidentsLoading } = useIncidents()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'down':
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
    if (servicesLoading) return { status: 'loading', message: 'Loading...' }
    
    const hasOutage = services.some(s => s.status === 'major_outage' || s.status === 'partial_outage')
    const hasDegraded = services.some(s => s.status === 'degraded_performance')
    
    if (hasOutage) {
      return { status: 'outage', message: 'Service Disruption', icon: XCircle, color: 'text-red-500' }
    } else if (hasDegraded) {
      return { status: 'degraded', message: 'Degraded Performance', icon: AlertTriangle, color: 'text-yellow-500' }
    } else {
      return { status: 'operational', message: 'All Systems Operational', icon: CheckCircle, color: 'text-green-500' }
    }
  }

  const overallStatus = getOverallStatus()
  const StatusIcon = overallStatus.icon || CheckCircle

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
              <StatusIcon className={`h-8 w-8 ${overallStatus.color}`} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{overallStatus.message}</h2>
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
                      <p className="text-sm text-gray-600">Uptime: {service.uptime}%</p>
                      {service.description && (
                        <p className="text-xs text-gray-500">{service.description}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {servicesLoading && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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
                  </div>
                </motion.div>
              ))}
              
              {incidentsLoading && (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                          </div>
                          <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="flex space-x-4">
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!incidentsLoading && incidents.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No recent incidents to display
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