# boardgame-bonanza

Web companion for a physical board game. Scan a QR on the board → join or host a realtime session.

## Setup

1. `cp .env.example .env` and fill in your Supabase project URL + anon key.
2. Apply `supabase/migrations/0001_init.sql` in the Supabase SQL editor (or via the CLI).
3. `npm install`
4. `npm run dev` → open `http://localhost:5173/#/b/test-board`

## Deploy

Push to `main`. The GitHub Actions workflow builds and publishes to Pages.
Required repo secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

## Stack

Vite + React + TypeScript, Tailwind, React Router (Hash), Supabase Realtime.
