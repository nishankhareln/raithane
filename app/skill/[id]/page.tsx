'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, CalendarCheck, Truck, Globe, Clock, Users, BadgeCheck, Star, ShieldCheck } from 'lucide-react'
import { SKILLS, REVIEWS, creatorOf, destOf, fmtNpr, photo } from '@/lib/mock'
import { Media, Stars, Pill, MoneySplit, CreatorLine, cx } from '@/components/ui'
import { Palette } from 'lucide-react'
import { useCreations, toSkill } from '@/lib/userStore'
import { useAuth } from '@/components/Auth'
import Checkout from '@/components/Checkout'

const DELIVERY = {
  IN_PERSON: { label: 'In person, on a chosen date', icon: CalendarCheck },
  SHIPPED: { label: 'Made to order & shipped', icon: Truck },
  DIGITAL: { label: 'Online, instant booking', icon: Globe },
}

export default function SkillDetail() {
  const { id } = useParams<{ id: string }>()
  const creations = useCreations()
  const { requireAuth } = useAuth()
  const skill = [...creations.filter(c => c.kind === 'skill').map(toSkill), ...SKILLS].find(s => s.id === id)
  const [checkout, setCheckout] = useState(false)
  const [booked, setBooked] = useState(false)
  const [myRating, setMyRating] = useState(0)
  const [myReview, setMyReview] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!skill) return <div className="py-20 text-center text-stone/50">Skill not found. <Link href="/skills" className="font-bold text-forest">Browse skills</Link></div>

  const c = creatorOf(skill.creatorId), d = destOf(skill.destinationId)
  const del = DELIVERY[skill.delivery]; const DI = del.icon

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href="/skills" className="inline-flex items-center gap-1.5 text-sm font-bold text-stone/55 hover:text-forest"><ArrowLeft size={16} /> Back to skills</Link>

      <Media src={skill.imgSrc || photo(skill.img, skill.id, 1000, 640)} grad={skill.grad} className="h-60 w-full rounded-3xl">
        <span className="absolute left-3 top-3"><Pill color="#14b8a6" soft={false}><Palette size={13} /> Bookable skill</Pill></span>
      </Media>

      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/destination/${d.slug}`} className="text-sm font-bold text-stone/50">📍 {d.name}</Link>
          <h1 className="mt-1 text-2xl font-black text-stone md:text-3xl">{skill.title}</h1>
        </div>
        <Stars value={skill.rating} />
      </div>

      <p className="text-[15px] leading-relaxed text-stone/80">{skill.description}</p>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Fact icon={DI} label={del.label} />
        {skill.durationMin && <Fact icon={Clock} label={`${skill.durationMin} minutes`} />}
        <Fact icon={Users} label={`${skill.slotsToday} slots today`} />
      </div>

      <div className="rounded-2xl border border-sand bg-white p-4">
        <CreatorLine creator={c} />
      </div>

      {!booked ? (
        <div className="card sticky bottom-20 z-10 flex items-center justify-between gap-3 rounded-2xl p-4 md:bottom-4">
          <div>
            <div className="text-2xl font-black text-forest">{fmtNpr(skill.priceNpr)}</div>
            <MoneySplit amount={skill.priceNpr} compact />
          </div>
          <button onClick={() => requireAuth('to book this', () => setCheckout(true))}
            className="flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-base font-black text-white hover:brightness-95">
            <ShieldCheck size={18} /> Book now
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-forest/30 bg-forest/5 p-4">
          <div className="flex items-center gap-2 text-forest"><BadgeCheck size={18} /><span className="font-black">Booked! {fmtNpr(skill.priceNpr)} sent to {c.name}.</span></div>
          {!submitted ? (
            <div className="mt-3">
              <div className="text-sm font-bold text-stone">Leave a verified review</div>
              <div className="mt-1.5 flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setMyRating(n)}>
                    <Star size={26} className={cx(n <= myRating ? 'fill-gold text-gold' : 'text-stone/25')} />
                  </button>
                ))}
              </div>
              <textarea value={myReview} onChange={e => setMyReview(e.target.value)} rows={2}
                placeholder="How was it? (only buyers can review — that’s what keeps stars honest)"
                className="mt-2 w-full rounded-xl border border-sand bg-white p-2.5 text-sm outline-none" />
              <button disabled={!myRating} onClick={() => setSubmitted(true)}
                className="mt-2 rounded-full bg-clay px-4 py-2 text-sm font-bold text-white disabled:opacity-40">Post verified review</button>
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-sand bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-stone">You</span>
                <Stars value={myRating} showNum={false} />
              </div>
              {myReview && <p className="mt-1 text-sm text-stone/70">{myReview}</p>}
              <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-forest"><BadgeCheck size={12} /> Verified purchase · just now</div>
            </div>
          )}
        </div>
      )}

      {/* existing reviews */}
      <section className="border-t border-sand pt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-black text-stone">Verified reviews ({skill.reviews})</h2>
          <Stars value={skill.rating} />
        </div>
        <div className="space-y-2.5">
          {REVIEWS.map(r => (
            <div key={r.id} className="rounded-xl border border-sand bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-stone">{r.author}</span>
                <Stars value={r.rating} showNum={false} />
              </div>
              <p className="mt-1 text-sm text-stone/70">{r.comment}</p>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-forest"><BadgeCheck size={12} /> Verified purchase · {r.daysAgo}d ago</div>
            </div>
          ))}
        </div>
      </section>

      <Checkout open={checkout} onClose={() => setCheckout(false)} onDone={() => setBooked(true)}
        title="Book this experience" subtitle={skill.title} amount={skill.priceNpr} creatorName={c.name} cta="Book" />
    </div>
  )
}

function Fact({ icon: Icon, label }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string }) {
  return (
    <div className="rounded-xl border border-sand bg-white px-2 py-3">
      <Icon size={18} className="mx-auto text-forest" />
      <div className="mt-1 text-[11px] font-semibold text-stone/65">{label}</div>
    </div>
  )
}
