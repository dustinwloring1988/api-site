export const env = {
  PORT: Number(process.env.PORT || 8787),
  NODE_ENV: process.env.NODE_ENV || "development",
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY!,
  UPSTREAMS: (process.env.UPSTREAMS || "http://127.0.0.1:8000/v1").split(",").map(s => s.trim()).filter(Boolean),
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  UPSTREAM_HMAC_KEY: process.env.UPSTREAM_HMAC_KEY || "",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*"
};