import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../server.js';

// Initialize lazily so any configuration or persistence failure is returned
// as a controlled 503 instead of terminating the serverless invocation.
let appPromise: ReturnType<typeof createApp> | undefined;

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    appPromise ??= createApp();
    const app = await appPromise;
    app(req as any, res as any);
  } catch (error) {
    appPromise = undefined;
    console.error('TrustKeys API initialization failed:', error);
    if (!res.headersSent) {
      res.statusCode = 503;
      res.setHeader('content-type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'API service is temporarily unavailable' }));
    }
  }
}
