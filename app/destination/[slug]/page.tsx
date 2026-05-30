'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, MapPin, LayoutGrid } from 'lucide-react'
import { DESTINATIONS, POSTS, SKILLS, CATEGORIES, VIBES, photo, type CategoryKey } from '@/lib/mock'
import { FeedCard, SkillCard, TipCard } from '@/components/cards'
import { Pill, Media, cx } from '@/components/ui'
import type { LucideIcon } from 'lucide-react'

export default function DestinationHub() {
  const { slug } = useParams<{ slug: string }>()
  const d = DESTINATIONS.find(x => x.slug === slug)
  const [cat, setCat] = useState<CategoryKey | 'ALL'>('ALL')
  if (!d) return <div className="py-20 text-center text-stone/50">Destination not found.</div>

  const posts = POSTS.filter(p => p.destinationId === d.id && !p.isTip)
  const tips = POSTS.filter(p => p.destinationId === d.id && p.isTip)
  const skills = SKILLS.filter(s => s.destinationId === d.id)
  const shown = cat === 'ALL' ? posts : cat === 'SKILL' ? [] : posts.filter(p => p.category === cat)

  return (
    <div className="space-y-5">
      <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm font-bold text-stone/55 hover:text-clay"><ArrowLeft size={16} /> All destinations</Link>

      <div className="relative overflow-hidden rounded-3xl text-white">
        <Media src={photo(d.img, d.id, 1200, 520)} grad={d.grad} className="absolute inset-0 h-full w-full" />
        <div className="relative p-6 md:p-8" style={{ background: 'linear-gradient(90deg,rgba(11,42,74,.82),rgba(11,42,74,.25))' }}>
          <div className="flex items-center gap-1 text-sm text-white/85"><MapPin size={14} /> {d.district}</div>
          <h1 className="text-3xl font-black md:text-4xl">{d.name}</h1>
          <p className="mt-2 max-w-lg text-sm text-white/90">{d.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {d.vibes.map(vk => { const v = VIBES.find(x => x.key === vk)!; const VI = v.icon; return <span key={vk} className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur"><VI size={12} /> {v.label}</span> })}
          </div>
        </div>
      </div>

      {tips.length > 0 && (
        <section>
          <h2 className="mb-2 text-base font-black text-stone">💡 Local know-how</h2>
          <div className="grid gap-3 sm:grid-cols-2">{tips.map(t => <TipCard key={t.id} post={t} />)}</div>
        </section>
      )}

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
        <Tab on={cat === 'ALL'} onClick={() => setCat('ALL')} label="All" icon={LayoutGrid} />
        {CATEGORIES.map(c => <Tab key={c.key} on={cat === c.key} onClick={() => setCat(c.key)} label={c.label} icon={c.icon} color={c.color} />)}
      </div>

      {cat === 'SKILL' || cat === 'ALL' ? (
        <>
          {cat === 'ALL' && shown.length > 0 && <div className="grid gap-4 sm:grid-cols-2">{shown.map(p => <FeedCard key={p.id} post={p} />)}</div>}
          <section>
            <h2 className="mb-2 mt-2 text-base font-black text-stone">🧑‍🎨 Skills here</h2>
            <div className="grid gap-4 sm:grid-cols-2">{skills.map(s => <SkillCard key={s.id} skill={s} />)}</div>
          </section>
        </>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {shown.length ? shown.map(p => <FeedCard key={p.id} post={p} />) : <div className="col-span-2 py-10 text-center text-stone/40">No {cat.toLowerCase()} posts yet here.</div>}
        </div>
      )}
    </div>
  )
}

function Tab({ on, onClick, label, icon: Icon, color = '#3b39e0' }: { on: boolean; onClick: () => void; label: string; icon: LucideIcon; color?: string }) {
  return (
    <button onClick={onClick} className="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition"
      style={on ? { background: color, color: '#fff' } : { background: '#fff', color: '#5b5e80', border: '1px solid #e3e7f5' }}><Icon size={15} /> {label}</button>
  )
}
