'use client'
import { useRef, useState } from 'react'
import { Volume2, Loader2, Square } from 'lucide-react'
import { cx } from './ui'

/** Plays real-time, human-like narration via the ElevenLabs API route. */
export default function NarrateButton({ text, voiceId, label = 'Listen in a real voice', className }:
  { text: string; voiceId?: string; label?: string; className?: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'playing'>('idle')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stop = () => { try { audioRef.current?.pause() } catch {} audioRef.current = null; setState('idle') }

  const go = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (state === 'playing') return stop()
    if (state === 'loading') return
    setState('loading')
    try {
      const r = await fetch('/api/tts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId }),
      })
      if (!r.ok) throw new Error(await r.text())
      const url = URL.createObjectURL(await r.blob())
      const a = new Audio(url)
      audioRef.current = a
      a.onended = () => { setState('idle'); URL.revokeObjectURL(url) }
      a.onerror = () => setState('idle')
      await a.play()
      setState('playing')
    } catch (e) {
      console.error('Narration failed', e)
      setState('idle')
    }
  }

  return (
    <button type="button" onClick={go}
      className={cx('inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition',
        state === 'playing' ? 'bg-forest text-white' : 'bg-clay text-white hover:bg-clay-dark', className)}>
      {state === 'loading' ? <Loader2 size={15} className="animate-spin" />
        : state === 'playing' ? <Square size={14} className="fill-white" />
        : <Volume2 size={15} />}
      {state === 'loading' ? 'Loading voice…' : state === 'playing' ? 'Stop' : label}
    </button>
  )
}
