# TPS Education Cloud API

## One-file frontend deployment

Every frontend request uses `public/runtime-config.js`. For local development,
set its `API_URL` to the local API. After building and uploading the frontend,
change only `dist/runtime-config.js` to the production API URL. No component or
module contains its own API host, and changing this file does not require a new
frontend build.

Database settings are intentionally separate. Configure the `TPS_DB_*`
environment variables on the PHP server; never put database credentials in
`runtime-config.js`.

## Required deployment steps

1. Rotate the database password that existed in the original server archive.
2. Copy `.env.example` values into the hosting environment. Do not upload a
   populated `.env` into a public directory or commit it.
3. Run `composer install --no-dev --optimize-autoloader`.
4. Apply `database/migrations/001_security.sql`.
5. Set `TPS_SUPER_ADMIN_PASSWORD` to a unique password of at least 12
   characters, then create or reset the first Super Administrator:
   `php api/bin/create-super-admin.php --name="Super Admin" --email="admin@example.org"`.
   This role automatically receives every permission and can manage every
   institute; it does not require rows in `user_institutes`.
6. Configure `TPS_ALLOWED_ORIGINS` with the exact production frontend origin.
7. Confirm Apache allows the included `.htaccess` rules.

## Security invariants

- All operational endpoints require an authenticated session.
- Every institute-scoped endpoint validates the authenticated user's access.
- Mutating requests require `X-CSRF-Token`.
- A frontend institute ID is never treated as authorization.
- Database credentials are loaded only from environment variables.
- API exceptions are logged server-side and are not returned to clients.

## Verification

```bash
find . -path './vendor' -prune -o -path './tools' -prune -o \
  -name '*.php' -print0 | xargs -0 -n1 php -l
```
