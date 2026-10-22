# BrewScope: Project Context

> **Every teammate:** give this file to Claude at the start of your part. Update it at the end of your part.

## 1. The assignment brief (follow it exactly)
> **13. React Dashboard Consuming an API**
> **Build:** A React dashboard with search, cards and a chart that loads data from an API, with loading and error states.
> **Research:** How do useState and useEffect work together for data fetching? Why use components and props? How do you handle loading, errors and empty states?
> **API:** Open Brewery DB · **Docs:** React

**Rule: the ONLY data API is Open Brewery DB.** Map tiles from OpenStreetMap are allowed (they are images, not data). No other data APIs, no API keys, no backend.

## 2. The concept: BrewScope, a World Brewery Atlas
A dashboard that turns Open Brewery DB's ~11,000 breweries in 16 countries into something you can **explore on a map, plan a trip with, and collect like a game**.

| Feature | What it does | Part |
|---|---|---|
| 🔍 Explore | Search (autocomplete), brewery cards, filters, stat cards, loading/error/empty states | 2 |
| 🌍 World view | Live world map with a bubble per country, live world stats, top-countries chart, types donut | 3 |
| 🗺️ Drill-down | World → Country → Region → Brewery, with breadcrumbs, map and charts at each level | 3 |
| 🏠 Details page | Full brewery info, mini map, nearby breweries | 3 |
| 🆚 Compare | Country face-off: counts, type mix, busiest regions, auto insight | 4 |
| 🧭 Brew Trail | Add breweries → shortest visiting order (nearest-neighbour) + distances (Haversine) drawn on the map | 4 |
| 🏅 Brew Passport | Mark visited → stamps + badges (Globetrotter, Type Collector, Continental…) | 4 |
| 🎲 Roulette | "Take me somewhere": random brewery anywhere on Earth | 4 |

**Demo cities with lots of data:** San Diego, Portland, Denver, Berlin, München, Sydney, Melbourne, Seoul, Dublin, Toronto, Singapore. **India has 0 breweries** in this API, so don't demo Indian cities.

## 3. Open Brewery DB API (v1, free, no key)
Base URL: `https://api.openbrewerydb.org/v1`

| Endpoint | Use |
|---|---|
| `GET /breweries?per_page=50&page=1` | List (max per_page = 200) |
| `GET /breweries?by_country=germany` | Filter by country (snake_case) |
| `GET /breweries?by_state=bayern` | Filter by state/region |
| `GET /breweries?by_city=san_diego` | Filter by city |
| `GET /breweries?by_type=micro` | Filter by type |
| `GET /breweries?by_name=stone` | Filter by name |
| `GET /breweries?by_dist=lat,lng` | Sort by distance from a point |
| `GET /breweries/search?query=dog` | Full-text search |
| `GET /breweries/autocomplete?query=dog` | Fast suggestions (id + name only) |
| `GET /breweries/{id}` | One brewery |
| `GET /breweries/random?size=1` | Random brewery |
| `GET /breweries/meta?by_country=germany` | **Counts:** `{ total, by_state, by_type, by_country }`. Use for stats and charts without downloading every brewery. Accepts the same filters. |

Brewery object fields: `id, name, brewery_type, address_1, city, state_province, postal_code, country, longitude, latitude, phone, website_url, state, street`.
Notes: `latitude`/`longitude` are strings and can be null; `phone`/`website_url` can be null; there can be odd values (e.g. a state spelled "MIssouri").

## 4. Tech stack
- Vite + React 18, React Router v6, CSS Modules
- Recharts (charts, added in Part 3)
- Leaflet + react-leaflet with OpenStreetMap tiles (maps, added in Part 3)
- localStorage for theme, trail, passport and favourites
- GitHub (protected `main`, PRs) + Vercel (auto-deploy from `main`)

## 5. Folder structure
```
brewscope/
  index.html            # fonts, theme set before React loads (no flash)
  vercel.json           # SPA rewrite so /explore etc. work on refresh
  PROJECT_CONTEXT.md    # this file
  public/favicon.svg
  src/
    main.jsx            # BrowserRouter + ThemeProvider
    App.jsx             # all routes
    index.css           # DESIGN TOKENS + shared classes (.card .grid .stack .btn .btn-ghost .badge .skeleton .muted)
    constants/breweryTypes.js  # BREWERY_TYPES (label + colour), getTypeInfo(), COUNTRIES list
    context/ThemeContext.jsx   # ThemeProvider, useTheme()  { theme, toggleTheme }
    components/
      Layout.jsx        # Navbar + <Outlet/> + Footer, scroll-to-top
      Navbar.jsx        # links + theme toggle + mobile menu
      Footer.jsx
      PageHeader.jsx    # <PageHeader eyebrow title subtitle actions/>  use on every page
      ComingSoon.jsx    # placeholder; delete usages as features land
    pages/
      World.jsx         # /                       (hero + country grid; Part 3 adds map/stats/charts)
      Explore.jsx       # /explore                (Part 2)
      Country.jsx       # /country/:country[/:region] (Part 3)
      Brewery.jsx       # /brewery/:id            (Part 3)
      Compare.jsx       # /compare                (Part 4)
      Trail.jsx         # /trail                  (Part 4)
      Passport.jsx      # /passport               (Part 4)
      About.jsx         # /about                  (Part 4 completes)
      NotFound.jsx
```
Planned folders: `src/api/` (Part 2), `src/hooks/` (Part 2), `src/utils/` (Parts 2–4), `src/context/` for Trail/Passport (Part 4).

## 6. Conventions (every part must follow)
- Functional components + hooks. One component per file. Component styles in `Name.module.css`.
- **Only use CSS variables from `index.css`** (`--surface`, `--surface-2`, `--text`, `--text-muted`, `--border`, `--brand`, `--brand-soft`, `--on-brand`, `--link`, `--success`, `--warning`, `--danger`, `--type-*`, `--radius`, `--shadow`). Never hard-code colours, so dark mode keeps working.
- Brewery type colours/labels come from `constants/breweryTypes.js`.
- Every page starts with `<PageHeader />`.
- Fetch logic lives in `src/api/` and hooks; components receive data via props. Don't fetch the same thing twice.
- Every data view needs **loading** (skeleton), **error** (message + Try again) and **empty** states.
- Must work at phone width (no horizontal scroll) and in both themes.
- Don't break or rewrite other parts' work; extend it.

## 7. Git workflow (IMPORTANT)
- `main` is protected: changes only via Pull Request, 1 approval from a teammate.
- Each part: `git checkout main` → `git pull` → `git checkout -b part-N` → build → test → **you** commit & push → PR into `main` → teammate approves → merge.
- **Claude must NOT commit, push or open PRs.** Each person commits from their own computer so GitHub credits them.
- Run Claude Code **locally** on your own folder (desktop app Code tab or VS Code), not the cloud/GitHub mode.

## 8. Progress
- [x] **Part 1 (Person 1): Foundation.** Vite, routing (9 routes), Layout, Navbar with mobile menu + theme toggle, Footer, PageHeader, ComingSoon, design tokens (light + dark), brewery type constants, country list, World hero + country grid, vercel.json.
- [ ] **Part 2 (Person 2): Explore (meets the brief by itself).** `src/api/breweries.js`, `useFetch`, `useDebounce`, search with autocomplete, BreweryCard, filters, StatCards, loading/error/empty states, pagination or "load more".
- [ ] **Part 3 (Person 3): Atlas.** Recharts + Leaflet. Live World view (map bubbles, world stats via meta, charts), Country/Region drill-down with breadcrumbs, Brewery details page with mini map + nearby.
- [ ] **Part 4 (Person 4): Unique features + delivery.** Compare, Brew Trail (nearest-neighbour + Haversine), Passport + badges, Roulette, About (team + research), README with **Research section**, GitHub Actions CI, screenshots.

## 9. Next task
**Part 2 (Person 2).** See Progress above.
