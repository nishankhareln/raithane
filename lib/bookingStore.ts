'use client'
import { useEffect, useState } from 'react'

const KEY = 'raithane_bookings'
const EVT = 'raithane:bookings'

export type Booking = { guideId: string; date: string /* ISO yyyy-mm-dd */; createdAt: number }

export function getBookings(): Booking[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function addBooking(guideId: string, date: string) {
  const all = [{ guideId, date, createdAt: Date.now() }, ...getBookings()]
  try { localStorage.setItem(KEY, JSON.stringify(all)) } catch {}
  try { window.dispatchEvent(new Event(EVT)) } catch {}
}

/** Live list of bookings made on this device (updates on book + across tabs). */
export function useBookings(): Booking[] {
  const [items, setItems] = useState<Booking[]>([])
  useEffect(() => {
    const load = () => setItems(getBookings())
    load()
    window.addEventListener(EVT, load)
    window.addEventListener('storage', load)
    return () => { window.removeEventListener(EVT, load); window.removeEventListener('storage', load) }
  }, [])
  return items
}
