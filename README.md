# Kadam 🏔️ — Discover Nepal through the people who live it

A **destination + creator-economy platform** for Nepal. Locals post stories, food, festivals and skills; tourists discover places, unlock premium cultural content, and book real experiences — and **every action pays a local (they keep 90%)**.

This is a **UI-first prototype** (judge-facing wow). Data is mocked in `lib/mock.ts`; payments are a mock checkout that shows the money-split. Swap in Prisma/SQLite + Auth.js + Khalti/eSewa later.

---

## Run it

Node is reused from `D:\hackathon\.node` (nothing installed system-wide).

**Easiest:** double-click **`start.bat`**, then open **http://localhost:3000**.

**Terminal:**
```powershell
cd D:\kadam
$env:Path = "D:\hackathon\.node;" + $env:Path
npm run dev        # then open http://localhost:3000
```
Stop with Ctrl+C.

---

## Screens (all built)
| Route | What it shows |
|---|---|
| `/` | Home feed — hero, **Discover by vibe**, **Local know-how**, category tabs, mixed content + skill cards (with money-split) |
| `/vibe` | **Vibe Finder** — pick a mood → matching destinations, creators, stories |
| `/explore` | Real **Leaflet/OpenStreetMap** of Nepal + **Near me** (GPS, distance-sorted) |
| `/destination/[slug]` | Destination hub with the 7 category tabs |
| `/post/[id]` | Content detail + **paywall** (teaser → unlock) + money-split + verified reviews |
| `/skill/[id]` | Skill detail + **booking** → verified review unlock |
| `/skills` | Skills marketplace (filter by delivery type) |
| `/creator/[id]` | Creator profile, stars, **Support/tip** + **Top supporters** |
| `/support` | **Preservation projects** (fund with proof) + Top supporters + tip creators |
| `/dashboard` | Creator earnings with **money-split breakdown** by source |
| `/upload` | **Low-literacy creator upload** — big icons, voice prompts, record audio, photo, price stepper |

## How the old trail features were reframed
- **Vibe Finder** → mood-based discovery front-door (`/vibe`).
- **Donations / Preservation Fund** → **Support & patronage** + preservation projects + Top supporters (`/support`, creator pages).
- **Trail Safety** → **Local Know-How** tips (helpful-votes instead of accuracy %).
- **Location notifications** → replaced by the **Near me** feed (`/explore`).

## Tech
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Leaflet/OpenStreetMap · lucide-react.
Mocked: payments, auth, DB (per spec — production targets: Prisma+Postgres, Auth.js, Khalti/eSewa).
We had used mocked data using the leaflet React js

## Wow moments to demo
1. Home hero → **Find your vibe** → pick *Spiritual* → watch destinations/creators re-filter.
2. Open a premium post → **Unlock** → mock checkout shows **"90% goes to the local"** → content reveals.
3. Book a skill → **verified review** form unlocks (only buyers can review).
4. `/upload` → tap **🎙️ Tell a story** → record in your voice → set price → see your **90% split** before publishing.
5. `/dashboard` → creator earnings broken down with the money-split everywhere.
