# Disaster Preparedness and Emergency Response Coordination Platform (DPERCP)

A platform for taking a disaster report from the first message to a coordinated response: report, verify, assign, support, inform. It is the team project for EC5404 at the University of Ruhuna, aimed at a pilot with a DMC district office.

Today the repo holds two parts: an Express API and a React admin dashboard. The mobile app, shared schema package and PostGIS work are not in the repo yet.

## Tech stack

| Part | Stack |
|---|---|
| Backend | Express 5, JavaScript (ESM), Prisma 7 with the `pg` adapter, PostgreSQL, JWT (`jsonwebtoken`) and `bcrypt` for auth, `zod` for request validation, Swagger UI at `/api-docs` |
| Frontend | React 18, Vite 6, Tailwind CSS 4, `react-router-dom` 6, `react-leaflet` / Leaflet for maps, `lucide-react` icons |

## Folder layout

```text
backend/
  index.js, app.js      server start and Express app
  routes/ controllers/ services/ repositories/   one set per feature
  schemas/              zod request schemas
  middleware/           auth, validation, error handling
  prisma/               schema, migrations, seed.js
  data/                 JSON fixtures used by the seed
  docs/openapi.yaml     API description served at /api-docs
  test/                 node:test suites
frontend/
  src/api/              fetch helpers (auth, incidents, shelters)
  src/pages/            one file per dashboard page
  src/components/       shared UI, auth form, route guard, shelter map
  src/layouts/          dashboard shell
```

## Prerequisites

- Node.js 22.12 or newer (taken from the original frontend setup; not pinned in either package.json)
- A running PostgreSQL server and an empty database for the API

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Meaning |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string. Empty in the example file, you must set it. |
| `JWT_SECRET` | Signing secret for access tokens. The API throws if it is missing. |
| `JWT_ACCESS_TTL` | Access token lifetime, default `15m` |
| `REFRESH_TTL_DAYS` | Refresh token lifetime in days, default `7` |
| `CORS_ORIGIN` | Allowed browser origin, `http://localhost:5173` in the example |
| `PORT` | API port, `3000` in the example and the default |

Create the tables and load the fixture data. The Prisma config file is named `prisma7.config.ts`, so pass it explicitly:

```bash
npx prisma generate --config prisma7.config.ts
npx prisma migrate deploy --config prisma7.config.ts
node prisma/seed.js
```

The seed reads `backend/data/*.json` and inserts 3 users, 8 incidents and 5 shelters. Run it again and it updates the same rows.

Start the API:

```bash
npm run dev     # nodemon
npm start       # plain node
```

Swagger UI is at `http://localhost:3000/api-docs`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The dev server runs on `http://localhost:5173`. `npm run build` makes a production build.

| Variable | Meaning |
|---|---|
| `VITE_AUTH_MODE` | `preview` (the example value) or `api`. Anything other than `api` is treated as preview. |
| `VITE_API_BASE_URL` | API address. Without it, `src/api/auth.js` falls back to `http://localhost:3000`, while `incidents.js` and `shelters.js` fall back to `http://localhost:3001`. |

In preview mode the login and registration forms send nothing and no session is created, so the route guard sends you back to `/login` and the dashboard cannot be opened. To use the dashboard, set `VITE_AUTH_MODE=api`, make sure the backend is running, and keep `VITE_API_BASE_URL` set (the example file uses `http://localhost:3000`) so all three API files talk to the same server. The session lives in memory only, so a page reload signs you out.

## Seed accounts

| Email | Role |
|---|---|
| `operator@dpercp.test` | operator |
| `admin@dpercp.test` | admin |
| `field@dpercp.test` | field |

The password is in `backend/data/users.json`. These are development accounts only. Registering through `/auth/register` always creates a `field` user.

## API endpoints

| Method and path | Access | What it does |
|---|---|---|
| `GET /health` | open | status and uptime |
| `POST /auth/register` | open | creates a `field` user, returns tokens and user (201) |
| `POST /auth/login` | open | email and password, returns access token, refresh token and user |
| `POST /auth/refresh` | open, needs refresh token | swaps a refresh token for a new pair |
| `POST /auth/logout` | open, needs refresh token | revokes the refresh token (204) |
| `GET /auth/me` | signed in | current user |
| `GET /incidents` | operator, admin | list, newest first, filter with `?status=` (`new`, `verified`, `assigned`, `resolved`) and `?priority=` (`critical`, `high`, `medium`, `low`) |
| `GET /incidents/:id` | operator, admin | one incident |
| `GET /shelters` | signed in | shelters with capacity and occupancy |

Protected routes expect `Authorization: Bearer <accessToken>`. The full request and response shapes are in `backend/docs/openapi.yaml`.

## Tests

Backend, from `backend/`:

```bash
npm test
```

This runs `node --test` with `.env.test`, which only sets `JWT_SECRET`. The suites that log in or read incidents and shelters (`login`, `authFlow`, `authMiddleware`, `refresh`, `incidents`, `mockData`) go through Prisma, so they need `DATABASE_URL` in `backend/.env` pointing at a migrated and seeded database. `health` and `password` run without one.

The frontend has no automated tests. `frontend/TESTING.md` is a note from the first preview version.

## Current status

Working:

- Backend: registration, login, token refresh and logout, role checks, incident list and detail, shelter list, all backed by PostgreSQL through Prisma.
- Frontend: login and registration pages (English only for now; Sinhala and Tamil are planned), a route guard, the Overview dashboard, the Incidents list and detail pages, and the Shelters page with a map. These read from the API.

Not built yet (placeholder pages only): Tasks, Resources, Volunteers and teams, Notices, News review, Analytics, Users and roles, Hazard types.

Not started: the mobile app, shared Zod package, and PostGIS queries. The Prisma models store coordinates as plain `lat` and `lng` floats. There are no endpoints for creating or updating incidents or shelters.

## Team and workflow

Contributors: Mudeera, Kumara, Himantha, Lakma Erandika, Thehansa.

Work goes through forks. Fork the repo, create a feature branch, and open a pull request into `dev`.
