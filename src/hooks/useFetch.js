import { useCallback, useEffect, useRef, useState } from 'react'

export default function useFetch(asyncFn, deps = []) {
  // useState stores the request's data and status so React can update the view.
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [attempt, setAttempt] = useState(0)
  const fn = useRef(asyncFn)
  fn.current = asyncFn
  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  // useEffect starts a request when dependencies change; cleanup cancels stale work.
  useEffect(() => {
    const controller = new AbortController()
    setState({ data: null, loading: true, error: null })
    Promise.resolve().then(() => fn.current(controller.signal)).then((data) => {
      if (!controller.signal.aborted) setState({ data, loading: false, error: null })
    }).catch((error) => {
      if (!controller.signal.aborted && error.name !== 'AbortError') setState({ data: null, loading: false, error })
    })
    return () => controller.abort()
  }, [...deps, attempt])

  return { ...state, retry }
}
