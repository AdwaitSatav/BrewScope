import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'brewscope-theme'
const ThemeContext = createContext(null)

function getInitialTheme() {
  // index.html already set data-theme before React loaded; read it back so both agree.
  const fromHtml = document.documentElement.getAttribute('data-theme')
  if (fromHtml === 'dark' || fromHtml === 'light') return fromHtml
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Storage can be blocked (private mode). The theme still works for this visit.
    }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
