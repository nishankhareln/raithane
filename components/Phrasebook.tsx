'use client'
import { Volume2, Info, Mic } from 'lucide-react'
import type { Phrase } from '@/lib/mock'

function speak(text: string, lang = 'ne-NP') {
  try {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang; u.rate = 0.85
    speechSynthesis.cancel(); speechSynthesis.speak(u)
  } catch {}
}

export default function Phrasebook({ phrases, origLang = 'Nepali', sampleNote, locked = 0 }:
  { phrases: Phrase[]; origLang?: string; sampleNote?: string; locked?: number }) {
  // speak the Nepali if present (TTS has Nepali/Hindi voices); else the original
  const ttsLang = 'ne-NP'
  return (
    <div className="space-y-2">
      {phrases.map((p, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-sand bg-white p-3">
          <button type="button" onClick={(e) => { e.preventDefault(); speak(p.ne || p.original, ttsLang) }} title="Hear it"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-clay/10 text-clay hover:bg-clay hover:text-white">
            <Volume2 size={17} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-extrabold leading-tight text-stone"
              style={{ fontFamily: 'var(--font-deva), system-ui, sans-serif' }}>{p.original}</div>
            <div className="text-xs italic text-stone/50">{p.roman}</div>
            {p.ne && <div className="text-xs font-semibold text-forest">नेपाली: {p.ne}</div>}
            <div className="text-sm text-stone/75">{p.en}</div>
          </div>
        </div>
      ))}

      {locked > 0 && (
        <div className="rounded-xl border border-dashed border-clay/40 bg-clay/5 p-3 text-center text-sm font-semibold text-clay">
          + {locked} more phrase{locked === 1 ? '' : 's'} — unlock below to see &amp; hear them all
        </div>
      )}

      {sampleNote && (
        <div className="flex items-start gap-1.5 text-[11px] text-stone/50">
          <Info size={13} className="mt-0.5 shrink-0" /> {sampleNote}
        </div>
      )}

      {origLang !== 'Nepali' && origLang !== 'English' && (
        <div className="flex items-start gap-1.5 text-[11px] text-stone/45">
          <Mic size={12} className="mt-0.5 shrink-0" />
          <span>Recorded in <b>{origLang}</b> by an elder · translated to Nepali by a paid local youth · English added after. The original voice is always preserved.</span>
        </div>
      )}
    </div>
  )
}
