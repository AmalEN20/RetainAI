insert into public.customers (id, name, contact_name, contact_email, initials, plan, health_score, risk_level, renewal_days, last_activity_label, usage_change_percent) values
  ('cus_acme_001', 'Acme Inc.', 'Sarah Chen', 'sarah@acme.co', 'AC', 'Pro', 34, 'High', 14, '8 days ago', -42),
  ('cus_northstar_002', 'Northstar', 'James Wilson', 'james@northstar.io', 'NS', 'Enterprise', 88, 'Low', 92, 'Today', 18),
  ('cus_pixel_003', 'Pixel Labs', 'Maya Patel', 'maya@pixellabs.dev', 'PL', 'Pro', 57, 'Medium', 31, '3 days ago', -12),
  ('cus_vertex_004', 'Vertex Works', 'Alex Morgan', 'alex@vertex.work', 'VW', 'Starter', 42, 'High', 9, '11 days ago', -36),
  ('cus_brightpath_005', 'Brightpath', 'Olivia King', 'olivia@brightpath.ai', 'BP', 'Enterprise', 73, 'Low', 64, 'Yesterday', 7),
  ('cus_momentum_006', 'Momentum', 'Noah Lee', 'noah@momentum.com', 'MO', 'Pro', 61, 'Medium', 27, '4 days ago', -8)
on conflict (id) do update set
  health_score = excluded.health_score,
  risk_level = excluded.risk_level,
  renewal_days = excluded.renewal_days,
  last_activity_label = excluded.last_activity_label,
  usage_change_percent = excluded.usage_change_percent;

insert into public.conversations (id, customer_id, subject, preview, body, display_time, unread, intent, received_at) values
  (1, 'cus_acme_001', 'Considering cancellation', 'We have not been getting enough value from the product lately and are thinking about canceling…', 'We have not been getting enough value from the product lately. Usage across our team is down, and the billing issue from last month is still unresolved. We are thinking about canceling before our next renewal.', '9:42 AM', true, 'Cancellation risk', '2026-07-13T09:42:00-07:00'),
  (2, 'cus_pixel_003', 'Question about team permissions', 'Could you clarify whether guests can access project reports without a paid seat?', 'Could you clarify whether guests can access project reports without a paid seat?', '8:18 AM', true, 'Product question', '2026-07-13T08:18:00-07:00'),
  (3, 'cus_northstar_002', 'Expanding to our EU team', 'We are rolling the platform out to another 120 people in Europe next quarter.', 'We are rolling the platform out to another 120 people in Europe next quarter.', 'Yesterday', false, 'Expansion signal', '2026-07-12T15:00:00-07:00'),
  (4, 'cus_vertex_004', 'Billing issue still unresolved', 'This is my third follow-up about the duplicate invoice on our account.', 'This is my third follow-up about the duplicate invoice on our account.', 'Yesterday', true, 'Escalation', '2026-07-12T11:20:00-07:00')
on conflict (id) do update set body = excluded.body, unread = excluded.unread, intent = excluded.intent;

insert into public.customer_usage (customer_id, active_users, licensed_seats, weekly_active_users_change_percent, last_meaningful_activity_days_ago, trend_window) values
  ('cus_acme_001', 18, 50, -42, 8, '30 days')
on conflict (customer_id) do update set active_users = excluded.active_users, weekly_active_users_change_percent = excluded.weekly_active_users_change_percent;

insert into public.subscriptions (customer_id, status, monthly_value_usd, renewal_in_days, cancel_at_period_end, available_retention_credit_usd) values
  ('cus_acme_001', 'active', 249, 14, false, 125)
on conflict (customer_id) do update set renewal_in_days = excluded.renewal_in_days, available_retention_credit_usd = excluded.available_retention_credit_usd;

insert into public.support_tickets (id, customer_id, subject, status, priority, opened_days_ago) values
  (1, 'cus_acme_001', 'Duplicate invoice', 'waiting_on_support', 'high', 12),
  (2, 'cus_acme_001', 'Team permissions', 'open', 'normal', 7),
  (3, 'cus_acme_001', 'Usage report export', 'open', 'normal', 4)
on conflict (id) do update set status = excluded.status, priority = excluded.priority, opened_days_ago = excluded.opened_days_ago;

insert into public.approvals (id, customer_id, customer_name, customer_initials, action, description, risk_level, owner_name, status, created_at) values
  ('apr_seed_acme', 'cus_acme_001', 'Acme Inc.', 'AC', 'Send retention email', 'Personalized response with an onboarding call and one-month account credit.', 'High', 'Sarah Chen', 'pending', now() - interval '12 minutes'),
  ('apr_seed_vertex', 'cus_vertex_004', 'Vertex Works', 'VW', 'Create escalation task', 'Escalate duplicate billing issue to Finance with a 24-hour SLA.', 'High', 'Alex Morgan', 'pending', now() - interval '38 minutes'),
  ('apr_seed_pixel', 'cus_pixel_003', 'Pixel Labs', 'PL', 'Send product guidance', 'Share the team permissions guide and offer a 15-minute setup session.', 'Medium', 'Maya Patel', 'pending', now() - interval '1 hour')
on conflict (id) do nothing;
