import { COUNTRIES } from '../constants/breweryTypes.js'

// Small pure helpers for the Atlas pages (World, Country, Brewery). No fetching here.

// { a: 3, b: 9 } → [['b', 9], ['a', 3]]
export const sortedEntries = (counts = {}) => Object.entries(counts).filter(([, value]) => value > 0).sort((a, b) => b[1] - a[1])

// The biggest entry of a meta counts object, e.g. ['brewpub', 1249], or undefined.
export const topEntry = (counts) => sortedEntries(counts)[0]

// API country names ("United States") → our COUNTRIES record, or undefined.
export const findCountryByName = (name) => COUNTRIES.find((country) => country.name.toLowerCase() === name?.toLowerCase())

// Region names keep their exact spelling (spaces, accents) and are URL-encoded in the path.
export const regionPath = (countrySlug, region) => `/country/${countrySlug}/${encodeURIComponent(region)}`

// React Router already decodes params; decoding again is safe for normal names and never throws.
export function safeDecode(value) {
  try { return decodeURIComponent(value) } catch { return value }
}

export const percentOf = (part, total) => (total ? Math.round((part / total) * 100) : 0)

// Plural, sentence-friendly type names for chart summaries ("most are brewpubs").
const PLURALS = {
  micro: 'micro breweries', nano: 'nano breweries', regional: 'regional breweries', brewpub: 'brewpubs',
  large: 'large breweries', bar: 'bars', taproom: 'taprooms', contract: 'contract breweries',
  proprietor: 'proprietor breweries', beergarden: 'beer gardens', cidery: 'cideries',
  planning: 'breweries in planning', closed: 'closed breweries',
}
export const describeType = (type) => PLURALS[type] ?? `${type || 'other'} breweries`
