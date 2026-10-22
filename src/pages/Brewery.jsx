import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import ComingSoon from '../components/ComingSoon.jsx'

export default function Brewery() {
  const { id } = useParams()

  return (
    <>
      <PageHeader eyebrow="Brewery" title="Brewery details" subtitle={`ID: ${id}`} />
      <ComingSoon
        part={3}
        owner="Person 3: details page"
        features={[
          'Full brewery info from /breweries/{id}',
          'Mini map with the brewery location',
          'Nearby breweries using by_dist',
          'Add to Trail and Mark as visited buttons (wired up in Part 4)',
        ]}
      />
    </>
  )
}
