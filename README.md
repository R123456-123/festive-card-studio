# Festive Card Studio

Festive Card Studio is a React/Vite festive experience beginning with Karwa Chauth 2026. The first release includes a responsive landing page, an accessible video hero, a data-driven upcoming-festivals section, and Supabase-backed early-access collection for the card studio.

## Current product state

The public site is ready for the **Karwa Chauth 2026 v1 release**. It includes a live card studio with personalized cards, social formats, PNG export, WhatsApp sharing fallback, X promotion sharing, and a Supabase-backed early-access list.

## Project structure

```text
festive-card-studio/
├── frontend/          # React + Vite landing page
├── supabase/          # Database schema and RLS policy
└── backend/           # Legacy FastAPI caption endpoint
```

The frontend keeps festival content in [`frontend/src/data/festivals.js`](./frontend/src/data/festivals.js), while the landing experience and reusable sections currently live in [`frontend/src/App.jsx`](./frontend/src/App.jsx). The Karwa Chauth video is bundled from `frontend/videos/` so Vite fingerprints it during production builds. The card studio supports Post, Story, Postcard, and Ticket formats, personalized PNG downloads, clipboard image copy, and WhatsApp sharing with a reliable download-and-attach fallback. The hero includes personalized X promotion artwork sharing.

The 2026 dates currently shown are Karwa Chauth (29 October), Dhanteras (6 November), Diwali (8 November), and Bhai Dooj (11 November). Local observance and moonrise timings can vary by location and tradition.

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** in Supabase.
3. Run [`supabase/waitlist.sql`](./supabase/waitlist.sql).
4. In **Project Settings → API**, copy the project URL and public anon key.
5. Create `frontend\.env` from [`frontend/.env.example`](./frontend/.env.example):

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-key
   ```

The form writes to `public.waitlist_emails`. Row Level Security permits anonymous inserts only; visitors cannot read or export the list from the website. Review submissions in **Supabase → Table Editor → waitlist_emails**.

Never expose a Supabase service-role key, database password, or other secret in the frontend.

## Run locally

```powershell
cd C:\Users\ABC\Desktop\WinterArcher\festive-card-studio
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

The npm scripts at the project root forward to the Vite app in `frontend/`. You can also run the frontend directly with `cd frontend; npm run dev`.

## Production build

```powershell
cd C:\Users\ABC\Desktop\WinterArcher\festive-card-studio
npm run build
npm run preview
```

For Vercel:

- Import the repository.
- Set the project root directory to `frontend`.
- Framework preset: `Vite`.
- Build command: `npm run build`.
- Output directory: `dist`.
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as production environment variables.
- Deploy from the `frontend` directory, or configure the project root as `frontend`; the root npm scripts are intended for local development and root-level builds.

## GitHub publishing

From the project root:

```powershell
git init
git add .
git commit -m "Launch festive waitlist landing page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

The repository intentionally ignores local `.env` files, virtual environments, `node_modules`, and Vite build output. The public Supabase anon key is safe to use in the frontend only with the included RLS policy; never add a service-role key.

## Validation

The frontend has been validated with:

```powershell
npm audit
npm run build
```

The current frontend dependency audit reports zero vulnerabilities when `npm audit` is run from `frontend`.
