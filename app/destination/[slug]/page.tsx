'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, MapPin, LayoutGrid, Lightbulb, Store, TriangleAlert, Users } from 'lucide-react'
import { DESTINATIONS, POSTS, SKILLS, CATEGORIES, GUIDES, VIBES, destImg, alertKindOf, creatorOf, catOf, guidesOf, fmtNpr, type CategoryKey } from '@/lib/mock'
import { FeedCard, SkillCard, TipCard } from '@/components/cards'
import { Pill, Media, Avatar, Stars, VerifiedBadge, cx } from '@/components/ui'
import type { LucideIcon } from 'lucide-react'
import { useAlerts, isActive } from '@/lib/alertStore'
import AlertCard from '@/components/AlertCard'
import ReportAlert from '@/components/ReportAlert'
import { useLang } from '@/lib/i18n'

export default function DestinationHub() {
  const { slug } = useParams<{ slug: string }>()
  const d = DESTINATIONS.find(x => x.slug === slug)
  const [cat, setCat] = useState<CategoryKey | 'ALL'>('ALL')
  const { t } = useLang()
  const allAlerts = useAlerts()

  useEffect(() => {
    if (!d || typeof window === 'undefined' || !('Notification' in window)) return
    const serious = allAlerts.find(a => isActive(a) && a.placeId === d.id && a.kind !== 'cleared')
    if (!serious) return
    const fire = () => { try { new Notification(`⚠ ${alertKindOf(serious.kind).label} near ${d.name}`, { body: serious.body }) } catch {} }
    if (Notification.permission === 'granted') fire()
    else if (Notification.permission !== 'denied') Notification.requestPermission().then(p => { if (p === 'granted') fire() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d?.id])

  if (!d) return <div className="py-20 text-center text-stone/50">Destination not found.</div>
  const placeAlerts = allAlerts.filter(a => isActive(a) && a.placeId === d.id)

  const posts = POSTS.filter(p => p.destinationId === d.id && !p.isTip)
  const tips = POSTS.filter(p => p.destinationId === d.id && p.isTip)
  const skills = SKILLS.filter(s => s.destinationId === d.id)
  const shown = cat === 'ALL' ? posts : cat === 'SKILL' ? [] : posts.filter(p => p.category === cat)

  // local guides who present & can be booked for this area (fall back to whoever posts here)
  const fallbackCreatorId = (posts[0] ?? tips[0] ?? skills[0])?.creatorId
  const guides = guidesOf(d.id).length ? guidesOf(d.id) : GUIDES.filter(g => g.creatorId === fallbackCreatorId)

  return (
    <div className="space-y-5">
      <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm font-bold text-stone/55 hover:text-clay"><ArrowLeft size={16} /> All destinations</Link>

      <div className="relative overflow-hidden rounded-3xl text-white">
        <Media src={destImg(d, 1200, 520)} grad={d.grad} className="absolute inset-0 h-full w-full" />
        <div className="relative p-6 md:p-8" style={{ background: 'linear-gradient(90deg,rgba(11,42,74,.82),rgba(11,42,74,.25))' }}>
          <div className="flex items-center gap-1 text-sm text-white/85"><MapPin size={14} /> {d.district}</div>
          <h1 className="text-3xl font-black md:text-4xl">{t(d.name)}</h1>
          <p className="mt-2 max-w-lg text-sm text-white/90">{t(d.description)}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {d.vibes.map(vk => { const v = VIBES.find(x => x.key === vk)!; const VI = v.icon; return <span key={vk} className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur"><VI size={12} /> {t(v.label)}</span> })}
          </div>
        </div>
      </div>

      {/* live local alerts for this place */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-1.5 text-sm font-black" style={{ color: placeAlerts.length ? '#c2410c' : undefined }}>
          {placeAlerts.length ? <><TriangleAlert size={14} /> {placeAlerts.length} live alert{placeAlerts.length > 1 ? 's' : ''} here</> : 'Conditions look clear'}
        </h2>
        <ReportAlert defaultPlaceId={d.id} className="!py-1.5 !text-xs" />
      </div>
      {placeAlerts.length > 0 && (
        <div className="space-y-2">{placeAlerts.map(a => <AlertCard key={a.id} alert={a} showPlace={false} />)}</div>
      )}

      {tips.length > 0 && (
        <section>
          <h2 className="mb-2 flex items-center gap-1.5 text-base font-black text-stone"><Lightbulb size={16} className="text-lake" /> {t('Local know-how')}</h2>
          <div className="grid gap-3 sm:grid-cols-2">{tips.map(tp => <TipCard key={tp.id} post={tp} />)}</div>
        </section>
      )}

      {/* local guides — compare, view profiles, then book a date */}
      {guides.length > 0 && (
        <section>
          <h2 className="mb-1 flex items-center gap-1.5 text-base font-black text-stone"><Users size={16} className="text-forest" /> {t('Local guides')} ({guides.length})</h2>
          <p className="mb-2.5 text-xs text-stone/55">{t('Pick a local to show you around — see their profile, then choose a date.')}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {guides.map(g => {
              const gc = creatorOf(g.creatorId)
              return (
                <div key={g.id} className="flex flex-col rounded-2xl border-2 border-forest/20 bg-white p-3.5">
                  <div className="flex items-start gap-3">
                    <Link href={`/creator/${gc.id}`}><Avatar creator={gc} size={46} /></Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/creator/${gc.id}`} className="flex items-center gap-1 font-black text-stone hover:text-forest">{gc.name}{gc.verified && <VerifiedBadge size={13} />}</Link>
                      <div className="flex items-center gap-1 text-[11px] text-stone/50"><Stars value={gc.rating} size={11} /> · {gc.reviews} reviews</div>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[13px] text-stone/70">{g.tagline}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {g.specialties.map(k => { const cc = catOf(k); const CI = cc.icon; return <span key={k} className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-bold text-forest"><CI size={10} /> {t(cc.label)}</span> })}
                  </div>
                  <div className="mt-1.5 text-[11px] text-stone/45">{g.languages.join(' · ')}</div>
                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-sand pt-2.5">
                    <div>
                      <div className="text-sm font-black text-forest">{fmtNpr(g.priceNpr)}</div>
                      <div className="text-[10px] text-stone/45">{g.durationLabel}</div>
                    </div>
                    <Link href={`/creator/${gc.id}`} className="rounded-full bg-forest px-4 py-2 text-xs font-bold text-white hover:brightness-95">{t('View & book')}</Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
        <Tab on={cat === 'ALL'} onClick={() => setCat('ALL')} label={t('All')} icon={LayoutGrid} />
        {CATEGORIES.map(c => <Tab key={c.key} on={cat === c.key} onClick={() => setCat(c.key)} label={t(c.label)} icon={c.icon} color={c.color} />)}
      </div>

      {cat === 'SKILL' || cat === 'ALL' ? (
        <>
          {cat === 'ALL' && shown.length > 0 && <div className="grid gap-4 sm:grid-cols-2">{shown.map(p => <FeedCard key={p.id} post={p} />)}</div>}
          <section>
            <h2 className="mb-2 mt-2 flex items-center gap-1.5 text-base font-black text-stone"><Store size={16} className="text-forest" /> {t('Skills here')}</h2>
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
