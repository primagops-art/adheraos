-- A logged-in portal client can also land on diagnostico.html and submit a
-- new request; the original policy only covered anon (logged-out) inserts.
drop policy if exists "anon can submit diagnostics" on public.diagnostic_submissions;

create policy "public can submit diagnostics"
on public.diagnostic_submissions
for insert
to anon, authenticated
with check (true);

-- RLS policies only govern row visibility; the role also needs the base
-- table-level privilege. Tables created via SQL editor don't get this
-- automatically (unlike ones created through the Table Editor UI).
grant insert on public.diagnostic_submissions to anon, authenticated;
