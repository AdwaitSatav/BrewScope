import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
      <p style={{ fontSize: '3rem' }} aria-hidden="true">🍺</p>
      <h1 style={{ marginTop: '0.5rem' }}>Page not found</h1>
      <p className="muted" style={{ margin: '0.5rem 0 1.5rem' }}>
        This page has run dry. Let&apos;s get you back to the map.
      </p>
      <Link to="/" className="btn">Back to World</Link>
    </section>
  )
}
