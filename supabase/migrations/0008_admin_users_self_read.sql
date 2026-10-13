-- Allow a signed-in owner to read only their own admin_users row.
-- Without this SELECT policy, the admin UI cannot verify its admin membership under RLS.
alter table public.admin_users enable row level security;

drop policy if exists "admins can read own admin record" on public.admin_users;
create policy "admins can read own admin record"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());
