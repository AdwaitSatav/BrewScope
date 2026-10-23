import 'leaflet/dist/leaflet.css'
import { CircleMarker, MapContainer, Tooltip } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import useThemeColors from '../hooks/useThemeColors.js'
import ThemedTileLayer from './ThemedTileLayer.jsx'
import MapViewController from './MapViewController.jsx'
import styles from './WorldBubbleMap.module.css'

// One bubble per country. Radius grows with Math.sqrt(total) so the bubble's AREA matches the count
// (otherwise the US, with 8,000+ breweries, would hide every other country).
export default function WorldBubbleMap({ countries = [] }) {
  const navigate = useNavigate()
  const colors = useThemeColors()
  const max = Math.max(1, ...countries.map((country) => country.total))
  const radius = (total) => 5 + 31 * Math.sqrt(total / max)

  return (
    <div className={styles.map} role="region" aria-label={`World map with a bubble for each of ${countries.length} countries, sized by brewery count. Click the map to enable scroll zoom.`}>
      <MapContainer center={[30, 10]} zoom={2} minZoom={1} scrollWheelZoom={false} worldCopyJump className={styles.leaflet}>
        <ThemedTileLayer />
        <MapViewController />
        {[...countries].sort((a, b) => b.total - a.total).map((country) => (
          <CircleMarker
            key={country.slug}
            center={country.center}
            radius={radius(country.total)}
            pathOptions={{ color: colors.brandStrong, weight: 1.5, fillColor: colors.brand, fillOpacity: 0.45 }}
            eventHandlers={{
              click: () => navigate(`/country/${country.slug}`),
              mouseover: (event) => event.target.setStyle({ fillOpacity: 0.8 }),
              mouseout: (event) => event.target.setStyle({ fillOpacity: 0.45 }),
            }}
          >
            <Tooltip direction="top" offset={[0, -4]}>
              <strong>{country.name}</strong> · {country.total.toLocaleString()} breweries
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
