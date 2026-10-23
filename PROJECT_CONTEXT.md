# BrewScope: Project Context

> **Every teammate:** give this file to Claude at the start of your part. Update it at the end of your part.

## 1. The assignment brief (follow it exactly)
> **13. React Dashboard Consuming an API**
> **Build:** A React dashboard with search, cards and a chart that loads data from an API, with loading and error states.
> **Research:** How do useState and useEffect work together for data fetching? Why use components and props? How do you handle loading, errors and empty states?
> **API:** Open Brewery DB · **Docs:** React

**Rule: the ONLY data API is Open Brewery DB.** Map tiles from OpenStreetMap are allowed (they are images, not data): OpenStreetMap tiles in both themes; dark mode darkens them with a CSS filter, no API key. No other data APIs, no API keys, no backend.

## 2. The concept: BrewScope, a World Brewery Atlas
A dashboard that turns Open Brewery DB's ~11,959 breweries in 23 countries into something you can **explore on a map, plan a trip with, and collect like a game**.

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
| `GET /breweries?by_type=micro,brewpub` | Filter by one or multiple comma-separated types; list filters combine |
| `GET /breweries?by_name=stone` | Filter by name |
| `GET /breweries?by_dist=lat,lng` | Sort by distance from a point |
| `GET /breweries/search?query=dog&page=1&per_page=24` | Full-text search; ignores country/type filters, so apply those on the client. Also supplies suggestions with per_page=8. |
| `GET /breweries/{id}` | One brewery; unknown IDs return 404 |
| `GET /breweries/random?size=1` | Random brewery |
| `GET /breweries/meta?by_country=germany` | **Counts:** `{ total, by_state, by_type, by_country }`. Use for stats and charts without downloading every brewery. Accepts the same filters. |

Brewery object fields: `id, name, brewery_type, address_1, city, state_province, postal_code, country, longitude, latitude, phone, website_url, state, street`.
Notes (verified Oct 2026): world meta = 11,959 breweries in 23 countries. Meta counts are numbers keyed by display names (by_country `"New Zealand"`, by_state `"Baden-Württemberg"`); pass region names exactly (URL-encoded) to by_state, spaces/accents work. by_type also includes `beergarden` and `cidery`. by_dist results can include the brewery itself (exclude by id). ~98% of records have coordinates. no key; localhost CORS works. `per_page` must be clamped to 1–200; larger values return HTML. The autocomplete endpoint is broken (HTML redirect); use search for suggestions. Reject non-JSON responses. Coordinates may be numbers, strings or null; normalize to Number or null. Address, phone, website and state_province can be null. Empty strings normalize to null, and location joins city/state/country without duplicates. State spelling can vary.

## 4. Tech stack
- Vite + React 18, React Router v6, CSS Modules
- Recharts 2 (`recharts@^2.15.4`, charts, added in Part 3)
- Leaflet 1.9 + react-leaflet 4 (`leaflet@^1.9.4`, `react-leaflet@^4.2.1`; v5 needs React 19) with OpenStreetMap tiles in both themes; dark mode darkens them with a CSS filter, no API key (maps, added in Part 3)
- localStorage for theme (`brewscope-theme`), trail (`brewscope-trail`) and passport (`brewscope-visited`)
- GitHub Actions CI (`.github/workflows/ci.yml`, added in Part 4)
- GitHub (protected `main`, PRs) + Vercel (auto-deploy from `main`)

## 5. Folder structure
```
brewscope/
  index.html            # fonts, theme set before React loads (no flash)
  vercel.json           # SPA rewrite so /explore etc. work on refresh
  PROJECT_CONTEXT.md    # this file
  public/favicon.svg
  src/
    main.jsx            # BrowserRouter + ThemeProvider + CollectionProvider
    App.jsx             # all routes
    index.css           # DESIGN TOKENS + shared classes (.card .grid .stack .btn .btn-ghost .badge .skeleton .muted)
    constants/breweryTypes.js  # BREWERY_TYPES (13 types, label + colour), getTypeInfo(), COUNTRIES (23, with center + zoom)
    api/breweries.js    # Part 2: all Open Brewery DB requests
    hooks/              # useFetch, useDebounce (Part 2), useThemeColors (Part 3)
    utils/atlas.js      # Part 3: pure helpers for the Atlas pages
    utils/geo.js        # Part 4: haversineKm, planRoute, routeDistance (+ hasCoords, formatKm, formatPlace)
    utils/badges.js     # Part 4: BADGES, computeBadges, distinctCount
    context/ThemeContext.jsx   # ThemeProvider, useTheme()  { theme, toggleTheme }
    context/CollectionContext.jsx  # Part 4: CollectionProvider, useCollection()  trail + visited
    components/
      Layout.jsx        # Navbar + <Outlet/> + Footer, scroll-to-top
      Navbar.jsx        # links + theme toggle + mobile menu
      Footer.jsx
      PageHeader.jsx    # <PageHeader eyebrow title subtitle actions/>  use on every page
      ComingSoon.jsx    # placeholder; no longer used by any page after Part 4
      TrailMap.jsx      # Part 4: route map (numbered dots + Polyline)
      RouletteButton.jsx  # Part 4: "Take me somewhere" random brewery
    pages/
      World.jsx         # /                       (hero, live stats, bubble map, charts, country grid)
      Atlas.module.css  # shared layout for World / Country / Brewery
      Explore.jsx       # /explore                (Part 2)
      Country.jsx       # /country/:country[/:region] (Part 3)
      Brewery.jsx       # /brewery/:id            (Part 3) + Brewery.module.css
      Compare.jsx       # /compare?a=&b=          (Part 4) + Compare.module.css
      Trail.jsx         # /trail                  (Part 4) + Trail.module.css
      Passport.jsx      # /passport               (Part 4) + Passport.module.css
      About.jsx         # /about                  (Part 4) + About.module.css
      NotFound.jsx
  .github/workflows/ci.yml  # Part 4: GitHub Actions build check (PRs + pushes to main)
  README.md             # public overview: features, run locally, Brew Trail, Research, credits
```

## 6. Conventions (every part must follow)
- Functional components + hooks. One component per file. Component styles in `Name.module.css`.
- **Only use CSS variables from `index.css`** (`--surface`, `--surface-2`, `--text`, `--text-muted`, `--border`, `--brand`, `--brand-soft`, `--on-brand`, `--link`, `--success`, `--warning`, `--danger`, `--type-*`, `--radius`, `--shadow`). Never hard-code colours, so dark mode keeps working. When JavaScript needs a real colour (Recharts, Leaflet), use `useThemeColors()`.
- Global classes (`.btn`, `.card`…) inside a CSS Module must be written `:global(.btn)`.
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
- [x] **Part 2 (Person 2 — Ryan): Explore (meets the brief by itself).** `src/api/breweries.js`, `useFetch`, `useDebounce`, search with autocomplete, BreweryCard, filters, StatCards, loading/error/empty states, pagination or "load more".
- [x] **Part 3 (Person 3 — Arham): Atlas.** Recharts + Leaflet. Live World view (bubble map, world stats via meta, top-countries bar chart, types donut), Country/Region drill-down with breadcrumbs, Brewery details page with mini map + nearby. See section 11.
- [x] **Part 4 (Person 4 — Yugraj): Unique features + delivery.** Compare, Brew Trail (nearest-neighbour + Haversine), Passport + badges, Roulette, About (team + research), README with **Research section**, GitHub Actions CI, screenshot placeholders. See section 12.

**🎉 The project is complete.** All four parts are merged; the brief (search, cards, chart, API, loading/error/empty states, research answers) is fully covered.

## 9. Next task
None: the project is complete. Optional polish only: add real screenshots to `docs/` (world.png, explore.png, country.png, trail.png) for the README, and optionally lazy-load pages with `React.lazy` to remove the >500 kB chunk warning.

<details><summary>Original Part 4 brief (done)</summary>

**Part 4 (Person 4): Unique features + delivery.** Compare, Brew Trail, Passport + badges, Roulette, About, README Research section, CI, screenshots. Reuse the Part 3 pieces in section 11: `TypeDonutChart`/`BarRankChart`/`ChartCard` for Compare, `BreweryMap` for the Trail map (add the route as a Polyline child or new component), and wire up the two disabled buttons on `Brewery.jsx` ("Add to Trail", "Mark as visited").

</details>

## 10. Part 2 handoff: files and reusable interfaces

No packages added. Existing Part 1 files changed only: Explore.jsx, World.jsx (hero search only), and this document. Every new component has its own matching CSS Module.

### API: src/api/breweries.js
- Internal request(path, params, signal): URLSearchParams, skips empty values, clamps per_page to 1–200, forwards AbortSignal, checks HTTP status and JSON content type. Friendly Error objects have status (0 for connection failures).
- normalizeBrewery(brewery): preserves fields, converts blank strings to null, coordinates to finite numbers/null, and adds deduplicated location.
- listBreweries(filters = {}, { page = 1, perPage = 24, signal } = {}): normalized array. Filters use API keys (by_city, by_country, by_state, by_type, by_name, by_dist); by_type can be a comma-separated string or array.
- searchBreweries(query, { page = 1, perPage = 24, signal } = {}): normalized full-text results; filter these on the client.
- suggestBreweries(query, { signal } = {}): empty below two characters; otherwise search with perPage 8, returning at most eight { id, name, city, country } records.
- getBrewery(id, { signal } = {}): one normalized record; throws on 404.
- getRandomBrewery({ signal } = {}): one normalized record, or null for an empty response.
- getBreweryMeta(filters = {}, { signal } = {}): metadata { total, by_state, by_type, by_country }; reuse for Part 3 charts.

### Hooks
- src/hooks/useFetch.js: default useFetch(asyncFn, deps) returns { data, loading, error, retry }. asyncFn receives AbortSignal. useState stores the UI state; useEffect starts work on dependency/retry changes and aborts during cleanup. Aborted/stale work cannot update state. Pass every request input in deps. Data clears on a new request.
- src/hooks/useDebounce.js: default useDebounce(value, delay = 300), with timer cleanup.

### Components (src/components/, matching .module.css for each)
- SearchBar.jsx: { query = '', onSearch(query) }. Controlled URL value initializes a local draft; 300ms suggestions, minimum two characters, combobox/listbox ARIA, arrows/Enter/Escape, outside-click and blur dismissal. Suggestion opens /brewery/:id; full search calls onSearch.
- FilterBar.jsx: { type, country, hideClosed, onChange(key, value), onClear }. Types from BREWERY_TYPES, country values from COUNTRIES slugs. Toggle emits string true/false for the URL.
- StatCard.jsx: { label, value, hint, icon }; hint/icon optional. Stats describe loaded, visible results, never global API totals.
- TypeBadge.jsx: { type }; getTypeInfo label/colour mixed with theme surface/text for readable soft styling.
- BreweryCard.jsx: { brewery }; normalized record, stretched details link with separate phone and validated HTTP(S) website links, no nested anchors. Missing address/location has fallback text.
- BreweryCardSkeleton.jsx: no props; decorative loading placeholder.
- EmptyState.jsx: { title, message, action }; action is an optional React node.
- ErrorState.jsx: { message, onRetry }; optional retry callback, alert semantics.
- ExploreResults.jsx: { query, type, country, hideClosed, onClear }. Keyed by URL inputs to reset pagination and cancel stale requests. Loads 24 raw records per page, appends/deduplicates by ID, filters visible results on client, and preserves cards during subsequent loading/errors. Retry repeats the failed page. Load more depends on raw page length, including when filtered results are empty. Distinct states/regions replace countries when one country is represented.
- HeroSearch.module.css: isolated compact World hero form styling; World.jsx submits to /explore?q=... with URLSearchParams.

### Explore page and behaviour
- src/pages/Explore.jsx + Explore.module.css: PageHeader, search/filter controls and ExploreResults. URL keys: q, type, country, hideClosed; absent hideClosed defaults true, false explicitly disables it. Invalid type/country values fall back to all. Clear filters clears query too, returning to the San Diego default.
- No query/type/country: by_city=san_diego and heading “Popular right now · San Diego”. Type/country selections browse globally. Search uses /search and applies type/country client-side. Closed/planning are hidden client-side by default.
- Pagination resets when query/filter inputs change. Search filters only cover loaded API pages; Load more remains available after full raw pages even with zero visible matches. Stats show visible count, most common type, website percentage, and distinct countries or states/regions.
- World.jsx: compact accessible hero search added; rest of page retained. Details/country pages remain Part 3 placeholders.
- Part 2 provides search/cards/API/loading/error/empty requirements. Charts remain Part 3 work, using getBreweryMeta.

## 11. Part 3 handoff: Atlas files and reusable interfaces

Packages added: `recharts@^2.15.4`, `leaflet@^1.9.4`, `react-leaflet@^4.2.1`. Part 1/2 files changed: World.jsx, Country.jsx, Brewery.jsx, breweryTypes.js, index.css, this document. Explore and its components were not touched.

### Data and tokens
- `constants/breweryTypes.js`: added `beergarden` (Beer garden) and `cidery` (Cidery). Added Belgium, New Zealand, South Africa, Netherlands, Finland, Italy, Ukraine. Every country now has `center: [lat, lng]` and `zoom` for map framing. Approx counts sum to 11,959.
- `index.css`: `--type-beergarden`, `--type-cidery` (lighter shades in dark mode); Leaflet theme overrides (popups, tooltips, zoom buttons, attribution use tokens; `.leaflet-container { z-index: 0 }` keeps maps under the sticky navbar).

### Hook and helpers
- `hooks/useThemeColors.js`: default `useThemeColors()` returns `{ theme, resolve, text, textMuted, border, surface, surface2, brand, brandStrong, link }` as real colour strings read with getComputedStyle. `resolve('var(--type-micro)')` turns a token into its current value. Re-reads one animation frame after `useTheme().theme` changes (ThemeProvider sets data-theme in its own effect, after child effects).
- `utils/atlas.js`: `sortedEntries(counts)`, `topEntry(counts)`, `findCountryByName(apiName)`, `regionPath(countrySlug, region)` (URL-encodes the exact region name), `safeDecode(value)`, `percentOf(part, total)`, `describeType(type)` (plural sentence name, e.g. "brewpubs").

### Components (src/components/, each with a .module.css unless it renders no markup)
- `ChartCard.jsx`: `{ title, subtitle, loading, error, onRetry, isEmpty, emptyMessage, summary, children }`. `.card` with header; skeleton while loading, `ErrorState` (with retry) on error, `EmptyState` when empty, else children plus the optional one-line text `summary`. Used for every chart and the maps.
- `TypeDonutChart.jsx`: `{ byType }` (meta by_type object). Recharts donut, colours from BREWERY_TYPES via useThemeColors, centre total, tooltip with count and %, HTML legend, `role="img"` with a full text aria-label.
- `BarRankChart.jsx`: `{ data: [{ label, value, key }], onSelect(key, item), valueLabel = 'breweries' }`. Horizontal bars (pass data already sorted and sliced). Each bar is an SVG `role="button"` with tabIndex: click or Enter/Space calls onSelect. Tooltip, value labels, responsive width.
- `BreweryMap.jsx`: `{ breweries, center, zoom, height = 420, highlightId, onSelect(brewery), label }`. CircleMarker per brewery coloured by type (records without coordinates skipped); popup with name, TypeBadge, location, details link. No center → fits bounds to the pins. Highlighted pin is bigger, outlined and drawn on top. Imports `leaflet/dist/leaflet.css`.
- `WorldBubbleMap.jsx`: `{ countries: [{ name, slug, center, total }] }`. One bubble per country, radius `5 + 31 * sqrt(total / max)`, tooltip with name + count, click → `/country/:slug`.
- `Breadcrumbs.jsx`: `{ items: [{ label, to }] }`; ordered list in `nav[aria-label=Breadcrumb]`, last item is `aria-current="page"`.
- `ThemedTileLayer.jsx` (no props, no CSS): OpenStreetMap tiles in both themes; dark mode darkens them with a CSS filter (`.tiles-dark` in index.css), no API key; OSM attribution; remounts on theme change.
- `MapViewController.jsx` (`{ center, zoom, points }`, renders nothing, must be inside MapContainer): setView/fitBounds when inputs change; scroll-wheel zoom enabled only after a click on the map, disabled on mouseout/blur.

### Pages
- `World.jsx`: one `getBreweryMeta({})` via useFetch. Live hero numbers (static fallback while loading), 4 StatCards, WorldBubbleMap, "Top countries" (top 10, click → country) and "Brewery types worldwide" donut, country grid sorted by live count (falls back to `~approx`).
- `Country.jsx`: `/country/:country[/:region]`. Two independent useFetch calls (deps `[country, region]`): meta with by_country (+ by_state) for stats/charts, and `listBreweries(..., { perPage: 200 })` for map + cards, so each section has its own loading/error/retry. Country view: regions bar chart (top 15, click → region) + donut; region view: donut + "Back to {country}". Map framed by `COUNTRIES.center/zoom` (country) or fit to pins (region), "Showing up to 200" note. 24 cards + "Show more" (24 more from loaded data, no requests). Unknown slug → "Country not found"; total 0 → friendly EmptyState.
- `Brewery.jsx`: getBrewery(id); breadcrumbs World › Country › Region › Brewery (country found by name); details card (address, tel: phone, validated http(s) website with rel="noreferrer", coordinates); 300px BreweryMap with the brewery highlighted plus nearby pins; "Nearby breweries" via `listBreweries({ by_dist }, { perPage: 7 })` minus the current id (max 6), hidden without coordinates; disabled "Add to Trail" / "Mark as visited" buttons ("Coming in Part 4"). 404 → "Brewery not found" + Explore link; other errors → ErrorState with retry.

### Notes
- Leaflet's default Marker icons break under Vite (image paths), so always use CircleMarker or a divIcon.
- Production build is ~760 kB JS (Recharts + Leaflet), so Vite prints the "chunk larger than 500 kB" warning; it is harmless. Part 4 could lazy-load pages with `React.lazy` if wanted.

## 12. Part 4 handoff: Compare, Trail, Passport, Roulette, CI and docs

No packages added. Part 1–3 files changed only where needed: `main.jsx` (CollectionProvider), `Brewery.jsx` (the two buttons + note), `World.jsx` and `Explore.jsx` (RouletteButton placement only), `Navbar.jsx` + `Navbar.module.css` (trail count), `About.jsx`, `README.md`, this file. Every new component/page has its own CSS Module and uses only index.css variables.

### Helpers
- `utils/geo.js`
  - `haversineKm(a, b)`: great-circle distance in km between two `{ latitude, longitude }` objects (R = 6371, `2 · atan2(√h, √(1−h))`).
  - `planRoute(stops)`: nearest-neighbour order. Keeps stops with coordinates, starts at the first one added, then repeatedly goes to the closest unvisited stop. Returns a new ordered array.
  - `routeDistance(stops)`: total km along the given order (sum of legs).
  - `hasCoords(point)`, `formatKm(km)` ("3.2 km", "1,235 km"), `formatPlace(stop)` (city, region, country without repeats).
- `utils/badges.js`
  - `BADGES`: First Stamp (1 visited), Explorer (10), Type Collector (5 distinct types), Globetrotter (3 distinct countries), Continental (2 distinct continents via `COUNTRIES.continent`), Micro Fan (5 micro). Each has `{ id, name, icon, description, target, measure(visited) }`.
  - `computeBadges(visited)` → `[{ id, name, description, icon, unlocked, progress, target }]` (progress capped at target).
  - `distinctCount(items, pick)`: number of different non-empty values, case-insensitive.

### Context
- `context/CollectionContext.jsx`: `CollectionProvider` (wraps App inside ThemeProvider in main.jsx) and `useCollection()` → `{ trail, visited, addToTrail(brewery), removeFromTrail(id), clearTrail(), isInTrail(id), toggleVisited(brewery), isVisited(id) }`.
  - Stores a small copy per brewery: `{ id, name, brewery_type, city, state_province, country, latitude, longitude }` (coordinates as Number or null).
  - `useState` lazy initialisers read localStorage once; `useEffect` saves on change. Keys `brewscope-trail` and `brewscope-visited`; `load`/`save` are wrapped in try/catch (blocked storage or broken JSON → empty list). Trail order = insertion order (planRoute starts from the first stop).

### Components
- `TrailMap.jsx`: `{ stops, height = 420 }` where stops are already route-ordered with coordinates. ThemedTileLayer + MapViewController (fits to the route), dashed brand-colour `Polyline` in route order, numbered `CircleMarker`s (number = permanent centred Tooltip), popup with name, TypeBadge, place and details link. Longitudes are "unwrapped" (±360°) so legs across the Pacific are drawn the short way, matching Haversine.
- `RouletteButton.jsx`: no props. "🎲 Take me somewhere" → `getRandomBrewery()` (min 600 ms "Spinning…" with a spinning die) → `navigate('/brewery/:id')`. Inline `role="alert"` error on failure; aborts on unmount. Placed in the World hero CTAs and the Explore PageHeader actions.
- `Navbar.jsx`: count pill on the Trail link (`trail.length`, hidden when 0) with visually hidden "N stops" text for screen readers.

### Pages
- `Brewery.jsx`: "🧭 Add to Trail" ↔ "🧭 In your trail ✓ (remove)" and "🏅 Mark as visited" ↔ "🏅 Visited ✓", plus a status line with links to Trail and Passport. Nothing else changed.
- `Trail.jsx`: empty state (how to add + Explore link); StatCards (stops, total distance, longest leg, countries); ordered stop list from `planRoute` (number, name link, TypeBadge, place, "x km from previous stop", Remove); `Clear trail` (confirm) in the PageHeader; TrailMap inside ChartCard with a text summary; separate "No coordinates: not included in the route" list.
- `Passport.jsx`: StatCards (visited, countries, types, badges unlocked); stamps grid (dashed card in the type colour via a `--stamp` custom property, country code seal, name, city/country, TypeBadge, link to the brewery); EmptyState with Explore link; badges grid from `computeBadges` (unlocked highlighted, locked greyed with an ARIA progressbar and "2/3").
- `Compare.jsx`: two COUNTRIES selects (defaults Germany vs Australia) synced to `?a=&b=` with `useSearchParams` (invalid slugs fall back to defaults), swap button, "Copy link". Two separate `useFetch(getBreweryMeta({ by_country }))` calls so each side loads/fails/retries independently; when both are the same country, side B reuses side A (no duplicate request). Per side: StatCards (total, regions, most common type with %, closed share), TypeDonutChart and top-5 regions BarRankChart (click → region page) in ChartCards. Automatic insight from the numbers, e.g. "Germany has 2.8x more breweries than Australia (1,445 vs 514). Germany is mostly brewpubs (86%), while Australia is mostly micro breweries (96%)."; handles same-country, equal totals, zero totals and same top type.
- `About.jsx`: description, feature cards, tech stack, API + OSM credits, team table, Research answers (useFetch; BreweryCard/ChartCard; ErrorState/EmptyState/skeletons).

### Delivery
- `.github/workflows/ci.yml` ("CI"): on `pull_request` and `push` to `main`; ubuntu-latest; checkout@v4; setup-node@v4 (Node 20, npm cache); `npm ci`; `npm run build`.
- `README.md`: features, screenshot placeholders (`docs/world.png`, `docs/explore.png`, `docs/country.png`, `docs/trail.png`), run locally, structure, how the Brew Trail works, Research, credits, CI note.

### Notes
- CSS order: `main.jsx` imports `index.css` after `App`, so global classes like `.card` win over a module class of equal specificity. To override `.card` borders/backgrounds in a module, use `:global(.card).yourClass` (done in Passport and Compare).
- `ComingSoon.jsx` is now unused; it was left in place (Part 1 file).
