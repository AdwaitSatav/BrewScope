// Brewery types returned by Open Brewery DB, with a readable label and a colour token.
// Use this everywhere (badges, charts, map pins) so colours stay consistent.
export const BREWERY_TYPES = {
  micro: { label: 'Micro', color: 'var(--type-micro)', description: 'Most craft breweries' },
  nano: { label: 'Nano', color: 'var(--type-nano)', description: 'Very small brewery' },
  regional: { label: 'Regional', color: 'var(--type-regional)', description: 'Regional-scale brewery' },
  brewpub: { label: 'Brewpub', color: 'var(--type-brewpub)', description: 'Brewery with a restaurant or bar' },
  large: { label: 'Large', color: 'var(--type-large)', description: 'Very large brewery' },
  bar: { label: 'Bar', color: 'var(--type-bar)', description: 'Bar that serves craft beer' },
  taproom: { label: 'Taproom', color: 'var(--type-taproom)', description: 'Tasting room' },
  contract: { label: 'Contract', color: 'var(--type-contract)', description: "Brews at another brewery's site" },
  proprietor: { label: 'Proprietor', color: 'var(--type-proprietor)', description: "Rents another brewery's equipment" },
  planning: { label: 'Planning', color: 'var(--type-planning)', description: 'Not open yet' },
  closed: { label: 'Closed', color: 'var(--type-closed)', description: 'No longer operating' },
}

export function getTypeInfo(type) {
  return BREWERY_TYPES[type] ?? { label: type ? type[0].toUpperCase() + type.slice(1) : 'Other', color: 'var(--type-other)' }
}

// Countries with data in Open Brewery DB (checked Oct 2026, counts are approximate).
// Use the API's /breweries/meta endpoint for live numbers. This list is for menus and the World view.
export const COUNTRIES = [
  { name: 'United States', slug: 'united_states', code: 'US', continent: 'North America', approx: 8334 },
  { name: 'Germany', slug: 'germany', code: 'DE', continent: 'Europe', approx: 1445 },
  { name: 'Australia', slug: 'australia', code: 'AU', continent: 'Oceania', approx: 514 },
  { name: 'Canada', slug: 'canada', code: 'CA', continent: 'North America', approx: 283 },
  { name: 'Portugal', slug: 'portugal', code: 'PT', continent: 'Europe', approx: 72 },
  { name: 'Ireland', slug: 'ireland', code: 'IE', continent: 'Europe', approx: 70 },
  { name: 'England', slug: 'england', code: 'ENG', continent: 'Europe', approx: 62 },
  { name: 'South Korea', slug: 'south_korea', code: 'KR', continent: 'Asia', approx: 62 },
  { name: 'Sweden', slug: 'sweden', code: 'SE', continent: 'Europe', approx: 36 },
  { name: 'Poland', slug: 'poland', code: 'PL', continent: 'Europe', approx: 34 },
  { name: 'Singapore', slug: 'singapore', code: 'SG', continent: 'Asia', approx: 33 },
  { name: 'Austria', slug: 'austria', code: 'AT', continent: 'Europe', approx: 15 },
  { name: 'Japan', slug: 'japan', code: 'JP', continent: 'Asia', approx: 10 },
  { name: 'Scotland', slug: 'scotland', code: 'SCO', continent: 'Europe', approx: 10 },
  { name: 'France', slug: 'france', code: 'FR', continent: 'Europe', approx: 3 },
  { name: 'Isle of Man', slug: 'isle_of_man', code: 'IM', continent: 'Europe', approx: 2 },
]
