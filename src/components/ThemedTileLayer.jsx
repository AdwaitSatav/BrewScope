import { TileLayer } from 'react-leaflet'
import { useTheme } from '../context/ThemeContext.jsx'

// Map tiles are images, not data: OpenStreetMap in light mode, CARTO dark tiles in dark mode.
const TILES = {
  light: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
}

export default function ThemedTileLayer() {
  const { theme } = useTheme()
  const tiles = TILES[theme] ?? TILES.light
  // key remounts the layer so both the URL and the attribution switch with the theme.
  return <TileLayer key={theme} url={tiles.url} attribution={tiles.attribution} subdomains={theme === 'dark' ? 'abcd' : 'abc'} maxZoom={19} />
}
