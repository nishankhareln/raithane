'use client'
import { useEffect, useMemo, useState } from 'react'
import { CalendarCheck, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { fmtNpr, type Guide } from '@/lib/mock'
import { useBookings, addBooking } from '@/lib/bookingStore'
import { useAuth } from './Auth'
import Checkout from './Checkout'
import { cx } from './ui'

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
const pretty = (s: string) => { const [y, m, dd] = s.split('-').map(Number); return new Date(y, m - 1, dd).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) }

export default function GuideBooking({ guide, creatorName }: { guide: Guide; creatorName: string }) {
  const { requireAuth } = useAuth()
  const bookings = useBookings()
  const [today, setToday] = useState<Date | null>(null)
  const [view, setView] = useState<Date | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [checkout, setCheckout] = useState(false)
  const [confirmed, setConfirmed] = useState<string | null>(null)

  // dates are resolved on the client to avoid SSR/hydration mismatch
  useEffect(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0)
    setToday(d); setView(new Date(d.getFullYear(), d.getMonth(), 1))
  }, [])

  const bookedSet = useMemo(() => {
    const s = new Set<string>()
    if (today) guide.bookedOffsets.forEach(o => s.add(iso(addDays(today, o))))
    bookings.filter(b => b.guideId === guide.id).forEach(b => s.add(b.date))
    return s
  }, [today, bookings, guide])

  return (
    <div className="rounded-2xl border-2 border-forest/25 bg-forest/5 p-4">
      <div className="flex items-center gap-2 text-forest"><CalendarCheck size={18} /><span className="font-black text-stone">Book {creatorName} as your guide</span></div>
      <p className="mt-1 text-sm text-stone/65">{guide.durationLabel} · <b className="text-forest">{fmtNpr(guide.priceNpr)}</b> · {creatorName} keeps 90%. Pick an open date — booked days are greyed out.</p>

      {confirmed ? (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-forest/10 p-3 text-sm font-bold text-forest">
          <Check size={16} className="mt-0.5 shrink-0" /> Booked for {pretty(confirmed)}. {creatorName} will confirm by message. (Demo — no real payment.)
        </div>
      ) : !today || !view ? (
        <div className="mt-3 h-44 animate-pulse rounded-xl bg-white/60" />
      ) : (
        <>
          <div className="mt-3 flex items-center justify-between">
            <button type="button" disabled={view <= new Date(today.getFullYear(), today.getMonth(), 1)}
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-sand bg-white text-stone/60 disabled:opacity-30"><ChevronLeft size={16} /></button>
            <span className="text-sm font-black text-stone">{view.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            <button type="button" disabled={view >= new Date(today.getFullYear(), today.getMonth() + 3, 1)}
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-sand bg-white text-stone/60 disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-stone/40">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(x => <div key={x}>{x}</div>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {(() => {
              const y = view.getFullYear(), m = view.getMonth()
              const pad = new Date(y, m, 1).getDay()
              const dim = new Date(y, m + 1, 0).getDate()
              const cells: (Date | null)[] = []
              for (let i = 0; i < pad; i++) cells.push(null)
              for (let dd = 1; dd <= dim; dd++) cells.push(new Date(y, m, dd))
              return cells.map((dt, i) => {
                if (!dt) return <div key={i} />
                const id = iso(dt)
                const past = dt < today
                const booked = bookedSet.has(id)
                const disabled = past || booked
                const sel = picked === id
                return (
                  <button key={i} type="button" disabled={disabled} onClick={() => setPicked(id)}
                    title={booked ? 'Already booked' : past ? 'Past date' : 'Available'}
                    className={cx('flex aspect-square items-center justify-center rounded-lg text-xs font-bold transition',
                      sel ? 'bg-forest text-white shadow' :
                      booked ? 'cursor-not-allowed bg-clay/10 text-clay/40 line-through' :
                      past ? 'cursor-not-allowed text-stone/25' :
                      'bg-white text-stone hover:bg-forest/15')}>
                    {dt.getDate()}
                  </button>
                )
              })
            })()}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-stone/50">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded border border-sand bg-white" /> open</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-clay/15" /> booked</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-forest" /> your pick</span>
          </div>

          <button type="button" disabled={!picked}
            onClick={() => requireAuth('to book this guide', () => setCheckout(true))}
            className={cx('mt-3 w-full rounded-full py-2.5 text-sm font-black text-white transition',
              picked ? 'bg-forest hover:brightness-95' : 'cursor-not-allowed bg-stone/30')}>
            {picked ? `Book for ${pretty(picked)} · ${fmtNpr(guide.priceNpr)}` : 'Select an available date'}
          </button>
        </>
      )}

      <Checkout open={checkout} onClose={() => setCheckout(false)}
        onDone={() => { if (picked) { addBooking(guide.id, picked); setConfirmed(picked); setPicked(null) } }}
        title={`Book ${creatorName}`} subtitle={picked ? pretty(picked) : ''} amount={guide.priceNpr} creatorName={creatorName} cta="Confirm booking" />
    </div>
  )
}
