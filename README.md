# Disaster Preparedness and Emergency Response Coordination Platform

A web and mobile platform for taking a disaster report from the first message to a coordinated response: report, verify, assign, support, inform. Built for the EC5404 Software Project at the University of Ruhuna, aimed at a pilot with a DMC district office.

## Layout

| Folder | What is in it |
|---|---|
| `backend/` | Express API (JavaScript, ESM) |
| `web/` | Admin dashboard (React, Vite, Tailwind), not started |
| `packages/shared/` | Zod schemas used by the API and the clients, not started |
| `docs/` | Notes and decision records, not started |

## Run the backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
npm test
```

The API runs on mock data for now (`backend/data`). Repositories hide where the data comes from, so Prisma and PostGIS can replace them later without touching routes.

## Endpoints

| Method and path | Who | What |
|---|---|---|
| `GET /health` | anyone | liveness check |
| `POST /auth/login` | anyone | email and password, returns access and refresh tokens |
| `POST /auth/refresh` | anyone with a refresh token | swaps it for a new pair (single use) |
| `POST /auth/logout` | anyone with a refresh token | revokes the refresh token |
| `GET /auth/me` | signed in | current user |
| `GET /incidents`, `GET /incidents/:id` | operator, admin | queue and detail, filter with `?status=` and `?priority=` |
| `GET /shelters` | signed in | shelters with capacity |

Mock users: `operator@dpercp.test`, `admin@dpercp.test`, `field@dpercp.test`. The seed password is in `backend/data/users.json`. These are fake accounts for development only.

## Branches

`main` holds stable work and `develop` is where branches are merged. Work happens on `feature/DPR-xx` branches and is squash-merged into `develop`.
