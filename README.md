# Meet Anime

## See it live at https://meet-anime-next.vercel.app/

## Yeah, I love anime.
And I found out that there is an (unofficial but functional) Jikan API for MyAnimeList.
So I created this small tech demo for browsing anime data.
Meet Anime is a Next.js (App Router) + TypeScript web app focused on browsing anime and characters with fast filtering, sorting, and “load more” pagination.

## Design
I used a neutral color scheme with subtle pastel accents that allow the images to stand out.  
The quality of images and richness of texts may vary piece to piece, but that's not something I can influence.  
Please direct any complaints to MyAnimeList :)

## What’s inside (high level)

### Tech stack
- Next.js 16 (App Router) + React 19
- TypeScript (strict mode enabled)
- Tailwind CSS v4 (via PostCSS)
- ESLint (Next.js core-web-vitals + TypeScript rules)
- SVG as React components via SVGR (`import Icon from './icon.svg'`)
- UI building blocks: Headless UI (Combobox) + Floating UI (positioning)



### App sections / pages
- Home: “Top Twenty Anime” grid
- Genres: genre picker + sorting + search, with incremental “load more”
- Current season: seasonal list with “load more”
- Characters: sorting + search, with “load more”
- Detail routes exist under `/anime/[id]` and `/characters/[id]`

### Data layer
- API wrapper functions live in `src/lib/api/*` (top anime, genres, season-now, characters, detail endpoints, etc.)
- UI types are defined in `src/types/*` to keep components strongly typed

### Images
- Remote images are allowed from `https://cdn.myanimelist.net` (configured in `next.config.ts`)

## Requirements
- Node.js (latest LTS recommended)
- npm (this repo includes `package-lock.json`)

## Getting started (local)
1) Install dependencies: `npm install`
2) Start the dev server: `npm run dev`
3) Open: http://localhost:3000

## Useful commands
- Dev server: `npm run dev`
- Production build: `npm run build`
- Run production server (after build): `npm run start`
- Lint: `npm run lint`

## Project structure (where to look)
- `src/app/` — routes, pages, and route handlers (App Router)
- `src/components/` — reusable UI components (cards, selects, overlays, navigation)
- `src/lib/api/` — data fetching functions (server-friendly)
- `src/types/` — shared TypeScript types
- `src/assets/` — CSS + SVG icons

## Environment variables
If you need environment variables, create `.env.local` (do not commit it). If you expose something to the browser, it must start with `NEXT_PUBLIC_`. Use placeholders in docs, e.g. `NEXT_PUBLIC_API_BASE_URL=https://example.com`.

## Notes about “smart” Characters backend
The Characters page uses a backend service that may scan multiple Jikan pages to collect a clean set of results:
- filters out “noise” names
- validates character image URLs with a capped budget
- adds a small delay between upstream requests  

Jikan can rate-limit requests. The app uses caching where appropriate, but you may still hit limits during rapid testing.

If you want it faster, tune the constants in the smart service (scan budget, delay, image checks).

## Notes / nice touches in the UI
- Genre selection is built with Headless UI’s Combobox and uses Floating UI for proper dropdown positioning
- The genre dropdown width is auto-sized based on the longest option label for a cleaner layout
- List pages are designed around incremental pagination (“load more”) rather than full reloads
