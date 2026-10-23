import { useCallback, useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext.jsx'

// Recharts and Leaflet draw SVG from JavaScript, so they need real colour strings, not var(--x).
// This hook reads the current CSS variables and reads them again whenever the theme changes.
function readVars() {
  const style = getComputedStyle(document.documentElement)
  return (name) => style.getPropertyValue(name).trim()
}

export default function useThemeColors() {
  const { theme } = useTheme()
  const [read, setRead] = useState(readVars)

  useEffect(() => {
    // ThemeProvider (a parent) sets data-theme in its own effect, which runs after ours,
    // so wait one frame before reading the new values.
    const frame = requestAnimationFrame(() => setRead(() => readVars()))
    return () => cancelAnimationFrame(frame)
  }, [theme])

  // resolve('var(--type-micro)') or resolve('--type-micro') → '#f59e0b'
  const resolve = useCallback((value, fallback = read('--text-muted')) => {
    const name = value?.match(/^var\((--[\w-]+)\)$/)?.[1] ?? (value?.startsWith('--') ? value : null)
    if (!name) return value || fallback
    return read(name) || fallback
  }, [read])

  return {
    theme,
    resolve,
    text: read('--text'),
    textMuted: read('--text-muted'),
    border: read('--border'),
    surface: read('--surface'),
    surface2: read('--surface-2'),
    brand: read('--brand'),
    brandStrong: read('--brand-strong'),
    link: read('--link'),
  }
}
