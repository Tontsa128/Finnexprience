-- Apply this migration to existing Supabase projects.
-- It fixes the admin login flow: the signed-in user must be allowed to
-- read their own row from admin_users so the UI can verify admin membership.

alter table public.admin_users enable row level security;

drop policy if exists "admins can read own admin record" on public.admin_users;
create policy "admins can read own admin record"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());
