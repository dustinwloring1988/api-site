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

Run these SQL scripts against your Supabase database. The following schema provides a comprehensive setup for managing users, API keys, models, usage, billing, and system status.

> **Note:** This schema assumes you are using Supabase for authentication. The `profiles` table is designed to link to Supabase's built-in `auth.users` table.

```sql
--
-- TBL: profiles
-- Description: Stores public user data and links to Supabase auth.
--
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at timestamptz,
  stripe_customer_id text UNIQUE,
  credits numeric(10, 4) DEFAULT 0.00 CHECK (credits >= 0)
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

--
-- TBL: models
-- Description: Stores information about available AI models and their pricing.
--
CREATE TABLE models (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  internal_name text NOT NULL UNIQUE,
  input_price_per_million_tokens integer NOT NULL, -- Price in cents
  output_price_per_million_tokens integer NOT NULL, -- Price in cents
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- RLS for models (allow public read access)
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to models" ON models FOR SELECT USING (true);


--
-- TBL: api_keys
-- Description: Manages user-generated API keys for accessing the service.
--
CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_prefix text NOT NULL UNIQUE, -- e.g., "sk_live_..."
  key_hash text NOT NULL UNIQUE, -- Hashed key for security
  revoked boolean DEFAULT false,
  expires_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- RLS for api_keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own API keys" ON api_keys FOR ALL USING (auth.uid() = user_id);

--
-- TBL: usage_logs
-- Description: Logs each API request for billing and analytics.
--
CREATE TABLE usage_logs (
  id bigserial PRIMARY KEY,
  api_key_id uuid NOT NULL REFERENCES api_keys(id),
  model_id bigint NOT NULL REFERENCES models(id),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  prompt_tokens integer NOT NULL,
  completion_tokens integer NOT NULL,
  cost numeric(10, 6) NOT NULL, -- Cost for this specific request
  created_at timestamptz DEFAULT now()
);

-- RLS for usage_logs
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own usage logs" ON usage_logs FOR SELECT USING (auth.uid() = user_id);

--
-- TBL: subscriptions
-- Description: Tracks user subscriptions, linked to Stripe.
--
CREATE TYPE subscription_status AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'unpaid');
CREATE TABLE subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_subscription_id text UNIQUE,
    status subscription_status NOT NULL,
    current_period_start timestamptz NOT NULL,
    current_period_end timestamptz NOT NULL,
    cancel_at_period_end boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz
);

-- RLS for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

--
-- TBL: services
-- Description: Lists monitored services for the system status page.
--
CREATE TYPE service_status AS ENUM ('operational', 'degraded_performance', 'partial_outage', 'major_outage');
CREATE TABLE services (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text,
  status service_status DEFAULT 'operational',
  last_updated timestamptz DEFAULT now()
);

-- RLS for services (allow public read access)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to services" ON services FOR SELECT USING (true);

--
-- TBL: incidents
-- Description: Logs system-wide incidents for the status page.
--
CREATE TYPE incident_severity AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE incident_status AS ENUM ('investigating', 'identified', 'monitoring', 'resolved');
CREATE TABLE incidents (
    id bigserial PRIMARY KEY,
    title text NOT NULL,
    status incident_status DEFAULT 'investigating',
    severity incident_severity DEFAULT 'medium',
    created_at timestamptz DEFAULT now(),
    resolved_at timestamptz
);

-- RLS for incidents (allow public read access)
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to incidents" ON incidents FOR SELECT USING (true);


--
-- TBL: incident_updates
-- Description: Provides updates for a specific incident.
--
CREATE TABLE incident_updates (
    id bigserial PRIMARY KEY,
    incident_id bigint NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    description text NOT NULL,
    status_at_update incident_status NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- RLS for incident_updates (allow public read access)
ALTER TABLE incident_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to incident updates" ON incident_updates FOR SELECT USING (true);

--
-- Seed initial data for models
--
INSERT INTO models (name, internal_name, input_price_per_million_tokens, output_price_per_million_tokens) VALUES
('gpt-oss-20B', 'gpt-fast', 25, 50), -- $0.25 and $0.50
('gpt-oss-120B', 'gpt-full', 50, 100), -- $0.50 and $1.00
('snowflake-arctic-embed2', 'embed', 5, 0); -- $0.05 and N/A
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
