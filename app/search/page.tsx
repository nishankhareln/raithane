'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, ArrowRight } from 'lucide-react'
import { DESTINATIONS, POSTS, SKILLS, CREATORS, destImg } from '@/lib/mock'
import { FeedCard, SkillCard } from '@/components/cards'
import { Avatar, Stars, Media, SectionHeader } from '@/components/ui'
import { useCreations, toPost, toSkill } from '@/lib/userStore'

function has(hay: string | undefined, q: string) { return (hay ?? '').toLowerCase().includes(q) }

function Results() {
  const sp = useSearchParams()
  const q = (sp.get('q') || '').trim().toLowerCase()
  const creations = useCreations()
  const allPosts = [...creations.filter(c => c.kind === 'post').map(toPost), ...POSTS]
  const allSkills = [...creations.filter(c => c.kind === 'skill').map(toSkill), ...SKILLS]

  const dests = DESTINATIONS.filter(d => has(d.name, q) || has(d.description, q) || has(d.district, q))
  const posts = allPosts.filter(p => !p.isTip && (has(p.title, q) || has(p.teaser, q) || has(p.category, q) || has(DESTINATIONS.find(d => d.id === p.destinationId)?.name, q)))
  const skills = allSkills.filter(s => has(s.title, q) || has(s.description, q))
  const creators = CREATORS.filter(c => has(c.name, q) || has(c.bio, q))
  const total = dests.length + posts.length + skills.length + creators.length

  if (!q) return <div className="py-20 text-center text-stone/50">Type something in the search bar above.</div>

  return (
    <div className="space-y-7">
      <SectionHeader title={`Results for “${q}”`} sub={`${total} match${total === 1 ? '' : 'es'} across places, stories, skills & creators`} />
      {total === 0 && (
        <div className="rounded-2xl border border-sand bg-white p-10 text-center text-stone/50">
          <Search size={28} className="mx-auto mb-2 text-stone/30" />
          Nothing found. Try “Pokhara”, “pottery”, “dal bhat”, “temple”, or “weaving”.
        </div>
      )}

      {dests.length > 0 && (
        <section>
          <h2 className="mb-2.5 text-lg font-black text-stone">Places</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {dests.map(d => (
              <Link key={d.id} href={`/destination/${d.slug}`} className="card hover-lift relative block h-28 overflow-hidden rounded-2xl text-white">
                <Media src={destImg(d, 600, 300)} grad={d.grad} className="absolute inset-0 h-full w-full" />
                <div className="absolute bottom-3 left-4"><div className="text-lg font-black">{d.name}</div><div className="text-xs text-white/85">{d.district}</div></div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {creators.length > 0 && (
        <section>
          <h2 className="mb-2.5 text-lg font-black text-stone">Creators</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {creators.map(c => (
              <Link key={c.id} href={`/creator/${c.id}`} className="card hover-lift flex items-center gap-3 rounded-2xl p-3">
                <Avatar creator={c} size={44} />
                <div className="flex-1"><div className="text-sm font-black text-stone">{c.name}</div><div className="line-clamp-1 text-xs text-stone/55">{c.bio}</div><Stars value={c.rating} size={12} /></div>
                <ArrowRight size={16} className="text-stone/30" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section>
          <h2 className="mb-2.5 text-lg font-black text-stone">Stories</h2>
          <div className="grid gap-4 sm:grid-cols-2">{posts.map(p => <FeedCard key={p.id} post={p} />)}</div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="mb-2.5 text-lg font-black text-stone">Skills</h2>
          <div className="grid gap-4 sm:grid-cols-2">{skills.map(s => <SkillCard key={s.id} skill={s} />)}</div>
        </section>
      )}
    </div>
  )
}

export default function SearchPage() {
  return <Suspense fallback={<div className="py-20 text-center text-stone/40">Searching…</div>}><Results /></Suspense>
}
