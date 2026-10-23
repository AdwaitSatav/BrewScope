import { Link, useNavigate } from 'react-router-dom'
import heroSearch from '../components/HeroSearch.module.css'
import { COUNTRIES, getTypeInfo } from '../constants/breweryTypes.js'
import { getBreweryMeta } from '../api/breweries.js'
import useFetch from '../hooks/useFetch.js'
import StatCard from '../components/StatCard.jsx'
import ChartCard from '../components/ChartCard.jsx'
import BarRankChart from '../components/BarRankChart.jsx'
import TypeDonutChart from '../components/TypeDonutChart.jsx'
import WorldBubbleMap from '../components/WorldBubbleMap.jsx'
import { describeType, findCountryByName, percentOf, sortedEntries, topEntry } from '../utils/atlas.js'
import styles from './World.module.css'
import atlas from './Atlas.module.css'

// Home page. One /breweries/meta request gives world totals per country and per type,
// which power the hero numbers, stat cards, bubble map, both charts and the country grid.
export default function World() {
  const navigate = useNavigate()
  const meta = useFetch((signal) => getBreweryMeta({}, { signal }), [])
  const byCountry = meta.data?.by_country ?? {}
  const byType = meta.data?.by_type ?? {}

  // Fall back to the static approximate numbers while loading (or if the request fails).
  const staticTotal = COUNTRIES.reduce((sum, c) => sum + c.approx, 0)
  const total = meta.data?.total ?? staticTotal
  const countryCount = meta.data ? Object.keys(byCountry).length : COUNTRIES.length

  // Match API names ("New Zealand") to our COUNTRIES list to get slug and map center.
  const liveCount = (country) => Object.entries(byCountry).find(([name]) => findCountryByName(name) === country)?.[1]
  const countries = COUNTRIES.map((country) => ({ ...country, live: liveCount(country) }))
    .sort((a, b) => (b.live ?? b.approx) - (a.live ?? a.approx))
  const bubbles = countries.filter((country) => country.live > 0).map(({ name, slug, center, live }) => ({ name, slug, center, total: live }))

  const ranking = sortedEntries(byCountry).slice(0, 10).map(([name, value]) => ({
    label: name, value, key: findCountryByName(name)?.slug ?? name.toLowerCase().replace(/\s+/g, '_'),
  }))
  const commonType = topEntry(byType)
  const topCountry = topEntry(byCountry)
  const show = (value) => (meta.loading ? '—' : meta.error ? 'n/a' : value)

  return (
    <div className={`stack ${atlas.page}`}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>World Brewery Atlas</p>
        <h1 className={styles.title}>
          Explore <span className={styles.highlight}>{total.toLocaleString()}+</span> breweries
          <br />
          across {countryCount} countries.
        </h1>
        <p className={styles.subtitle}>
          Search breweries anywhere, drill down from the world to a single taproom, plan a brew trail and collect
          stamps in your Brew Passport. All powered by live data from Open Brewery DB.
        </p>
        <form className={heroSearch.form} role="search" onSubmit={(event) => {
          event.preventDefault()
          const query = new FormData(event.currentTarget).get('query').trim()
          navigate(query ? `/explore?${new URLSearchParams({ q: query })}` : '/explore')
        }}>
          <label htmlFor="world-search">Where will you explore?</label>
          <div><input id="world-search" name="query" type="search" placeholder="Search a city or brewery" /><button className="btn" type="submit">Search</button></div>
        </form>
        <div className={styles.ctas}>
          <Link to="/explore" className="btn">🔍 Start exploring</Link>
          <Link to="/trail" className="btn btn-ghost">🧭 Plan a trail</Link>
        </div>
      </section>

      <section className={atlas.stats} aria-label="World statistics" aria-busy={meta.loading}>
        <StatCard label="Total breweries" value={show(total.toLocaleString())} hint="Live from Open Brewery DB" icon="◎" />
        <StatCard label="Countries covered" value={show(countryCount)} hint="With at least one brewery" icon="⌖" />
        <StatCard label="Most common type" value={show(commonType ? getTypeInfo(commonType[0]).label : '—')} hint={commonType ? `${percentOf(commonType[1], total)}% of all breweries` : 'Worldwide'} icon="◇" />
        <StatCard label="Top country" value={show(topCountry?.[0] ?? '—')} hint={topCountry ? `${topCountry[1].toLocaleString()} breweries` : 'Most breweries'} icon="★" />
      </section>

      <ChartCard
        title="Breweries around the world"
        subtitle="Bubble size shows how many breweries each country has. Click a bubble to open that country."
        loading={meta.loading}
        error={meta.error}
        onRetry={meta.retry}
        isEmpty={!bubbles.length}
        summary={topCountry && `${topCountry[0]} leads with ${topCountry[1].toLocaleString()} breweries (${percentOf(topCountry[1], total)}% of the world total). Keyboard users can open any country from the cards below.`}
      >
        <WorldBubbleMap countries={bubbles} />
      </ChartCard>

      <div className={atlas.charts}>
        <ChartCard
          title="Top countries"
          subtitle="Top 10 by number of breweries. Select a bar to drill down."
          loading={meta.loading}
          error={meta.error}
          onRetry={meta.retry}
          isEmpty={!ranking.length}
          summary={ranking.length > 1 && `${ranking[0].label} has ${ranking[0].value.toLocaleString()} breweries, followed by ${ranking[1].label} with ${ranking[1].value.toLocaleString()}.`}
        >
          <BarRankChart data={ranking} onSelect={(slug) => navigate(`/country/${slug}`)} />
        </ChartCard>
        <ChartCard
          title="Brewery types worldwide"
          subtitle="Share of every brewery type in the database."
          loading={meta.loading}
          error={meta.error}
          onRetry={meta.retry}
          isEmpty={!commonType}
          summary={commonType && `The world has ${total.toLocaleString()} breweries; the most common type is ${describeType(commonType[0])} (${percentOf(commonType[1], total)}%).`}
        >
          <TypeDonutChart byType={byType} />
        </ChartCard>
      </div>

      <section>
        <h2 className={styles.sectionTitle}>Pick a country</h2>
        <div className={styles.countries}>
          {countries.map((country) => (
            <Link key={country.slug} to={`/country/${country.slug}`} className={`card ${styles.country}`}>
              <span className={styles.code} aria-hidden="true">{country.code}</span>
              <span className={styles.countryName}>{country.name}</span>
              <span className={styles.count}>{country.live !== undefined ? country.live.toLocaleString() : `~${country.approx.toLocaleString()}`} breweries</span>
              <span className={styles.continent}>{country.continent}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
