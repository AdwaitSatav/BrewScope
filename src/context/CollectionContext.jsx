import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// The user's Brew Trail (breweries to visit) and Brew Passport (breweries visited).
// Both lists live here so every page (Brewery, Trail, Passport, Navbar) shares the same data,
// and both are saved in localStorage so they survive a page reload.
const TRAIL_KEY = 'brewscope-trail'
const VISITED_KEY = 'brewscope-visited'
const CollectionContext = createContext(null)

// Read a saved list. Storage can be blocked or hold broken JSON, so any problem means "empty list".
function load(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(saved) ? saved.filter((item) => item && item.id) : []
  } catch {
    return []
  }
}

function save(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list))
  } catch {
    // Storage can be blocked (private mode) or full. The lists still work for this visit.
  }
}

// Coordinates may be numbers, strings or null; keep a finite Number or null.
const toCoord = (value) => (value === null || value === undefined || value === '' || !Number.isFinite(Number(value)) ? null : Number(value))

// Only a small copy of each brewery is stored: enough for the lists, map, route and badges.
function toSummary(brewery) {
  return {
    id: brewery.id,
    name: brewery.name,
    brewery_type: brewery.brewery_type ?? null,
    city: brewery.city ?? null,
    state_province: brewery.state_province ?? null,
    country: brewery.country ?? null,
    latitude: toCoord(brewery.latitude),
    longitude: toCoord(brewery.longitude),
  }
}

export function CollectionProvider({ children }) {
  // Lazy initialisers: localStorage is read once, on the first render, not on every render.
  const [trail, setTrail] = useState(() => load(TRAIL_KEY))
  const [visited, setVisited] = useState(() => load(VISITED_KEY))

  // Save whenever a list changes.
  useEffect(() => save(TRAIL_KEY, trail), [trail])
  useEffect(() => save(VISITED_KEY, visited), [visited])

  const addToTrail = useCallback((brewery) => {
    setTrail((list) => (list.some((item) => item.id === brewery.id) ? list : [...list, toSummary(brewery)]))
  }, [])
  const removeFromTrail = useCallback((id) => setTrail((list) => list.filter((item) => item.id !== id)), [])
  const clearTrail = useCallback(() => setTrail([]), [])
  const toggleVisited = useCallback((brewery) => {
    setVisited((list) => (list.some((item) => item.id === brewery.id)
      ? list.filter((item) => item.id !== brewery.id)
      : [...list, toSummary(brewery)]))
  }, [])

  const value = useMemo(() => ({
    trail,
    visited,
    addToTrail,
    removeFromTrail,
    clearTrail,
    isInTrail: (id) => trail.some((item) => item.id === id),
    toggleVisited,
    isVisited: (id) => visited.some((item) => item.id === id),
  }), [trail, visited, addToTrail, removeFromTrail, clearTrail, toggleVisited])

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>
}

export function useCollection() {
  const ctx = useContext(CollectionContext)
  if (!ctx) throw new Error('useCollection must be used inside <CollectionProvider>')
  return ctx
}
