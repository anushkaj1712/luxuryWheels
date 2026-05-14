# Drive Luxury Wheels

Premium luxury car dealership platform: **Next.js** (frontend) and **Express + Prisma** (backend) in one **npm workspace** monorepo. Run everything with a single dev command.

## Monorepo layout

```
drive-luxury-wheels/
├── frontend/          # Next.js 15, TypeScript, Tailwind, Framer Motion, ShadCN-style UI
├── backend/           # Express API, Prisma, PostgreSQL, JWT, uploads, email
├── package.json       # Workspaces + scripts (concurrently)
├── .env.example       # Copy to `.env` at repo root — one place for local variables
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
   | `CLIENT_URL` | Browser origin for CORS (default `http://localhost:3002`) |

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

- **Frontend:** [http://localhost:3002](http://localhost:3002) (Next.js)
- **Backend:** [http://localhost:5000](http://localhost:5000) (Express, routes under `/api`)

You do **not** need two terminals for local development.

## Production build

```bash
npm run build
```

Builds the frontend (`next build`) and compiles the backend TypeScript to `backend/dist/`.

## Production start

```bash
npm start
```

Runs `next start` on port **3002** and the compiled API on **PORT** from `.env` (default **5000**). Set the same variables on your host (e.g. Vercel + Render) as in production `.env`.

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
| `npm run prisma:studio -w backend` | Prisma Studio |

## Troubleshooting

### `EADDRINUSE` / “port already in use”

Something else is using **3002** or **5000**. Either stop that process or change:

- Frontend: `frontend/package.json` scripts `dev` / `start` (`-p` flag).
- Backend: `PORT` in `.env`.

If you change the API port, update `NEXT_PUBLIC_API_URL` so it still points at the correct host and `/api` path.

### API returns CORS errors

The backend allows the origin in `CLIENT_URL` (`backend/src/app.ts`). It must match exactly how you open the site (e.g. `http://127.0.0.1:3002` vs `http://localhost:3002` are different origins).

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
