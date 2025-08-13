# GPT API - High-Performance AI Inference Platform

A modern, production-ready AI API platform built on llama.cpp with OpenAI compatibility, featuring advanced authentication, billing, and multi-tenant support.

## 🚀 Features

- **High-Performance API** - Built on llama.cpp for maximum speed and efficiency
- **OpenAI Compatible** - Drop-in replacement for OpenAI API
- **Multiple Models** - Support for various AI models with custom pricing
- **Advanced Authentication** - Secure signup/login with Supabase
- **Billing System** - Token-based pricing with Stripe integration
- **Usage Analytics** - Detailed cost tracking and usage monitoring
- **API Key Management** - Generate and manage API keys with rate limiting
- **Multi-tenant Ready** - Out-of-the-box multi-tenant support
- **Webhook Support** - Usage events and notifications
- **Real-time Status** - System status monitoring and incident reporting

## 🏗️ Architecture

### Frontend
- **Framework**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: React Context + Hooks
- **Routing**: React Router v6

### Backend Infrastructure
- **API Gateway**: Custom routing and load balancing
- **Inference Servers**: llama.cpp on RunPod
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (Supabase)
- **Payments**: Stripe
- **Hosting**: DigitalOcean Kubernetes (frontend), RunPod (inference)

## 🎯 Pricing Models

| Model | Internal Name | Input Price | Output Price | Use Case |
|-------|---------------|-------------|--------------|----------|
| gpt-oss-20B | `gpt-fast` | $0.25 / 1M tokens | $0.50 / 1M tokens | General purpose |
| gpt-oss-120B | `gpt-full` | $0.50 / 1M tokens | $1.00 / 1M tokens | Advanced reasoning |
| snowflake-arctic-embed2 | `embed` | $0.05 / 1M tokens | N/A | Embeddings |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/gpt-api.git
   cd gpt-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Database Setup

Run these SQL scripts against your Supabase database:

```sql
-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create API keys table  
CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can manage own API keys" ON api_keys
  FOR ALL TO authenticated 
  USING (user_id = auth.uid());
```

## 📖 API Documentation

### Authentication

All requests require an API key in the Authorization header:

```bash
Authorization: Bearer gpt_live_1234567890abcdef
```

### Chat Completions

```bash
curl https://api.gpt.ai/v1/chat/completions \
  -H "Authorization: Bearer $GPT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-fast",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

### Embeddings

```bash
curl https://api.gpt.ai/v1/embeddings \
  -H "Authorization: Bearer $GPT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "embed",
    "input": "Text to embed"
  }'
```

## 🔧 Configuration

### OAuth Providers

Enable OAuth providers via environment variables:

```bash
VITE_ENABLE_GOOGLE_AUTH=true
VITE_ENABLE_GITHUB_AUTH=true  
VITE_ENABLE_FACEBOOK_AUTH=false
VITE_ENABLE_INDEED_AUTH=false
```

### Stripe Integration

Configure Stripe for billing:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
# Backend also needs STRIPE_SECRET_KEY
```

## 📊 Monitoring & Status

- **Status Page**: Real-time system status at `/status`
- **Metrics**: Usage analytics in user dashboard
- **Incidents**: Automatic incident reporting and updates
- **Uptime Monitoring**: Per-service uptime tracking

## 🚀 Deployment

### Frontend (DigitalOcean Kubernetes)

```bash
# Build for production
npm run build

# Deploy to Kubernetes cluster
kubectl apply -f k8s/
```

### Backend (RunPod)

Deploy llama.cpp inference servers:

1. Create RunPod instances with GPU support
2. Install llama.cpp and load models
3. Configure load balancer and API gateway
4. Set up monitoring and health checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Full API docs at `/docs`
- **Status Page**: System status at `/status`  
- **Community**: GitHub Discussions
- **Enterprise**: Contact sales for enterprise support

## 🙏 Acknowledgments

- Built with [llama.cpp](https://github.com/ggerganov/llama.cpp) for high-performance inference
- Powered by [Supabase](https://supabase.com) for authentication and database
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Hosting on [DigitalOcean](https://digitalocean.com) and [RunPod](https://runpod.io)

---

**GPT API** © 2025 - Built for the future of AI inference
