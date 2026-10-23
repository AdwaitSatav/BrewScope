import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { suggestBreweries } from '../api/breweries.js'
import useDebounce from '../hooks/useDebounce.js'
import useFetch from '../hooks/useFetch.js'
import styles from './SearchBar.module.css'

export default function SearchBar({ query = '', onSearch }) {
  const [text, setText] = useState(query)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const root = useRef(null)
  const id = useId()
  const navigate = useNavigate()
  const debounced = useDebounce(text.trim())
  const { data, loading, error } = useFetch((signal) => suggestBreweries(debounced, { signal }), [debounced])
  const waiting = loading || debounced !== text.trim()
  const suggestions = waiting ? [] : data ?? []
  const expanded = open && text.trim().length >= 2
  useEffect(() => { setText(query); setOpen(false); setActive(-1) }, [query])
  useEffect(() => {
    const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])
  function submit(event) {
    event.preventDefault()
    setOpen(false)
    onSearch(text.trim())
  }
  function keyDown(event) {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing && expanded && suggestions[active]) {
      event.preventDefault()
      setOpen(false)
      navigate(`/brewery/${suggestions[active].id}`)
      return
    }
    if (event.key === 'Escape') { setOpen(false); setActive(-1) }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      if (suggestions.length) setActive((index) => (index + (event.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length)
    }
  }
  return (
    <form ref={root} className={styles.root} onSubmit={submit} role="search" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
      <label htmlFor={id} className={styles.label}>Search the brewery atlas</label>
      <div className={styles.row}>
        <input id={id} className={styles.input} type="text" role="combobox" autoComplete="off" placeholder="Try San Diego, Berlin or Stone…" value={text} aria-autocomplete="list" aria-expanded={expanded} aria-controls={`${id}-list`} aria-activedescendant={expanded && suggestions[active] ? `${id}-${active}` : undefined} onChange={(event) => { setText(event.target.value); setActive(-1); setOpen(true) }} onFocus={() => setOpen(true)} onKeyDown={keyDown} />
        <button className="btn" type="submit">Search</button>
      </div>
      {expanded && <div className={styles.dropdown}>
        <ul id={`${id}-list`} role="listbox" aria-label="Brewery suggestions">
          {suggestions.map((brewery, index) => <li key={brewery.id} id={`${id}-${index}`} role="option" aria-selected={active === index} className={active === index ? styles.active : ''} onPointerDown={(event) => event.preventDefault()} onClick={() => { setOpen(false); navigate(`/brewery/${brewery.id}`) }}>
            <strong>{brewery.name}</strong><span className="muted">{[brewery.city, brewery.country].filter(Boolean).join(', ')}</span>
          </li>)}
        </ul>
        <p className={styles.status} role="status">{waiting ? 'Searching…' : error ? 'Suggestions unavailable. Press Search to try a full search.' : suggestions.length ? 'Use ↑ ↓ to choose · Enter to open or search' : 'No suggestions'}</p>
      </div>}
    </form>
  )
}
