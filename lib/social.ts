'use client'
import { useEffect, useState } from 'react'

const FKEY = 'raithane_follows'   // { [userId]: creatorId[] }
const CKEY = 'raithane_comments'  // { [postId]: Comment[] }
const EVT = 'raithane:social'

export type Comment = { id: string; userId: string; author: string; text: string; createdAt: number }

function read<T>(key: string): T { try { return JSON.parse(localStorage.getItem(key) || '{}') } catch { return {} as T } }
function write(key: string, val: unknown) { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} try { window.dispatchEvent(new Event(EVT)) } catch {} }

// ---- follows ----
export function toggleFollow(userId: string, creatorId: string) {
  const all = read<Record<string, string[]>>(FKEY)
  const list = all[userId] || []
  all[userId] = list.includes(creatorId) ? list.filter(x => x !== creatorId) : [...list, creatorId]
  write(FKEY, all)
}
export function useFollows(userId: string | undefined): string[] {
  const [list, setList] = useState<string[]>([])
  useEffect(() => {
    const load = () => setList(userId ? (read<Record<string, string[]>>(FKEY)[userId] || []) : [])
    load(); window.addEventListener(EVT, load); window.addEventListener('storage', load)
    return () => { window.removeEventListener(EVT, load); window.removeEventListener('storage', load) }
  }, [userId])
  return list
}

// ---- comments ----
export function addComment(postId: string, c: Comment) {
  const all = read<Record<string, Comment[]>>(CKEY)
  all[postId] = [c, ...(all[postId] || [])]
  write(CKEY, all)
}
export function useComments(postId: string): Comment[] {
  const [list, setList] = useState<Comment[]>([])
  useEffect(() => {
    const load = () => setList(read<Record<string, Comment[]>>(CKEY)[postId] || [])
    load(); window.addEventListener(EVT, load); window.addEventListener('storage', load)
    return () => { window.removeEventListener(EVT, load); window.removeEventListener('storage', load) }
  }, [postId])
  return list
}
