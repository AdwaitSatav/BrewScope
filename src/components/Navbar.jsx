import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'
import { useCollection } from '../context/CollectionContext.jsx'
import styles from './Navbar.module.css'

const links = [
  { to: '/', label: 'World', icon: '🌍' },
  { to: '/explore', label: 'Explore', icon: '🔍' },
  { to: '/compare', label: 'Compare', icon: '🆚' },
  { to: '/trail', label: 'Trail', icon: '🧭' },
  { to: '/passport', label: 'Passport', icon: '🏅' },
  { to: '/about', label: 'About', icon: 'ℹ️' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { trail } = useCollection()
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the mobile menu whenever the page changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const linkClass = ({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand} aria-label="BrewScope home">
          <img src="/favicon.svg" alt="" className={styles.logo} />
          <span>Brew<span className={styles.brandAccent}>Scope</span></span>
        </NavLink>

        <nav className={`${styles.links} ${menuOpen ? styles.open : ''}`} aria-label="Main">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              <span className={styles.icon} aria-hidden="true">{link.icon}</span>
              {link.label}
              {link.to === '/trail' && trail.length > 0 && (
                <>
                  <span className={styles.count} aria-hidden="true">{trail.length}</span>
                  <span className={styles.srOnly}>, {trail.length} {trail.length === 1 ? 'stop' : 'stops'}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.menuButton}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  )
}
