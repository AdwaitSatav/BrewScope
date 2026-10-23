import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import styles from './About.module.css'

const FEATURES = [
  { icon: '🔍', title: 'Explore', text: 'Search with autocomplete, brewery cards, filters by type and country, stat cards, and loading, error and empty states.', to: '/explore' },
  { icon: '🌍', title: 'World view', text: 'Live world bubble map, world stats, a top-countries bar chart and a brewery-types donut.', to: '/' },
  { icon: '🗺️', title: 'Drill-down', text: 'World → Country → Region → Brewery, with breadcrumbs, maps and charts at each level.', to: '/country/germany' },
  { icon: '🏠', title: 'Brewery details', text: 'Full brewery info, a mini map and nearby breweries.' },
  { icon: '🆚', title: 'Compare', text: 'Two countries side by side: totals, type mix, busiest regions and an automatic insight.', to: '/compare' },
  { icon: '🧭', title: 'Brew Trail', text: 'Add breweries and get a short visiting order (nearest neighbour) with Haversine distances, drawn on a map.', to: '/trail' },
  { icon: '🏅', title: 'Brew Passport', text: 'Mark breweries as visited to collect stamps and unlock badges like Globetrotter and Continental.', to: '/passport' },
  { icon: '🎲', title: 'Roulette', text: '“Take me somewhere” opens a random brewery anywhere on Earth.' },
]

const STACK = ['React 18', 'Vite', 'React Router', 'Recharts', 'Leaflet / react-leaflet', 'CSS Modules', 'GitHub', 'Vercel']

const TEAM = [
  { part: 1, name: 'Adwait', work: 'Setup, routing, layout, design system and the GitHub repo' },
  { part: 2, name: 'Ryan', work: 'API layer, search, brewery cards, filters, loading/error/empty states' },
  { part: 3, name: 'Arham', work: 'Charts, maps, drill-down, brewery details, dark map fix' },
  { part: 4, name: 'Yugraj', work: 'Compare, Brew Trail, Passport, Roulette, CI and documentation' },
]

export default function About() {
  return (
    <>
      <PageHeader eyebrow="About" title="About BrewScope" subtitle="IMAP Group Project: React Dashboard Consuming an API" />
      <div className={styles.page}>
        <section className={`card ${styles.intro}`} aria-labelledby="about-what">
          <h2 id="about-what">What is BrewScope?</h2>
          <p>
            BrewScope is a world brewery atlas built with React. It turns live data from the free{' '}
            <a href="https://www.openbrewerydb.org" target="_blank" rel="noreferrer" className={styles.link}>Open Brewery DB</a>{' '}
            API (about 12,000 breweries in 23 countries) into a dashboard you can search, explore on a map, plan a trip with
            and collect like a game. Everything runs in the browser: no backend, no API keys, and your trail and passport
            are saved in localStorage.
          </p>
        </section>

        <section aria-labelledby="about-features">
          <h2 id="about-features" className={styles.heading}>Features</h2>
          <ul className={styles.features}>
            {FEATURES.map((feature) => (
              <li key={feature.title} className={`card ${styles.feature}`}>
                <span className={styles.featureIcon} aria-hidden="true">{feature.icon}</span>
                <h3>{feature.to ? <Link to={feature.to} className={styles.featureLink}>{feature.title}</Link> : feature.title}</h3>
                <p className="muted">{feature.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className={styles.columns}>
          <section className="card" aria-labelledby="about-stack">
            <h2 id="about-stack" className={styles.heading}>Tech stack</h2>
            <ul className={styles.stack}>
              {STACK.map((item) => <li key={item} className="badge">{item}</li>)}
            </ul>
          </section>
          <section className="card" aria-labelledby="about-api">
            <h2 id="about-api" className={styles.heading}>The API</h2>
            <p>
              All brewery data comes from <a href="https://www.openbrewerydb.org" target="_blank" rel="noreferrer" className={styles.link}>Open Brewery DB</a>,
              a free, open-source dataset with no API key. Map tiles are © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className={styles.link}>OpenStreetMap</a> contributors.
              Thanks to both projects.
            </p>
          </section>
        </div>

        <section className="card" aria-labelledby="about-team">
          <h2 id="about-team" className={styles.heading}>Team</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th scope="col">Part</th><th scope="col">Member</th><th scope="col">Responsibility</th></tr>
              </thead>
              <tbody>
                {TEAM.map((member) => (
                  <tr key={member.part}><td>{member.part}</td><th scope="row">{member.name}</th><td>{member.work}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="about-research">
          <h2 id="about-research" className={styles.heading}>Research</h2>
          <div className={styles.research}>
            <article className="card">
              <h3>How do useState and useEffect work together for data fetching?</h3>
              <p>
                <code>useState</code> is the component’s memory: it holds the data, a loading flag and an error, and changing
                it makes React redraw the page. <code>useEffect</code> runs code <em>after</em> React has drawn the page, which is
                the right moment to call an API. Our <code>useFetch</code> hook combines them: the effect sets
                loading, calls the API and then stores the data (or the error) in state, and the page redraws.
              </p>
              <p>
                The effect’s dependency list (for example the country slug) says when to fetch again, and its cleanup function
                aborts the old request with an <code>AbortController</code>, so a slow old answer can never overwrite a newer one.
              </p>
            </article>
            <article className="card">
              <h3>Why use components and props?</h3>
              <p>
                Components are reusable building blocks, and props are their inputs, like arguments to a function.{' '}
                <code>BreweryCard</code> is written once and receives a different <code>brewery</code> prop for every card on
                Explore, Country and Brewery pages. <code>ChartCard</code> takes <code>title</code>, <code>loading</code>,{' '}
                <code>error</code> and <code>children</code>, so every chart and map gets the same header and the same loading
                and error behaviour without repeating code.
              </p>
              <p>This keeps each file small, makes bugs easier to fix in one place, and let four people work in parallel.</p>
            </article>
            <article className="card">
              <h3>How do you handle loading, errors and empty states?</h3>
              <p>
                Every data view checks three things before showing data. While <strong>loading</strong>, we show skeleton
                placeholders (<code>BreweryCardSkeleton</code>, the shimmer in <code>ChartCard</code>) so the layout doesn’t jump.
                On an <strong>error</strong>, <code>ErrorState</code> shows a friendly message and a “Try again” button that calls{' '}
                <code>retry</code> from useFetch. When the answer is <strong>empty</strong>, <code>EmptyState</code> explains what
                happened and offers a next step, like “Clear filters” or “Find breweries in Explore”.
              </p>
            </article>
          </div>
        </section>
      </div>
    </>
  )
}
