import styles from './ComingSoon.module.css'

// Temporary placeholder. Each part replaces these with real features.
export default function ComingSoon({ part, owner, features = [] }) {
  return (
    <section className={styles.box}>
      <span className={styles.tag}>Coming in Part {part}</span>
      {owner && <p className={styles.owner}>{owner}</p>}
      {features.length > 0 && (
        <ul className={styles.list}>
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
