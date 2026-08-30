# Klue CRM

Rebuilt from scratch as a proper Vite + React + Supabase project, connected
to the same live database (`kluetech-crm`, ref `lxyqyfbpinfzqphuuiki`) —
none of your existing order data is affected.

## What's included in this first version
- Login screen (Supabase Auth — email/password)
- Dark/light mode toggle
- Order pipeline Kanban board (drag orders between Pending → Confirmed →
  Shipped → Delivered / Returned / Cancelled), live-synced across devices
- Automatic inventory decrement on order confirmation (handled at the
  database level, from the earlier SQL migration)

## Not yet included (next pieces to build)
- Cart abandonment recovery
- Order bumps & upsells
- Automated WhatsApp/SMS/email follow-ups
- Expenses tracking & accounting reports
- Telegram order notifications (your existing setup handled this
  separately — reconnect once this is live)

---

## Getting this onto GitHub

If you're uploading via the GitHub website (no terminal needed):
1. Go to https://github.com/Klue-dr/klue-crm
2. Click "Add file" → "Upload files"
3. Drag in every file/folder from this package, **keeping the folder
   structure** (src/, public/ if present, package.json, etc. all at the
   top level of the repo)
4. Commit directly to the `main` branch

If you're comfortable with git/terminal:
```bash
cd klue-crm
git init
git remote add origin https://github.com/Klue-dr/klue-crm.git
git add .
git commit -m "Initial CRM rebuild"
git branch -M main
git push -u origin main
```

## Connecting Netlify to this repo
1. In Netlify, go to your `klue-crm` site → Site configuration →
   Build & deploy
2. Look for an option like "Link repository" or "Change site's repository"
3. Connect it to `Klue-dr/klue-crm`, branch `main`
4. Build command: `npm run build`
5. Publish directory: `dist`

## Environment variables
In Netlify → Site configuration → Environment variables, make sure these
exist (they likely already do from your original setup):
```
VITE_SUPABASE_URL=https://lxyqyfbpinfzqphuuiki.supabase.co
VITE_SUPABASE_ANON_KEY=<your anon key>
```

## Creating a login for yourself
Since this uses Supabase Auth, you'll need at least one user to log in
with:
1. Supabase dashboard → Authentication → Users → Add user
2. Enter an email and password — use this to log into the CRM

## Local testing (optional)
```bash
npm install
cp .env.example .env.local   # then fill in your real anon key
npm run dev
```
