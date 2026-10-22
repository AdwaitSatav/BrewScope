import PageHeader from '../components/PageHeader.jsx'
import ComingSoon from '../components/ComingSoon.jsx'

export default function Compare() {
  return (
    <>
      <PageHeader
        eyebrow="Compare"
        title="Country face-off"
        subtitle="Put two countries side by side: brewery counts, type mix and busiest regions."
      />
      <ComingSoon
        part={4}
        owner="Person 4: Compare"
        features={['Pick two countries', 'Side-by-side stat cards and type-mix charts', 'Automatic insight and verdict']}
      />
    </>
  )
}
