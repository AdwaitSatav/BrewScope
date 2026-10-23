import styles from './EmptyState.module.css'
export default function EmptyState({ title, message, action }) {
  return <section className={`card ${styles.state}`} role="status"><span aria-hidden="true">◎</span><h2>{title}</h2><p className="muted">{message}</p>{action}</section>
}
