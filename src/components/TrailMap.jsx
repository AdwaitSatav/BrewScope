import 'leaflet/dist/leaflet.css'
import { CircleMarker, MapContainer, Polyline, Popup, Tooltip } from 'react-leaflet'
import { Link } from 'react-router-dom'
import useThemeColors from '../hooks/useThemeColors.js'
import { formatPlace } from '../utils/geo.js'
import ThemedTileLayer from './ThemedTileLayer.jsx'
import MapViewController from './MapViewController.jsx'
import TypeBadge from './TypeBadge.jsx'
import styles from './TrailMap.module.css'

// Leaflet draws a line straight across longitudes, so San Diego (-117°) → Melbourne (145°) would go the long way
// over the Atlantic. Shifting each longitude by ±360° to stay within 180° of the previous stop makes the line
// take the short way (over the Pacific), matching the Haversine distance. Leaflet shows the shifted points on a world copy.
function unwrap(stops) {
  let previous = null
  return stops.map((stop) => {
    let lng = stop.longitude
    if (previous !== null) {
      while (lng - previous > 180) lng -= 360
      while (lng - previous < -180) lng += 360
    }
    previous = lng
    return [stop.latitude, lng]
  })
}

// The Brew Trail on a map. stops must already be in route order and have coordinates (planRoute does both).
// A Polyline joins the stops in order; each stop is a numbered CircleMarker (no image icons, see Part 3 notes).
export default function TrailMap({ stops = [], height = 420 }) {
  const colors = useThemeColors()
  const points = unwrap(stops)

  return (
    <div className={styles.map} style={{ height }} role="region" aria-label={`Map of your brew trail: ${stops.length} stops joined by a line in route order. Click the map to enable scroll zoom.`}>
      <MapContainer center={points[0] ?? [20, 0]} zoom={points.length ? 10 : 2} scrollWheelZoom={false} className={styles.leaflet}>
        <ThemedTileLayer />
        {/* No center/zoom given, so it fits the map to the route's points. */}
        <MapViewController points={points} />
        {points.length > 1 && <Polyline positions={points} pathOptions={{ color: colors.brand, weight: 4, opacity: 0.85, dashArray: '10 8' }} />}
        {stops.map((stop, index) => (
          <CircleMarker
            key={stop.id}
            center={points[index]}
            radius={13}
            pathOptions={{ color: index === 0 ? colors.text : colors.surface, weight: 2.5, fillColor: colors.brand, fillOpacity: 1 }}
          >
            <Tooltip permanent direction="center" className={styles.number}>{index + 1}</Tooltip>
            <Popup>
              <div className={styles.popup}>
                <span className={styles.step}>Stop {index + 1}{index === 0 ? ' · start' : ''}</span>
                <strong>{stop.name}</strong>
                <TypeBadge type={stop.brewery_type} />
                <span className={styles.location}>{formatPlace(stop) || 'Location unavailable'}</span>
                <Link className={styles.link} to={`/brewery/${stop.id}`}>View details →</Link>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
