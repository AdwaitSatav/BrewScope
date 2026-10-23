import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { COUNTRIES, getTypeInfo } from '../constants/breweryTypes.js'
import { getBreweryMeta, listBreweries } from '../api/breweries.js'
import useFetch from '../hooks/useFetch.js'
import PageHeader from '../components/PageHeader.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import StatCard from '../components/StatCard.jsx'
import ChartCard from '../components/ChartCard.jsx'
import BarRankChart from '../components/BarRankChart.jsx'
import TypeDonutChart from '../components/TypeDonutChart.jsx'
import BreweryMap from '../components/BreweryMap.jsx'
import BreweryCard from '../components/BreweryCard.jsx'
import BreweryCardSkeleton from '../components/BreweryCardSkeleton.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { describeType, percentOf, regionPath, safeDecode, sortedEntries, topEntry } from '../utils/atlas.js'
import atlas from './Atlas.module.css'

const PAGE_SIZE = 24
const MAP_LIMIT = 200

// Drill-down page: /country/:country (country view) and /country/:country/:region (region view).
export default function Country() {
  const { country, region: rawRegion } = useParams()
  const navigate = useNavigate()
  const info = COUNTRIES.find((c) => c.slug === country)
  const region = rawRegion ? safeDecode(rawRegion) : ''
  const areaName = region || info?.name || ''
  // request() skips empty values, so by_state is only sent in the region view.
  const filters = { by_country: country, by_state: region }

  // Two independent requests: counts for stats/charts, and up to 200 records for the map and cards.
  const meta = useFetch((signal) => (info ? getBreweryMeta(filters, { signal }) : null), [country, region])
  const list = useFetch((signal) => (info ? listBreweries(filters, { perPage: MAP_LIMIT, signal }) : []), [country, region])
  const [shown, setShown] = useState(PAGE_SIZE)
  useEffect(() => setShown(PAGE_SIZE), [country, region])

  const crumbs = [{ label: 'World', to: '/' }, { label: info?.name ?? 'Unknown country', to: `/country/${country}` }]
  if (region) crumbs.push({ label: region, to: regionPath(country, region) })

  if (!info) {
    return <>
      <Breadcrumbs items={crumbs} />
      <PageHeader eyebrow="Country" title="Country not found" subtitle="BrewScope has no brewery data for this address." />
      <EmptyState title="Country not found" message={`“${country}” isn’t one of the countries in Open Brewery DB.`} action={<Link className="btn" to="/">Back to World</Link>} />
    </>
  }

  const total = meta.data?.total ?? 0
  const byType = meta.data?.by_type ?? {}
  const regions = sortedEntries(meta.data?.by_state)
  const commonType = topEntry(byType)
  const breweries = list.data ?? []
  const cities = new Set(breweries.map((brewery) => brewery.city?.toLowerCase()).filter(Boolean)).size
  const withWebsite = percentOf(breweries.filter((brewery) => brewery.website_url).length, breweries.length)
  const pinned = breweries.filter((brewery) => brewery.latitude !== null && brewery.longitude !== null).length
  const metaValue = (value) => (meta.loading ? '—' : meta.error ? 'n/a' : value)
  const listValue = (value) => (list.loading ? '—' : list.error ? 'n/a' : value)
  const typeSummary = commonType && `${areaName} has ${total.toLocaleString()} breweries; the most common type is ${describeType(commonType[0])} (${percentOf(commonType[1], total)}%).`

  const header = <>
    <Breadcrumbs items={crumbs} />
    <PageHeader
      eyebrow={`${info.code} · ${info.continent}`}
      title={areaName}
      subtitle={region ? `Breweries, types and the map for ${region}, ${info.name}.` : 'Regions, brewery types and every brewery in this country.'}
      actions={region && <Link className="btn btn-ghost" to={`/country/${country}`}>← Back to {info.name}</Link>}
    />
  </>

  if (meta.data && total === 0) {
    return <>
      {header}
      <EmptyState
        title={`No breweries in ${areaName} yet`}
        message="Open Brewery DB has no breweries listed here. Try another region or country."
        action={<Link className="btn" to={region ? `/country/${country}` : '/'}>{region ? `Back to ${info.name}` : 'Back to World'}</Link>}
      />
    </>
  }

  return <>
    {header}
    <div className={`stack ${atlas.page}`}>
      <section className={atlas.stats} aria-label={`Statistics for ${areaName}`}>
        <StatCard label="Breweries" value={metaValue(total.toLocaleString())} hint="Live total from Open Brewery DB" icon="◎" />
        {region
          ? <StatCard label="Cities" value={listValue(cities)} hint={`Among ${breweries.length} loaded breweries`} icon="⌖" />
          : <StatCard label="Regions" value={metaValue(regions.length)} hint="States, provinces or regions" icon="⌖" />}
        <StatCard label="Most common type" value={metaValue(commonType ? getTypeInfo(commonType[0]).label : '—')} hint={commonType ? `${percentOf(commonType[1], total)}% of breweries here` : 'In this area'} icon="◇" />
        <StatCard label="With a website" value={listValue(`${withWebsite}%`)} hint={`Of ${breweries.length} loaded breweries`} icon="↗" />
      </section>

      <div className={atlas.charts}>
        {!region && (
          <ChartCard
            title="Breweries by region"
            subtitle="Top 15 regions. Select a bar to drill down."
            loading={meta.loading}
            error={meta.error}
            onRetry={meta.retry}
            isEmpty={!regions.length}
            emptyMessage="No regions are listed for this country."
            summary={regions.length > 0 && `${regions[0][0]} leads with ${regions[0][1].toLocaleString()} breweries, ${percentOf(regions[0][1], total)}% of ${info.name}'s total.`}
          >
            <BarRankChart data={regions.slice(0, 15).map(([name, value]) => ({ label: name, value, key: name }))} onSelect={(name) => navigate(regionPath(country, name))} />
          </ChartCard>
        )}
        <ChartCard
          title={`Brewery types in ${areaName}`}
          subtitle="Share of each brewery type."
          loading={meta.loading}
          error={meta.error}
          onRetry={meta.retry}
          isEmpty={!commonType}
          summary={typeSummary}
        >
          <TypeDonutChart byType={byType} />
        </ChartCard>
      </div>

      <ChartCard
        title={`Map of ${areaName}`}
        subtitle={(total > MAP_LIMIT || breweries.length === MAP_LIMIT) ? `Showing up to ${MAP_LIMIT} breweries on the map.` : 'Every brewery with a known location. Click a dot for details.'}
        loading={list.loading}
        error={list.error}
        onRetry={list.retry}
        isEmpty={!pinned}
        emptyMessage="None of these breweries have map coordinates."
        summary={`${pinned} of ${breweries.length} loaded breweries have coordinates. Dot colours match the brewery type. Click the map to enable scroll zoom.`}
      >
        <BreweryMap breweries={breweries} center={region ? undefined : info.center} zoom={region ? undefined : info.zoom} label={`Map of breweries in ${areaName}`} />
      </ChartCard>

      <section aria-label={`Breweries in ${areaName}`} aria-busy={list.loading}>
        <div className={atlas.sectionHead}>
          <h2>Breweries in {areaName}</h2>
          {!list.loading && !list.error && <p className="muted" role="status">Showing {Math.min(shown, breweries.length)} of {breweries.length} loaded{total > breweries.length ? ` (${total.toLocaleString()} in total)` : ''}</p>}
        </div>
        {list.loading && <div className="grid">{Array.from({ length: 8 }, (_, index) => <BreweryCardSkeleton key={index} />)}</div>}
        {list.error && <ErrorState message={list.error.message} onRetry={list.retry} />}
        {!list.loading && !list.error && !breweries.length && <EmptyState title="No breweries to list" message="Try another region." />}
        {breweries.length > 0 && <div className="grid">{breweries.slice(0, shown).map((brewery) => <BreweryCard key={brewery.id} brewery={brewery} />)}</div>}
        {shown < breweries.length && (
          <div className={atlas.more}>
            <button type="button" className="btn" onClick={() => setShown((count) => count + PAGE_SIZE)}>Show more</button>
            <p className="muted">{breweries.length - shown} more already loaded · no extra requests</p>
          </div>
        )}
      </section>
    </div>
  </>
}
