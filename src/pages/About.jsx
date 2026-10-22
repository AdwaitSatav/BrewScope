import PageHeader from '../components/PageHeader.jsx'

// Part 4 adds the team section, research answers and full feature list.
export default function About() {
  return (
    <>
      <PageHeader eyebrow="About" title="About BrewScope" subtitle="IMAP Group Project: React Dashboard Consuming an API" />
      <section className="card" style={{ maxWidth: '75ch' }}>
        <p>
          BrewScope is a world brewery atlas built with React. It uses the free{' '}
          <a href="https://www.openbrewerydb.org" target="_blank" rel="noreferrer" style={{ color: 'var(--brand)', fontWeight: 600 }}>
            Open Brewery DB
          </a>{' '}
          API to let you search breweries around the world, drill down from countries to regions to individual
          breweries, plan a brew trail with the shortest route, and collect stamps in a Brew Passport.
        </p>
      </section>
    </>
  )
}
