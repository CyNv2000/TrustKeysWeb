# TrustKeys – Borivali, Mumbai Real Estate Advisory

A full-stack residential real estate advisory platform purpose-built for the Western Suburbs of Mumbai (Bandra, Khar, Santacruz, Juhu, Vile Parle, Andheri, Goregaon, Malad, Kandivali, and Borivali).

---

## 🌟 Key Highlights & Architecture

- **High-Performance Architecture**: Server-rendered and cached API layer, minimal client JavaScript, debounced database queries, click-to-load YouTube previews, explicit image dimensions, zero endless skeletons with automatic timeouts & retry mechanics.
- **Shared Project Catalogue**: Identical filtering, sorting, multi-image carousels, load-more pagination (12 per batch), and no-results reset controls shared across `/` and `/projects`.
- **Unit Configuration Engine**: Supports projects with single or multiple unit configurations (e.g. 2 BHK, 3 BHK, 4 BHK, Penthouses). Selecting a configuration dynamically updates unit pricing, carpet area, parking allocation, balcony count, and unit floor plans.
- **Interactive Vastu Shastra Assessment**: Fully client-side 0–100 Vedic directional scoring engine evaluating Entrance (Ishanya), Kitchen (Agneya), Master Suite (Nairutya), Sanitation (Vayavya), plot geometry, and natural light inflow, complete with traditional non-invasive remedies.
- **Compare Matrix**: Compare up to 3 residences side-by-side with local storage persistence, remove/clear controls, and attribute matrix.
- **Seller & Resale Hubs**: 5-step resale verification roadmap, dedicated seller lead capture with automatic duplicate submission prevention and matching enquiry creation.
- **Admin Management Portal (`/admin` & `/admin/leads`)**:
  - Full CRUD for residences, multiple unit configurations, amenities, and floor plans
  - Media uploader with type/size validation and progress indicator
  - Buyer enquiries and seller leads dashboard with one-click WhatsApp action & CSV export
  - Dynamic FAQ management
  - Editable business settings, advisor bio, and RERA credentials
  - Admin password reset tool

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js 18+ or 20+
- npm 9+

### 2. Installation
```bash
git clone <repository-url>
cd trustkeys-realty
npm install
```

### 3. Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env
```
Default `.env` values:
```env
PORT=3000
ADMIN_PASSWORD="set-a-strong-unique-password"
SESSION_SECRET="trustkeys-super-secret-mumbai-realty-key-2026"

# Optional: Supabase configuration (falls back to local persistent store if omitted)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-public-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-secret-key"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Setup & SQL Migrations

The platform includes production-grade PostgreSQL migration scripts with Row Level Security (RLS) policies and storage bucket configuration.

### 1. Apply Migration
In your Supabase project dashboard:
1. Navigate to the **SQL Editor**.
2. Open the file `supabase/migrations/20261019000000_trustkeys_schema.sql`.
3. Paste the entire script and click **Run**.

### 2. What the Migration Configures
- **Tables**: `projects`, `enquiries`, `sell_leads`, `faqs`, `site_settings`.
- **Performance Indexes**:
  - `idx_projects_slug` on `projects(slug)`
  - `idx_projects_status` on `projects(status)`
  - `idx_projects_area` on `projects(area)`
  - `idx_projects_price` on `projects(starting_price)`
  - `idx_projects_possession` on `projects(possession_date)`
  - `idx_projects_published` on `projects(published)`
  - `idx_projects_featured` on `projects(featured)`
- **Row Level Security (RLS)**:
  - Public can read `published = true` projects and FAQs.
  - Public forms can insert validated inquiries and seller leads (cannot view others' submissions).
  - Only authenticated admin tokens have full management access.
- **Storage Buckets**: `project-media`, `floor-plans`, `documents`.

---

## 🔐 Admin Account Credentials

- **Admin Portal URL**: `/admin` or `/admin/leads`
- **Admin Password**: Set `ADMIN_PASSWORD` in your environment before starting the server.
- **Password Modification**: Navigate to the **Security & Password** tab inside the Admin Portal to update the passkey at any time.

---

## 🌐 Production Deployment Guide (Render)

To deploy the full-stack Express + React application on [Render](https://render.com):

1. **Create a New Web Service** connected to your repository.
2. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: `20.x` or higher
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `3000` (or leave default)
   - `ADMIN_PASSWORD`: Your custom admin password
   - `SESSION_SECRET`: A long random secret string
   - (Optional) `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Create Web Service**. Render will install dependencies, build the Vite production bundle to `dist/`, and start `server.ts` serving the API and static SPA assets.

---

## 📍 Western Mumbai Micro-Markets Covered

- **Bandra West**: Pali Hill, Bandstand, Carter Road, Turner Road
- **Bandra East**: BKC Financial Center, Kalanagar
- **Khar West**: 14th Road, Madhu Park, Linking Road
- **Santacruz West**: Tagore Road, Juhu Tara Road
- **Juhu**: JVPD Scheme, Gulmohar Cross Road
- **Vile Parle West**: VM Road, Mithibai & NMIMS vicinity
- **Andheri West**: Lokhandwala Complex, Oshiwara, Versova
- **Goregaon West**: Inorbit Mall, Link Road, Bangur Nagar
- **Malad West**: Mindspace IT Park, Chincholi Bunder
- **Kandivali West**: Mahavir Nagar, Link Road
- **Borivali West**: Shimpoli Road, IC Colony, Eksar


---

## ☁️ Vercel Deployment (Express + Vite + Supabase)

This repository supports Vercel using the Express API as a Node.js serverless function. The Vite frontend is built into `dist/` and served by Vercel's static hosting/CDN.

### 1. Import the GitHub repository

1. Open https://vercel.com/new and import `CyNv2000/TrustKeysWeb`.
2. Deploy branch `vercel-adaptation` for the initial validation (merge to `main` only after the deployment tests pass).
3. Use the repository root as the Root Directory.
4. Framework preset: Vite.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Install command: `npm install`.

The checked-in `vercel.json` routes `/api/*` to `api/index.ts` and sends browser routes to `index.html`.

### 2. Configure Vercel environment variables

Set these for Production (and Preview if you intend to test preview deployments):

- `NODE_ENV=production`
- `ADMIN_PASSWORD`: a new, strong admin password
- `SESSION_SECRET`: a cryptographically random secret of at least 32 bytes
- `TRUSTKEYS_PERSISTENCE_URL=https://<project-ref>.supabase.co/functions/v1/trustkeysweb-persistence`
- `TRUSTKEYS_PERSISTENCE_SECRET`: a long random secret shared with the Supabase Edge Function

Do not expose any of these as `VITE_*` variables. Never commit their values to Git.

### 3. Configure and deploy the Supabase persistence function

The function source is `supabase/functions/trustkeysweb-persistence/index.ts`. Configure the Supabase Edge Function secrets:

- `TRUSTKEYS_PERSISTENCE_SECRET`: exactly the same secret configured in Vercel
- `SUPABASE_SERVICE_ROLE_KEY`: the project's server-side service-role/secret key (keep private)

Supabase provides `SUPABASE_URL` to deployed Edge Functions. Deploy the function named `trustkeysweb-persistence` from the Supabase CLI:

```bash
supabase secrets set TRUSTKEYS_PERSISTENCE_SECRET="<same-random-secret>" SUPABASE_SERVICE_ROLE_KEY="<service-role-secret>" --project-ref <project-ref>
supabase functions deploy trustkeysweb-persistence --project-ref <project-ref>
```

Ensure the `trustkeysweb_state` table exists before deployment. The function accesses it using the service role and the Vercel API accesses the function using the shared secret.

### 4. Important runtime limitations to validate

- Vercel functions are stateless and can run in multiple instances. The current application stores its complete application state in one JSON row (`trustkeysweb_state`). Concurrent writes from separate instances can overwrite one another. This implementation is suitable only for controlled validation until the persistence layer is made concurrency-safe or moved to normalized transactional table operations.
- Vercel has a request-body limit for Functions (currently 4.5 MB). The existing upload endpoint sends base64-encoded file data in JSON and advertises a 10 MB file limit. Uploads near that limit will not work through this endpoint on Vercel; use direct browser-to-Supabase Storage uploads with signed upload URLs before production use.
- Local `.data` and `/uploads` files are not durable on Vercel. Production persistence and uploads must use Supabase.
- Admin passwords are currently stored in the application state as plaintext despite the legacy `adminPasswordHash` field name. Plan a password-hashing migration before treating the admin portal as production-hardened.

### 5. Smoke tests

After deploying, verify:

- `GET /api/health` returns HTTP 200.
- `GET /api/projects` returns the expected catalogue.
- `GET /api/faqs` and `GET /api/settings` return persisted content.
- Admin login works with the configured password.
- A test enquiry is visible in the admin dashboard after a fresh page load.
- Project/FAQ/settings changes survive a new function invocation.
- Uploads are tested only after the direct-to-Storage upload flow is implemented.

Do not consider the site production-ready until the concurrency, upload-size, and admin-password storage limitations above are resolved.
