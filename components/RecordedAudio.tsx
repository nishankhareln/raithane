'use client'
import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { cx } from './ui'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/**
 * Custom player for MediaRecorder blobs. Those blobs report a broken duration
 * (0:00 / Infinity), so we drive the UI from currentTime + a known `secs`
 * (measured while recording). currentTime works fine even on data URLs.
 */
export default function RecordedAudio({ src, secs = 0, className }: { src: string; secs?: number; className?: string }) {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [cur, setCur] = useState(0)
  const [dur, setDur] = useState(secs)

  useEffect(() => {
    const a = ref.current
    if (!a) return
    const onTime = () => setCur(a.currentTime || 0)
    const onMeta = () => { if (isFinite(a.duration) && a.duration > 0) setDur(a.duration) }
    const onEnd = () => { setPlaying(false); setCur(0); try { a.currentTime = 0 } catch {} }
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('durationchange', onMeta)
    a.addEventListener('loadedmetadata', onMeta)
    a.addEventListener('ended', onEnd)
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('durationchange', onMeta)
      a.removeEventListener('loadedmetadata', onMeta)
      a.removeEventListener('ended', onEnd)
    }
  }, [src])

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const a = ref.current; if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play().then(() => setPlaying(true)).catch(() => {}) }
  }

  const total = dur || secs || 0
  const pct = total > 0 ? Math.min(100, (cur / total) * 100) : (playing ? 100 : 0)

  // repair data URLs saved with the wrong MIME (e.g. application/octet-stream) so they play
  const fixedSrc = src.startsWith('data:') && !src.startsWith('data:audio')
    ? src.replace(/^data:[^;,]*/, 'data:audio/webm')
    : src

  return (
    <div className={cx('flex items-center gap-2 rounded-full border border-sand bg-white px-2.5 py-1.5', className)}>
      <audio ref={ref} src={fixedSrc} preload="metadata" />
      <button type="button" onClick={toggle} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-clay text-white">
        {playing ? <Pause size={13} className="fill-white" /> : <Play size={13} className="fill-white" />}
      </button>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone/15">
        <div className="h-full rounded-full bg-clay transition-[width]" style={{ width: pct + '%' }} />
      </div>
      <span className="shrink-0 text-[11px] tabular-nums text-stone/60">{fmt(cur)} / {fmt(total)}</span>
    </div>
  )
}
