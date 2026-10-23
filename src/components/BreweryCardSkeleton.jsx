import styles from './BreweryCardSkeleton.module.css'
export default function BreweryCardSkeleton() {
  return <div className={`card ${styles.card}`} aria-hidden="true"><div className={`skeleton ${styles.badge}`} /><div className={`skeleton ${styles.title}`} /><div className="skeleton" /><div className="skeleton" /><div className={`skeleton ${styles.short}`} /></div>
}
