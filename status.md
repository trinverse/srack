# Completed Tasks

## 2026-02-18

- **fix: Enable RLS on 5 vulnerable public tables** — Enabled Row Level Security on `menu_settings`, `discount_codes`, `loyalty_settings`, `audit_logs`, and `email_subscribers`. Created `is_admin()` helper function and appropriate read/write policies per table. Migration applied via Supabase SQL Editor and verified with `supabase db lint`. Commit: `97d6710`.
