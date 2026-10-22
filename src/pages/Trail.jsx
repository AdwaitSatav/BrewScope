import PageHeader from '../components/PageHeader.jsx'
import ComingSoon from '../components/ComingSoon.jsx'

export default function Trail() {
  return (
    <>
      <PageHeader
        eyebrow="Brew Trail"
        title="Plan your brew trail"
        subtitle="Add breweries and BrewScope works out the shortest route between them."
      />
      <ComingSoon
        part={4}
        owner="Person 4: Brew Trail planner"
        features={[
          'Add or remove breweries from your trail',
          'Shortest visiting order (nearest-neighbour route)',
          'Distance between stops and total distance (Haversine formula)',
          'Route drawn on the map; trail saved in localStorage',
        ]}
      />
    </>
  )
}
