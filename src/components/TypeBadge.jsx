import { getTypeInfo } from '../constants/breweryTypes.js'
import styles from './TypeBadge.module.css'
export default function TypeBadge({ type }) {
  const info = getTypeInfo(type)
  return <span className={`badge ${styles.badge}`} style={{ background: `color-mix(in srgb, ${info.color} 14%, var(--surface))`, borderColor: `color-mix(in srgb, ${info.color} 45%, var(--border))`, color: `color-mix(in srgb, ${info.color} 30%, var(--text))` }}>{info.label}</span>
}
