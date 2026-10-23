import styles from './ErrorState.module.css'
export default function ErrorState({ message, onRetry }) {
  return <section className={`card ${styles.state}`} role="alert"><h2>Couldn’t load breweries</h2><p className="muted">{message}</p>{onRetry && <button className="btn" type="button" onClick={onRetry}>Try again</button>}</section>
}
