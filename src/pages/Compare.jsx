import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getBreweryMeta } from '../api/breweries.js'
import { COUNTRIES, getTypeInfo } from '../constants/breweryTypes.js'
import useFetch from '../hooks/useFetch.js'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ChartCard from '../components/ChartCard.jsx'
import TypeDonutChart from '../components/TypeDonutChart.jsx'
import BarRankChart from '../components/BarRankChart.jsx'
import { describeType, percentOf, regionPath, sortedEntries, topEntry } from '../utils/atlas.js'
import atlas from './Atlas.module.css'
import styles from './Compare.module.css'

const findCountry = (slug) => COUNTRIES.find((country) => country.slug === slug)

// Turn one meta response ({ total, by_state, by_type }) into the numbers the page shows.
function summarize(meta) {
  if (!meta) return null
  const total = meta.total ?? 0
  const top = topEntry(meta.by_type)
  return {
    total,
    byType: meta.by_type ?? {},
    regions: sortedEntries(meta.by_state),
    topType: top?.[0],
    topShare: top ? percentOf(top[1], total) : 0,
    closed: meta.by_type?.closed ?? 0,
    closedShare: percentOf(meta.by_type?.closed ?? 0, total),
  }
}

// The automatic insight: compare the totals, then the most common type on each side.
function buildInsight(a, b, nameA, nameB, same) {
  const mostly = (side) => (side.topType ? `mostly ${describeType(side.topType)} (${side.topShare}%)` : 'without type data')
  if (same) {
    return `You picked ${nameA} twice: it has ${a.total.toLocaleString()} breweries and is ${mostly(a)}. Choose a different country to see a real face-off.`
  }
  const [big, small, bigName, smallName] = a.total >= b.total ? [a, b, nameA, nameB] : [b, a, nameB, nameA]
  let size
  if (a.total === b.total) size = `${nameA} and ${nameB} have the same number of breweries (${a.total.toLocaleString()}).`
  else if (!small.total) size = `${bigName} has ${big.total.toLocaleString()} breweries, while ${smallName} has none listed.`
  else {
    const ratio = (big.total / small.total).toFixed(1)
    size = ratio === '1.0'
      ? `${bigName} has slightly more breweries than ${smallName} (${big.total.toLocaleString()} vs ${small.total.toLocaleString()}).`
      : `${bigName} has ${ratio}x more breweries than ${smallName} (${big.total.toLocaleString()} vs ${small.total.toLocaleString()}).`
  }
  const mix = a.topType && a.topType === b.topType
    ? `Both are mostly ${describeType(a.topType)}: ${a.topShare}% in ${nameA} and ${b.topShare}% in ${nameB}.`
    : `${nameA} is ${mostly(a)}, while ${nameB} is ${mostly(b)}.`
  return `${size} ${mix}`
}

// Country face-off. Both choices live in the URL (?a=germany&b=australia) so a comparison can be shared.
export default function Compare() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [copied, setCopied] = useState('')
  const a = findCountry(params.get('a')) ? params.get('a') : 'germany'
  const b = findCountry(params.get('b')) ? params.get('b') : 'australia'
  const same = a === b

  // Two separate requests, so each side loads, fails and retries on its own.
  // If the same country is picked twice, side B skips its request and reuses side A.
  const metaA = useFetch((signal) => getBreweryMeta({ by_country: a }, { signal }), [a])
  const metaB = useFetch((signal) => (same ? null : getBreweryMeta({ by_country: b }, { signal })), [b, same])

  const sides = [
    { key: 'a', info: findCountry(a), fetch: metaA },
    { key: 'b', info: findCountry(b), fetch: same ? metaA : metaB },
  ].map((side) => ({ ...side, stats: summarize(side.fetch.data) }))
  const [left, right] = sides
  const insight = left.stats && right.stats && buildInsight(left.stats, right.stats, left.info.name, right.info.name, same)

  function choose(next) {
    setCopied('')
    setParams({ a, b, ...next }, { replace: true })
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied('Link copied. Anyone who opens it sees this comparison.')
    } catch {
      setCopied('Copy the address bar to share this comparison.')
    }
  }

  return <>
    <PageHeader
      eyebrow="Compare"
      title="Country face-off"
      subtitle="Put two countries side by side: brewery counts, type mix and busiest regions."
      actions={<button type="button" className="btn btn-ghost" onClick={copyLink}>🔗 Copy link</button>}
    />
    <div className={`stack ${atlas.page}`}>
      <section className={`card ${styles.picker}`} aria-label="Choose two countries">
        <label>
          Country A
          <select value={a} onChange={(event) => choose({ a: event.target.value })}>
            {COUNTRIES.map((country) => <option key={country.slug} value={country.slug}>{country.name}</option>)}
          </select>
        </label>
        <button type="button" className={`btn btn-ghost ${styles.swap}`} onClick={() => choose({ a: b, b: a })} aria-label="Swap the two countries">
          ⇄ <span aria-hidden="true">VS</span>
        </button>
        <label>
          Country B
          <select value={b} onChange={(event) => choose({ b: event.target.value })}>
            {COUNTRIES.map((country) => <option key={country.slug} value={country.slug}>{country.name}</option>)}
          </select>
        </label>
        {copied && <p className={`muted ${styles.copied}`} role="status">{copied}</p>}
      </section>

      <section className={`card ${styles.insight}`} aria-live="polite" aria-busy={!insight && !metaA.error && !metaB.error}>
        <span className={styles.insightIcon} aria-hidden="true">💡</span>
        <p>
          {insight
            || (metaA.error || (!same && metaB.error)
              ? 'The insight appears once both countries have loaded. Use “Try again” on the side that failed.'
              : 'Comparing the two countries…')}
        </p>
      </section>

      <div className={styles.sides}>
        {sides.map(({ key, info, fetch, stats }) => {
          const show = (value) => (fetch.loading ? '—' : fetch.error ? 'n/a' : value)
          return (
            <section key={key} className={styles.side} aria-labelledby={`compare-${key}`}>
              <div className={styles.sideHead}>
                <span className={styles.code} aria-hidden="true">{info.code}</span>
                <div>
                  <h2 id={`compare-${key}`}>{info.name}</h2>
                  <p className="muted">{info.continent} · <Link to={`/country/${info.slug}`} className={styles.link}>Open country page →</Link></p>
                </div>
              </div>

              <div className={styles.stats}>
                <StatCard label="Breweries" value={show(stats?.total.toLocaleString())} hint="Live total" icon="◎" />
                <StatCard label="Regions" value={show(stats?.regions.length)} hint="States, provinces or regions" icon="⌖" />
                <StatCard label="Most common type" value={show(stats?.topType ? getTypeInfo(stats.topType).label : '—')} hint={stats?.topType ? `${stats.topShare}% of breweries` : 'Type mix'} icon="◇" />
                <StatCard label="Closed share" value={show(`${stats?.closedShare ?? 0}%`)} hint={stats ? `${stats.closed.toLocaleString()} closed` : 'No longer operating'} icon="✕" />
              </div>

              <ChartCard
                title={`Brewery types in ${info.name}`}
                subtitle="Share of each brewery type."
                loading={fetch.loading}
                error={fetch.error}
                onRetry={fetch.retry}
                isEmpty={!stats?.topType}
                emptyMessage={`No brewery types are listed for ${info.name}.`}
                summary={stats?.topType && `${info.name} is mostly ${describeType(stats.topType)} (${stats.topShare}%).`}
              >
                <TypeDonutChart byType={stats?.byType} />
              </ChartCard>

              <ChartCard
                title={`Busiest regions in ${info.name}`}
                subtitle="Top 5 regions. Select a bar to open it."
                loading={fetch.loading}
                error={fetch.error}
                onRetry={fetch.retry}
                isEmpty={!stats?.regions.length}
                emptyMessage="No regions are listed for this country."
                summary={stats?.regions.length > 0 && `${stats.regions[0][0]} is the busiest region with ${stats.regions[0][1].toLocaleString()} breweries.`}
              >
                <BarRankChart
                  data={(stats?.regions ?? []).slice(0, 5).map(([name, value]) => ({ label: name, value, key: name }))}
                  onSelect={(name) => navigate(regionPath(info.slug, name))}
                />
              </ChartCard>
            </section>
          )
        })}
      </div>
    </div>
  </>
}
