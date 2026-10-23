import { TileLayer } from 'react-leaflet'
import { useTheme } from '../context/ThemeContext.jsx'

// Map tiles are images, not data. OpenStreetMap tiles are used in both themes (no API key needed).
// In dark mode the "tiles-dark" class darkens only the tile images with a CSS filter (see index.css).
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

export default function ThemedTileLayer() {
  const { theme } = useTheme()
  // key remounts the layer so the className switches with the theme.
  return (
    <TileLayer
      key={theme}
      url={TILE_URL}
      attribution={ATTRIBUTION}
      className={theme === 'dark' ? 'tiles-dark' : undefined}
      maxZoom={19}
    />
  )
}
