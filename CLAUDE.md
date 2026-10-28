# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

donkey horse is a minimal event aggregator (live at https://donkeyhorse.boo). It's an npm workspaces monorepo: `packages/fe` (React + Vite + TypeScript + Tailwind, package name `frontend`), `packages/be` (Express 5 + PostgreSQL, plain CommonJS JavaScript, package name `backend`), `packages/migrations` (node-pg-migrate with plain SQL files).

## Commands

```bash
npm install                  # from the root, installs all workspaces
npm run dev                  # fe (vite) + be (node server.js) together
npm run dev:fe / dev:be      # one side only
npm run build                # frontend only (tsc -b && vite build); the backend has no build step
npm run lint --workspace=frontend
DATABASE_URL=... npm run migrate:up --workspace=packages/migrations
npm audit                    # check dependencies after any upgrade
docker compose up -d         # full stack: postgres + backend + nginx frontend
```

- There is no test suite. Verify backend changes by running the server against a throwaway postgres (`docker run postgres:15-alpine`), applying migrations, and exercising the API with curl.
- Local env: `packages/fe/.env` needs `VITE_API_BASE_URL`; `packages/be/.env` needs `DATABASE_URL`, `JWT_SECRET` (≥32 chars, the server exits otherwise), `CORS_ORIGIN`, `FRONTEND_URL`, SMTP `EMAIL_*`. The README lists them all. dotenv is only loaded when `NODE_ENV !== "production"`.

## Architecture

- **Auth**: stateless HS256 JWT (default 7d) stored in the browser's `localStorage`, sent as `Authorization: Bearer`. `be/middlewares/auth-middleware.js` verifies the signature and then checks `users.token_version` in the DB. A password reset bumps it, revoking every existing session (a missing claim counts as version 0). Any change to the token payload must keep `signToken` in `be/auth/auth.js` and the middleware in sync.
- **No roles**: every logged-in user is effectively an admin (can manage all events, create invites, register users). Public signup only works through a single-use invite code (`invitelinks`, valid 7 days, `INVITE_VALIDITY` in `auth/auth.js`), consumed atomically inside the registration transaction.
- **First user**: `be/db/initDb.js` seeds an `admin` user on boot when the users table is empty (`ADMIN_EMAIL`, `ADMIN_PASSWORD` or a generated password printed to the logs).
- **Password reset**: random token emailed via nodemailer, only its sha256 is stored, expiry is a ms timestamp in `reset_password_expires`. Responses are identical whether the email exists or not, and login always runs bcrypt, to prevent user enumeration. Keep it that way.
- **Dates**: the pg `DATE` parser is overridden in `be/db/database.js` to return raw `YYYY-MM-DD` strings; the frontend formats them by string slicing, never through `Date`, so dates don't shift with timezone.
- **Backend security layers** (`be/server.js`): helmet, CORS allow-list from `CORS_ORIGIN`, 100kb JSON limit, rate limit (20 per 15 min) on login/forgot/update-password/register-with-code. Set `TRUST_PROXY` to the number of proxies in front, or the limiter treats all clients as one IP.
- **Frontend**: `AuthProvider` lives in `contexts/AuthContext.tsx` while the context object and `useAuth` live in `contexts/useAuth.ts` (the react-refresh lint rule forbids non-component exports next to a component). `api/methods.ts` wraps fetch (`authenticatedFetch` clears the token and redirects to `/login` on 401). Data fetching uses TanStack Query; routes are in `app/routes.tsx` with `ProtectedRoute` for logged-in pages; features live in `src/features/<name>/`.
- **Frontend serving**: built into an nginx image (`fe/nginx.conf`) that sets a strict CSP. `add_header` in a `location` block drops server-level headers, so security headers are repeated there; edit both copies. `VITE_API_BASE_URL` is baked in at image build time.

## Migrations

- Plain SQL in `packages/migrations/migrations/`, numbered `NNN_description.sql`, with `-- Up Migration` / `-- Down Migration` sections. `check-order` is on, so never renumber or edit an applied migration; add a new one.
- The backend container runs `migrate:up` before starting the server, so a migration ships together with the code that needs it.

## Release

Publishing a GitHub release triggers `.github/workflows/build-and-publish.yml`: it sets the tag as the version in every package.json, builds and pushes `gnmrschnzs/donkeyhorse-fe` / `-be` to Docker Hub, then commits the version bump to `main`. Don't bump versions by hand.

## Conventions

- Comments, UI copy and error messages are lowercase English; some log messages are in Italian. Match the surrounding code.
- The backend isn't Prettier-formatted; don't reformat whole files, keep diffs to the lines you change.
- Backend input validation is hand-written in each route (`validateEvent` in `routes/events.js`, `createUser` in `auth/auth.js`); always parameterize SQL.
- `.claude/agents/quality-guardian.md` is a review subagent for code quality and OWASP security checks; use it after significant changes.
- Before opening a PR: run `npm run lint --workspace=frontend` and `npm run build`, run quality-guardian on the diff, then open it with `gh pr create --base main`.
- Commit messages must not include a `Co-Authored-By: Claude ...` trailer.
