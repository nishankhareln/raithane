'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Lock, Heart, Eye, Play, Lightbulb, ThumbsUp, MapPin, CalendarCheck, Truck, Globe, Palette } from 'lucide-react'
import { type Post, type Skill, catOf, creatorOf, destOf, fmtNpr, photo } from '@/lib/mock'
import { Media, Avatar, Stars, Pill, MoneySplit, VerifiedBadge, cx } from './ui'

export function FeedCard({ post }: { post: Post }) {
  const c = creatorOf(post.creatorId), d = destOf(post.destinationId), cat = catOf(post.category)
  const Cat = cat.icon
  const [liked, setLiked] = useState(false)
  const premium = post.type === 'PREMIUM'
  return (
    <article className="card hover-lift rise flex flex-col overflow-hidden rounded-2xl">
      <Link href={`/post/${post.id}`}>
        <Media src={post.imgSrc || photo(post.img, post.id, 700, 460)} className="h-44 w-full">
          <span className="absolute left-2.5 top-2.5"><Pill color={cat.color} soft={false}><Cat size={12} /> {cat.label}</Pill></span>
          {premium && (
            <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-navy/80 px-2 py-1 text-[11px] font-bold text-white backdrop-blur">
              <Lock size={11} /> Premium
            </span>
          )}
          {post.mediaType === 'VIDEO' && (
            <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white">
              <Play size={10} className="fill-white" /> {post.durationMin}m
            </span>
          )}
        </Media>
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <Link href={`/post/${post.id}`} className="flex items-center gap-1 text-[11px] font-semibold text-stone/45"><MapPin size={11} /> {d.name}</Link>
        <Link href={`/post/${post.id}`} className="mt-0.5 line-clamp-1 text-[15px] font-extrabold text-stone hover:text-clay">{post.title}</Link>
        <p className="mt-1 line-clamp-2 text-[13px] text-stone/60">{post.teaser}</p>

        <div className="mt-2.5 flex items-center justify-between">
          <Link href={`/creator/${c.id}`} className="flex items-center gap-1.5 hover:opacity-80">
            <Avatar creator={c} size={26} />
            <span className="flex items-center gap-1 text-xs font-bold text-stone">{c.name}{c.verified && <VerifiedBadge size={12} />}</span>
          </Link>
          <div className="flex items-center gap-2.5 text-[11px] text-stone/45">
            <button onClick={() => setLiked(v => !v)} className={cx('flex items-center gap-1 font-semibold', liked && 'text-clay')}>
              <Heart size={13} className={liked ? 'fill-clay text-clay pop' : ''} /> {post.likes + (liked ? 1 : 0)}
            </button>
            <span className="flex items-center gap-1"><Eye size={13} /> {post.views.toLocaleString()}</span>
          </div>
        </div>

        {premium && (
          <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-sand pt-2.5">
            <MoneySplit amount={post.priceNpr} compact />
            <Link href={`/post/${post.id}`} className="shrink-0 rounded-full bg-clay px-3.5 py-1.5 text-xs font-bold text-white hover:bg-clay-dark">
              Unlock {fmtNpr(post.priceNpr)}
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}

const DELIVERY: Record<string, { label: string; icon: typeof Truck }> = {
  IN_PERSON: { label: 'In person', icon: CalendarCheck },
  SHIPPED: { label: 'Shipped', icon: Truck },
  DIGITAL: { label: 'Online', icon: Globe },
}

export function SkillCard({ skill }: { skill: Skill }) {
  const c = creatorOf(skill.creatorId), d = destOf(skill.destinationId)
  const del = DELIVERY[skill.delivery]; const DI = del.icon
  return (
    <article className="hover-lift rise flex flex-col overflow-hidden rounded-2xl border-2 border-forest/30 bg-white shadow-sm">
      <Link href={`/skill/${skill.id}`} className="relative">
        <Media src={skill.imgSrc || photo(skill.img, skill.id, 700, 440)} grad={skill.grad} className="h-40 w-full">
          <span className="absolute left-2.5 top-2.5"><Pill color="#14b8a6" soft={false}><Palette size={12} /> Bookable skill</Pill></span>
          <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-forest">
            <DI size={11} /> {del.label}
          </span>
        </Media>
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-stone/45"><MapPin size={11} /> {d.name}</span>
          <Stars value={skill.rating} size={12} />
        </div>
        <Link href={`/skill/${skill.id}`} className="mt-0.5 line-clamp-1 text-[15px] font-extrabold text-stone hover:text-forest">{skill.title}</Link>
        <p className="mt-1 line-clamp-2 text-[13px] text-stone/60">{skill.description}</p>
        <div className="mt-2 flex items-center gap-1.5"><Avatar creator={c} size={22} /><span className="text-xs font-bold text-stone">{c.name}</span></div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-sand pt-2.5">
          <div>
            <div className="text-lg font-black text-forest">{fmtNpr(skill.priceNpr)}</div>
            <div className="text-[10px] text-stone/45">{skill.slotsToday} slots today · {skill.durationMin ? skill.durationMin + ' min' : 'made to order'}</div>
          </div>
          <Link href={`/skill/${skill.id}`} className="rounded-full bg-forest px-4 py-2 text-sm font-bold text-white hover:brightness-95">Book</Link>
        </div>
      </div>
    </article>
  )
}

export function TipCard({ post }: { post: Post }) {
  const c = creatorOf(post.creatorId), d = destOf(post.destinationId)
  const [helped, setHelped] = useState(false)
  return (
    <article className="rise flex flex-col rounded-2xl border-2 border-lake/25 bg-lake/5 p-3.5">
      <div className="flex items-center gap-2 text-lake">
        <Lightbulb size={16} /><span className="text-xs font-black uppercase tracking-wide">Local know-how · {d.name}</span>
      </div>
      <h3 className="mt-1.5 text-[15px] font-extrabold text-stone">{post.title}</h3>
      <p className="mt-1 text-[13px] text-stone/70">{post.teaser}</p>
      <div className="mt-2.5 flex items-center justify-between border-t border-lake/15 pt-2.5">
        <div className="flex items-center gap-1.5"><Avatar creator={c} size={24} /><span className="text-xs font-bold text-stone">{c.name}</span></div>
        <button onClick={() => setHelped(v => !v)}
          className={cx('flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold', helped ? 'bg-lake text-white' : 'border border-lake/30 bg-white text-lake')}>
          <ThumbsUp size={13} className={helped ? 'fill-white' : ''} /> Helpful · {(post.tipHelpful ?? 0) + (helped ? 1 : 0)}
        </button>
      </div>
    </article>
  )
}
