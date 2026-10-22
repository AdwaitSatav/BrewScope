import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        <strong>BrewScope</strong> · World Brewery Atlas · IMAP Group Project
      </p>
      <p className={styles.credit}>
        Data from{' '}
        <a href="https://www.openbrewerydb.org" target="_blank" rel="noreferrer">
          Open Brewery DB
        </a>
      </p>
    </footer>
  )
}
