import { findCountryByName } from './atlas.js'

// Brew Passport badges (Part 4). Pure functions: visited list in, badge list out.

// How many different values a field has, ignoring case and empty values.
export const distinctCount = (items, pick) => new Set(items.map(pick).filter(Boolean).map((value) => String(value).toLowerCase())).size

// Continents come from our COUNTRIES list (the API has no continent field).
const continentOf = (brewery) => findCountryByName(brewery.country)?.continent

// Each badge: a target number, and a measure() that counts progress from the visited list.
export const BADGES = [
  { id: 'first-stamp', name: 'First Stamp', icon: '🎟️', description: 'Visit your first brewery.', target: 1, measure: (visited) => visited.length },
  { id: 'explorer', name: 'Explorer', icon: '🧭', description: 'Visit 10 breweries.', target: 10, measure: (visited) => visited.length },
  { id: 'type-collector', name: 'Type Collector', icon: '🎨', description: 'Visit 5 different brewery types.', target: 5, measure: (visited) => distinctCount(visited, (b) => b.brewery_type) },
  { id: 'globetrotter', name: 'Globetrotter', icon: '🌍', description: 'Visit breweries in 3 different countries.', target: 3, measure: (visited) => distinctCount(visited, (b) => b.country) },
  { id: 'continental', name: 'Continental', icon: '✈️', description: 'Visit breweries on 2 different continents.', target: 2, measure: (visited) => distinctCount(visited, continentOf) },
  { id: 'micro-fan', name: 'Micro Fan', icon: '🍺', description: 'Visit 5 micro breweries.', target: 5, measure: (visited) => visited.filter((b) => b.brewery_type === 'micro').length },
]

// → [{ id, name, description, icon, unlocked, progress, target }]
// progress is capped at target so a progress bar never goes past 100%.
export function computeBadges(visited = []) {
  return BADGES.map(({ measure, ...badge }) => {
    const count = measure(visited)
    return { ...badge, unlocked: count >= badge.target, progress: Math.min(count, badge.target) }
  })
}
