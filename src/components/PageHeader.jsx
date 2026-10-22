import styles from './PageHeader.module.css'

// Consistent page title block. Use on every page:
// <PageHeader eyebrow="Explore" title="Find breweries" subtitle="..." actions={<button/>} />
export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <header className={styles.header}>
      <div>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  )
}
