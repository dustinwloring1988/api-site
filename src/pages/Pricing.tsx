import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useModels } from '../hooks/useSupabaseData'
import { Button } from '../components/ui/Button'

export function Pricing() {
  const { models, loading } = useModels()

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)} / 1M tokens`
  }

  const getUseCase = (internalName: string) => {
    switch (internalName) {
      case 'gpt-fast':
        return 'General purpose'
      case 'gpt-full':
        return 'Advanced reasoning'
      case 'embed':
        return 'Embeddings'
      default:
        return 'AI Model'
    }
  }

  const isPopular = (internalName: string) => {
    return internalName === 'gpt-full'
  }

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pay only for what you use. No hidden fees, no minimum commitments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-8 border-2 border-gray-200">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-28 mb-6"></div>
                    <div className="space-y-4 mb-8">
                      <div>
                        <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div>
                        <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))
            ) : (
              models.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white rounded-xl p-8 border-2 transition-all hover:scale-105 ${
                  isPopular(model.internal_name)
                    ? 'border-blue-500 shadow-xl'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {isPopular(model.internal_name) && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{model.name}</h3>
                  <p className="text-gray-600 mb-1">Model: <code className="bg-gray-100 px-2 py-1 rounded">{model.internal_name}</code></p>
                  <p className="text-gray-600 mb-6">{getUseCase(model.internal_name)}</p>

                  <div className="space-y-4 mb-8">
                    <div>
                      <span className="text-sm text-gray-500">Input tokens</span>
                      <p className="text-2xl font-bold text-gray-900">{formatPrice(model.input_price_per_million_tokens)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Output tokens</span>
                      <p className="text-2xl font-bold text-gray-900">
                        {model.output_price_per_million_tokens === 0 ? 'N/A' : formatPrice(model.output_price_per_million_tokens)}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant={isPopular(model.internal_name) ? "primary" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </div>
              </motion.div>
            ))}
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Free Tier Included
              </h3>
              <p className="text-gray-600 mb-6">
                Start with 1M free tokens every month. No credit card required.
              </p>
              <div className="flex justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>1M tokens/month free</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>Full API access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>Community support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
