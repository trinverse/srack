# Vulnerabilities

Tracked from the Supabase security linter. See [remediation docs](https://supabase.com/docs/guides/database/database-linter?lint=0013_rls_disabled_in_public).

## Resolved

All items below were resolved in migration `002_enable_rls_vulnerable_tables.sql`.

| table               | issue                  | level | status   | resolution                                                              |
| ------------------- | ---------------------- | ----- | -------- | ----------------------------------------------------------------------- |
| `menu_settings`     | RLS Disabled in Public | ERROR | RESOLVED | RLS enabled; public read, admin write                                   |
| `discount_codes`    | RLS Disabled in Public | ERROR | RESOLVED | RLS enabled; authenticated read, admin write                            |
| `loyalty_settings`  | RLS Disabled in Public | ERROR | RESOLVED | RLS enabled; authenticated read, admin write                            |
| `audit_logs`        | RLS Disabled in Public | ERROR | RESOLVED | RLS enabled; admin read, authenticated insert, no update/delete         |
| `email_subscribers` | RLS Disabled in Public | ERROR | RESOLVED | RLS enabled; admin read/update/delete, anonymous + authenticated insert |
