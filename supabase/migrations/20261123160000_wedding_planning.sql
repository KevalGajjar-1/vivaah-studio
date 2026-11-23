-- Wedding planning: couple sites, events, guests, RSVPs, and a free-tool quota.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.weddings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Our Wedding',
  slug text not null unique,
  partner_a text not null default '',
  partner_b text not null default '',
  wedding_date date,
  wedding_time time,
  venue text,
  venue_address text,
  story text,
  language text not null default 'en' check (language = any (array['en','hi','gu'])),
  theme text not null default 'ivory' check (theme = any (array['ivory','wine','marigold'])),
  vibe text,
  design_id uuid references public.designs(id) on delete set null,
  is_published boolean not null default false,
  whatsapp_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists weddings_user_id_idx on public.weddings (user_id);
create index if not exists weddings_slug_idx on public.weddings (slug);

create table if not exists public.wedding_events (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  title text not null,
  event_key text,
  event_date date,
  event_time time,
  venue text,
  venue_address text,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists wedding_events_wedding_id_idx on public.wedding_events (wedding_id, sort_order);

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  side text not null default 'other' check (side = any (array['bride','groom','other'])),
  group_name text,
  party_size integer not null default 1 check (party_size >= 1 and party_size <= 30),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guests_wedding_id_idx on public.guests (wedding_id);
create index if not exists guests_side_idx on public.guests (wedding_id, side);

create table if not exists public.guest_event_rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.guests(id) on delete cascade,
  event_id uuid not null references public.wedding_events(id) on delete cascade,
  status text not null default 'pending' check (status = any (array['pending','invited','yes','no','maybe'])),
  party_size integer,
  message text,
  responded_at timestamptz,
  unique (guest_id, event_id)
);

create index if not exists guest_event_rsvps_event_id_idx on public.guest_event_rsvps (event_id);
create index if not exists guest_event_rsvps_guest_id_idx on public.guest_event_rsvps (guest_id);

create table if not exists public.tool_rate_limits (
  bucket text not null,
  tool text not null,
  day date not null,
  count integer not null default 0,
  primary key (bucket, tool, day)
);

create trigger weddings_set_updated_at
  before update on public.weddings
  for each row execute function public.set_updated_at();

create trigger guests_set_updated_at
  before update on public.guests
  for each row execute function public.set_updated_at();

create or replace function public.is_wedding_owner(p_wedding_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.weddings w
    where w.id = p_wedding_id and w.user_id = auth.uid()
  );
$$;

create or replace function public.is_wedding_published(p_wedding_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.weddings w
    where w.id = p_wedding_id and w.is_published = true
  );
$$;

create or replace function public.set_wedding_owner()
returns trigger
language plpgsql
as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  if auth.uid() is null or (new.user_id is distinct from auth.uid() and not public.is_admin()) then
    raise exception 'Not allowed';
  end if;
  return new;
end;
$$;

create trigger weddings_set_owner
  before insert on public.weddings
  for each row execute function public.set_wedding_owner();

-- RLS
alter table public.weddings enable row level security;
alter table public.wedding_events enable row level security;
alter table public.guests enable row level security;
alter table public.guest_event_rsvps enable row level security;
alter table public.tool_rate_limits enable row level security;

create policy "owners manage weddings"
  on public.weddings for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "public read published weddings"
  on public.weddings for select
  to anon, authenticated
  using (is_published = true);

create policy "owners manage wedding events"
  on public.wedding_events for all
  to authenticated
  using (public.is_wedding_owner(wedding_id))
  with check (public.is_wedding_owner(wedding_id));

create policy "public read published wedding events"
  on public.wedding_events for select
  to anon, authenticated
  using (public.is_wedding_published(wedding_id));

create policy "owners manage guests"
  on public.guests for all
  to authenticated
  using (public.is_wedding_owner(wedding_id))
  with check (public.is_wedding_owner(wedding_id));

create policy "owners manage guest rsvps"
  on public.guest_event_rsvps for all
  to authenticated
  using (
    exists (
      select 1 from public.guests g
      where g.id = guest_id and public.is_wedding_owner(g.wedding_id)
    )
  )
  with check (
    exists (
      select 1 from public.guests g
      where g.id = guest_id and public.is_wedding_owner(g.wedding_id)
    )
  );

-- Public RSVP intake (anon cannot write guests directly).
create or replace function public.submit_wedding_rsvp(
  p_slug text,
  p_name text,
  p_phone text default null,
  p_email text default null,
  p_side text default 'other',
  p_party_size integer default 1,
  p_message text default null,
  p_responses jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_wedding public.weddings%rowtype;
  v_guest_id uuid;
  v_side text;
  v_party integer;
  v_item jsonb;
  v_event_id uuid;
  v_status text;
begin
  if p_slug is null or length(trim(p_slug)) = 0 then
    raise exception 'Missing wedding';
  end if;
  if p_name is null or length(trim(p_name)) < 2 then
    raise exception 'Please share your name';
  end if;

  select * into v_wedding
  from public.weddings
  where slug = trim(p_slug) and is_published = true;

  if not found then
    raise exception 'This wedding page is not available';
  end if;

  v_side := case when p_side in ('bride', 'groom', 'other') then p_side else 'other' end;
  v_party := least(greatest(coalesce(p_party_size, 1), 1), 20);

  select id into v_guest_id
  from public.guests
  where wedding_id = v_wedding.id
    and (
      (p_phone is not null and length(regexp_replace(p_phone, '\D', '', 'g')) >= 8
        and regexp_replace(coalesce(phone, ''), '\D', '', 'g') = regexp_replace(p_phone, '\D', '', 'g'))
      or (p_email is not null and length(trim(p_email)) > 3
        and lower(coalesce(email, '')) = lower(trim(p_email)))
    )
  limit 1;

  if v_guest_id is null then
    insert into public.guests (wedding_id, name, phone, email, side, party_size, notes)
    values (
      v_wedding.id,
      left(trim(p_name), 120),
      nullif(left(trim(coalesce(p_phone, '')), 24), ''),
      nullif(left(trim(coalesce(p_email, '')), 160), ''),
      v_side,
      v_party,
      nullif(left(trim(coalesce(p_message, '')), 500), '')
    )
    returning id into v_guest_id;
  else
    update public.guests set
      name = left(trim(p_name), 120),
      phone = coalesce(nullif(left(trim(coalesce(p_phone, '')), 24), ''), phone),
      email = coalesce(nullif(left(trim(coalesce(p_email, '')), 160), ''), email),
      side = v_side,
      party_size = v_party,
      notes = coalesce(nullif(left(trim(coalesce(p_message, '')), 500), ''), notes)
    where id = v_guest_id;
  end if;

  for v_item in select * from jsonb_array_elements(coalesce(p_responses, '[]'::jsonb))
  loop
    begin
      v_event_id := nullif(v_item->>'event_id', '')::uuid;
    exception when others then
      v_event_id := null;
    end;
    v_status := coalesce(v_item->>'status', 'pending');
    if v_status not in ('yes', 'no', 'maybe', 'pending') then
      v_status := 'pending';
    end if;
    if v_event_id is null then
      continue;
    end if;
    if not exists (
      select 1 from public.wedding_events e
      where e.id = v_event_id and e.wedding_id = v_wedding.id
    ) then
      continue;
    end if;

    insert into public.guest_event_rsvps (guest_id, event_id, status, party_size, message, responded_at)
    values (
      v_guest_id,
      v_event_id,
      v_status,
      v_party,
      nullif(left(trim(coalesce(p_message, '')), 500), ''),
      case when v_status = 'pending' then null else now() end
    )
    on conflict (guest_id, event_id) do update
      set status = excluded.status,
          party_size = excluded.party_size,
          message = excluded.message,
          responded_at = excluded.responded_at;
  end loop;

  return jsonb_build_object('ok', true, 'guest_id', v_guest_id);
end;
$$;

create or replace function public.consume_tool_quota(p_bucket text, p_tool text, p_limit integer default 8)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day date := (timezone('Asia/Kolkata', now()))::date;
  v_count integer;
  v_limit integer := least(greatest(coalesce(p_limit, 8), 1), 20);
begin
  if p_bucket is null or length(p_bucket) < 8 or length(p_bucket) > 80 then
    return jsonb_build_object('allowed', false, 'remaining', 0, 'limit', v_limit);
  end if;
  if p_tool is null or p_tool not in ('messages', 'wording') then
    return jsonb_build_object('allowed', false, 'remaining', 0, 'limit', v_limit);
  end if;

  insert into public.tool_rate_limits (bucket, tool, day, count)
  values (p_bucket, p_tool, v_day, 1)
  on conflict (bucket, tool, day)
  do update set count = public.tool_rate_limits.count + 1
  returning count into v_count;

  if v_count > v_limit then
    return jsonb_build_object('allowed', false, 'remaining', 0, 'limit', v_limit);
  end if;
  return jsonb_build_object('allowed', true, 'remaining', v_limit - v_count, 'limit', v_limit);
end;
$$;

revoke all on function public.submit_wedding_rsvp(text, text, text, text, text, integer, text, jsonb) from public;
grant execute on function public.submit_wedding_rsvp(text, text, text, text, text, integer, text, jsonb) to anon, authenticated;

revoke all on function public.consume_tool_quota(text, text, integer) from public;
grant execute on function public.consume_tool_quota(text, text, integer) to anon, authenticated;

revoke all on function public.is_wedding_owner(uuid) from public;
grant execute on function public.is_wedding_owner(uuid) to authenticated;

revoke all on function public.is_wedding_published(uuid) from public;
grant execute on function public.is_wedding_published(uuid) to anon, authenticated;

grant select, insert, update, delete on public.weddings, public.wedding_events, public.guests, public.guest_event_rsvps to authenticated;
grant select on public.weddings, public.wedding_events to anon;
