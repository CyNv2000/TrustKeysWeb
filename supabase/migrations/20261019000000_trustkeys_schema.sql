-- ==============================================================================
-- TrustKeys Realty - Database Schema Migration
-- Targets: Supabase Postgres
-- Western Mumbai Residential Property Advisory System
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Table: projects
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    area TEXT NOT NULL,
    address TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Ready', 'Ongoing', 'Upcoming')),
    configuration TEXT[] NOT NULL DEFAULT '{}',
    configurations JSONB NOT NULL DEFAULT '[]'::jsonb,
    starting_price NUMERIC(14, 2) NOT NULL,
    max_price NUMERIC(14, 2),
    starting_price_formatted TEXT NOT NULL,
    carpet_area TEXT NOT NULL,
    min_area NUMERIC(10, 2) NOT NULL DEFAULT 0,
    max_area NUMERIC(10, 2) NOT NULL DEFAULT 0,
    possession TEXT NOT NULL,
    possession_date DATE,
    amenities TEXT[] NOT NULL DEFAULT '{}',
    parking TEXT NOT NULL DEFAULT '',
    balcony TEXT NOT NULL DEFAULT '',
    total_floors INTEGER NOT NULL DEFAULT 1,
    vastu_notes TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    rera_number TEXT NOT NULL DEFAULT '',
    floor_plans JSONB NOT NULL DEFAULT '[]'::jsonb,
    brochure_url TEXT,
    architectural_plan_url TEXT,
    youtube_url TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Performance Indexes on Projects
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects (slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_area ON public.projects (area);
CREATE INDEX IF NOT EXISTS idx_projects_price ON public.projects (starting_price);
CREATE INDEX IF NOT EXISTS idx_projects_possession ON public.projects (possession_date);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects (published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects (featured);

-- ------------------------------------------------------------------------------
-- 2. Table: enquiries (Buyer inquiries, site visits, brochure requests)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    requirement TEXT NOT NULL,
    project_ref TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Site Visit Scheduled', 'Closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries (status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries (created_at DESC);

-- ------------------------------------------------------------------------------
-- 3. Table: sell_leads (Property owners looking to sell or list)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sell_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Residential',
    configuration TEXT NOT NULL,
    carpet_area NUMERIC(10, 2) NOT NULL,
    expected_price TEXT NOT NULL,
    property_status TEXT NOT NULL,
    extra_details TEXT,
    status TEXT NOT NULL DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Under Evaluation', 'Listed', 'Completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_sell_leads_status ON public.sell_leads (status);
CREATE INDEX IF NOT EXISTS idx_sell_leads_created_at ON public.sell_leads (created_at DESC);

-- ------------------------------------------------------------------------------
-- 4. Table: faqs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_faqs_published ON public.faqs (published);
CREATE INDEX IF NOT EXISTS idx_faqs_sort_order ON public.faqs (sort_order ASC);

-- ------------------------------------------------------------------------------
-- 5. Table: site_settings
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    business_name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    phone TEXT NOT NULL,
    phone_secondary TEXT,
    email TEXT NOT NULL,
    notification_email TEXT,
    address TEXT NOT NULL,
    office_hours TEXT NOT NULL,
    about_summary TEXT NOT NULL,
    advisor_name TEXT NOT NULL,
    advisor_title TEXT NOT NULL,
    advisor_rera TEXT NOT NULL,
    advisor_bio TEXT NOT NULL,
    advisor_image TEXT,
    whatsapp_number TEXT,
    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- Row Level Security (RLS) Policies
-- ------------------------------------------------------------------------------
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sell_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Projects Policies
-- Public can read published projects
CREATE POLICY "Public read published projects" ON public.projects
    FOR SELECT USING (published = true);

-- Authenticated admins can perform any operation
CREATE POLICY "Admins full access to projects" ON public.projects
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- FAQs Policies
CREATE POLICY "Public read published FAQs" ON public.faqs
    FOR SELECT USING (published = true);

CREATE POLICY "Admins full access to FAQs" ON public.faqs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Site Settings Policies
CREATE POLICY "Public read site settings" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins full access to site settings" ON public.site_settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Enquiries Policies (Public can submit; cannot read others' submissions)
CREATE POLICY "Public submit enquiries" ON public.enquiries
    FOR INSERT WITH CHECK (
        length(name) >= 2 AND
        length(mobile) >= 8 AND
        length(email) >= 5
    );

CREATE POLICY "Admins read all enquiries" ON public.enquiries
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage enquiries" ON public.enquiries
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins delete enquiries" ON public.enquiries
    FOR DELETE TO authenticated USING (true);

-- Sell Leads Policies (Public can submit; cannot read others' submissions)
CREATE POLICY "Public submit sell leads" ON public.sell_leads
    FOR INSERT WITH CHECK (
        length(name) >= 2 AND
        length(mobile) >= 8 AND
        length(email) >= 5 AND
        carpet_area > 0
    );

CREATE POLICY "Admins read all sell leads" ON public.sell_leads
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage sell leads" ON public.sell_leads
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins delete sell leads" ON public.sell_leads
    FOR DELETE TO authenticated USING (true);

-- ------------------------------------------------------------------------------
-- Storage Buckets Configuration
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('project-media', 'project-media', true),
    ('floor-plans', 'floor-plans', true),
    ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can view assets
CREATE POLICY "Public view project media" ON storage.objects
    FOR SELECT USING (bucket_id IN ('project-media', 'floor-plans', 'documents'));

-- Storage RLS: Authenticated admin can upload/update/delete assets
CREATE POLICY "Admins upload storage objects" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('project-media', 'floor-plans', 'documents'));

CREATE POLICY "Admins update storage objects" ON storage.objects
    FOR UPDATE TO authenticated USING (bucket_id IN ('project-media', 'floor-plans', 'documents'));

CREATE POLICY "Admins delete storage objects" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id IN ('project-media', 'floor-plans', 'documents'));
