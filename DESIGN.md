**Project Overview**
Create a website called **GPT API** (© 2025) with the domain `gpt.ai` and API endpoint `api.gpt.ai/`.
The backend will use **llama.cpp**, running multiple servers—each with its own model—on **RunPod**.
We will charge users for API usage similar to OpenAI’s pricing model.

**Pricing**

| Model                   | Internal Name | Input Price        | Output Price       | Use Case           |
| ----------------------- | ------------- | ------------------ | ------------------ | ------------------ |
| gpt-oss-20B             | `gpt-fast`    | \$0.25 / 1M tokens | \$0.50 / 1M tokens | General purpose    |
| gpt-oss-120B            | `gpt-full`    | \$0.50 / 1M tokens | \$1.00 / 1M tokens | Advanced reasoning |
| snowflake-arctic-embed2 | `embed`       | \$0.05 / 1M tokens | N/A                | Embeddings         |

**Infrastructure**

* **Frontend**: Hosted on DigitalOcean Kubernetes cluster
* **Backend**: Multiple llama.cpp inference servers on RunPod
* **Auth & Database**: Supabase
* **Payments**: Stripe

---

### **Website Layout**

**Header** (with nav links)
**Body** (page content)
**Footer** (with relevant links)

---

### **Pages**

* **Landing** (not logged in) – marketing sections explaining services
* **Dashboard** (logged in) – tabbed interface for account management and usage data
* **Status** – overall system status + per-service & per-server status cards + recent incidents
* **Documentation** – API docs for multiple languages

---

### **Modals**

* Sign In (not logged in)
* Sign Up (not logged in)
* Forgot Password (not logged in)
* Confirm Action (logged in)
* 2FA Code
* Privacy Policy
* Terms of Service
* Contact Us

---

### **Navigation Links**

**Header**:

* Sign In (not logged in)
* Register (not logged in)
* Dashboard (logged in)

**Footer**:

* Landing Page (not logged in)
* Dashboard (logged in)
* Status
* Documentation
* Privacy Policy
* Terms of Service
* Contact Us

---

### **Notifications (Toast)**

* No Alert
* Warn – Yellow
* Bad – Red
* Good – Green

---

### **OAuth Integration**

Support Google, GitHub, Facebook, and Indeed logins.

* Controlled via environment variables
* Disabled by default
* Ready for enabling in production

---

### **Repository Structure (for GitHub)**

* `.env.example` – Environment variable template
* `.gitignore`
* `LICENSE`
* `README.md`
* `/scripts` – SQL scripts for Supabase setup

---

### **Tech Stack**

* **Frontend**: React + shadcn UI + Motion for animations
* **Backend**: llama.cpp inference servers
* **Database/Auth**: Supabase
* **Payments**: Stripe
* **Hosting**: DigitalOcean Kubernetes (frontend), RunPod (backend)

---

### **Core Features**

* **User Authentication** - Secure signup/login with Supabase
* **Billing System** - Token-based pricing with billing dashboard from Stripe Payment Integration
* **Usage Tracking** - Detailed analytics and cost tracking
* **API Key Management** - Generate and manage API keys with rate limiting
* **Multi-tenant** - Outof the box support for Multi-tenant
* **Webhooks** - These will add support for Usage Events
* **Multiple Models** - Support for different AI models with custom pricing
* **OpenAI Compatible** - Drop-in replacement for OpenAI API
