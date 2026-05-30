'use client'
import { useEffect, useState } from 'react'
import type { Post, Skill, CategoryKey } from './mock'

const KEY = 'raithane_creations'
const EVT = 'raithane:creations'

export type Creation = {
  id: string
  kind: 'post' | 'skill'
  creatorId: string
  destinationId: string
  category: CategoryKey
  type: 'FREE' | 'PREMIUM'
  title: string
  body: string
  priceNpr: number
  img: string            // keyword fallback
  imgSrc?: string        // uploaded photo (data URL)
  mediaType: 'PHOTO' | 'VIDEO' | 'AUDIO' | 'TEXT'
  delivery?: 'IN_PERSON' | 'SHIPPED' | 'DIGITAL'
  createdAt: number
}

export function getCreations(): Creation[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function addCreation(c: Creation) {
  const all = [c, ...getCreations()]
  try { localStorage.setItem(KEY, JSON.stringify(all)) } catch {
    // likely quota (large photo) — retry without the data URL
    try { localStorage.setItem(KEY, JSON.stringify([{ ...c, imgSrc: undefined }, ...getCreations()])) } catch {}
  }
  try { window.dispatchEvent(new Event(EVT)) } catch {}
}

export function clearCreations() { try { localStorage.removeItem(KEY); window.dispatchEvent(new Event(EVT)) } catch {} }

/** Live list of the current user's creations (updates on publish + across tabs). */
export function useCreations(): Creation[] {
  const [items, setItems] = useState<Creation[]>([])
  useEffect(() => {
    const load = () => setItems(getCreations())
    load()
    window.addEventListener(EVT, load)
    window.addEventListener('storage', load)
    return () => { window.removeEventListener(EVT, load); window.removeEventListener('storage', load) }
  }, [])
  return items
}

export function toPost(c: Creation): Post {
  return {
    id: c.id, creatorId: c.creatorId, destinationId: c.destinationId, category: c.category,
    type: c.type, title: c.title, teaser: c.body || 'Shared by you on Raithane.',
    img: c.img, imgSrc: c.imgSrc, mediaType: c.mediaType, priceNpr: c.priceNpr,
    language: 'Nepali', likes: 0, views: 0,
  }
}

export function toSkill(c: Creation): Skill {
  return {
    id: c.id, creatorId: c.creatorId, destinationId: c.destinationId, title: c.title,
    description: c.body || 'A new experience offered by you.', priceNpr: c.priceNpr,
    delivery: c.delivery || 'IN_PERSON', img: c.img, imgSrc: c.imgSrc,
    grad: 'linear-gradient(135deg,#2563eb,#16a34a)', rating: 5, reviews: 0, slotsToday: 3,
  }
}
