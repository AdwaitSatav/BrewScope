import { useId } from 'react'
import EmptyState from './EmptyState.jsx'
import ErrorState from './ErrorState.jsx'
import styles from './ChartCard.module.css'

// Card wrapper for every chart: header, then a skeleton, error, empty message or the chart itself.
// summary is an optional one-line text version of the chart, shown under it for everyone (and screen readers).
export default function ChartCard({ title, subtitle, loading, error, onRetry, isEmpty, emptyMessage = 'No data to chart yet.', summary, children }) {
  const id = useId()
  let body = children
  if (loading) body = <div className={`skeleton ${styles.skeleton}`} aria-hidden="true" />
  else if (error) body = <ErrorState message={error.message} onRetry={onRetry} />
  else if (isEmpty) body = <EmptyState title="Nothing to show" message={emptyMessage} />

  return (
    <section className={`card ${styles.card}`} aria-labelledby={`${id}-title`} aria-busy={loading || undefined}>
      <header className={styles.header}>
        <h2 id={`${id}-title`}>{title}</h2>
        {subtitle && <p className="muted">{subtitle}</p>}
      </header>
      <div className={styles.body}>{body}</div>
      {!loading && !error && !isEmpty && summary && <p className={styles.summary}>{summary}</p>}
      {loading && <p className="muted" role="status">Loading chart…</p>}
    </section>
  )
}
