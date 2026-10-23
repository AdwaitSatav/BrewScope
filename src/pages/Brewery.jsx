import { Link, useParams } from 'react-router-dom'
import { getBrewery, listBreweries } from '../api/breweries.js'
import { getTypeInfo } from '../constants/breweryTypes.js'
import useFetch from '../hooks/useFetch.js'
import PageHeader from '../components/PageHeader.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import TypeBadge from '../components/TypeBadge.jsx'
import BreweryMap from '../components/BreweryMap.jsx'
import BreweryCard from '../components/BreweryCard.jsx'
import BreweryCardSkeleton from '../components/BreweryCardSkeleton.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { findCountryByName, regionPath } from '../utils/atlas.js'
import atlas from './Atlas.module.css'
import styles from './Brewery.module.css'

// Only http/https links are shown, so a bad website value can never become a javascript: link.
function safeWebsite(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

export default function Brewery() {
  const { id } = useParams()
  const { data: brewery, loading, error, retry } = useFetch((signal) => getBrewery(id, { signal }), [id])
  const lat = brewery?.latitude ?? null
  const lng = brewery?.longitude ?? null
  const hasCoords = lat !== null && lng !== null

  // by_dist sorts by distance; the first result is usually this brewery, so drop it by id.
  const nearby = useFetch(async (signal) => {
    if (!hasCoords) return []
    const results = await listBreweries({ by_dist: `${lat},${lng}` }, { perPage: 7, signal })
    return results.filter((item) => item.id !== id).slice(0, 6)
  }, [id, lat, lng])

  if (loading) {
    return <>
      <Breadcrumbs items={[{ label: 'World', to: '/' }, { label: 'Loading…' }]} />
      <PageHeader eyebrow="Brewery" title="Loading brewery…" />
      <div className={styles.layout} aria-busy="true" role="status" aria-label="Loading brewery details">
        <BreweryCardSkeleton />
        <div className={`skeleton ${styles.mapSkeleton}`} />
      </div>
    </>
  }

  if (error) {
    return <>
      <Breadcrumbs items={[{ label: 'World', to: '/' }, { label: 'Explore', to: '/explore' }, { label: 'Brewery' }]} />
      {error.status === 404
        ? <>
          <PageHeader eyebrow="Brewery" title="Brewery not found" subtitle="This brewery may have been removed or the link is wrong." />
          <EmptyState title="Brewery not found" message={`No brewery has the id “${id}”.`} action={<Link className="btn" to="/explore">Go to Explore</Link>} />
        </>
        : <>
          <PageHeader eyebrow="Brewery" title="Brewery details" />
          <ErrorState message={error.message} onRetry={retry} />
        </>}
    </>
  }

  const country = findCountryByName(brewery.country)
  const crumbs = country
    ? [
      { label: 'World', to: '/' },
      { label: country.name, to: `/country/${country.slug}` },
      ...(brewery.state_province ? [{ label: brewery.state_province, to: regionPath(country.slug, brewery.state_province) }] : []),
      { label: brewery.name },
    ]
    : [{ label: 'World', to: '/' }, { label: 'Explore', to: '/explore' }, { label: brewery.name }]

  const website = safeWebsite(brewery.website_url)
  const street = [brewery.address_1 || brewery.street, brewery.address_2, brewery.address_3].filter(Boolean)
  const cityLine = [brewery.city, [brewery.state_province, brewery.postal_code].filter(Boolean).join(' ')].filter(Boolean).join(', ')
  const addressLines = [...street, cityLine, brewery.country].filter(Boolean)
  const typeInfo = getTypeInfo(brewery.brewery_type)

  return <>
    <Breadcrumbs items={crumbs} />
    <PageHeader
      eyebrow="Brewery"
      title={brewery.name}
      subtitle={<span className={styles.subtitle}><TypeBadge type={brewery.brewery_type} /> {brewery.location || 'Location unavailable'}</span>}
    />
    <div className={`stack ${atlas.page}`}>
      <div className={styles.layout}>
        <section className={`card ${styles.details}`} aria-labelledby="brewery-details">
          <h2 id="brewery-details">Details</h2>
          <dl>
            <div><dt>Type</dt><dd>{typeInfo.label}{typeInfo.description && <span className="muted"> · {typeInfo.description}</span>}</dd></div>
            <div><dt>Address</dt><dd>{addressLines.length ? <address>{addressLines.map((line) => <span key={line}>{line}</span>)}</address> : 'Address unavailable'}</dd></div>
            <div><dt>Phone</dt><dd>{brewery.phone ? <a href={`tel:${brewery.phone.replace(/[^\d+]/g, '')}`}>{brewery.phone}</a> : 'Not listed'}</dd></div>
            <div><dt>Website</dt><dd>{website ? <a href={website} target="_blank" rel="noreferrer">{website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')} ↗</a> : 'Not listed'}</dd></div>
            <div><dt>Coordinates</dt><dd>{hasCoords ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : 'Not available'}</dd></div>
          </dl>
          <div className={styles.actions}>
            <button type="button" className="btn" disabled title="Coming in Part 4" aria-describedby="part4-note">🧭 Add to Trail</button>
            <button type="button" className="btn btn-ghost" disabled title="Coming in Part 4" aria-describedby="part4-note">🏅 Mark as visited</button>
            <p id="part4-note" className="muted">Coming in Part 4</p>
          </div>
        </section>

        <section className={`card ${styles.mapCard}`} aria-labelledby="brewery-map">
          <h2 id="brewery-map">On the map</h2>
          {hasCoords
            ? <>
              <BreweryMap breweries={[brewery, ...(nearby.data ?? [])]} center={[lat, lng]} zoom={14} height={300} highlightId={brewery.id} label={`Map showing ${brewery.name} and nearby breweries`} />
              <p className="muted">The large dot is {brewery.name}; smaller dots are nearby breweries. Click the map to enable scroll zoom.</p>
            </>
            : <EmptyState title="No map location" message="This brewery has no coordinates in Open Brewery DB." />}
        </section>
      </div>

      {hasCoords && (
        <section aria-label="Nearby breweries" aria-busy={nearby.loading}>
          <div className={atlas.sectionHead}>
            <h2>Nearby breweries</h2>
            <p className="muted">Closest first, using the API’s by_dist sort</p>
          </div>
          {nearby.loading && <div className="grid">{Array.from({ length: 3 }, (_, index) => <BreweryCardSkeleton key={index} />)}</div>}
          {nearby.error && <ErrorState message={nearby.error.message} onRetry={nearby.retry} />}
          {!nearby.loading && !nearby.error && !nearby.data?.length && <EmptyState title="No other breweries nearby" message="This one is on its own. Try Explore to find more." />}
          {nearby.data?.length > 0 && <div className="grid">{nearby.data.map((item) => <BreweryCard key={item.id} brewery={item} />)}</div>}
        </section>
      )}
    </div>
  </>
}
