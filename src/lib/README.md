# Library Layer

Utility modules that are safe to import from both server and client code live in `src/lib`. Currently the directory focuses on database access but can grow to encompass shared helpers.

## Database Pool (`db.ts`)
- Wraps `pg.Pool` and reads the `DATABASE_URL` environment variable.
- Exported singleton avoids creating multiple connections across hot reloads or serverless invocations.
- Intended for server-side contexts (API routes, server components). Avoid importing directly into client components.

### Environment Requirements
- `DATABASE_URL` must be a full Postgres connection string (e.g. `postgres://user:pass@host:port/db`).
- When running locally, verify the database allows SSL/plaintext depending on driver requirements.

### Usage Patterns
- Use `const result = await pool.query(sql, params)` inside API routes.
- Always prefer parameterized queries to protect against SQL injection.
- Handle and log errors server-side; return sanitized messages to clients.

## Future Utilities
- Consider adding data mappers or repositories to keep SQL statements DRY.
- Shared validation, formatting, or feature toggles can also live here to keep components slim.
