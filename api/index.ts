import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../server';

// Reuse one initialized Express application for warm invocations.
// Persistent application data is loaded from Supabase, never from the
// serverless instance's temporary filesystem.
const appPromise = createApp();

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    const app = await appPromise;
    app(req as any, res as any);
  } catch (error) {
    console.error('TrustKeys API initialization failed:', error);
    if (!res.headersSent) {
      res.statusCode = 503;
      res.setHeader('content-type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'API service is temporarily unavailable' }));
    }
  }
}
