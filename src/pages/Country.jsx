import { Link, useParams } from 'react-router-dom'
import { COUNTRIES } from '../constants/breweryTypes.js'
import PageHeader from '../components/PageHeader.jsx'
import ComingSoon from '../components/ComingSoon.jsx'

// Drill-down page: /country/:country and /country/:country/:region
export default function Country() {
  const { country, region } = useParams()
  const info = COUNTRIES.find((c) => c.slug === country)
  const countryName = info?.name ?? country.replace(/_/g, ' ')

  return (
    <>
      <p className="muted" style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
        <Link to="/">World</Link> › {region ? <Link to={`/country/${country}`}>{countryName}</Link> : countryName}
        {region && <> › {decodeURIComponent(region)}</>}
      </p>
      <PageHeader
        eyebrow={info ? `${info.code} · ${info.continent}` : 'Country'}
        title={region ? decodeURIComponent(region) : countryName}
        subtitle="Regions, brewery types and every brewery in this area."
      />
      <ComingSoon
        part={3}
        owner="Person 3: World map & drill-down"
        features={[
          'Map zoomed to this country/region with a pin per brewery',
          'Breweries per region chart (click a region to drill down)',
          'Type breakdown chart and stat cards',
          'Brewery cards for the selected region',
        ]}
      />
    </>
  )
}
