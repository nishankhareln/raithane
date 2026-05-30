'use client'
import Link from 'next/link'
import { TrendingUp, Eye, Star, Users, Lock, Store, HeartHandshake, BadgeCheck, LogIn, type LucideIcon } from 'lucide-react'
import { creatorOf, fmtNpr, split, PLATFORM_FEE } from '@/lib/mock'
import { Avatar, MoneySplit } from '@/components/ui'
import { useAuth } from '@/components/Auth'

export default function Dashboard() {
  const { user, openAuth } = useAuth()
  if (!user) return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-clay/10 text-clay"><LogIn size={26} /></div>
      <h1 className="text-2xl font-black text-stone">Sign in to see your dashboard</h1>
      <p className="mt-1 text-sm text-stone/55">Your earnings and stats are private to your account.</p>
      <button onClick={() => openAuth('to view your dashboard')} className="mt-5 rounded-full bg-clay px-6 py-2.5 text-sm font-black text-white hover:bg-clay-dark">Sign in</button>
    </div>
  )
  const me = creatorOf('maya')
  const grossMonth = Math.round(me.earningsMonth / (1 - PLATFORM_FEE))
  const s = split(grossMonth)

  const sources = [
    { label: 'Premium unlocks', icon: Lock, color: '#c1502e', gross: 14800, count: 62 },
    { label: 'Skill bookings', icon: Store, color: '#3f6f52', gross: 26000, count: 21 },
    { label: 'Support & tips', icon: HeartHandshake, color: '#8a5a9e', gross: 5000, count: 12 },
  ]
  const txns = [
    { who: 'Hannah (DE)', item: 'Cook Dal Bhat — booking', gross: 1200, type: 'Booking' },
    { who: 'Kenji (JP)', item: 'Tamu Lhosar fire dance — unlock', gross: 300, type: 'Unlock' },
    { who: 'Anonymous', item: 'Direct support', gross: 1000, type: 'Tip' },
    { who: 'Sofia (ES)', item: 'Dal Bhat recipe — unlock', gross: 250, type: 'Unlock' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Avatar creator={me} size={48} />
        <div>
          <div className="flex items-center gap-1.5 text-xl font-black text-stone">{me.name}{me.verified && <BadgeCheck size={18} className="text-lake" />}</div>
          <div className="text-sm text-stone/55">Creator earnings dashboard</div>
        </div>
      </div>

      {/* hero earnings */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#16a34a,#2563eb)' }}>
          <div className="text-sm font-semibold text-white/80">You earned this month</div>
          <div className="mt-1 text-4xl font-black">{fmtNpr(s.creator)}</div>
          <div className="mt-1 flex items-center gap-1 text-sm text-white/85"><TrendingUp size={15} /> +18% vs last month</div>
          <div className="mt-4 rounded-xl bg-white/15 p-3 backdrop-blur">
            <div className="flex justify-between text-xs"><span>Gross sales</span><span className="font-bold">{fmtNpr(s.gross)}</span></div>
            <div className="flex justify-between text-xs"><span>Platform fee (10%)</span><span className="font-bold">− {fmtNpr(s.fee)}</span></div>
            <div className="mt-1 flex justify-between border-t border-white/25 pt-1 text-sm font-black"><span>You keep</span><span>{fmtNpr(s.creator)}</span></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat icon={Eye} label="Views this month" value="34,210" color="#2f6f8f" />
          <Stat icon={Star} label="Avg rating" value={`${me.rating}`} color="#d4a017" />
          <Stat icon={Users} label="Followers" value={me.followers.toLocaleString()} color="#c1502e" />
          <Stat icon={HeartHandshake} label="Supporters" value={`${me.supporters}`} color="#8a5a9e" />
        </div>
      </div>

      {/* breakdown by source */}
      <section>
        <h2 className="mb-2.5 text-lg font-black text-stone">Where it came from</h2>
        <div className="space-y-2.5">
          {sources.map(src => {
            const ss = split(src.gross); const A = src.icon
            const pct = Math.round((src.gross / sources.reduce((a, b) => a + b.gross, 0)) * 100)
            return (
              <div key={src.label} className="card rounded-2xl p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: src.color }}><A size={17} /></span>
                    <div>
                      <div className="text-sm font-black text-stone">{src.label}</div>
                      <div className="text-[11px] text-stone/45">{src.count} transactions</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-forest">{fmtNpr(ss.creator)}</div>
                    <div className="text-[10px] text-stone/45">of {fmtNpr(src.gross)} gross</div>
                  </div>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand"><div className="h-full rounded-full" style={{ width: pct + '%', background: src.color }} /></div>
              </div>
            )
          })}
        </div>
      </section>

      {/* recent transactions */}
      <section>
        <h2 className="mb-2.5 text-lg font-black text-stone">Recent transactions</h2>
        <div className="card divide-y divide-sand rounded-2xl">
          {txns.map((t, i) => {
            const ts = split(t.gross)
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1">
                  <div className="text-sm font-bold text-stone">{t.item}</div>
                  <div className="text-[11px] text-stone/45">{t.who} · {t.type}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-forest">+ {fmtNpr(ts.creator)}</div>
                  <div className="text-[10px] text-stone/40">fee {fmtNpr(ts.fee)}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="rounded-2xl border border-sand bg-white p-4 text-center text-sm text-stone/55">
        Want to earn here too? <Link href="/upload" className="font-bold text-clay">Share your first story →</Link>
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: string; color: string }) {
  return (
    <div className="card flex flex-col justify-between rounded-2xl p-3">
      <Icon size={18} style={{ color }} />
      <div className="mt-2"><div className="text-xl font-black text-stone">{value}</div><div className="text-[11px] text-stone/45">{label}</div></div>
    </div>
  )
}
