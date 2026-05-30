'use client'
import { useState, useEffect } from 'react'
import { X, ShieldCheck, Loader2, PartyPopper } from 'lucide-react'
import { fmtNpr, split } from '@/lib/mock'
import { MoneySplit } from './ui'

type Props = {
  open: boolean
  onClose: () => void
  onDone?: () => void
  title: string
  subtitle?: string
  amount: number
  creatorName: string
  cta?: string
}

const METHODS = [
  { id: 'khalti', label: 'Khalti', color: '#5c2d91' },
  { id: 'esewa', label: 'eSewa', color: '#60bb46' },
  { id: 'card', label: 'Card', color: '#2f6f8f' },
]

export default function Checkout({ open, onClose, onDone, title, subtitle, amount, creatorName, cta = 'Pay' }: Props) {
  const [stage, setStage] = useState<'review' | 'paying' | 'done'>('review')
  const [method, setMethod] = useState('khalti')

  useEffect(() => { if (open) setStage('review') }, [open])
  if (!open) return null

  const pay = () => {
    setStage('paying')
    setTimeout(() => setStage('done'), 1100)
  }
  const finish = () => { onDone?.(); onClose() }
  const s = split(amount)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div className="card w-full max-w-md overflow-hidden rounded-t-3xl sm:rounded-3xl rise" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-sand px-5 py-3.5">
          <div>
            <div className="text-base font-black text-stone">{title}</div>
            {subtitle && <div className="text-xs text-stone/55">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="text-stone/40 hover:text-stone"><X size={20} /></button>
        </div>

        {stage === 'review' && (
          <div className="space-y-4 p-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-stone/60">Amount</span>
              <span className="text-2xl font-black text-stone">{fmtNpr(amount)}</span>
            </div>
            <MoneySplit amount={amount} />
            <div>
              <div className="mb-1.5 text-xs font-bold text-stone/55">Pay with (demo — no real charge)</div>
              <div className="grid grid-cols-3 gap-2">
                {METHODS.map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    className="rounded-xl border-2 py-2.5 text-sm font-bold transition"
                    style={method === m.id ? { borderColor: m.color, background: m.color + '14', color: m.color } : { borderColor: '#ece2cf', color: '#7a7064' }}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={pay}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-clay py-3 text-sm font-black text-white hover:bg-clay-dark">
              <ShieldCheck size={17} /> {cta} {fmtNpr(amount)}
            </button>
            <p className="text-center text-[11px] text-stone/40">Mock checkout. Production: Khalti / eSewa / ConnectIPS.</p>
          </div>
        )}

        {stage === 'paying' && (
          <div className="flex flex-col items-center gap-3 px-5 py-12">
            <Loader2 size={40} className="animate-spin text-clay" />
            <div className="text-sm font-bold text-stone/70">Sending money to {creatorName}…</div>
          </div>
        )}

        {stage === 'done' && (
          <div className="flex flex-col items-center gap-2 px-5 py-9 text-center">
            <div className="pop flex h-16 w-16 items-center justify-center rounded-full bg-forest/15 text-forest"><PartyPopper size={32} /></div>
            <div className="text-lg font-black text-forest">Paid!</div>
            <p className="text-sm text-stone/70">
              <b className="text-forest">{fmtNpr(s.creator)}</b> went straight to <b>{creatorName}</b>.
            </p>
            <p className="text-[11px] text-stone/45">Platform fee {fmtNpr(s.fee)} · this unlocks a verified review.</p>
            <button onClick={finish} className="mt-3 w-full rounded-full bg-forest py-2.5 text-sm font-black text-white">Done</button>
          </div>
        )}
      </div>
    </div>
  )
}
