-- Board Game Bonanza schema
-- One active session per physical board, anonymous players, dice-roll events.

create extension if not exists "pgcrypto";

-- sessions ---------------------------------------------------------------
create table public.sessions (
  id              uuid primary key default gen_random_uuid(),
  board_id        text not null,
  host_device_id  text not null,
  status          text not null default 'active'
                  check (status in ('active', 'ended', 'expired')),
  created_at      timestamptz not null default now(),
  expires_at      timestamptz not null default now() + interval '6 hours'
);

-- Race-resolver: only one active session per board at a time.
create unique index sessions_one_active_per_board
  on public.sessions (board_id)
  where status = 'active';

create index sessions_board_id_idx on public.sessions (board_id);

-- players ----------------------------------------------------------------
create table public.players (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.sessions(id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 40),
  device_id   text not null,
  joined_at   timestamptz not null default now(),
  unique (session_id, device_id)
);

create index players_session_idx on public.players (session_id);

-- events -----------------------------------------------------------------
create table public.events (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.sessions(id) on delete cascade,
  type        text not null,
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index events_session_created_idx on public.events (session_id, created_at desc);

-- Realtime ---------------------------------------------------------------
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.players;
alter publication supabase_realtime add table public.events;

-- RLS --------------------------------------------------------------------
alter table public.sessions enable row level security;
alter table public.players  enable row level security;
alter table public.events   enable row level security;

create policy sessions_select_all on public.sessions
  for select to anon using (true);

create policy sessions_insert_anyone on public.sessions
  for insert to anon
  with check (status = 'active' and host_device_id is not null);

-- MVP: any anon can flip status to ended/expired. Hardened later via RPC.
create policy sessions_update_status on public.sessions
  for update to anon
  using (status = 'active')
  with check (status in ('ended', 'expired'));

create policy players_select_all on public.players
  for select to anon using (true);

create policy players_insert_into_active on public.players
  for insert to anon
  with check (
    exists (
      select 1 from public.sessions s
      where s.id = session_id and s.status = 'active'
    )
  );

-- Allow a device to rename itself within the same session (no-op for MVP UI).
create policy players_update_self on public.players
  for update to anon
  using (true)
  with check (true);

create policy events_select_all on public.events
  for select to anon using (true);

create policy events_insert_into_active on public.events
  for insert to anon
  with check (
    type in ('dice_roll')
    and exists (
      select 1 from public.sessions s
      where s.id = session_id and s.status = 'active'
    )
  );
