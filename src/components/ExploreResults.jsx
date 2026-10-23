import { useRef, useState } from 'react'
import { listBreweries, searchBreweries } from '../api/breweries.js'
import { getTypeInfo } from '../constants/breweryTypes.js'
import useFetch from '../hooks/useFetch.js'
import StatCard from './StatCard.jsx'
import BreweryCard from './BreweryCard.jsx'
import BreweryCardSkeleton from './BreweryCardSkeleton.jsx'
import EmptyState from './EmptyState.jsx'
import ErrorState from './ErrorState.jsx'
import styles from './ExploreResults.module.css'

const slug = (value) => (value || '').toLowerCase().trim().replace(/\s+/g, '_')
const distinct = (values) => new Set(values.filter(Boolean).map((value) => value.toLowerCase())).size

// A new keyed instance resets pagination and cancels requests when URL filters change.
export default function ExploreResults({ query, type, country, hideClosed, onClear }) {
  const [page, setPage] = useState(1)
  const loaded = useRef([])
  const defaultCity = !query && !type && !country
  const { data, loading, error, retry } = useFetch(async (signal) => {
    const batch = query
      ? await searchBreweries(query, { page, perPage: 24, signal })
      : await listBreweries({ by_type: type, by_country: country, by_city: defaultCity ? 'san_diego' : '' }, { page, perPage: 24, signal })
    if (signal.aborted) throw new DOMException('Request cancelled', 'AbortError')
    loaded.current = [...new Map([...loaded.current, ...batch].map((brewery) => [brewery.id, brewery])).values()]
    return { hasMore: batch.length === 24 }
  }, [page])
  const breweries = loaded.current.filter((brewery) => (!type || brewery.brewery_type === type) && (!country || slug(brewery.country) === country) && (!hideClosed || !['closed', 'planning'].includes(brewery.brewery_type)))
  const types = breweries.reduce((counts, brewery) => { const type = brewery.brewery_type || 'other'; counts[type] = (counts[type] || 0) + 1; return counts }, {})
  const commonType = Object.entries(types).sort((a, b) => b[1] - a[1])[0]
  const countries = distinct(breweries.map((brewery) => brewery.country))
  const regions = countries === 1 ? distinct(breweries.map((brewery) => brewery.state_province)) : countries
  const initialLoading = loading && !loaded.current.length
  const value = (result) => initialLoading ? '—' : result
  return <div className="stack">
    <section className={styles.stats} aria-label="Statistics for loaded results">
      <StatCard label="Breweries shown" value={value(breweries.length)} hint="From the pages loaded" icon="◎" />
      <StatCard label="Most common type" value={value(commonType ? getTypeInfo(commonType[0]).label : '—')} hint="Among visible breweries" icon="◇" />
      <StatCard label="With a website" value={value(`${breweries.length ? Math.round(breweries.filter((brewery) => brewery.website_url).length / breweries.length * 100) : 0}%`)} hint="Plan your next visit" icon="↗" />
      <StatCard label={countries === 1 ? 'States / regions' : 'Countries'} value={value(regions)} hint="Represented in these results" icon="⌖" />
    </section>
    <div className={styles.heading}><h2>{query ? `Results for “${query}”` : defaultCity ? 'Popular right now · San Diego' : 'Explore breweries'}</h2><p className="muted" role="status">{loading ? 'Loading breweries…' : `Showing ${breweries.length} breweries`}</p></div>
    {query && (type || country) && <p className={`muted ${styles.note}`}>Search filters apply to the pages loaded. Load more to discover additional matches.</p>}
    <section aria-label="Brewery results" aria-busy={loading} className="stack">
      {breweries.length > 0 && <div className="grid">{breweries.map((brewery) => <BreweryCard key={brewery.id} brewery={brewery} />)}</div>}
      {loading && <div className="grid" aria-label="Loading breweries">{Array.from({ length: initialLoading ? 8 : 4 }, (_, index) => <BreweryCardSkeleton key={index} />)}</div>}
      {error && <ErrorState message={error.message} onRetry={retry} />}
      {!loading && !error && !breweries.length && <EmptyState title={query ? `No breweries found for '${query}'` : 'No breweries found'} message="Try San Diego, Berlin, Sydney or Seoul, or clear your filters. More matches may appear on later pages." action={<button className="btn btn-ghost" type="button" onClick={onClear}>Clear filters</button>} />}
    </section>
    {!loading && !error && data?.hasMore && <div className={styles.more}><button type="button" className="btn" onClick={() => setPage((current) => current + 1)}>Load more</button><p className="muted">24 records per API page · stats update as you explore</p></div>}
  </div>
}
