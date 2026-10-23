import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRandomBrewery } from '../api/breweries.js'
import styles from './RouletteButton.module.css'

const MIN_SPIN_MS = 600

// "Take me somewhere": asks the API for one random brewery anywhere on Earth and opens its page.
export default function RouletteButton() {
  const navigate = useNavigate()
  const [spinning, setSpinning] = useState(false)
  const [error, setError] = useState('')
  const controller = useRef(null)

  // Cancel a spin that is still running if the button disappears (e.g. the user changes page).
  useEffect(() => () => controller.current?.abort(), [])

  async function spin() {
    controller.current?.abort()
    const current = new AbortController()
    controller.current = current
    setSpinning(true)
    setError('')
    try {
      // Wait for the brewery AND a short delay, so the "Spinning…" state is visible even on fast connections.
      const [brewery] = await Promise.all([
        getRandomBrewery({ signal: current.signal }),
        new Promise((resolve) => setTimeout(resolve, MIN_SPIN_MS)),
      ])
      if (current.signal.aborted) return
      if (!brewery) throw new Error('No brewery came back. Please try again.')
      navigate(`/brewery/${brewery.id}`)
    } catch (err) {
      if (err.name !== 'AbortError' && !current.signal.aborted) setError(err.message)
    } finally {
      if (!current.signal.aborted) setSpinning(false)
    }
  }

  return (
    <span className={styles.wrap}>
      <button type="button" className={`btn btn-ghost ${styles.button}`} onClick={spin} disabled={spinning} aria-busy={spinning}>
        <span className={spinning ? styles.dice : undefined} aria-hidden="true">🎲</span>
        {spinning ? 'Spinning…' : 'Take me somewhere'}
      </button>
      {error && <span className={styles.error} role="alert">Couldn’t spin: {error}</span>}
    </span>
  )
}
