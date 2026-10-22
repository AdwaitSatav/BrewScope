import PageHeader from '../components/PageHeader.jsx'
import ComingSoon from '../components/ComingSoon.jsx'

export default function Passport() {
  return (
    <>
      <PageHeader
        eyebrow="Brew Passport"
        title="Your Brew Passport"
        subtitle="Mark breweries as visited to collect stamps and unlock badges."
      />
      <ComingSoon
        part={4}
        owner="Person 4: Passport & badges"
        features={[
          'Visited breweries shown as passport stamps',
          'Badges: Globetrotter, Type Collector, Continental and more',
          'Progress stats; saved in localStorage',
        ]}
      />
    </>
  )
}
