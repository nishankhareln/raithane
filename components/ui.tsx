'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Star, BadgeCheck } from 'lucide-react'
import { fmtNpr, split, photo, type Creator } from '@/lib/mock'
import { useLang } from '@/lib/i18n'

export const cx = (...a: (string | false | undefined | null)[]) => a.filter(Boolean).join(' ')

/** Real photo with graceful fallback to a gradient (never a broken-image icon, never emoji). */
function Img({ src, className = '' }: { src: string; className?: string }) {
  const [ok, setOk] = useState(true)
  if (!ok || !src) return null
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" loading="lazy" onError={() => setOk(false)} className={className} />
}

export function Stars({ value, size = 14, showNum = true }: { value: number; size?: number; showNum?: boolean }) {
  return (
    <span className="inline-flex items-center gap-0.5 font-semibold text-gold">
      <Star size={size} className="fill-gold text-gold" />
      {showNum && <span className="text-stone">{value.toFixed(1)}</span>}
    </span>
  )
}

export function Pill({ children, color = '#3b39e0', soft = true }: { children: React.ReactNode; color?: string; soft?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={soft ? { background: color + '1c', color } : { background: color, color: '#fff' }}>
      {children}
    </span>
  )
}

export function VerifiedBadge({ size = 14 }: { size?: number }) { return <BadgeCheck size={size} className="text-lake" /> }

export function Media({ src, grad, className = '', children, overlay = true }:
  { src?: string; grad?: string; className?: string; children?: React.ReactNode; overlay?: boolean }) {
  return (
    <div className={cx('relative overflow-hidden img-skeleton', className)} style={grad ? { background: grad } : undefined}>
      {src && <Img src={src} className="absolute inset-0 h-full w-full object-cover" />}
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-stone/45 via-transparent to-transparent" />}
      {children}
    </div>
  )
}

export function Avatar({ creator, size = 40, ring = true }: { creator: Creator; size?: number; ring?: boolean }) {
  return (
    <span className={cx('relative inline-block shrink-0 overflow-hidden rounded-full', ring && 'ring-2 ring-white shadow')}
      style={{ width: size, height: size, background: creator.grad }}>
      <Img src={creator.imgSrc || photo(creator.img, creator.id, size * 2, size * 2)} className="absolute inset-0 h-full w-full object-cover" />
    </span>
  )
}

export function CreatorLine({ creator, sub }: { creator: Creator; sub?: string }) {
  return (
    <Link href={`/creator/${creator.id}`} className="flex items-center gap-2 hover:opacity-80">
      <Avatar creator={creator} size={34} />
      <span className="leading-tight">
        <span className="flex items-center gap-1 text-sm font-bold text-stone">
          {creator.name}{creator.verified && <VerifiedBadge size={13} />}
        </span>
        <span className="block text-[11px] text-stone/50">{sub ?? `★ ${creator.rating} · ${creator.reviews} reviews`}</span>
      </span>
    </Link>
  )
}

export function MoneySplit({ amount, compact = false }: { amount: number; compact?: boolean }) {
  const s = split(amount)
  const creatorPct = Math.round((s.creator / s.gross) * 100)
  if (compact) {
    return <span className="text-[11px] font-semibold text-forest">Creator gets {fmtNpr(s.creator)} <span className="text-stone/40">({creatorPct}%)</span></span>
  }
  return (
    <div className="rounded-xl border border-forest/20 bg-forest/5 p-3">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-bold text-stone">Where your {fmtNpr(amount)} goes</span>
        <span className="font-semibold text-forest">{creatorPct}% to the local</span>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full">
        <div className="bg-forest" style={{ width: creatorPct + '%' }} />
        <div className="bg-clay" style={{ width: 100 - creatorPct + '%' }} />
      </div>
      <div className="mt-2 flex justify-between text-[11px]">
        <span className="flex items-center gap-1 font-semibold text-forest"><span className="h-2 w-2 rounded-full bg-forest" /> Creator {fmtNpr(s.creator)}</span>
        <span className="flex items-center gap-1 text-stone/50"><span className="h-2 w-2 rounded-full bg-clay" /> Platform fee {fmtNpr(s.fee)}</span>
      </div>
    </div>
  )
}

export function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  const { t } = useLang()
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-black tracking-tight text-stone">{t(title)}</h2>
        {sub && <p className="text-sm text-stone/55">{t(sub)}</p>}
      </div>
      {action}
    </div>
  )
}

export function Price({ npr, free }: { npr: number; free?: boolean }) {
  if (free || npr === 0) return <span className="font-extrabold text-forest">Free</span>
  return <span className="font-extrabold text-clay">{fmtNpr(npr)}</span>
}
