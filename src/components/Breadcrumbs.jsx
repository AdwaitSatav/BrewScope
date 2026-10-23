import { Link } from 'react-router-dom'
import styles from './Breadcrumbs.module.css'

// items: [{ label, to }]. The last item is the current page, so it is plain text.
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className={styles.crumbs} aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`}>
              {last || !item.to ? <span aria-current={last ? 'page' : undefined}>{item.label}</span> : <Link to={item.to}>{item.label}</Link>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
