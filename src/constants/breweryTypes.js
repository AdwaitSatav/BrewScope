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
  beergarden: { label: 'Beer garden', color: 'var(--type-beergarden)', description: 'Outdoor beer garden' },
  cidery: { label: 'Cidery', color: 'var(--type-cidery)', description: 'Makes cider' },
  planning: { label: 'Planning', color: 'var(--type-planning)', description: 'Not open yet' },
  closed: { label: 'Closed', color: 'var(--type-closed)', description: 'No longer operating' },
}

export function getTypeInfo(type) {
  return BREWERY_TYPES[type] ?? { label: type ? type[0].toUpperCase() + type.slice(1) : 'Other', color: 'var(--type-other)' }
}

// Countries with data in Open Brewery DB (checked Oct 2026, counts are approximate).
// Use the API's /breweries/meta endpoint for live numbers. This list is for menus and the World view.
// center/zoom frame each country on the maps (Part 3).
export const COUNTRIES = [
  { name: 'United States', slug: 'united_states', code: 'US', continent: 'North America', approx: 8334, center: [39.8, -98.6], zoom: 4 },
  { name: 'Germany', slug: 'germany', code: 'DE', continent: 'Europe', approx: 1445, center: [51.2, 10.4], zoom: 6 },
  { name: 'Australia', slug: 'australia', code: 'AU', continent: 'Oceania', approx: 514, center: [-26.5, 134.5], zoom: 4 },
  { name: 'Belgium', slug: 'belgium', code: 'BE', continent: 'Europe', approx: 478, center: [50.6, 4.6], zoom: 8 },
  { name: 'Canada', slug: 'canada', code: 'CA', continent: 'North America', approx: 283, center: [55.5, -97], zoom: 3 },
  { name: 'New Zealand', slug: 'new_zealand', code: 'NZ', continent: 'Oceania', approx: 243, center: [-41.3, 172.8], zoom: 5 },
  { name: 'South Africa', slug: 'south_africa', code: 'ZA', continent: 'Africa', approx: 104, center: [-29, 24.7], zoom: 5 },
  { name: 'Netherlands', slug: 'netherlands', code: 'NL', continent: 'Europe', approx: 76, center: [52.2, 5.5], zoom: 7 },
  { name: 'Portugal', slug: 'portugal', code: 'PT', continent: 'Europe', approx: 72, center: [39.6, -8], zoom: 6 },
  { name: 'Ireland', slug: 'ireland', code: 'IE', continent: 'Europe', approx: 70, center: [53.4, -7.9], zoom: 7 },
  { name: 'Finland', slug: 'finland', code: 'FI', continent: 'Europe', approx: 68, center: [64.5, 26], zoom: 5 },
  { name: 'England', slug: 'england', code: 'ENG', continent: 'Europe', approx: 62, center: [52.6, -1.5], zoom: 6 },
  { name: 'South Korea', slug: 'south_korea', code: 'KR', continent: 'Asia', approx: 62, center: [36.4, 127.8], zoom: 7 },
  { name: 'Sweden', slug: 'sweden', code: 'SE', continent: 'Europe', approx: 36, center: [62, 15], zoom: 4 },
  { name: 'Poland', slug: 'poland', code: 'PL', continent: 'Europe', approx: 34, center: [52, 19.4], zoom: 6 },
  { name: 'Singapore', slug: 'singapore', code: 'SG', continent: 'Asia', approx: 33, center: [1.35, 103.82], zoom: 11 },
  { name: 'Austria', slug: 'austria', code: 'AT', continent: 'Europe', approx: 15, center: [47.6, 14.1], zoom: 7 },
  { name: 'Japan', slug: 'japan', code: 'JP', continent: 'Asia', approx: 10, center: [36.2, 138.3], zoom: 5 },
  { name: 'Scotland', slug: 'scotland', code: 'SCO', continent: 'Europe', approx: 10, center: [56.8, -4.2], zoom: 6 },
  { name: 'Italy', slug: 'italy', code: 'IT', continent: 'Europe', approx: 4, center: [42.8, 12.5], zoom: 5 },
  { name: 'France', slug: 'france', code: 'FR', continent: 'Europe', approx: 3, center: [46.6, 2.4], zoom: 5 },
  { name: 'Isle of Man', slug: 'isle_of_man', code: 'IM', continent: 'Europe', approx: 2, center: [54.24, -4.55], zoom: 10 },
  { name: 'Ukraine', slug: 'ukraine', code: 'UA', continent: 'Europe', approx: 1, center: [48.4, 31.2], zoom: 5 },
]
