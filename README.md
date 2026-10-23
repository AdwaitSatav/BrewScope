# 🌍 BrewScope: World Brewery Atlas

A React dashboard that turns live data from the [Open Brewery DB](https://www.openbrewerydb.org) API into a world brewery atlas: search breweries anywhere, drill down from the world to a single taproom, plan a brew trail with the shortest route, and collect stamps in a Brew Passport.

> IMAP group project: "React Dashboard Consuming an API". **Complete:** all four parts are merged.

**Live site:** https://brewscope-five.vercel.app

![CI](https://github.com/AdwaitSatav/BrewScope/actions/workflows/ci.yml/badge.svg)

## Features
| | Feature | What it does | Part |
|---|---|---|---|
| 🔍 | **Explore** | Search with autocomplete, brewery cards, type/country filters, stat cards, loading/error/empty states, "Load more" | 2 |
| 🌍 | **World view** | Live world bubble map, world stats, top-countries bar chart, brewery-types donut, country grid | 3 |
| 🗺️ | **Drill-down** | World → Country → Region → Brewery, with breadcrumbs, map and charts at each level | 3 |
| 🏠 | **Brewery details** | Full info, mini map, nearby breweries, Add to Trail / Mark as visited | 3 + 4 |
| 🆚 | **Compare** | Two countries side by side: totals, regions, type mix, closed share, busiest regions and an automatic insight. Shareable URL (`/compare?a=germany&b=australia`) | 4 |
| 🧭 | **Brew Trail** | Add breweries → visiting order (nearest neighbour) + distances (Haversine), drawn on a map. Saved in localStorage | 4 |
| 🏅 | **Brew Passport** | Mark breweries visited → passport stamps + 6 badges (First Stamp, Explorer, Type Collector, Globetrotter, Continental, Micro Fan) | 4 |
| 🎲 | **Roulette** | "Take me somewhere": opens a random brewery anywhere on Earth | 4 |
| 🌙 | **Light / dark mode** | Saved theme, no flash on load, charts and maps follow the theme | 1 + 3 |

## Screenshots
> Screenshots go in the `docs/` folder (replace these placeholders).

| World | Explore |
|---|---|
| ![World view](docs/world.png) | ![Explore](docs/explore.png) |
| **Country drill-down** | **Brew Trail** |
| ![Country page](docs/country.png) | ![Brew Trail](docs/trail.png) |

## Run locally
Requires Node.js 18+ (CI uses Node 20).
```bash
npm install
npm run dev
```
Then open http://localhost:5173. `npm run build` creates the production build in `dist/` (the "chunk larger than 500 kB" warning is expected: Recharts + Leaflet).

No API key, no `.env`, no backend: the app calls Open Brewery DB directly from the browser.

## Project structure
```
src/
  main.jsx                 # BrowserRouter > ThemeProvider > CollectionProvider > App
  App.jsx                  # all routes
  index.css                # design tokens (light + dark) and shared classes
  api/breweries.js         # every Open Brewery DB request (list, search, one, random, meta)
  hooks/                   # useFetch, useDebounce, useThemeColors
  context/
    ThemeContext.jsx       # theme + toggle (localStorage)
    CollectionContext.jsx  # Brew Trail + visited list (localStorage)
  constants/breweryTypes.js# brewery types (label + colour) and the 23 countries
  utils/
    atlas.js               # helpers for counts and URLs
    geo.js                 # haversineKm, planRoute, routeDistance
    badges.js              # BADGES, computeBadges
  components/              # one component per file, each with its own .module.css
  pages/                   # World, Explore, Country, Brewery, Compare, Trail, Passport, About, NotFound
.github/workflows/ci.yml   # GitHub Actions: build on every PR and push to main
```

## How the Brew Trail works
1. **Saving stops.** "Add to Trail" on a brewery page stores a small copy of the brewery (id, name, type, city, region, country, latitude, longitude) in React Context, which saves it to `localStorage` (`brewscope-trail`).
2. **Distance: the Haversine formula** (`haversineKm` in `src/utils/geo.js`). The Earth is a sphere, so we can't use a flat-map distance. Haversine uses the difference in latitude and longitude plus the cosine of each latitude to find the angle between two points, then multiplies it by the Earth's radius (6371 km). The result is the straight-line ("as the crow flies") distance.
3. **Order: nearest neighbour** (`planRoute`). Start at the first brewery you added, then always go to the closest brewery you haven't visited yet, until none are left. Finding the truly shortest order is the Travelling Salesman Problem, which gets extremely slow as stops grow (10 stops already have 362,880 orders from a fixed start). Nearest neighbour is a fast approximation that is usually good enough for a trip.
4. **Totals.** `routeDistance` adds up each leg. The Trail page shows stops, total distance, the longest leg and countries, and `TrailMap` draws numbered dots joined by a line in route order. Breweries without coordinates are listed separately and left out of the route.

## Research
**How do useState and useEffect work together for data fetching?**
`useState` is the component's memory: it holds the data, a loading flag and an error, and changing it redraws the page. `useEffect` runs *after* React draws the page, which is the right moment to call an API. Our `useFetch` hook (`src/hooks/useFetch.js`) combines them: the effect sets loading, calls the API, and stores the data or the error in state, so the page redraws. The dependency list (e.g. the country slug) says when to fetch again, and the cleanup function aborts the old request with an `AbortController`, so a slow old answer can't overwrite a newer one.

**Why use components and props?**
Components are reusable building blocks; props are their inputs, like function arguments. `BreweryCard` is written once and receives a different `brewery` prop for every card on the Explore, Country and Brewery pages. `ChartCard` takes `title`, `loading`, `error` and `children`, so every chart and map gets the same header, skeleton and error message without repeated code. Small components are easier to test and fix, and they let four people work in parallel.

**How do you handle loading, errors and empty states?**
Every data view checks three cases before showing data. **Loading:** skeleton placeholders (`BreweryCardSkeleton`, the shimmer in `ChartCard`) keep the layout from jumping. **Error:** `ErrorState` shows a friendly message and a "Try again" button that calls `retry` from `useFetch`. **Empty:** `EmptyState` explains what happened and offers a next step, such as "Clear filters" or "Find breweries in Explore".

## API and credits
- Brewery data: [Open Brewery DB](https://www.openbrewerydb.org): free, open-source, no API key. Thank you!
- Map tiles: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (dark mode darkens the same tiles with a CSS filter).
- Built with React 18, Vite, React Router, Recharts, Leaflet / react-leaflet and CSS Modules. Hosted on Vercel.

## Continuous integration
`.github/workflows/ci.yml` ("CI") runs on every pull request and every push to `main`: it checks out the code, sets up Node 20 (with npm cache), runs `npm ci` and `npm run build`. A red ✗ on a PR means the app doesn't build and shouldn't be merged.

## Team
| Part | Member | Responsibility |
|---|---|---|
| 1 | Adwait | Setup, routing, layout, theme, design system |
| 2 | Ryan | API layer, search, brewery cards, filters, loading/error/empty states |
| 3 | Arham | World map, drill-down, charts, brewery details |
| 4 | Yugraj | Compare, Brew Trail, Passport, Roulette, research, CI |
