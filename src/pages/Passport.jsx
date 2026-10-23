import { Link } from 'react-router-dom'
import { useCollection } from '../context/CollectionContext.jsx'
import { getTypeInfo } from '../constants/breweryTypes.js'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import TypeBadge from '../components/TypeBadge.jsx'
import { findCountryByName } from '../utils/atlas.js'
import { computeBadges, distinctCount } from '../utils/badges.js'
import atlas from './Atlas.module.css'
import styles from './Passport.module.css'

// Brew Passport: every visited brewery is a stamp, and badges unlock from the visited list.
export default function Passport() {
  const { visited } = useCollection()
  const badges = computeBadges(visited)
  const unlocked = badges.filter((badge) => badge.unlocked).length
  const countries = distinctCount(visited, (brewery) => brewery.country)
  const types = distinctCount(visited, (brewery) => brewery.brewery_type)

  return <>
    <PageHeader
      eyebrow="Brew Passport"
      title="Your Brew Passport"
      subtitle="Mark breweries as visited to collect stamps and unlock badges. Saved in this browser."
    />
    <div className={`stack ${atlas.page}`}>
      <section className={atlas.stats} aria-label="Passport statistics">
        <StatCard label="Breweries visited" value={visited.length} hint="One stamp each" icon="◎" />
        <StatCard label="Countries" value={countries} hint="Different countries visited" icon="⌖" />
        <StatCard label="Types" value={types} hint="Different brewery types" icon="◇" />
        <StatCard label="Badges unlocked" value={`${unlocked} / ${badges.length}`} hint={unlocked === badges.length ? 'Every badge collected!' : 'Keep exploring'} icon="★" />
      </section>

      <section aria-labelledby="passport-stamps">
        <div className={atlas.sectionHead}>
          <h2 id="passport-stamps">Stamps</h2>
          {visited.length > 0 && <p className="muted">Newest last · open a stamp to see the brewery</p>}
        </div>
        {visited.length
          ? <ul className={styles.stamps}>
            {visited.map((brewery) => {
              const country = findCountryByName(brewery.country)
              return (
                <li key={brewery.id}>
                  <Link to={`/brewery/${brewery.id}`} className={styles.stamp} style={{ '--stamp': getTypeInfo(brewery.brewery_type).color }}>
                    <span className={styles.seal} aria-hidden="true">{country?.code ?? '★'}</span>
                    <strong className={styles.stampName}>{brewery.name}</strong>
                    <span className="muted">{[brewery.city, brewery.country].filter(Boolean).join(', ') || 'Location unavailable'}</span>
                    <TypeBadge type={brewery.brewery_type} />
                    <span className={styles.stamped}>Visited ✓</span>
                  </Link>
                </li>
              )
            })}
          </ul>
          : <EmptyState
            title="No stamps yet"
            message="Open a brewery page and press “Mark as visited” to collect your first stamp and unlock the First Stamp badge."
            action={<Link className="btn" to="/explore">Find breweries in Explore</Link>}
          />}
      </section>

      <section aria-labelledby="passport-badges">
        <div className={atlas.sectionHead}>
          <h2 id="passport-badges">Badges</h2>
          <p className="muted">{unlocked} of {badges.length} unlocked</p>
        </div>
        <ul className={styles.badges}>
          {badges.map((badge) => (
            <li key={badge.id} className={`card ${styles.badge} ${badge.unlocked ? styles.unlocked : styles.locked}`}>
              <span className={styles.icon} aria-hidden="true">{badge.icon}</span>
              <div className={styles.badgeText}>
                <h3>{badge.name}</h3>
                <p className="muted">{badge.description}</p>
              </div>
              {badge.unlocked
                ? <span className={styles.status}>Unlocked ✓</span>
                : <div className={styles.progress}>
                  <div
                    className={styles.track}
                    role="progressbar"
                    aria-label={`${badge.name} progress`}
                    aria-valuemin={0}
                    aria-valuemax={badge.target}
                    aria-valuenow={badge.progress}
                    aria-valuetext={`${badge.progress} of ${badge.target}`}
                  >
                    <span style={{ width: `${(badge.progress / badge.target) * 100}%` }} />
                  </div>
                  <span className={styles.count}>{badge.progress}/{badge.target}</span>
                </div>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  </>
}
