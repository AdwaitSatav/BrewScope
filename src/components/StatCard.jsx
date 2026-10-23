import styles from './StatCard.module.css'
export default function StatCard({ label, value, hint, icon }) {
  return <div className={`card ${styles.stat}`}><p className="muted"><span aria-hidden="true">{icon} </span>{label}</p><strong>{value}</strong>{hint && <small className="muted">{hint}</small>}</div>
}
