import type { IncomingMessage, ServerResponse } from 'node:http';

// Reuse one initialized Express application for warm invocations, but start
// initialization only inside a request so a rejected startup promise is handled
// by the request's 503 response instead of terminating the serverless process.
let appPromise: Promise<any> | undefined;

function restoreRewrittenApiPath(req: IncomingMessage): void {
  const host = req.headers.host || 'localhost';
  const requestUrl = new URL(req.url || '/', `http://${host}`);
  const rewrittenPaths = requestUrl.searchParams.getAll('__tk_route');
  const routePath = rewrittenPaths.at(-1);

  if (routePath === undefined) return;

  requestUrl.searchParams.delete('__tk_route');
  const encodedPath = routePath.split('/').map(segment => encodeURIComponent(segment)).join('/');
  req.url = `/api/${encodedPath}${requestUrl.search}`;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    restoreRewrittenApiPath(req);
    appPromise ??= import('../server.js').then(({ createApp }) => createApp());
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
