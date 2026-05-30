'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { VIBES, DESTINATIONS, CREATORS, POSTS, photo, destImg, type VibeKey } from '@/lib/mock'
import { Avatar, Stars, Media, cx } from '@/components/ui'
import { FeedCard } from '@/components/cards'

function VibeInner() {
  const sp = useSearchParams()
  const initial = (sp.get('v') as VibeKey) || null
  const [vibe, setVibe] = useState<VibeKey | null>(initial)

  const dests = vibe ? DESTINATIONS.filter(d => d.vibes.includes(vibe)) : DESTINATIONS
  const destIds = new Set(dests.map(d => d.id))
  const creators = CREATORS.filter(c => destIds.has(c.destinationId)).slice(0, 4)
  const posts = POSTS.filter(p => !p.isTip && destIds.has(p.destinationId)).slice(0, 4)
  const v = vibe ? VIBES.find(x => x.key === vibe)! : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone">What’s your vibe?</h1>
        <p className="text-sm text-stone/55">Pick a feeling — we’ll match you to places, creators and stories. Tags come from the locals themselves.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {VIBES.map(x => (
          <button key={x.key} onClick={() => setVibe(vibe === x.key ? null : x.key)}
            className={cx('hover-lift relative h-28 overflow-hidden rounded-2xl text-left text-white transition',
              vibe && vibe !== x.key && 'opacity-50')}
            style={{ outline: vibe === x.key ? '3px solid #14163f' : 'none' }}>
            <Media src={photo(x.img, x.key, 360, 240)} grad={x.grad} className="absolute inset-0 h-full w-full" />
            <span className="absolute left-4 top-4"><x.icon size={26} /></span>
            <span className="absolute bottom-3 left-4 text-base font-black">{x.label}</span>
          </button>
        ))}
      </div>

      {v && (
        <div className="flex items-center gap-2 rounded-2xl px-4 py-3 text-white" style={{ background: v.grad }}>
          <v.icon size={18} /><span className="text-sm font-bold">Showing {v.label} places across Nepal</span>
        </div>
      )}

      <section>
        <h2 className="mb-2.5 text-lg font-black text-stone">Destinations {v && `· ${v.label}`}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {dests.map(d => (
            <Link key={d.id} href={`/destination/${d.slug}`} className="hover-lift relative block h-32 overflow-hidden rounded-2xl text-white">
              <Media src={destImg(d, 600, 360)} grad={d.grad} className="absolute inset-0 h-full w-full" />
              <div className="absolute bottom-3 left-4 right-4">
                <div className="text-lg font-black">{d.name}</div>
                <div className="line-clamp-1 text-xs text-white/85">{d.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2.5 text-lg font-black text-stone">Creators to follow</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {creators.map(c => (
            <Link key={c.id} href={`/creator/${c.id}`} className="card hover-lift flex items-center gap-3 rounded-2xl p-3">
              <Avatar creator={c} size={48} />
              <div className="flex-1">
                <div className="text-sm font-black text-stone">{c.name}</div>
                <div className="line-clamp-1 text-xs text-stone/55">{c.bio}</div>
                <div className="mt-0.5"><Stars value={c.rating} size={12} /></div>
              </div>
              <ArrowRight size={16} className="text-stone/30" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2.5 text-lg font-black text-stone">Stories for this vibe</h2>
        <div className="grid gap-4 sm:grid-cols-2">{posts.map(p => <FeedCard key={p.id} post={p} />)}</div>
      </section>
    </div>
  )
}

export default function VibePage() {
  return <Suspense fallback={<div className="py-20 text-center text-stone/40">Loading…</div>}><VibeInner /></Suspense>
}
