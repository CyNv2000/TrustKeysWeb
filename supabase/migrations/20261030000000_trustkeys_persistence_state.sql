-- Persistence state used by the TrustKeys server-side persistence function.
-- No anon/authenticated policies are created: only the service role may access this table.
CREATE TABLE IF NOT EXISTS public.trustkeysweb_state (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  state JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.trustkeysweb_state ENABLE ROW LEVEL SECURITY;
