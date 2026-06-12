-- CopyAI Pro Bot allowlist
create table if not exists public.bot_users (
  telegram_id text primary key,
  username    text,
  active      boolean not null default false,
  created_at  timestamptz not null default now()
);

-- RLS stays ON so the public anon key can't read/write this table.
-- The bot route reaches it with the service role key (bypasses RLS).
alter table public.bot_users enable row level security;

-- If you'd rather NOT add a service role key, comment the line above and
-- uncomment the next one instead (less secure — anon key can then access it):
-- alter table public.bot_users disable row level security;
