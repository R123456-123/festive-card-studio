# Festive Card Studio

Festive Card Studio is a polished React/Vite waitlist landing page for a future festive card experience. It uses a supplied artwork background, a responsive landing page, a rotating multilingual brand line, and Supabase-backed email collection.

## Current product state

The public site is intentionally in **waitlist mode**. The card maker and other product surfaces are disabled while the launch list is collected.

## Project structure

```text
festive-card-studio/
├── frontend/          # React + Vite landing page
├── supabase/          # Database schema and RLS policy
└── backend/           # Legacy FastAPI caption endpoint
```

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
cd C:\Users\ABC\Desktop\WinterArcher\festive-card-studio\frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Production build

```powershell
cd C:\Users\ABC\Desktop\WinterArcher\festive-card-studio\frontend
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

The repository intentionally ignores local `.env` files, virtual environments, `node_modules`, and Vite build output.

## Validation

The frontend has been validated with:

```powershell
npm audit
npm run build
```

The current frontend dependency audit reports zero vulnerabilities.
