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
