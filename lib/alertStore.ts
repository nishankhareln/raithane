'use client'
import { useEffect, useState } from 'react'
import { SEED_ALERTS, type Alert, type AlertKind, type AlertSeverity } from './mock'

const KEY = 'raithane_alerts'
const EVT = 'raithane:alerts'

function seeded(): Alert[] {
  const now = Date.now()
  return SEED_ALERTS.map(a => ({ ...a, createdAt: now - (a.minsAgo ?? 0) * 60000 }))
}

export function getAlerts(): Alert[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) { const s = seeded(); localStorage.setItem(KEY, JSON.stringify(s)); return s }
    return JSON.parse(raw)
  } catch { return seeded() }
}

function saveAll(arr: Alert[]) {
  try { localStorage.setItem(KEY, JSON.stringify(arr)) } catch {}
  try { window.dispatchEvent(new Event(EVT)) } catch {}
}

export function addAlert(a: { placeId: string; kind: AlertKind; severity: AlertSeverity; body: string; byCreatorId: string; audioSrc?: string; audioSecs?: number }) {
  const full: Alert = { ...a, id: 'al' + Date.now(), createdAt: Date.now(), helpful: 0 }
  saveAll([full, ...getAlerts()])
  return full
}
export function resolveAlert(id: string) { saveAll(getAlerts().map(a => a.id === id ? { ...a, resolved: true } : a)) }
export function markHelpful(id: string) { saveAll(getAlerts().map(a => a.id === id ? { ...a, helpful: (a.helpful || 0) + 1 } : a)) }

export function useAlerts(): Alert[] {
  const [items, setItems] = useState<Alert[]>([])
  useEffect(() => {
    const load = () => setItems(getAlerts())
    load()
    window.addEventListener(EVT, load)
    window.addEventListener('storage', load)
    return () => { window.removeEventListener(EVT, load); window.removeEventListener('storage', load) }
  }, [])
  return items
}

export const isActive = (a: Alert) => !a.resolved
export function timeAgo(createdAt?: number): string {
  if (!createdAt) return 'just now'
  const m = Math.max(0, Math.round((Date.now() - createdAt) / 60000))
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  return `${Math.round(m / 60)} hr ago`
}
