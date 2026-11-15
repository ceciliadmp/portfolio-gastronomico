import { useCallback, useEffect, useState } from 'react'
import { api } from './api'

export function useSiteData({ refetchOnFocus = false } = {}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const reload = useCallback(async () => {
    try {
      setData(await api.getSiteData())
      setError(null)
    } catch (e) {
      console.error(e)
      setError(e)
    }
  }, [])
  useEffect(() => { reload() }, [reload])
  useEffect(() => {
    if (!refetchOnFocus) return
    const f = () => document.visibilityState === 'visible' && reload()
    document.addEventListener('visibilitychange', f)
    return () => document.removeEventListener('visibilitychange', f)
  }, [refetchOnFocus, reload])
  return { data, setData, error, reload }
}

export const lines = (txt) => (txt || '').split('\n').map((s) => s.trim()).filter(Boolean)
