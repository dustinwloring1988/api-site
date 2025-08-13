import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Code, Book, Zap, Key, MessageSquare, Database } from 'lucide-react'

export function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [activeLanguage, setActiveLanguage] = useState('curl')

  const navigation = [
    { id: 'getting-started', name: 'Getting Started', icon: Zap },
    { id: 'authentication', name: 'Authentication', icon: Key },
    { id: 'chat-completions', name: 'Chat Completions', icon: MessageSquare },
    { id: 'embeddings', name: 'Embeddings', icon: Database },
    { id: 'models', name: 'Models', icon: Book },
  ]

  const languages = [
    { id: 'curl', name: 'cURL' },
    { id: 'python', name: 'Python' },
    { id: 'node', name: 'Node.js' },
    { id: 'php', name: 'PHP' },
  ]

  const codeExamples = {
    'chat-completions': {
      curl: `curl https://api.gpt.ai/v1/chat/completions \\
  -H "Authorization: Bearer $GPT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-fast",
    "messages": [
      {
        "role": "user",
        "content": "What is the capital of France?"
      }
    ],
    "max_tokens": 100
  }'`,
      python: `import openai

client = openai.OpenAI(
    base_url="https://api.gpt.ai/v1",
    api_key="your-api-key"
)

response = client.chat.completions.create(
    model="gpt-fast",
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ],
    max_tokens=100
)

print(response.choices[0].message.content)`,
      node: `const OpenAI = require('openai');

const client = new OpenAI({
  baseURL: 'https://api.gpt.ai/v1',
  apiKey: 'your-api-key'
});

async function main() {
  const response = await client.chat.completions.create({
    model: 'gpt-fast',
    messages: [
      { role: 'user', content: 'What is the capital of France?' }
    ],
    max_tokens: 100
  });
  
  console.log(response.choices[0].message.content);
}

main();`,
      php: `<?php

require_once 'vendor/autoload.php';

$client = new OpenAI\\Client([
    'api_key' => 'your-api-key',
    'base_url' => 'https://api.gpt.ai/v1'
]);

$response = $client->chat()->create([
    'model' => 'gpt-fast',
    'messages' => [
        ['role' => 'user', 'content' => 'What is the capital of France?']
    ],
    'max_tokens' => 100
]);

echo $response['choices'][0]['message']['content'];
?>`
    }
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
            <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
            <p className="text-gray-600 mt-2">Complete guide to integrating with GPT API</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeSection === item.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={16} />
                        <span>{item.name}</span>
                      </button>
                    )
                  })}
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                {activeSection === 'getting-started' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
                    <div className="prose max-w-none">
                      <p className="text-gray-600 mb-6">
                        GPT API provides a drop-in replacement for OpenAI's API with better performance and lower costs.
                      </p>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Start</h3>
                      <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6">
                        <li>Sign up for a GPT API account</li>
                        <li>Get your API key from the dashboard</li>
                        <li>Make your first API request</li>
                      </ol>

                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Base URL</h3>
                      <div className="bg-gray-100 rounded-lg p-4 mb-6">
                        <code className="text-sm">https://api.gpt.ai/v1</code>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Authentication</h3>
                      <p className="text-gray-600 mb-4">
                        All API requests require an API key passed in the Authorization header:
                      </p>
                      <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                        Authorization: Bearer YOUR_API_KEY
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'authentication' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
                    <div className="prose max-w-none">
                      <p className="text-gray-600 mb-6">
                        GPT API uses API keys for authentication. Include your API key in the Authorization header.
                      </p>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">API Key Format</h3>
                      <div className="bg-gray-100 rounded-lg p-4 mb-6">
                        <code className="text-sm">gpt_live_1234567890abcdef</code> (Production)<br />
                        <code className="text-sm">gpt_test_0987654321fedcba</code> (Development)
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Best Practices</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                        <li>Never expose your API key in client-side code</li>
                        <li>Use environment variables to store your API key</li>
                        <li>Rotate your API keys regularly</li>
                        <li>Use different keys for development and production</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === 'chat-completions' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat Completions</h2>
                    <div className="prose max-w-none">
                      <p className="text-gray-600 mb-6">
                        Create conversational AI applications with the chat completions endpoint.
                      </p>

                      {/* Language Selector */}
                      <div className="flex space-x-2 mb-4">
                        {languages.map((lang) => (
                          <button
                            key={lang.id}
                            onClick={() => setActiveLanguage(lang.id)}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                              activeLanguage === lang.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>

                      {/* Code Example */}
                      <div className="bg-gray-900 rounded-lg p-4 mb-6">
                        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                          <code>{codeExamples['chat-completions'][activeLanguage as keyof typeof codeExamples['chat-completions']]}</code>
                        </pre>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Parameters</h3>
                      <div className="overflow-x-auto mb-6">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-4 py-2 text-sm font-mono">model</td>
                              <td className="px-4 py-2 text-sm">string</td>
                              <td className="px-4 py-2 text-sm">Yes</td>
                              <td className="px-4 py-2 text-sm">Model to use (gpt-fast, gpt-full)</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 text-sm font-mono">messages</td>
                              <td className="px-4 py-2 text-sm">array</td>
                              <td className="px-4 py-2 text-sm">Yes</td>
                              <td className="px-4 py-2 text-sm">List of messages in the conversation</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 text-sm font-mono">max_tokens</td>
                              <td className="px-4 py-2 text-sm">integer</td>
                              <td className="px-4 py-2 text-sm">No</td>
                              <td className="px-4 py-2 text-sm">Maximum tokens in the response</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 text-sm font-mono">temperature</td>
                              <td className="px-4 py-2 text-sm">number</td>
                              <td className="px-4 py-2 text-sm">No</td>
                              <td className="px-4 py-2 text-sm">Sampling temperature (0.0 to 2.0)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'embeddings' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Embeddings</h2>
                    <div className="prose max-w-none">
                      <p className="text-gray-600 mb-6">
                        Generate vector embeddings for text using our embedding models.
                      </p>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Example Request</h3>
                      <div className="bg-gray-900 rounded-lg p-4 mb-6 text-green-400 font-mono text-sm">
                        <pre>{`curl https://api.gpt.ai/v1/embeddings \\
  -H "Authorization: Bearer $GPT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "embed",
    "input": "The quick brown fox jumps over the lazy dog"
  }'`}</pre>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Use Cases</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Semantic search</li>
                        <li>Document similarity</li>
                        <li>Clustering and classification</li>
                        <li>Recommendation systems</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === 'models' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Models</h2>
                    <div className="prose max-w-none">
                      <p className="text-gray-600 mb-6">
                        Choose the right model for your use case and budget.
                      </p>

                      <div className="grid gap-6">
                        {[
                          {
                            name: 'gpt-fast',
                            fullName: 'gpt-oss-20B',
                            description: 'Fast, cost-effective model for general-purpose tasks',
                            contextWindow: '8K tokens',
                            pricing: '$0.25/$0.50 per 1M tokens'
                          },
                          {
                            name: 'gpt-full',
                            fullName: 'gpt-oss-120B', 
                            description: 'Advanced reasoning and complex task handling',
                            contextWindow: '32K tokens',
                            pricing: '$0.50/$1.00 per 1M tokens'
                          },
                          {
                            name: 'embed',
                            fullName: 'snowflake-arctic-embed2',
                            description: 'High-quality text embeddings',
                            contextWindow: '512 tokens',
                            pricing: '$0.05 per 1M tokens'
                          }
                        ].map((model) => (
                          <div key={model.name} className="border border-gray-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {model.fullName} ({model.name})
                            </h3>
                            <p className="text-gray-600 mb-3">{model.description}</p>
                            <div className="flex space-x-6 text-sm text-gray-500">
                              <span>Context: {model.contextWindow}</span>
                              <span>Pricing: {model.pricing}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}