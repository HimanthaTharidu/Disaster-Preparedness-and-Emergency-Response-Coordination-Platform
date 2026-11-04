# DPERCP authentication frontend

React + Vite + TypeScript login and registration pages based on the supplied DPERCP screenshot. No backend, database, or real authentication is included. The login card preserves the screenshot's navy button, pale background, border, typography hierarchy and spacing; registration uses the same visual system.

## Run locally in VS Code

Install Node.js 22.12 or newer (Node 24 LTS is suitable), then extract this folder and open it in VS Code.

```bash
npm install
npm run dev
```

Open the address printed in the terminal, normally `http://localhost:5173`.

- Login: `http://localhost:5173/#/login`
- Registration: `http://localhost:5173/#/register`
- Production check: `npm run build`

Both screens work without a backend in the default **frontend preview** mode. Submitting valid data shows an explicit preview notice: it does not send data, save credentials, create an account, or sign anybody in. No password or access token is stored in browser storage.

## Files

```text
src/
  App.tsx          Login/registration screens, navigation and form validation
  styles.css       Responsive layout and screenshot styling
  locales.ts       English, Sinhala and Tamil interface messages
  api/auth.ts      Types and the replaceable backend API adapter
  main.tsx         React entry point
```

The login screen adds a small password toggle, registration link and preview badge to the supplied reference. The registration screen asks for full name, email, phone, password and password confirmation. English, Sinhala and Tamil are included; have native speakers review translations before production.

## Connect your teammate's backend

The following URLs and payloads are **a proposed contract**, not verified existing endpoints. Agree on them with your teammate and edit `src/api/auth.ts` if their implementation differs.

Copy `.env.example` to `.env.local`, then set:

```dotenv
VITE_AUTH_MODE=api
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Restart `npm run dev` after changing environment variables. Variables prefixed `VITE_` are public client configuration; never put passwords, database URLs, signing secrets or private API keys in them.

### Sign in

`POST /auth/login`

```json
{
  "identifier": "name@dmc.gov.lk",
  "password": "user-supplied-password",
  "preferred_language": "en"
}
```

The identifier can be an email or phone number. The adapter expects a successful HTTP response and cookie-based sessions (`credentials: 'include'`). It does not parse or persist a token. If the backend uses a bearer-token contract, coordinate a memory-based session provider with your teammate and adapt this layer.

The current success handler displays a confirmation. When integrating into the real app, replace that branch in `App.tsx` with your authenticated session initialization and dashboard route. A UI message alone is not an authenticated session. If adding an auth check, the backend must confirm the cookie/session.

### Staff registration request

`POST /auth/register`

```json
{
  "full_name": "Example Staff Member",
  "email": "name@dmc.gov.lk",
  "phone": "0771234567",
  "password": "user-supplied-password",
  "preferred_language": "en"
}
```

`confirm` is frontend-only and is not sent. There is deliberately no role selector or role field. Staff approval is a proposed workflow because the supplied screenshot says "Staff only"; confirm it with the project team. The backend should own approval, role assignment, password hashing, validation, rate limits, CSRF protection where applicable, and access checks. This page does not implement those policies.

The frontend currently requires both email and phone and uses a minimum password length of 8. Update these rules to match the agreed backend policy. Client-side validation helps users; it does not replace server-side validation.

### Response handling

- Any `2xx`: display the submitted/success state; no JSON response body is required by this adapter.
- `401` / `403`: display a sign-in/access rejection message.
- `409`: display an existing-account message.
- Other errors, including `400`, `422`, `429` and `5xx`: display a generic request failure. Extend typed error handling after agreeing on a backend response format.
- Network failure and a 15-second timeout have separate messages.

For cookie sessions across origins, the backend must explicitly allow the frontend origin and credentialed CORS. Configure HTTPS and cookie attributes for your actual deployment.

## Add to the shared project

If the existing web project already uses React/Vite, do **not** replace its `package.json` or `App.tsx` blindly. Copy the screens and styles into your team's feature structure, connect them to its router, and reuse its session and translation providers. The `#/login` and `#/register` navigation is a self-contained demo convenience and can be replaced with React Router routes.

## Documentation references

- https://react.dev/reference/react-dom/components/input
- https://vite.dev/guide/env-and-mode
