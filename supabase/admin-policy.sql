-- 관리자 본인이 자신의 관리자 등록 여부를 확인할 수 있도록 허용
grant select on public.admins to authenticated;
drop policy if exists "admins can read own membership" on public.admins;
create policy "admins can read own membership"
on public.admins for select to authenticated
using (auth.uid() = user_id);
