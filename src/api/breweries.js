const BASE_URL = 'https://api.openbrewerydb.org/v1'

async function request(path, params = {}, signal) {
  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (key === 'per_page') value = Math.min(200, Math.max(1, Math.trunc(Number(value)) || 24))
    url.searchParams.set(key, Array.isArray(value) ? value.join(',') : value)
  })
  try {
    const response = await fetch(url, { signal })
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
      const error = new Error(response.status === 404 ? 'This brewery could not be found.' : 'Brewery data is unavailable right now. Please try again.')
      error.status = response.status
      throw error
    }
    try { return await response.json() } catch {
      const error = new Error('The brewery service returned unreadable data. Please try again.')
      error.status = response.status
      throw error
    }
  } catch (error) {
    if (error.name === 'AbortError' || error.status !== undefined) throw error
    const friendly = new Error('Unable to connect to Open Brewery DB. Check your connection and try again.')
    friendly.status = 0
    throw friendly
  }
}

export function normalizeBrewery(brewery) {
  const result = Object.fromEntries(Object.entries(brewery).map(([key, value]) => [key, typeof value === 'string' ? value.trim() || null : value]))
  for (const key of ['latitude', 'longitude']) {
    const value = result[key]
    result[key] = value !== null && value !== undefined && Number.isFinite(Number(value)) ? Number(value) : null
  }
  const seen = new Set()
  result.location = [result.city, result.state_province, result.country].filter((value) => {
    if (!value || seen.has(value.toLowerCase())) return false
    seen.add(value.toLowerCase())
    return true
  }).join(', ')
  return result
}

export async function listBreweries(filters = {}, { page = 1, perPage = 24, signal } = {}) {
  return (await request('/breweries', { ...filters, page, per_page: perPage }, signal)).map(normalizeBrewery)
}
export async function searchBreweries(query, { page = 1, perPage = 24, signal } = {}) {
  return (await request('/breweries/search', { query: query.trim(), page, per_page: perPage }, signal)).map(normalizeBrewery)
}
export async function suggestBreweries(query, { signal } = {}) {
  if (query.trim().length < 2) return []
  return (await searchBreweries(query, { perPage: 8, signal })).slice(0, 8).map(({ id, name, city, country }) => ({ id, name, city, country }))
}
export async function getBrewery(id, { signal } = {}) {
  return normalizeBrewery(await request(`/breweries/${encodeURIComponent(id)}`, {}, signal))
}
export async function getRandomBrewery({ signal } = {}) {
  const results = await request('/breweries/random', { size: 1 }, signal)
  return results.length ? normalizeBrewery(results[0]) : null
}
export function getBreweryMeta(filters = {}, { signal } = {}) {
  return request('/breweries/meta', filters, signal)
}
