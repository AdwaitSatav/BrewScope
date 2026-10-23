import { BREWERY_TYPES, COUNTRIES } from '../constants/breweryTypes.js'
import styles from './FilterBar.module.css'

export default function FilterBar({ type, country, hideClosed, onChange, onClear }) {
  return <div className={styles.filters}>
    <label>Brewery type<select value={type} onChange={(event) => onChange('type', event.target.value)}><option value="">All types</option>{Object.entries(BREWERY_TYPES).map(([value, info]) => <option key={value} value={value}>{info.label}</option>)}</select></label>
    <label>Country<select value={country} onChange={(event) => onChange('country', event.target.value)}><option value="">All countries</option>{COUNTRIES.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
    <label className={styles.toggle}><input type="checkbox" checked={hideClosed} onChange={(event) => onChange('hideClosed', event.target.checked ? 'true' : 'false')} />Hide closed &amp; planning</label>
    <button type="button" className="btn btn-ghost" onClick={onClear}>Clear filters</button>
  </div>
}
