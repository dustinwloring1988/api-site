import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react'

export function Status() {
  const services = [
    { name: 'API Gateway', status: 'operational', uptime: '99.99%' },
    { name: 'gpt-fast (20B)', status: 'operational', uptime: '99.95%' },
    { name: 'gpt-full (120B)', status: 'degraded', uptime: '98.2%' },
    { name: 'embed (Arctic)', status: 'operational', uptime: '99.98%' },
    { name: 'Authentication', status: 'operational', uptime: '100%' },
    { name: 'Billing System', status: 'operational', uptime: '99.9%' },
  ]

  const incidents = [
    {
      id: '1',
      title: 'Increased response times for gpt-full model',
      description: 'We are investigating reports of increased response times for the gpt-full model.',
      status: 'investigating',
      createdAt: '2025-01-20T14:30:00Z',
      updatedAt: '2025-01-20T15:45:00Z'
    },
    {
      id: '2',
      title: 'Scheduled maintenance completed',
      description: 'Scheduled maintenance on our primary data center has been completed successfully.',
      status: 'resolved',
      createdAt: '2025-01-19T02:00:00Z',
      updatedAt: '2025-01-19T03:30:00Z'
    },
    {
      id: '3',
      title: 'Brief API outage resolved',
      description: 'A brief outage affecting API requests has been resolved.',
      status: 'resolved',
      createdAt: '2025-01-18T10:15:00Z',
      updatedAt: '2025-01-18T10:45:00Z'
    }
  ]

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
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50'
      case 'down':
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
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">All Systems Operational</h2>
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
                      <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
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
                      <p className="text-gray-600 text-sm mb-2">{incident.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getIncidentStatusColor(incident.status)}`}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <span>Created: {formatDate(incident.createdAt)}</span>
                    <span>Updated: {formatDate(incident.updatedAt)}</span>
                  </div>
                </motion.div>
              ))}
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