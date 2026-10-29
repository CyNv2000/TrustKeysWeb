// @ts-nocheck -- Supabase Edge Function runtime provides Deno globals.
const BACKEND_SECRET = "__TRUSTKEYS_BACKEND_SECRET__";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
  (Deno.env.get("SUPABASE_SECRET_KEYS")
    ? JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")!).default
    : undefined);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

function serviceHeaders(extra: Record<string, string> = {}): Headers {
  const headers = new Headers({
    apikey: SERVICE_KEY!,
    authorization: `Bearer ${SERVICE_KEY}`,
    ...extra,
  });
  return headers;
}

Deno.serve(async (request: Request) => {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error("Supabase function is missing its built-in service credentials");
    return json({ error: "Persistence service is not configured" }, 503);
  }

  const suppliedSecret = request.headers.get("x-trustkeys-persistence-secret") ?? "";
  if (!constantTimeEqual(suppliedSecret, BACKEND_SECRET)) {
    return json({ error: "Unauthorized" }, 401);
  }

  const pathname = new URL(request.url).pathname;
  const stateEndpoint = `${SUPABASE_URL}/rest/v1/trustkeysweb_state`;

  try {
    if (request.method === "GET" && pathname.endsWith("/state")) {
      const response = await fetch(`${stateEndpoint}?id=eq.1&select=state`, {
        headers: serviceHeaders({ accept: "application/json" }),
      });
      if (!response.ok) throw new Error(`State read failed (${response.status})`);
      const rows = await response.json();
      return json(rows[0]?.state ?? null);
    }

    if (request.method === "PUT" && pathname.endsWith("/state")) {
      const state = await request.json();
      const response = await fetch(`${stateEndpoint}?on_conflict=id`, {
        method: "POST",
        headers: serviceHeaders({
          "content-type": "application/json",
          prefer: "resolution=merge-duplicates,return=minimal",
        }),
        body: JSON.stringify({ id: 1, state, updated_at: new Date().toISOString() }),
      });
      if (!response.ok) throw new Error(`State write failed (${response.status})`);
      return json({ success: true });
    }

    if (request.method === "POST" && pathname.endsWith("/upload")) {
      const mimeType = request.headers.get("content-type") ?? "";
      const extensionByMime: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "application/pdf": ".pdf",
      };
      const extension = extensionByMime[mimeType];
      if (!extension) return json({ error: "Unsupported file type" }, 415);

      const bytes = new Uint8Array(await request.arrayBuffer());
      if (!bytes.length || bytes.length > 10 * 1024 * 1024) {
        return json({ error: "File exceeds the 10MB limit" }, 413);
      }

      const path = `trustkeysweb/${crypto.randomUUID()}${extension}`;
      const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/project-images/${path}`,
        {
          method: "POST",
          headers: serviceHeaders({
            "content-type": mimeType,
            "x-upsert": "false",
          }),
          body: bytes,
        },
      );
      if (!response.ok) throw new Error(`Asset upload failed (${response.status})`);

      return json({
        success: true,
        url: `${SUPABASE_URL}/storage/v1/object/public/project-images/${path}`,
        size: bytes.length,
      });
    }

    return json({ error: "Not found" }, 404);
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Persistence request failed");
    return json({ error: "Persistence request failed" }, 500);
  }
});
