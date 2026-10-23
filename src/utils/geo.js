// Pure geography helpers for the Brew Trail (Part 4). No React and no fetching here.
// Every "point" is an object with latitude and longitude, like a brewery record.

const EARTH_RADIUS_KM = 6371
const toRadians = (degrees) => (degrees * Math.PI) / 180

// true when a stop has real numeric coordinates (normalizeBrewery stores numbers or null).
export const hasCoords = (point) => Number.isFinite(point?.latitude) && Number.isFinite(point?.longitude)

// Haversine formula: the distance between two points on a sphere, "as the crow flies".
// The Earth is round, so we can't use Pythagoras on latitude/longitude. Instead:
//   1. take the difference in latitude and in longitude, in radians;
//   2. h = sin²(Δlat / 2) + cos(lat1) · cos(lat2) · sin²(Δlng / 2)
//      (h measures how far apart the points are, between 0 = same place and 1 = opposite sides);
//   3. turn h into the angle between the points: c = 2 · atan2(√h, √(1 − h));
//   4. multiply that angle by the Earth's radius (6371 km) to get kilometres.
export function haversineKm(a, b) {
  const dLat = toRadians(b.latitude - a.latitude)
  const dLng = toRadians(b.longitude - a.longitude)
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return EARTH_RADIUS_KM * c
}

// Nearest-neighbour route: a simple, fast way to choose a good visiting order.
//   1. keep only stops that have coordinates;
//   2. start at the first stop the user added;
//   3. from where you are, go to the closest stop you haven't visited yet;
//   4. repeat until every stop is visited.
// It doesn't always find the shortest possible route (that is the Travelling Salesman Problem,
// which gets very slow to solve exactly), but it's quick and usually close.
export function planRoute(stops = []) {
  const remaining = stops.filter(hasCoords)
  if (!remaining.length) return []
  const route = [remaining.shift()]
  while (remaining.length) {
    const current = route[route.length - 1]
    let closestIndex = 0
    let closestDistance = Infinity
    remaining.forEach((stop, index) => {
      const distance = haversineKm(current, stop)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })
    route.push(...remaining.splice(closestIndex, 1))
  }
  return route
}

// Total km along the stops in the order given: add up each leg (stop 1 → 2, 2 → 3, …).
export function routeDistance(stops = []) {
  let total = 0
  for (let index = 1; index < stops.length; index += 1) total += haversineKm(stops[index - 1], stops[index])
  return total
}

// 3.24 → "3.2 km", 1234.5 → "1,235 km"
export const formatKm = (km) => `${(km < 10 ? Math.round(km * 10) / 10 : Math.round(km)).toLocaleString()} km`

// "San Diego, California, United States" without empty parts or repeats (e.g. Singapore, Singapore).
export function formatPlace(stop) {
  const seen = new Set()
  return [stop?.city, stop?.state_province, stop?.country].filter((value) => {
    if (!value || seen.has(value.toLowerCase())) return false
    seen.add(value.toLowerCase())
    return true
  }).join(', ')
}
