import { Link, useNavigate } from 'react-router-dom'
import heroSearch from '../components/HeroSearch.module.css'
import { COUNTRIES } from '../constants/breweryTypes.js'
import ComingSoon from '../components/ComingSoon.jsx'
import styles from './World.module.css'

// Home page. Part 3 adds the live world map, live stat cards and charts.
// The country grid below uses approximate counts until Part 3 switches it to live /breweries/meta data.
export default function World() {
  const navigate = useNavigate()
  const total = COUNTRIES.reduce((sum, c) => sum + c.approx, 0)

  return (
    <div className="stack">
      <section className={styles.hero}>
        <p className={styles.eyebrow}>World Brewery Atlas</p>
        <h1 className={styles.title}>
          Explore <span className={styles.highlight}>{total.toLocaleString()}+</span> breweries
          <br />
          across {COUNTRIES.length} countries.
        </h1>
        <p className={styles.subtitle}>
          Search breweries anywhere, drill down from the world to a single taproom, plan a brew trail and collect
          stamps in your Brew Passport. All powered by live data from Open Brewery DB.
        </p>
        <form className={heroSearch.form} role="search" onSubmit={(event) => {
          event.preventDefault()
          const query = new FormData(event.currentTarget).get('query').trim()
          navigate(query ? `/explore?${new URLSearchParams({ q: query })}` : '/explore')
        }}>
          <label htmlFor="world-search">Where will you explore?</label>
          <div><input id="world-search" name="query" type="search" placeholder="Search a city or brewery" /><button className="btn" type="submit">Search</button></div>
        </form>
        <div className={styles.ctas}>
          <Link to="/explore" className="btn">🔍 Start exploring</Link>
          <Link to="/trail" className="btn btn-ghost">🧭 Plan a trail</Link>
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Pick a country</h2>
        <div className={styles.countries}>
          {COUNTRIES.map((country) => (
            <Link key={country.slug} to={`/country/${country.slug}`} className={`card ${styles.country}`}>
              <span className={styles.code} aria-hidden="true">{country.code}</span>
              <span className={styles.countryName}>{country.name}</span>
              <span className={styles.count}>~{country.approx.toLocaleString()} breweries</span>
              <span className={styles.continent}>{country.continent}</span>
            </Link>
          ))}
        </div>
      </section>

      <ComingSoon
        part={3}
        owner="Person 3: World map & drill-down"
        features={[
          'Interactive world map with a bubble per country, sized by brewery count',
          'Live world stat cards from the /breweries/meta endpoint',
          'Top countries chart and brewery types donut',
        ]}
      />
    </div>
  )
}
