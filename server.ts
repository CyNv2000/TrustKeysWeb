import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { createHmac, randomUUID, timingSafeEqual } from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const ADMIN_TOKEN_SECRET = process.env.SESSION_SECRET || 'trustkeys-admin-secure-auth-2026';
const UPLOADS_DIR = path.resolve(__dirname, '.data', 'uploads');
const ADMIN_TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

function createAdminToken(): string {
  const payload = Buffer.from(JSON.stringify({ sub: 'admin', exp: Date.now() + ADMIN_TOKEN_TTL_MS })).toString('base64url');
  const signature = createHmac('sha256', ADMIN_TOKEN_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function isValidAdminToken(token: string): boolean {
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;

  const expected = createHmac('sha256', ADMIN_TOKEN_SECRET).update(payload).digest();
  const received = Buffer.from(signature, 'base64url');
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return false;

  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return claims.sub === 'admin' && Number.isFinite(claims.exp) && claims.exp > Date.now();
  } catch {
    return false;
  }
}

// Simple auth middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  const token = authHeader.substring(7);
  if (!isValidAdminToken(token)) {
    return res.status(401).json({ error: 'Invalid or expired session token. Please log in again.' });
  }

  next();
}

async function startServer() {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  await db.initializePersistentStorage();
  const app = express();

  // Middleware
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use((req, res, next) => {
    const originalJson = res.json.bind(res);
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
      res.json = ((body: unknown) => {
        if (res.statusCode >= 400) return originalJson(body);
        void db.flushPersistentWrites().then(() => originalJson(body)).catch(err => {
          console.error('Could not confirm durable save:', err);
          if (!res.headersSent) {
            res.status(503);
            originalJson({ error: 'Could not confirm the change was saved. Please retry.' });
          }
        });
        return res;
      }) as typeof res.json;
    }
    next();
  });
  app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '1d', immutable: true }));

  // --- API Endpoints ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'TrustKeys API', timestamp: new Date().toISOString() });
  });

  // Projects - List & Query
  app.get('/api/projects', (req, res, next) => {
    if (req.query.includeUnpublished === 'true') return requireAdmin(req, res, next);
    next();
  }, (req, res) => {
    try {
      const {
        search,
        area,
        bhk,
        status,
        category,
        minPrice,
        maxPrice,
        minArea,
        maxArea,
        possession,
        sort,
        page,
        limit,
        includeUnpublished
      } = req.query;

      const results = db.getProjects({
        search: typeof search === 'string' ? search : undefined,
        area: typeof area === 'string' ? area.split(',') : undefined,
        bhk: typeof bhk === 'string' ? bhk.split(',') : undefined,
        status: typeof status === 'string' ? status.split(',') : undefined,
        category: typeof category === 'string' ? category.split(',') : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minArea: minArea ? Number(minArea) : undefined,
        maxArea: maxArea ? Number(maxArea) : undefined,
        possession: typeof possession === 'string' ? possession : undefined,
        sort: typeof sort === 'string' ? sort : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 12,
        includeUnpublished: includeUnpublished === 'true'
      });

      res.json(results);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      res.status(500).json({ error: 'Failed to fetch residences. Please retry.' });
    }
  });

  // Project by Slug
  app.get('/api/projects/:slug', (req, res) => {
    try {
      const project = db.getProjectBySlug(req.params.slug);
      if (!project || !project.published) {
        return res.status(404).json({ error: 'Residence not found' });
      }
      res.json(project);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to load project details' });
    }
  });

  // Admin Project CRUD
  app.post('/api/projects', requireAdmin, (req, res) => {
    try {
      const payload = req.body;
      if (!payload.title || !payload.area || !payload.startingPrice) {
        return res.status(400).json({ error: 'Missing mandatory fields: title, area, startingPrice' });
      }

      payload.title = String(payload.title).trim();
      // Always canonicalize slugs so whitespace and case cannot break project links.
      const slugSource = typeof payload.slug === 'string' && payload.slug.trim() ? payload.slug : payload.title;
      const slug = slugSource.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      if (!slug) return res.status(400).json({ error: 'Enter a valid project title or URL slug' });
      const existing = db.getProjectBySlug(slug);
      if (existing) {
        payload.slug = `${slug}-${Date.now().toString().slice(-4)}`;
      } else {
        payload.slug = slug;
      }

      const created = db.createProject(payload);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create residence' });
    }
  });

  app.put('/api/projects/:id', requireAdmin, (req, res) => {
    try {
      const updates = { ...req.body };
      if (typeof updates.title === 'string') updates.title = updates.title.trim();
      if (typeof updates.slug === 'string') {
        const slug = updates.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        if (!slug) return res.status(400).json({ error: 'Enter a valid project URL slug' });
        const existing = db.getProjectBySlug(slug);
        updates.slug = existing && existing.id !== req.params.id ? `${slug}-${Date.now().toString().slice(-4)}` : slug;
      }
      const updated = db.updateProject(req.params.id, updates);
      if (!updated) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update residence' });
    }
  });

  app.delete('/api/projects/:id', requireAdmin, (req, res) => {
    try {
      const ok = db.deleteProject(req.params.id);
      if (!ok) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json({ success: true, message: 'Residence deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete residence' });
    }
  });

  // Enquiries (Public POST, Admin GET/PATCH/DELETE)
  app.post('/api/enquiries', (req, res) => {
    try {
      const { name, mobile, email, requirement, projectRef, message } = req.body;

      if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Please enter a valid full name' });
      }
      if (!mobile || mobile.trim().replace(/\D/g, '').length < 8) {
        return res.status(400).json({ error: 'Please enter a valid contact phone number' });
      }
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
      }

      const enquiry = db.createEnquiry({
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim().toLowerCase(),
        requirement: requirement || 'General Enquiry',
        projectRef: projectRef || undefined,
        message: message ? message.trim() : undefined
      });

      res.status(201).json({
        success: true,
        message: 'Your enquiry has been successfully registered. A Senior TrustKeys Advisor will contact you within 2 hours.',
        enquiryId: enquiry.id
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Could not register enquiry. Please retry.' });
    }
  });

  app.get('/api/enquiries', requireAdmin, (req, res) => {
    try {
      const list = db.getEnquiries();
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
  });

  app.patch('/api/enquiries/:id', requireAdmin, (req, res) => {
    try {
      const { status } = req.body;
      const updated = db.updateEnquiryStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ error: 'Enquiry not found' });
      }
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update enquiry' });
    }
  });

  app.delete('/api/enquiries/:id', requireAdmin, (req, res) => {
    try {
      const ok = db.deleteEnquiry(req.params.id);
      if (!ok) return res.status(404).json({ error: 'Enquiry not found' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete enquiry' });
    }
  });

  // Sell Leads (Public POST, Admin GET/PATCH/DELETE)
  app.post('/api/sell-leads', (req, res) => {
    try {
      const { name, mobile, email, location, category, configuration, carpetArea, expectedPrice, propertyStatus, extraDetails } = req.body;

      if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Please enter your name' });
      }
      if (!mobile || mobile.trim().replace(/\D/g, '').length < 8) {
        return res.status(400).json({ error: 'Please enter a valid mobile number' });
      }
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Please provide a valid email' });
      }
      if (!location || location.trim().length < 2) {
        return res.status(400).json({ error: 'Please specify property location/building' });
      }
      if (!carpetArea || Number(carpetArea) <= 0) {
        return res.status(400).json({ error: 'Please enter valid carpet area in sq.ft.' });
      }

      const lead = db.createSellLead({
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim().toLowerCase(),
        location: location.trim(),
        category: category || 'Residential',
        configuration: configuration || '3 BHK',
        carpetArea: Number(carpetArea),
        expectedPrice: expectedPrice || 'Market Valuation',
        propertyStatus: propertyStatus || 'Ready',
        extraDetails: extraDetails ? extraDetails.trim() : undefined
      });

      // Also create matching enquiry record as requested in the brief:
      // "Save a seller lead and a matching enquiry"
      db.createEnquiry({
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim().toLowerCase(),
        requirement: `Seller Lead: ${configuration} in ${location}`,
        message: `Expected Price: ${expectedPrice}. Carpet Area: ${carpetArea} sq.ft. Status: ${propertyStatus}. Notes: ${extraDetails || 'None'}`
      });

      res.status(201).json({
        success: true,
        message: 'Your property evaluation request has been submitted. Our valuation specialist will contact you with a Comparative Market Analysis.',
        leadId: lead.id
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to submit seller lead. Please try again.' });
    }
  });

  app.get('/api/sell-leads', requireAdmin, (req, res) => {
    try {
      const leads = db.getSellLeads();
      res.json(leads);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch seller leads' });
    }
  });

  app.patch('/api/sell-leads/:id', requireAdmin, (req, res) => {
    try {
      const { status } = req.body;
      const updated = db.updateSellLeadStatus(req.params.id, status);
      if (!updated) return res.status(404).json({ error: 'Lead not found' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update lead status' });
    }
  });

  app.delete('/api/sell-leads/:id', requireAdmin, (req, res) => {
    try {
      const ok = db.deleteSellLead(req.params.id);
      if (!ok) return res.status(404).json({ error: 'Lead not found' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete lead' });
    }
  });

  // FAQs
  app.get('/api/faqs', (req, res, next) => {
    if (req.query.all === 'true') return requireAdmin(req, res, next);
    next();
  }, (req, res) => {
    try {
      const all = req.query.all === 'true';
      const faqs = db.getFAQs(!all);
      res.json(faqs);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
  });

  app.post('/api/faqs', requireAdmin, (req, res) => {
    try {
      const { question, answer, category, sortOrder, published } = req.body;
      if (!question || !answer) {
        return res.status(400).json({ error: 'Question and answer are required' });
      }
      const created = db.createFAQ({
        question: question.trim(),
        answer: answer.trim(),
        category: category || 'Buying',
        sortOrder: Number(sortOrder) || 0,
        published: published !== false
      });
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create FAQ' });
    }
  });

  app.put('/api/faqs/:id', requireAdmin, (req, res) => {
    try {
      const updated = db.updateFAQ(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'FAQ not found' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update FAQ' });
    }
  });

  app.delete('/api/faqs/:id', requireAdmin, (req, res) => {
    try {
      const ok = db.deleteFAQ(req.params.id);
      if (!ok) return res.status(404).json({ error: 'FAQ not found' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete FAQ' });
    }
  });

  // Site Settings
  app.get('/api/settings', (req, res) => {
    try {
      const settings = db.getSettings();
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch site settings' });
    }
  });

  app.put('/api/settings', requireAdmin, (req, res) => {
    try {
      const updated = db.updateSettings(req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update site settings' });
    }
  });

  // Admin Auth
  app.post('/api/admin/login', (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }

      const isValid = db.verifyAdminPassword(password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
      }

      // Signed tokens remain valid across service restarts until they expire.
      const token = createAdminToken();

      res.json({
        success: true,
        token,
        message: 'Admin access granted'
      });
    } catch (err) {
      res.status(500).json({ error: 'Authentication failed' });
    }
  });

  app.post('/api/admin/change-password', requireAdmin, (req, res) => {
    try {
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }
      db.changeAdminPassword(newPassword);
      res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update password' });
    }
  });

  // File Upload with Validation (size and mime type check)
  app.post('/api/upload', requireAdmin, async (req, res) => {
    try {
      const { filename, fileData, mimeType } = req.body;

      if (!fileData) {
        return res.status(400).json({ error: 'No file data received' });
      }

      // Store assets separately from project JSON so multiple uploads stay small.
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      const resolvedMime = mimeType || ((filename || '').toLowerCase().endsWith('.pdf') ? 'application/pdf' : '');
      if (!allowedMimes.includes(resolvedMime)) {
        return res.status(400).json({ error: 'Unsupported file type. Only JPEG, PNG, WebP, and PDF documents are allowed.' });
      }

      const base64Data = typeof fileData === 'string' ? fileData.replace(/^data:[^,]*,/, '') : '';
      const bytes = Buffer.from(base64Data, 'base64');
      if (!bytes.length || bytes.length > 10 * 1024 * 1024) {
        return res.status(400).json({ error: 'File size exceeds maximum permitted limit (10MB)' });
      }

      const extensionByMime: Record<string, string> = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
        'application/pdf': '.pdf'
      };
      const extension = extensionByMime[resolvedMime] || '.bin';
      const persistentUrl = await db.uploadPersistentFile(bytes, filename || 'uploaded_document', resolvedMime);
      if (persistentUrl) {
        return res.json({
          success: true,
          url: persistentUrl,
          size: bytes.length,
          filename: path.basename(filename || 'uploaded_document')
        });
      }

      const storedName = `${randomUUID()}${extension}`;
      const storedPath = path.join(UPLOADS_DIR, storedName);
      const tempPath = `${storedPath}.tmp`;
      fs.writeFileSync(tempPath, bytes, { flag: 'wx' });
      fs.renameSync(tempPath, storedPath);

      res.json({
        success: true,
        url: `/uploads/${storedName}`,
        size: bytes.length,
        filename: path.basename(filename || storedName)
      });
    } catch (err) {
      res.status(500).json({ error: 'File processing failed' });
    }
  });

  // --- Vite / Frontend Serving ---
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TrustKeys server operational on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to initialize server:', err);
});
