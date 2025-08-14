/*
# GPT API Database Setup

This script sets up the complete database schema for the GPT API platform.
It includes tables for user profiles, API keys, models, usage tracking, billing,
subscriptions, and system status monitoring.

## Tables Created:
1. profiles - User profile data linked to Supabase auth
2. models - Available AI models and pricing
3. api_keys - User-generated API keys
4. usage_logs - API request logging for billing
5. subscriptions - User subscription management
6. services - System services for status page
7. incidents - System incidents tracking
8. incident_updates - Updates for incidents

## Security:
- Row Level Security (RLS) enabled on all tables
- Appropriate policies for data access control
- Foreign key constraints for data integrity
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--
-- TBL: profiles
-- Description: Stores public user data and links to Supabase auth.
--
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at timestamptz DEFAULT now(),
  stripe_customer_id text UNIQUE,
  credits numeric(10, 4) DEFAULT 0.00 CHECK (credits >= 0),
  created_at timestamptz DEFAULT now()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

--
-- TBL: models
-- Description: Stores information about available AI models and their pricing.
--
CREATE TABLE IF NOT EXISTS models (
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

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public read access to models" ON models;

CREATE POLICY "Allow public read access to models" ON models FOR SELECT USING (true);

--
-- TBL: api_keys
-- Description: Manages user-generated API keys for accessing the service.
--
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_prefix text NOT NULL UNIQUE, -- e.g., "gpt_live_..."
  key_hash text NOT NULL UNIQUE, -- Hashed key for security
  revoked boolean DEFAULT false,
  expires_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- RLS for api_keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their own API keys" ON api_keys;

CREATE POLICY "Users can manage their own API keys" ON api_keys FOR ALL USING (auth.uid() = user_id);

--
-- TBL: usage_logs
-- Description: Logs each API request for billing and analytics.
--
CREATE TABLE IF NOT EXISTS usage_logs (
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

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view their own usage logs" ON usage_logs;

CREATE POLICY "Users can view their own usage logs" ON usage_logs FOR SELECT USING (auth.uid() = user_id);

--
-- TBL: subscriptions
-- Description: Tracks user subscriptions, linked to Stripe.
--
DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'unpaid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_subscription_id text UNIQUE,
    status subscription_status NOT NULL,
    current_period_start timestamptz NOT NULL,
    current_period_end timestamptz NOT NULL,
    cancel_at_period_end boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;

CREATE POLICY "Users can view their own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

--
-- TBL: services
-- Description: Lists monitored services for the system status page.
--
DO $$ BEGIN
    CREATE TYPE service_status AS ENUM ('operational', 'degraded_performance', 'partial_outage', 'major_outage');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS services (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text,
  status service_status DEFAULT 'operational',
  uptime numeric(5,2) DEFAULT 99.99,
  last_updated timestamptz DEFAULT now()
);

-- RLS for services (allow public read access)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public read access to services" ON services;

CREATE POLICY "Allow public read access to services" ON services FOR SELECT USING (true);

--
-- TBL: incidents
-- Description: Logs system-wide incidents for the status page.
--
DO $$ BEGIN
    CREATE TYPE incident_severity AS ENUM ('critical', 'high', 'medium', 'low');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE incident_status AS ENUM ('investigating', 'identified', 'monitoring', 'resolved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS incidents (
    id bigserial PRIMARY KEY,
    title text NOT NULL,
    description text,
    status incident_status DEFAULT 'investigating',
    severity incident_severity DEFAULT 'medium',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    resolved_at timestamptz
);

-- RLS for incidents (allow public read access)
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public read access to incidents" ON incidents;

CREATE POLICY "Allow public read access to incidents" ON incidents FOR SELECT USING (true);

--
-- TBL: incident_updates
-- Description: Provides updates for a specific incident.
--
CREATE TABLE IF NOT EXISTS incident_updates (
    id bigserial PRIMARY KEY,
    incident_id bigint NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    description text NOT NULL,
    status_at_update incident_status NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- RLS for incident_updates (allow public read access)
ALTER TABLE incident_updates ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public read access to incident updates" ON incident_updates;

CREATE POLICY "Allow public read access to incident updates" ON incident_updates FOR SELECT USING (true);

--
-- Seed initial data for models
--
INSERT INTO models (name, internal_name, input_price_per_million_tokens, output_price_per_million_tokens) 
VALUES
('gpt-oss-20B', 'gpt-fast', 25, 50), -- $0.25 and $0.50
('gpt-oss-120B', 'gpt-full', 50, 100), -- $0.50 and $1.00
('snowflake-arctic-embed2', 'embed', 5, 0) -- $0.05 and N/A
ON CONFLICT (internal_name) DO NOTHING;

--
-- Seed initial data for services
--
INSERT INTO services (name, description, status, uptime) 
VALUES
('API Gateway', 'Main API gateway handling all requests', 'operational', 99.99),
('gpt-fast (20B)', 'Fast inference model for general purpose tasks', 'operational', 99.95),
('gpt-full (120B)', 'Advanced reasoning model', 'degraded_performance', 98.20),
('embed (Arctic)', 'Text embedding service', 'operational', 99.98),
('Authentication', 'User authentication and authorization', 'operational', 100.00),
('Billing System', 'Payment processing and billing', 'operational', 99.90)
ON CONFLICT DO NOTHING;

--
-- Seed initial data for incidents
--
INSERT INTO incidents (title, description, status, severity, created_at, updated_at) 
VALUES
('Increased response times for gpt-full model', 'We are investigating reports of increased response times for the gpt-full model.', 'investigating', 'medium', '2025-01-20T14:30:00Z', '2025-01-20T15:45:00Z'),
('Scheduled maintenance completed', 'Scheduled maintenance on our primary data center has been completed successfully.', 'resolved', 'low', '2025-01-19T02:00:00Z', '2025-01-19T03:30:00Z'),
('Brief API outage resolved', 'A brief outage affecting API requests has been resolved.', 'resolved', 'medium', '2025-01-18T10:15:00Z', '2025-01-18T10:45:00Z')
ON CONFLICT DO NOTHING;

--
-- Function to automatically create user profile on signup
--
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, updated_at)
  VALUES (new.id, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to automatically create profile for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at);