'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, BadgeCheck, Users, HeartHandshake, Trophy, Heart } from 'lucide-react'
import { CREATORS, POSTS, SKILLS, SUPPORTERS, destOf, fmtNpr } from '@/lib/mock'
import { useCreations, toPost, toSkill } from '@/lib/userStore'
import { useAuth } from '@/components/Auth'
import { useFollows, toggleFollow } from '@/lib/social'
import { Avatar, Stars, Pill, cx } from '@/components/ui'
import { FeedCard, SkillCard } from '@/components/cards'
import Checkout from '@/components/Checkout'

const TIPS = [200, 500, 1000]

export default function CreatorProfile() {
  const { id } = useParams<{ id: string }>()
  const c = CREATORS.find(x => x.id === id)
  const [tab, setTab] = useState<'posts' | 'skills'>('posts')
  const [tip, setTip] = useState(0)
  const [checkout, setCheckout] = useState(false)
  const [supporters, setSupporters] = useState(SUPPORTERS)
  const creations = useCreations()
  const { user, requireAuth } = useAuth()
  const follows = useFollows(user?.id)
  const following = !!c && follows.includes(c.id)

  if (!c) return <div className="py-20 text-center text-stone/50">Creator not found.</div>
  const d = destOf(c.destinationId)
  const posts = [...creations.filter(x => x.kind === 'post' && x.creatorId === c.id).map(toPost), ...POSTS.filter(p => p.creatorId === c.id && !p.isTip)]
  const skills = [...creations.filter(x => x.kind === 'skill' && x.creatorId === c.id).map(toSkill), ...SKILLS.filter(s => s.creatorId === c.id)]

  return (
    <div className="space-y-5">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-stone/55 hover:text-clay"><ArrowLeft size={16} /> Back</Link>

      {/* header */}
      <div className="relative overflow-hidden rounded-3xl p-5 text-white" style={{ background: 'linear-gradient(135deg,#16a34a,#2563eb)' }}>
        <div className="relative flex items-start gap-4">
          <Avatar creator={c} size={80} />
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-2xl font-black">{c.name}{c.verified && <BadgeCheck size={20} />}</div>
            <div className="text-sm text-white/85">📍 {d.name}, {d.district}</div>
            <div className="mt-1.5 flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1 font-bold"><span className="rounded bg-white/20 px-1.5 py-0.5">★ {c.rating}</span> {c.reviews} reviews</span>
              <span className="flex items-center gap-1"><Users size={14} /> {c.followers.toLocaleString()}</span>
              <span className="flex items-center gap-1"><HeartHandshake size={14} /> {c.supporters} supporters</span>
            </div>
          </div>
        </div>
        <p className="relative mt-3 text-sm text-white/90">{c.bio}</p>
        <div className="relative mt-4 flex gap-2">
          <button onClick={() => requireAuth('to follow', () => user && toggleFollow(user.id, c.id))}
            className={cx('flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold', following ? 'bg-white/20 text-white' : 'bg-white text-stone')}>
            <Heart size={15} className={following ? 'fill-white' : ''} /> {following ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>

      {/* SUPPORT (was donations) */}
      <div className="rounded-2xl border-2 border-clay/25 bg-clay/5 p-4">
        <div className="flex items-center gap-2 text-clay"><HeartHandshake size={18} /><span className="font-black">Support {c.name} directly</span></div>
        <p className="mt-1 text-sm text-stone/65">A tip is pure patronage — no unlock, no booking. {c.name} keeps 90%.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {TIPS.map(t => (
            <button key={t} onClick={() => { setTip(t); setCheckout(true) }}
              className="rounded-full border-2 border-clay/30 bg-white px-4 py-2 text-sm font-bold text-clay hover:bg-clay hover:text-white">
              {fmtNpr(t)}
            </button>
          ))}
        </div>
      </div>

      {/* top supporters */}
      <div>
        <h2 className="mb-2 flex items-center gap-1.5 text-lg font-black text-stone"><Trophy size={18} className="text-gold" /> Top supporters</h2>
        <div className="card divide-y divide-sand rounded-2xl">
          {supporters.slice(0, 5).map((s, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5">
              <span className="w-5 text-center font-black text-stone/40">{['🥇', '🥈', '🥉'][i] || i + 1}</span>
              <div className="flex-1">
                <div className="text-sm font-bold text-stone">{s.anon ? 'Anonymous Friend' : s.name}</div>
                <div className="text-[11px] text-stone/45">{s.country}</div>
              </div>
              <div className="font-black text-clay">{fmtNpr(s.amountNpr)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* content tabs */}
      <div className="flex gap-2">
        {(['posts', 'skills'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cx('flex-1 rounded-full py-2 text-sm font-bold', tab === t ? 'bg-stone text-white' : 'border border-sand bg-white text-stone/55')}>
            {t === 'posts' ? `Stories (${posts.length})` : `Skills (${skills.length})`}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {tab === 'posts' ? posts.map(p => <FeedCard key={p.id} post={p} />) : skills.map(s => <SkillCard key={s.id} skill={s} />)}
      </div>

      <Checkout open={checkout} onClose={() => setCheckout(false)}
        onDone={() => setSupporters(s => [{ name: 'You', amountNpr: tip, country: 'You' }, ...s].sort((a, b) => b.amountNpr - a.amountNpr))}
        title={`Support ${c.name}`} subtitle="Direct patronage" amount={tip} creatorName={c.name} cta="Support" />
    </div>
  )
}
