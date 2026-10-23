import { Link } from 'react-router-dom'
import TypeBadge from './TypeBadge.jsx'
import styles from './BreweryCard.module.css'

export default function BreweryCard({ brewery }) {
  let website = null
  try { const url = new URL(brewery.website_url); if (['http:', 'https:'].includes(url.protocol)) website = url.href } catch { /* Missing or invalid website. */ }
  return <article className={`card ${styles.card}`}>
    <TypeBadge type={brewery.brewery_type} />
    <h3><Link className={styles.details} to={`/brewery/${brewery.id}`}>{brewery.name}</Link></h3>
    <p className="muted">{brewery.location || 'Location unavailable'}</p>
    <p className={styles.address}>{brewery.address_1 || brewery.street || 'Street address unavailable'}</p>
    <div className={styles.links}>
      {brewery.phone && <a href={`tel:${brewery.phone.replace(/[^\d+]/g, '')}`}>{brewery.phone}</a>}
      {website && <a href={website} target="_blank" rel="noreferrer">Visit website ↗</a>}
    </div>
    <span className={styles.more} aria-hidden="true">Explore brewery →</span>
  </article>
}
