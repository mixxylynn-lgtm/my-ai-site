-- CopyAI Pro Bot — one-time access codes
-- Bridges a Stripe payment (known by email) to a Telegram account (known by
-- telegram_id only once the buyer messages the bot).
--
-- Flow:
--   1. /api/checkout generates a random `code`, stores it here (paid=false),
--      and passes it to Stripe as session metadata.
--   2. The Stripe webhook flips `paid=true` once payment completes.
--   3. The success page hands the buyer a deep link: t.me/<bot>?start=<code>.
--   4. The bot receives `/start <code>`, and if it's paid & unclaimed it
--      activates that telegram_id in bot_users and marks the code claimed.
create table if not exists public.bot_access_codes (
  code        text primary key,
  email       text,
  paid        boolean not null default false,
  claimed     boolean not null default false,
  telegram_id text,
  created_at  timestamptz not null default now(),
  paid_at     timestamptz,
  claimed_at  timestamptz
);

-- RLS stays ON so the public anon key can't read/write codes.
-- The checkout, webhook, and bot routes reach it with the service role key
-- (which bypasses RLS).
alter table public.bot_access_codes enable row level security;
