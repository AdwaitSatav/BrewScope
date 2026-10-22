import PageHeader from '../components/PageHeader.jsx'
import ComingSoon from '../components/ComingSoon.jsx'

export default function Explore() {
  return (
    <>
      <PageHeader
        eyebrow="Explore"
        title="Find breweries anywhere"
        subtitle="Search by name, city or country, filter by type, and browse brewery cards with live stats."
      />
      <ComingSoon
        part={2}
        owner="Person 2: API layer, search, cards and states"
        features={[
          'Search with autocomplete (name / city / country)',
          'Brewery cards with type badge, address, phone and website',
          'Filters: type, country, hide closed/planning',
          'Stat cards: total results, most common type, % with website',
          'Loading skeletons, error + retry, and empty states',
        ]}
      />
    </>
  )
}
