'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Compass, Sparkles, ArrowRight, type LucideIcon } from 'lucide-react'
import {
  POSTS, SKILLS, VIBES, CATEGORIES, CREATORS, DESTINATIONS, destOf, photo, CURRENT_USER,
  type CategoryKey,
} from '@/lib/mock'
import { FeedCard, SkillCard, TipCard } from '@/components/cards'
import { Media, cx } from '@/components/ui'
import { useCreations, toPost, toSkill } from '@/lib/userStore'

type Item = { kind: 'post'; id: string } | { kind: 'skill'; id: string }

export default function HomeFeed() {
  const [cat, setCat] = useState<CategoryKey | 'ALL'>('ALL')
  const creations = useCreations()
  const userPosts = creations.filter(c => c.kind === 'post').map(toPost)
  const userSkills = creations.filter(c => c.kind === 'skill').map(toSkill)
  const allPosts = [...userPosts, ...POSTS]
  const allSkills = [...userSkills, ...SKILLS]
  const tips = allPosts.filter(p => p.isTip)
  const content = allPosts.filter(p => !p.isTip)
  const trip = destOf(CURRENT_USER.tripDestinationId)
  const postById = (id: string) => allPosts.find(p => p.id === id)!
  const skillById = (id: string) => allSkills.find(s => s.id === id)!

  const items: Item[] = useMemo(() => {
    if (cat === 'SKILL') return allSkills.map(s => ({ kind: 'skill', id: s.id }))
    if (cat === 'ALL') {
      const out: Item[] = []
      const cs = content.map(p => ({ kind: 'post', id: p.id } as Item))
      const sk = allSkills.map(s => ({ kind: 'skill', id: s.id } as Item))
      let i = 0, j = 0
      while (i < cs.length || j < sk.length) {
        if (i < cs.length) { out.push(cs[i++]); if (i % 3 === 0 && j < sk.length) out.push(sk[j++]) }
        else if (j < sk.length) out.push(sk[j++])
      }
      return out
    }
    return content.filter(p => p.category === cat).map(p => ({ kind: 'post', id: p.id }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, creations])

  return (
    <div className="space-y-7">
      {/* HERO — reference-style split: navy text panel + real image */}
      <section className="overflow-hidden rounded-3xl border border-sand">
        <div className="grid md:grid-cols-2">
          <div className="p-6 text-white md:p-10" style={{ background: 'linear-gradient(135deg,#16a34a 0%,#0b2a4a 80%)' }}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
              <Sparkles size={13} /> Nepal, through the people who live it
            </span>
            <h1 className="mt-3 text-3xl font-black leading-tight md:text-[2.7rem]">
              Discover Nepal.<br /><span className="text-gold">Pay the locals</span> who make it real.
            </h1>
            <p className="mt-3 text-sm text-white/80 md:text-base">
              Stories, food, festivals and skills shared by the people who live them — unlock culture and book real experiences, and <b className="text-white">90% goes straight to the local</b>.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/vibe" className="flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-bold text-navy shadow transition hover:scale-[1.03]">
                <Sparkles size={16} /> Find your vibe
              </Link>
              <Link href="/explore" className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-sm font-bold text-white backdrop-blur hover:bg-white/25">
                <Compass size={16} /> Explore the map
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              <Stat n={`${CREATORS.length}+`} l="verified creators" />
              <Stat n={`${DESTINATIONS.length}`} l="destinations" />
              <Stat n="90%" l="goes to locals" />
            </div>
          </div>
          <Media src={photo('nepal,himalaya,village', 7, 900, 900)} className="min-h-[220px] md:min-h-full" overlay={false} />
        </div>
      </section>

      {/* trip-context personalization */}
      <Link href={`/destination/${trip.slug}`} className="flex items-center gap-3 rounded-2xl border border-plum/25 bg-plum/5 px-4 py-3 hover:bg-plum/10">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-plum/15 text-plum"><Compass size={20} /></span>
        <div className="flex-1">
          <div className="text-sm font-bold text-stone">Because you’re visiting <span className="text-plum">{trip.name}</span></div>
          <div className="text-xs text-stone/55">Your feed is tuned to your trip and your vibes. Tap to open the {trip.name} hub.</div>
        </div>
        <ArrowRight size={18} className="text-plum" />
      </Link>

      {/* DISCOVER BY VIBE — real photos */}
      <section>
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-lg font-black text-stone">Discover by vibe</h2>
          <Link href="/vibe" className="text-xs font-bold text-clay">See all →</Link>
        </div>
        <div className="no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
          {VIBES.map(v => (
            <Link key={v.key} href={`/vibe?v=${v.key}`} className="hover-lift shrink-0">
              <Media src={photo(v.img, v.key, 320, 220)} grad={v.grad} className="h-24 w-36 rounded-2xl">
                <span className="absolute left-3 top-3 text-white"><v.icon size={20} /></span>
                <span className="absolute bottom-2.5 left-3 text-sm font-black text-white">{v.label}</span>
              </Media>
            </Link>
          ))}
        </div>
      </section>

      {/* LOCAL KNOW-HOW strip */}
      {tips.length > 0 && (
        <section>
          <h2 className="mb-2.5 text-lg font-black text-stone">Local know-how</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{tips.map(t => <TipCard key={t.id} post={t} />)}</div>
        </section>
      )}

      {/* CATEGORY TABS + FEED */}
      <section>
        <div className="no-scrollbar -mx-1 mb-4 flex gap-2 overflow-x-auto px-1">
          <Tab on={cat === 'ALL'} onClick={() => setCat('ALL')} label="For you" icon={Sparkles} />
          {CATEGORIES.map(c => <Tab key={c.key} on={cat === c.key} onClick={() => setCat(c.key)} label={c.label} icon={c.icon} color={c.color} />)}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map(it => it.kind === 'post'
            ? <FeedCard key={'p' + it.id} post={postById(it.id)} />
            : <SkillCard key={'s' + it.id} skill={skillById(it.id)} />)}
        </div>
      </section>
    </div>
  )
}

function Stat({ n, l }: { n: string; l: string }) {
  return <span className="leading-none"><span className="block text-2xl font-black">{n}</span><span className="text-xs text-white/70">{l}</span></span>
}

function Tab({ on, onClick, label, icon: Icon, color = '#3b39e0' }: { on: boolean; onClick: () => void; label: string; icon: LucideIcon; color?: string }) {
  return (
    <button onClick={onClick} className="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition"
      style={on ? { background: color, color: '#fff' } : { background: '#fff', color: '#5b5e80', border: '1px solid #e3e7f5' }}>
      <Icon size={15} /> {label}
    </button>
  )
}
