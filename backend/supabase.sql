-- Run once in the company's Supabase SQL editor. Auth accounts must be created
-- by an administrator; add only approved hosts to activity_staff below.
create table if not exists public.activity_staff (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.activity_staff enable row level security;
drop policy if exists staff_self_read on public.activity_staff;
create policy staff_self_read on public.activity_staff for select to authenticated using (user_id=auth.uid());
grant select on public.activity_staff to authenticated;
create or replace function public.is_activity_staff() returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.activity_staff where user_id=auth.uid());
$$;
revoke all on function public.is_activity_staff() from public;
grant execute on function public.is_activity_staff() to authenticated;
create table if not exists public.activity_records (
 id uuid primary key, name text not null, updated_at timestamptz not null default now(), payload jsonb not null
);
alter table public.activity_records enable row level security;
drop policy if exists activity_read on public.activity_records;
create policy activity_read on public.activity_records for select to authenticated using (public.is_activity_staff());
drop policy if exists activity_insert on public.activity_records;
create policy activity_insert on public.activity_records for insert to authenticated with check (public.is_activity_staff());
drop policy if exists activity_update on public.activity_records;
create policy activity_update on public.activity_records for update to authenticated using (public.is_activity_staff()) with check (public.is_activity_staff());
grant select,insert,update on public.activity_records to authenticated;
-- Atomic version check prevents two devices from silently replacing each other.
create or replace function public.save_activity_record(p_id uuid,p_payload jsonb,p_expected_updated_at timestamptz default null)
returns timestamptz language plpgsql security invoker set search_path=public as $$
declare saved timestamptz;
begin
 if not public.is_activity_staff() then raise exception 'Not authorized'; end if;
 if p_payload->>'id' is distinct from p_id::text or p_payload->>'schemaVersion' is distinct from '1' or nullif(trim(p_payload#>>'{meta,name}'),'') is null then raise exception 'Invalid activity'; end if;
 if p_expected_updated_at is null then
  insert into public.activity_records(id,name,updated_at,payload) values(p_id,p_payload#>>'{meta,name}',clock_timestamp(),p_payload)
  on conflict(id) do nothing returning updated_at into saved;
 else
  update public.activity_records set name=p_payload#>>'{meta,name}',updated_at=clock_timestamp(),payload=p_payload
  where id=p_id and updated_at=p_expected_updated_at returning updated_at into saved;
 end if;
 if saved is null then raise exception 'Activity changed on another device; export local backup and reload' using errcode='40001'; end if;
 return saved;
end;
$$;
revoke all on function public.save_activity_record(uuid,jsonb,timestamptz) from public;
grant execute on function public.save_activity_record(uuid,jsonb,timestamptz) to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('activity-photos','activity-photos',false,20971520,array['image/png','image/jpeg','image/webp','image/gif']) on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists activity_photos_read on storage.objects;
create policy activity_photos_read on storage.objects for select to authenticated using(bucket_id='activity-photos' and public.is_activity_staff());
drop policy if exists activity_photos_insert on storage.objects;
create policy activity_photos_insert on storage.objects for insert to authenticated with check(bucket_id='activity-photos' and public.is_activity_staff());
drop policy if exists activity_photos_update on storage.objects;
create policy activity_photos_update on storage.objects for update to authenticated using(bucket_id='activity-photos' and public.is_activity_staff()) with check(bucket_id='activity-photos' and public.is_activity_staff());
-- Add each approved host's Auth UUID using the SQL editor, never a browser:
-- insert into public.activity_staff(user_id) values('APPROVED_AUTH_USER_UUID');
-- Disable public signup in Auth settings. Never put a service_role key in this site.
