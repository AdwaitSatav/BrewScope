import 'leaflet/dist/leaflet.css'
import { CircleMarker, MapContainer, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { getTypeInfo } from '../constants/breweryTypes.js'
import useThemeColors from '../hooks/useThemeColors.js'
import ThemedTileLayer from './ThemedTileLayer.jsx'
import MapViewController from './MapViewController.jsx'
import TypeBadge from './TypeBadge.jsx'
import styles from './BreweryMap.module.css'

// One coloured dot per brewery. CircleMarker is drawn as SVG, so it needs no marker image files
// (Leaflet's default Marker icons break with Vite's asset paths) and can use our type colours.
export default function BreweryMap({ breweries = [], center, zoom, height = 420, highlightId, onSelect, label = 'Map of breweries' }) {
  const colors = useThemeColors()
  // normalizeBrewery already turned coordinates into numbers or null; skip records without them.
  const pins = breweries
    .filter((brewery) => brewery.latitude !== null && brewery.longitude !== null)
    .sort((a, b) => (a.id === highlightId) - (b.id === highlightId)) // highlighted pin drawn last, on top

  return (
    <div className={styles.map} style={{ height }} role="region" aria-label={`${label}. ${pins.length} breweries pinned. Click the map to enable scroll zoom.`}>
      <MapContainer center={center ?? [20, 0]} zoom={zoom ?? 2} scrollWheelZoom={false} className={styles.leaflet}>
        <ThemedTileLayer />
        <MapViewController center={center} zoom={zoom} points={pins.map((brewery) => [brewery.latitude, brewery.longitude])} />
        {pins.map((brewery) => {
          const highlighted = brewery.id === highlightId
          return (
            <CircleMarker
              key={brewery.id}
              center={[brewery.latitude, brewery.longitude]}
              radius={highlighted ? 11 : 6}
              pathOptions={{
                color: highlighted ? colors.text : colors.surface,
                weight: highlighted ? 3 : 1.5,
                fillColor: colors.resolve(getTypeInfo(brewery.brewery_type).color),
                fillOpacity: 0.9,
              }}
              eventHandlers={{ click: () => onSelect?.(brewery) }}
            >
              <Popup>
                <div className={styles.popup}>
                  <strong>{brewery.name}</strong>
                  <TypeBadge type={brewery.brewery_type} />
                  <span className={styles.location}>{brewery.location || 'Location unavailable'}</span>
                  {!highlighted && <Link className={styles.link} to={`/brewery/${brewery.id}`}>View details →</Link>}
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}
