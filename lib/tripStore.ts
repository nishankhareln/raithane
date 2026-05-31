'use client'
import { useEffect, useState } from 'react'

const KEY = 'raithane_trip'
export const TRIP_EVT = 'raithane:trip'

export function getTrip(): string | null {
  try { return localStorage.getItem(KEY) || null } catch { return null }
}
export function setTrip(id: string) {
  try { localStorage.setItem(KEY, id) } catch {}
  try { window.dispatchEvent(new Event(TRIP_EVT)) } catch {}
}
export function clearTrip() {
  try { localStorage.removeItem(KEY) } catch {}
  try { window.dispatchEvent(new Event(TRIP_EVT)) } catch {}
}

/** Live current-trip destination id (set from GPS or a manual pick). */
export function useTrip(): string | null {
  const [id, setId] = useState<string | null>(null)
  useEffect(() => {
    const load = () => setId(getTrip())
    load()
    window.addEventListener(TRIP_EVT, load)
    window.addEventListener('storage', load)
    return () => { window.removeEventListener(TRIP_EVT, load); window.removeEventListener('storage', load) }
  }, [])
  return id
}
