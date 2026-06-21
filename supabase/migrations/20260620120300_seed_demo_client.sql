-- Seed data for the demo/test account (cliente@adheraos.com), reusing the
-- exact values that were previously hardcoded as mock content in
-- portal.html, so the portal looks identical after switching to real data.
insert into public.client_profiles (user_id, company_name, contact_name, role_label, avatar_initials)
values ('8a719f0a-f642-41d5-b0cc-b5e5385bf8c0', 'Acme Corp', 'Kaua', 'Admin', 'KA')
on conflict (user_id) do update set
  company_name = excluded.company_name,
  contact_name = excluded.contact_name,
  role_label = excluded.role_label,
  avatar_initials = excluded.avatar_initials;

delete from public.client_projects where user_id = '8a719f0a-f642-41d5-b0cc-b5e5385bf8c0';
insert into public.client_projects
  (user_id, name, subtitle, status, progress, deadline, impact_value, impact_pct, impact_dir, is_focus)
values
  ('8a719f0a-f642-41d5-b0cc-b5e5385bf8c0', 'Commercial Automation', 'CRM + WhatsApp + AI', 'In execution', 75, '2026-06-28', 87430, 28, 'pos', true),
  ('8a719f0a-f642-41d5-b0cc-b5e5385bf8c0', 'Integrations API', 'Internal systems', 'In execution', 60, '2026-05-30', 45210, 18, 'pos', false),
  ('8a719f0a-f642-41d5-b0cc-b5e5385bf8c0', 'AI Training', 'AI for Support', 'In progress', 40, '2026-06-03', 23800, 12, 'pos', false),
  ('8a719f0a-f642-41d5-b0cc-b5e5385bf8c0', 'Executive Dashboard', 'BI + Indicators', 'Attention', 20, '2026-05-15', 12400, -5, 'neg', false),
  ('8a719f0a-f642-41d5-b0cc-b5e5385bf8c0', 'Financial Automation', 'Flows & reports', 'Waiting', 10, '2026-06-10', 18760, 8, 'pos', false);

delete from public.client_proposals where user_id = '8a719f0a-f642-41d5-b0cc-b5e5385bf8c0';
insert into public.client_proposals (user_id, title, value, status, is_pending)
values ('8a719f0a-f642-41d5-b0cc-b5e5385bf8c0', 'Commercial Proposal', 45210, 'High', true);
