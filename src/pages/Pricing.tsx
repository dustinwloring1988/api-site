import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'

const pricing = [
  {
    name: 'gpt-oss-20B',
    model: 'gpt-fast',
    useCase: 'General purpose',
    input: '$0.25 / 1M tokens',
    output: '$0.50 / 1M tokens',
    popular: false
  },
  {
    name: 'gpt-oss-120B',
    model: 'gpt-full',
    useCase: 'Advanced reasoning',
    input: '$0.50 / 1M tokens',
    output: '$1.00 / 1M tokens',
    popular: true
  },
  {
    name: 'snowflake-arctic-embed2',
    model: 'embed',
    useCase: 'Embeddings',
    input: '$0.05 / 1M tokens',
    output: 'N/A',
    popular: false
  }
]

export function Pricing() {
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
            {pricing.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white rounded-xl p-8 border-2 transition-all hover:scale-105 ${
                  plan.popular
                    ? 'border-blue-500 shadow-xl'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-1">Model: <code className="bg-gray-100 px-2 py-1 rounded">{plan.model}</code></p>
                  <p className="text-gray-600 mb-6">{plan.useCase}</p>

                  <div className="space-y-4 mb-8">
                    <div>
                      <span className="text-sm text-gray-500">Input tokens</span>
                      <p className="text-2xl font-bold text-gray-900">{plan.input}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Output tokens</span>
                      <p className="text-2xl font-bold text-gray-900">{plan.output}</p>
                    </div>
                  </div>

                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </div>
              </motion.div>
            ))}
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
