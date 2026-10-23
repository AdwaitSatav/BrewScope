import { Link } from 'react-router-dom'
import { useCollection } from '../context/CollectionContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ChartCard from '../components/ChartCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import TypeBadge from '../components/TypeBadge.jsx'
import TrailMap from '../components/TrailMap.jsx'
import { distinctCount } from '../utils/badges.js'
import { formatKm, formatPlace, hasCoords, haversineKm, planRoute, routeDistance } from '../utils/geo.js'
import atlas from './Atlas.module.css'
import styles from './Trail.module.css'

// Brew Trail: the breweries the user added, put in nearest-neighbour order (planRoute),
// with Haversine distances per leg and in total, and the route drawn on a map.
export default function Trail() {
  const { trail, removeFromTrail, clearTrail } = useCollection()
  const header = (
    <PageHeader
      eyebrow="Brew Trail"
      title="Plan your brew trail"
      subtitle="Add breweries and BrewScope puts them in a short visiting order, starting from the first one you added."
      actions={trail.length > 0 && (
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => { if (window.confirm(`Remove all ${trail.length} stops from your trail?`)) clearTrail() }}
        >
          Clear trail
        </button>
      )}
    />
  )

  if (!trail.length) {
    return <>
      {header}
      <EmptyState
        title="Your trail is empty"
        message="Open any brewery (from Explore, the World map or a country page) and press “Add to Trail”. Add a few and BrewScope works out the visiting order, the distances and the route on the map."
        action={<Link className="btn" to="/explore">Find breweries in Explore</Link>}
      />
    </>
  }

  const route = planRoute(trail)
  const unmapped = trail.filter((stop) => !hasCoords(stop))
  const legs = route.map((stop, index) => (index === 0 ? 0 : haversineKm(route[index - 1], stop)))
  const total = routeDistance(route)
  const longest = Math.max(0, ...legs)
  const countries = distinctCount(trail, (stop) => stop.country)

  return <>
    {header}
    <div className={`stack ${atlas.page}`}>
      <section className={atlas.stats} aria-label="Trail statistics">
        <StatCard label="Stops" value={trail.length} hint={unmapped.length ? `${route.length} on the route, ${unmapped.length} without coordinates` : 'All on the route'} icon="◎" />
        <StatCard label="Total distance" value={formatKm(total)} hint="Straight lines between stops" icon="↝" />
        <StatCard label="Longest leg" value={formatKm(longest)} hint={route.length > 1 ? 'Biggest jump between two stops' : 'Add another stop'} icon="⇥" />
        <StatCard label="Countries" value={countries} hint={countries === 1 ? 'A local trail' : 'An international trail'} icon="⌖" />
      </section>

      <div className={styles.layout}>
        <section className={`card ${styles.listCard}`} aria-labelledby="trail-route">
          <div className={styles.listHead}>
            <h2 id="trail-route">Route order</h2>
            <p className="muted">Nearest-neighbour: from each stop, go to the closest one not visited yet.</p>
          </div>
          {route.length > 0
            ? <ol className={styles.stops}>
              {route.map((stop, index) => (
                <li key={stop.id} className={styles.stop}>
                  <span className={styles.number} aria-hidden="true">{index + 1}</span>
                  <div className={styles.info}>
                    <Link to={`/brewery/${stop.id}`} className={styles.name}>{stop.name}</Link>
                    <TypeBadge type={stop.brewery_type} />
                    <span className="muted">{formatPlace(stop) || 'Location unavailable'}</span>
                    <span className={styles.leg}>{index === 0 ? 'Start of the trail' : `${formatKm(legs[index])} from previous stop`}</span>
                  </div>
                  <button type="button" className={`btn btn-ghost ${styles.remove}`} onClick={() => removeFromTrail(stop.id)} aria-label={`Remove ${stop.name} from trail`}>
                    Remove
                  </button>
                </li>
              ))}
            </ol>
            : <p className="muted">None of your stops have coordinates yet, so there is no route to plan.</p>}
        </section>

        <ChartCard
          title="Trail map"
          subtitle="Numbered dots in route order, joined by a line. Click a dot for details."
          isEmpty={!route.length}
          emptyMessage="None of your stops have coordinates, so they can't be drawn on the map."
          summary={route.length > 1
            ? `${route.length} stops, ${formatKm(total)} in total, from ${route[0].name} to ${route[route.length - 1].name.replace(/\.$/, '')}. Click the map to enable scroll zoom.`
            : 'Add another brewery to draw a route.'}
        >
          <TrailMap stops={route} />
        </ChartCard>
      </div>

      {unmapped.length > 0 && (
        <section className={`card ${styles.listCard}`} aria-labelledby="trail-unmapped">
          <div className={styles.listHead}>
            <h2 id="trail-unmapped">No coordinates: not included in the route</h2>
            <p className="muted">Open Brewery DB has no map location for these, so distances can't be worked out.</p>
          </div>
          <ul className={styles.stops}>
            {unmapped.map((stop) => (
              <li key={stop.id} className={styles.stop}>
                <span className={`${styles.number} ${styles.unmapped}`} aria-hidden="true">?</span>
                <div className={styles.info}>
                  <Link to={`/brewery/${stop.id}`} className={styles.name}>{stop.name}</Link>
                  <TypeBadge type={stop.brewery_type} />
                  <span className="muted">{formatPlace(stop) || 'Location unavailable'}</span>
                </div>
                <button type="button" className={`btn btn-ghost ${styles.remove}`} onClick={() => removeFromTrail(stop.id)} aria-label={`Remove ${stop.name} from trail`}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  </>
}
