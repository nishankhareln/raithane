'use client'
import Link from 'next/link'
import { FileText, Store, Lock, Sparkles, LogIn, Wallet, type LucideIcon } from 'lucide-react'
import { fmtNpr, type Creator } from '@/lib/mock'
import { Avatar } from '@/components/ui'
import { useAuth } from '@/components/Auth'
import { useCreations } from '@/lib/userStore'

export default function Dashboard() {
  const { user, openAuth, requestLocal } = useAuth()
  const creations = useCreations()

  if (!user) return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-clay/10 text-clay"><LogIn size={26} /></div>
      <h1 className="text-2xl font-black text-stone">Sign in to see your dashboard</h1>
      <p className="mt-1 text-sm text-stone/55">Your earnings and stats are private to your account.</p>
      <button onClick={() => openAuth('to view your dashboard')} className="mt-5 rounded-full bg-clay px-6 py-2.5 text-sm font-black text-white hover:bg-clay-dark">Sign in</button>
    </div>
  )

  if (user.role !== 'local') return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-clay/10 text-clay"><Wallet size={26} /></div>
      <h1 className="text-2xl font-black text-stone">The dashboard is for local creators</h1>
      <p className="mt-1 text-sm text-stone/55">Earnings and stats live here once you start sharing. Switch to a creator account to begin.</p>
      <button onClick={() => requestLocal()} className="mt-5 rounded-full bg-clay px-6 py-2.5 text-sm font-black text-white hover:bg-clay-dark">Become a creator</button>
    </div>
  )

  const me: Creator = {
    id: 'me', name: user.name, img: 'traveler,backpacker,person', grad: 'linear-gradient(135deg,#16a34a,#2563eb)',
    destinationId: 'kathmandu', bio: '', rating: 0, reviews: 0, verified: false, earningsMonth: 0, followers: 0, supporters: 0,
  }
  const myPosts = creations.filter(c => c.kind === 'post')
  const mySkills = creations.filter(c => c.kind === 'skill')
  const premium = creations.filter(c => c.type === 'PREMIUM')
  const earned = 0 // honest: no real sales are recorded in this prototype

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Avatar creator={me} size={48} />
        <div>
          <div className="text-xl font-black text-stone">{user.name}</div>
          <div className="text-sm text-stone/55">Your creator dashboard</div>
        </div>
      </div>

      {/* earnings hero — honest zero state */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#16a34a,#2563eb)' }}>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-white/80"><Wallet size={15} /> You earned this month</div>
          <div className="mt-1 text-4xl font-black">{fmtNpr(earned)}</div>
          <div className="mt-1 text-sm text-white/85">
            {creations.length ? 'No sales yet — once people unlock or book, your 90% lands here.' : 'Share your first story or skill to start earning.'}
          </div>
          <div className="mt-4 rounded-xl bg-white/15 p-3 text-xs backdrop-blur">
            <div className="font-bold">How you earn</div>
            <div className="mt-1 text-white/85">You keep <b>90%</b> of every unlock, booking and tip. Example: a ₨250 unlock → <b>you get ₨225</b>, platform fee ₨25.</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat icon={FileText} label="Stories posted" value={`${myPosts.length}`} color="#2563eb" />
          <Stat icon={Store} label="Skills offered" value={`${mySkills.length}`} color="#16a34a" />
          <Stat icon={Lock} label="Premium items" value={`${premium.length}`} color="#7c3aed" />
          <Stat icon={Sparkles} label="Total content" value={`${creations.length}`} color="#0ea5e9" />
        </div>
      </div>

      {/* your content */}
      <section>
        <h2 className="mb-2.5 text-lg font-black text-stone">Your content</h2>
        {creations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sand bg-white p-10 text-center">
            <p className="text-sm text-stone/55">You haven’t shared anything yet.</p>
            <Link href="/upload" className="mt-3 inline-block rounded-full bg-clay px-5 py-2.5 text-sm font-black text-white hover:bg-clay-dark">Share your first story →</Link>
          </div>
        ) : (
          <div className="card divide-y divide-sand rounded-2xl">
            {creations.map(c => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone/5 text-stone/60">
                  {c.kind === 'skill' ? <Store size={16} /> : <FileText size={16} />}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-stone">{c.title}</div>
                  <div className="text-[11px] text-stone/45">{c.kind === 'skill' ? 'Skill' : 'Story'} · {c.type === 'PREMIUM' ? fmtNpr(c.priceNpr) : 'Free'}</div>
                </div>
                <div className="text-right text-[11px] text-stone/40">0 sales</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="rounded-2xl border border-sand bg-white p-4 text-center text-sm text-stone/55">
        Earnings, unlocks and bookings will appear here as people engage with your content. <Link href="/upload" className="font-bold text-clay">Create more →</Link>
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
