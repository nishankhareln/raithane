'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Trophy, HeartHandshake, ArrowRight, BadgeCheck, MapPin } from 'lucide-react'
import { PROJECTS, SUPPORTERS, CREATORS, destOf, creatorOf, fmtNpr, photo } from '@/lib/mock'
import { Avatar, Media, SectionHeader, cx } from '@/components/ui'
import Checkout from '@/components/Checkout'

export default function SupportPage() {
  const [raised, setRaised] = useState<Record<string, number>>(Object.fromEntries(PROJECTS.map(p => [p.id, p.raisedNpr])))
  const [checkout, setCheckout] = useState<{ amount: number; name: string; title: string; id: string } | null>(null)

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-3xl p-6 text-white md:p-8" style={{ background: 'linear-gradient(135deg,#16a34a,#2563eb)' }}>
        <h1 className="text-2xl font-black md:text-3xl">Support & preservation</h1>
        <p className="mt-2 max-w-lg text-sm text-white/85">Back a restoration project or tip a creator directly. No unlock, no booking — pure patronage, and 90% reaches the local hands doing the work.</p>
      </section>

      {/* preservation projects */}
      <section>
        <SectionHeader title="Preservation projects" sub="Fund the repair of heritage objects, places and archives — with proof." />
        <div className="grid gap-4 md:grid-cols-2">
          {PROJECTS.map(p => {
            const d = destOf(p.destinationId), lead = creatorOf(p.leadCreatorId)
            const cur = raised[p.id]; const pct = Math.min(100, Math.round((cur / p.goalNpr) * 100))
            return (
              <div key={p.id} className="card overflow-hidden rounded-2xl">
                <Media src={photo(p.img, p.id, 600, 320)} className="h-28 w-full">
                  {p.restored && <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-black text-forest">✓ Restored</span>}
                </Media>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-stone/45"><MapPin size={11} /> {d.name} · led by {lead.name}</div>
                  <h3 className="mt-0.5 font-black text-stone">{p.title}</h3>
                  <p className="mt-1 text-xs text-stone/60">{p.desc}</p>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-sand">
                    <div className="h-full rounded-full bg-forest" style={{ width: pct + '%' }} />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] font-semibold text-stone/55">
                    <span>{fmtNpr(cur)} of {fmtNpr(p.goalNpr)}</span><span>{pct}%</span>
                  </div>
                  {!p.restored && (
                    <div className="mt-2.5 flex gap-2">
                      {[500, 2000].map(a => (
                        <button key={a} onClick={() => setCheckout({ amount: a, name: lead.name, title: p.title, id: p.id })}
                          className="rounded-full bg-forest px-3.5 py-1.5 text-xs font-bold text-white">Back {fmtNpr(a)}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* top supporters */}
      <section>
        <h2 className="mb-2.5 flex items-center gap-1.5 text-lg font-black text-stone"><Trophy size={18} className="text-gold" /> Top supporters</h2>
        <div className="card divide-y divide-sand rounded-2xl">
          {SUPPORTERS.map((s, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white" style={{ background: ['#d4a017', '#9ca3af', '#b45309'][i] || '#cbd5e1' }}>{i + 1}</span>
              <div className="flex-1"><div className="text-sm font-bold text-stone">{s.anon ? 'Anonymous Friend' : s.name}</div><div className="text-[11px] text-stone/45">{s.country}</div></div>
              <div className="font-black text-clay">{fmtNpr(s.amountNpr)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* support a creator */}
      <section>
        <SectionHeader title="Support a creator" sub="Tip the locals whose stories you loved." />
        <div className="grid gap-3 sm:grid-cols-2">
          {CREATORS.slice(0, 4).map(c => (
            <div key={c.id} className="card flex items-center gap-3 rounded-2xl p-3">
              <Avatar creator={c} size={44} />
              <div className="flex-1">
                <div className="flex items-center gap-1 text-sm font-black text-stone">{c.name}{c.verified && <BadgeCheck size={13} className="text-lake" />}</div>
                <div className="text-[11px] text-stone/50">{c.supporters} supporters · ★ {c.rating}</div>
              </div>
              <button onClick={() => setCheckout({ amount: 500, name: c.name, title: `Support ${c.name}`, id: c.id })}
                className="rounded-full bg-clay px-3.5 py-1.5 text-xs font-bold text-white hover:bg-clay-dark">Tip ₨500</button>
            </div>
          ))}
        </div>
      </section>

      <Checkout open={!!checkout} onClose={() => setCheckout(null)}
        onDone={() => checkout && setRaised(r => ({ ...r, [checkout.id]: (r[checkout.id] ?? 0) + checkout.amount }))}
        title={checkout?.title ?? ''} subtitle="Direct support" amount={checkout?.amount ?? 0} creatorName={checkout?.name ?? ''} cta="Give" />
    </div>
  )
}
