import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import SearchBar from '../components/SearchBar.jsx'
import FilterBar from '../components/FilterBar.jsx'
import ExploreResults from '../components/ExploreResults.jsx'
import { BREWERY_TYPES, COUNTRIES } from '../constants/breweryTypes.js'
import styles from './Explore.module.css'

export default function Explore() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q')?.trim() || ''
  const type = Object.hasOwn(BREWERY_TYPES, params.get('type')) ? params.get('type') : ''
  const country = COUNTRIES.some((item) => item.slug === params.get('country')) ? params.get('country') : ''
  const hideClosed = params.get('hideClosed') !== 'false'
  function change(key, value) {
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    })
  }
  const clear = () => setParams({})
  return <>
    <PageHeader eyebrow="Explore" title="Find your next great brewery" subtitle="Discover local favourites and faraway taprooms. Your next stop starts here." />
    <div className={`stack ${styles.content}`}>
      <section className={`card stack ${styles.controls}`} aria-label="Search and filters">
        <SearchBar query={query} onSearch={(value) => change('q', value)} />
        <FilterBar type={type} country={country} hideClosed={hideClosed} onChange={change} onClear={clear} />
      </section>
      <ExploreResults key={JSON.stringify([query, type, country, hideClosed])} query={query} type={type} country={country} hideClosed={hideClosed} onClear={clear} />
    </div>
  </>
}
