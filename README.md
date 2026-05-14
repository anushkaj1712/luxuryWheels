# Drive Luxury Wheels

Premium luxury car dealership platform: **Next.js** (frontend) and **Express + Prisma** (backend) in one **npm workspace** monorepo. Run everything with a single dev command.

## Monorepo layout

```
drive-luxury-wheels/
├── frontend/            # Next.js 15 app (deploy root on Vercel)
│   └── vercel.json      # Vercel defaults
├── backend/             # Express API (deploy root on Render)
├── package.json         # Workspaces + scripts (concurrently)
├── render.yaml          # Optional Render blueprint (API service)
├── .env.example         # Copy to `.env` at repo root
└── README.md
```

- **npm workspaces** — `frontend` and `backend` are packages; `npm install` at the repo root installs dependencies for both.
- **concurrently** — runs the frontend and backend dev servers in one terminal with color-coded labels (`frontend` / `backend`).

## Requirements

- **Node.js 20+**
- **PostgreSQL** database (local, [Neon](https://neon.tech), or [Supabase](https://supabase.com))

## Installation

From the repository root:

```bash
npm install
```

## Environment setup

1. Copy the template file to `.env` in the **repository root** (same folder as the root `package.json`):

   ```bash
   copy .env.example .env
   ```

   On macOS/Linux: `cp .env.example .env`

2. Edit `.env` and set at minimum:

   | Variable | Purpose |
   |----------|---------|
   | `DATABASE_URL` | PostgreSQL connection string (required for API + Prisma) |
   | `JWT_SECRET` | Long random string (16+ characters; required) |
   | `NEXT_PUBLIC_API_URL` | Must match the API, e.g. `http://localhost:5000/api` |
   | `PORT` | API port (default **5000**) |
   | `CLIENT_URL` | Browser origin for CORS (local default `http://localhost:3000`; production must be your real `https://` Vercel URL — see deployment section) |

3. Generate the Prisma client and apply migrations (first time / after schema changes):

   ```bash
   npm run prisma:generate -w backend
   npm run prisma:migrate -w backend
   ```

## Run the full application

```bash
npm run dev
```

This starts:

- **Frontend:** [http://localhost:3000](http://localhost:3000) (Next.js)
- **Backend:** [http://localhost:5000](http://localhost:5000) (Express, routes under `/api`)

You do **not** need two terminals for local development.

## Production build

```bash
npm run build
```

Builds the frontend (`next build`) and compiles the backend TypeScript to `backend/dist/`.

For hosted builds that must run Prisma generate first:

```bash
npm run build:production
```

## Production deployment (Vercel + Render + Neon/Supabase)

This stack deploys **without Docker/Kubernetes**: Next.js on Vercel, Express on Render, PostgreSQL on Neon or Supabase.

### Database

1. Create a Neon or Supabase project; copy the **PostgreSQL** URL.
2. Prefer a **pooled** connection string for `DATABASE_URL` on Render.
3. Apply migrations (from your laptop or a Render shell):

   ```bash
   npm run prisma:migrate -w backend
   ```

### Render (API)

1. **Web Service** → connect this repository.
2. **Root Directory:** `backend`
3. **Build:** `npm install && npx prisma generate && npm run build`
4. **Start:** `npm start`
5. **Health check:** `/api/health/live` (see `render.yaml` for a blueprint).

**Required on Render:** `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL` (public `https://` Vercel origin — **not** localhost). Optional: `CORS_ORIGINS` (comma-separated preview URLs), `LOG_LEVEL`, `API_REQUEST_TIMEOUT_MS`, Cloudinary, SMTP, payment keys (see root `.env.example`).

### Vercel (frontend)

1. Import the same repository.
2. **Root Directory:** `frontend`
3. Set **`NEXT_PUBLIC_API_URL`** to your Render URL including `/api`, and **`NEXT_PUBLIC_SITE_URL`** to your canonical `https://` domain (Vercel also provides `VERCEL_URL` for server-side fallbacks).

### CORS

- `CLIENT_URL` must match the browser origin exactly (scheme + host + port).
- Local `localhost` / `127.0.0.1:3000` are allowed only when `NODE_ENV !== "production"` (`backend/src/config/cors.ts`).

### Health endpoints

| Route | Purpose |
|-------|---------|
| `GET /api/health` | Process summary |
| `GET /api/health/live` | Liveness (no DB) |
| `GET /api/health/ready` | DB readiness (`SELECT 1`) |

### Deployment troubleshooting

| Symptom | Likely cause | Fix |
|--------|----------------|-----|
| API exits on boot in production | `CLIENT_URL` is loopback | Set `CLIENT_URL` to your deployed `https://` frontend (`backend/src/config/env.ts`). |
| `/api/health/ready` returns 503 | Database URL / firewall / SSL | Verify `DATABASE_URL`; allow Render outbound IPs if your DB is IP-restricted. |
| Vercel build error about env | Missing `NEXT_PUBLIC_*` | Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL` for Production (Preview as needed). |
| Browser CORS errors | Origin not allow-listed | Fix `CLIENT_URL` / `CORS_ORIGINS` on Render; redeploy API. |
| HTTP 408 from API | Slow handler vs timeout | Raise `API_REQUEST_TIMEOUT_MS` or optimize the route. |

## Production start

```bash
npm start
```

Runs `next start` on port **3000** and the compiled API on **PORT** from `.env` (default **5000**). Set the same variables on your host (e.g. Vercel + Render) as in production `.env`.

## Suggested deployment (simple)

| Piece | Suggested host |
|-------|----------------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [Neon](https://neon.tech) or [Supabase](https://supabase.com) |
| Images | [Cloudinary](https://cloudinary.com) |

Set `NEXT_PUBLIC_API_URL` on the frontend to your public API URL (including `/api`). Set `CLIENT_URL` on the backend to your frontend URL (for CORS).

## Useful workspace commands

| Command | What it does |
|---------|----------------|
| `npm run dev` | Frontend + backend together |
| `npm run build -w frontend` | Build only Next.js |
| `npm run build -w backend` | Compile only API |
| `npm run build:production` | Prisma generate + full monorepo build (CI / release) |

## Troubleshooting

### `EADDRINUSE` / “port already in use”

Something else is using **3000** or **5000**. Either stop that process or change:

- Frontend: `frontend/package.json` scripts `dev` / `start` (`-p` flag).
- Backend: `PORT` in `.env`.

If you change the API port, update `NEXT_PUBLIC_API_URL` so it still points at the correct host and `/api` path.

### API returns CORS errors

The backend allows the origin in `CLIENT_URL` (`backend/src/app.ts`). It must match exactly how you open the site (e.g. `http://127.0.0.1:3000` vs `http://localhost:3000` are different origins).

### “Invalid environment variables” on API startup

`backend/src/config/env.ts` validates env. Common fixes:

- Set `DATABASE_URL` and `JWT_SECRET` in root `.env` or `backend/.env`.
- Ensure `JWT_SECRET` is at least 16 characters.

### Frontend cannot reach the API

- Confirm the API is running (check the `backend` tab in the `concurrently` output).
- `NEXT_PUBLIC_API_URL` must include the `/api` suffix, e.g. `http://localhost:5000/api`.
- Restart `npm run dev` after changing any `NEXT_PUBLIC_*` variable (Next embeds them at startup).

### Prisma errors

Run from repo root:

```bash
npm run prisma:generate -w backend
```

If the schema changed, run migrations:

```bash
npm run prisma:migrate -w backend
```

### `npm install` fails

Delete root `node_modules` and any workspace `node_modules`, remove `package-lock.json` at the root if it is corrupted, then run `npm install` again from the **repository root**.

## Tech stack (intentionally minimal)

**Frontend:** Next.js, TypeScript, Tailwind CSS, Framer Motion, GSAP (sparingly), Radix/ShadCN-style components, Axios, React Hook Form, Zod.

**Backend:** Node.js, Express, Prisma, PostgreSQL, JWT, bcrypt, Multer, Nodemailer; payments via Razorpay / optional Stripe; media via Cloudinary.

**Monorepo:** npm workspaces + concurrently only.
