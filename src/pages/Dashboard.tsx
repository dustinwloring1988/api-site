import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Key, BarChart3, CreditCard, Settings, Plus, Copy, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSupabaseData } from '../hooks/useSupabaseData'
import { Button } from '../components/ui/Button'
import { formatCurrency, formatNumber } from '../lib/utils'
import { useToast } from '../hooks/useToast'

export function Dashboard() {
  const { user } = useAuth()
  const { apiKeys, usageData, models, profile, loading, error, createApiKey, deleteApiKey } = useSupabaseData()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isCreatingKey, setIsCreatingKey] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'api-keys', name: 'API Keys', icon: Key },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings },
  ]

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for your API key',
        variant: 'destructive'
      })
      return
    }

    setIsCreatingKey(true)
    const result = await createApiKey(newKeyName.trim())
    
    if (result) {
      toast({
        title: 'Success',
        description: 'API key created successfully',
        variant: 'default'
      })
      setNewKeyName('')
    }
    setIsCreatingKey(false)
  }

  const handleDeleteApiKey = async (keyId: string, keyName: string) => {
    if (window.confirm(`Are you sure you want to delete "${keyName}"? This action cannot be undone.`)) {
      const success = await deleteApiKey(keyId)
      if (success) {
        toast({
          title: 'Success',
          description: 'API key deleted successfully',
          variant: 'default'
        })
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.email}</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon size={20} />
                      <span>{tab.name}</span>
                    </div>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                      />
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tokens Used</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatNumber(usageData.tokensThisMonth)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Cost This Month</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(usageData.costThisMonth)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">API Requests</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatNumber(usageData.requestsThisMonth)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Key className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Models Used</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {usageData.modelsUsed.length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Settings className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Chart Placeholder */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Over Time</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart will be implemented with real data</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api-keys' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
                    <p className="text-gray-600">Manage your API keys for accessing GPT API</p>
                  </div>
                  <Button 
                    variant="primary" 
                    className="inline-flex items-center"
                    onClick={() => setIsCreatingKey(true)}
                  >
                    <Plus size={16} className="mr-2" />
                    Create New Key
                  </Button>
                </div>

                {/* Create API Key Form */}
                {isCreatingKey && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4"
                  >
                    <h4 className="font-medium text-blue-900 mb-3">Create New API Key</h4>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Enter key name (e.g., Production, Development)"
                        className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateApiKey()}
                      />
                      <Button variant="primary" onClick={handleCreateApiKey}>
                        Create
                      </Button>
                      <Button variant="ghost" onClick={() => {
                        setIsCreatingKey(false)
                        setNewKeyName('')
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-4">
                  {apiKeys.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
                      <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h4>
                      <p className="text-gray-600 mb-4">Create your first API key to start using the GPT API</p>
                      <Button variant="primary" onClick={() => setIsCreatingKey(true)}>
                        <Plus size={16} className="mr-2" />
                        Create API Key
                      </Button>
                    </div>
                  ) : (
                    apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{apiKey.name}</h4>
                          <div className="flex items-center space-x-2 mt-2">
                            <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                              {showApiKey ? apiKey.key_prefix : '•'.repeat(32)}
                            </code>
                            <button
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(apiKey.key_prefix)
                                toast({
                                  title: 'Copied',
                                  description: 'API key copied to clipboard',
                                  variant: 'default'
                                })
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Copy size={16} />
                            </button>
                          </div>
                          <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                            <span>Created: {formatDate(apiKey.created_at)}</span>
                            <span>Last used: {apiKey.last_used_at ? formatDate(apiKey.last_used_at) : 'Never'}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteApiKey(apiKey.id, apiKey.name)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Billing Overview</h3>
                  <p className="text-gray-600">Manage your billing information and view usage</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Current Usage</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tokens used this month</span>
                        <span className="font-semibold">{formatNumber(usageData.tokensThisMonth)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Current bill</span>
                        <span className="font-semibold">{formatCurrency(usageData.costThisMonth)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Free tier remaining</span>
                        <span className="font-semibold text-green-600">
                          {formatNumber(Math.max(0, 1000000 - usageData.tokensThisMonth))} tokens
                        </span>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Account type</span>
                          <span className="font-semibold">
                            {usageData.tokensThisMonth > 1000000 ? 'Pay-as-you-go' : 'Free Tier'}
                          </span>
                        </div>
                        {usageData.tokensThisMonth > 1000000 && (
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-600">Overage tokens</span>
                            <span className="font-semibold text-orange-600">
                              {formatNumber(usageData.tokensThisMonth - 1000000)} tokens
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Billing History</h4>
                  {usageData.billingHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No billing history</h4>
                      <p className="text-gray-600">Your billing history will appear here once you start using the API.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {usageData.billingHistory.map((bill) => (
                        <div key={bill.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                          <div>
                            <p className="font-medium">{formatCurrency(bill.amount)}</p>
                            <div className="text-sm text-gray-600">
                              <p>{new Date(bill.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long' 
                              })}</p>
                              <p>{formatNumber(bill.tokens_used)} tokens used</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              bill.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : bill.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(bill.period_start).toLocaleDateString()} - {new Date(bill.period_end).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Usage by Model */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Usage by Model</h4>
                  {usageData.modelsUsed.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600">No models used this month</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {usageData.modelsUsed.map((model, index) => (
                        <div key={model} className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="font-medium">{model}</span>
                          </div>
                          <span className="text-sm text-gray-600">Active</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Free Tier Information */}
                {usageData.tokensThisMonth <= 1000000 && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-lg font-medium text-blue-900 mb-2">Free Tier</h4>
                    <p className="text-blue-700 mb-4">
                      You're currently on our free tier with 1M tokens per month. 
                      {usageData.tokensThisMonth > 0 && (
                        <span> You've used {((usageData.tokensThisMonth / 1000000) * 100).toFixed(1)}% of your free allocation.</span>
                      )}
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mb-4">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((usageData.tokensThisMonth / 1000000) * 100, 100)}%` }}
                        />
                    </div>
                    <p className="text-sm text-blue-600">
                      {formatNumber(Math.max(0, 1000000 - usageData.tokensThisMonth))} tokens remaining this month
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                  <p className="text-gray-600">Manage your account preferences</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Type
                      </label>
                      <input
                        type="text"
                        value="Free Tier"
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                    <Button variant="outline">Update Profile</Button>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Security</h4>
                  <div className="space-y-4">
                    <Button variant="outline">Change Password</Button>
                    <Button variant="outline">Enable Two-Factor Authentication</Button>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h4 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h4>
                  <p className="text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                    Delete Account
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}