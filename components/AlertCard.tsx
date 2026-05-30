'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Construction, Waves, Mountain, Megaphone, Lock, CircleCheck, ThumbsUp, MapPin, type LucideIcon } from 'lucide-react'
import { alertKindOf, ALERT_SEV, destOf, creatorOf, type Alert, type AlertKind } from '@/lib/mock'
import { markHelpful, resolveAlert, timeAgo } from '@/lib/alertStore'
import { Avatar, cx } from './ui'
import NarrateButton from './NarrateButton'

const KIND_ICON: Record<AlertKind, LucideIcon> = {
  road_blocked: Construction, flood: Waves, landslide: Mountain, strike: Megaphone, closed: Lock, cleared: CircleCheck,
}

export default function AlertCard({ alert, showPlace = true }: { alert: Alert; showPlace?: boolean }) {
  const k = alertKindOf(alert.kind)
  const Icon = KIND_ICON[alert.kind]
  const place = destOf(alert.placeId)
  const by = creatorOf(alert.byCreatorId)
  const cleared = alert.kind === 'cleared'
  const sev = cleared ? { label: 'Cleared', color: '#15803d', bg: '#dcfce7' } : ALERT_SEV[alert.severity]
  const [helped, setHelped] = useState(false)
  const [done, setDone] = useState(alert.resolved)

  return (
    <div className="overflow-hidden rounded-2xl border" style={{ borderColor: sev.color + '55', background: sev.bg }}>
      <div className="flex items-start gap-3 p-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: sev.color }}>
          <Icon size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-sm font-black" style={{ color: sev.color }}>{k.label}</span>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: sev.color, color: '#fff' }}>{sev.label}</span>
            {showPlace && place && (
              <Link href={`/destination/${place.slug}`} className="flex items-center gap-0.5 text-[11px] font-semibold text-stone/60 hover:underline">
                <MapPin size={11} /> {place.name}
              </Link>
            )}
          </div>
          <p className="mt-1 text-sm text-stone/85">{alert.body}</p>

          <div className="mt-2 flex items-center gap-2">
            <Avatar creator={by} size={22} />
            <span className="text-[11px] text-stone/55">{by.name} · {timeAgo(alert.createdAt)}</span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {alert.audioSrc
              ? <audio src={alert.audioSrc} controls className="h-8 max-w-[220px]" />
              : <NarrateButton text={`${k.label} near ${place?.name}. ${alert.body}`} label="Hear the alert" className="!px-3 !py-1.5 !text-xs" />}

            <button type="button" disabled={helped} onClick={() => { markHelpful(alert.id); setHelped(true) }}
              className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold',
                helped ? 'bg-forest text-white' : 'border bg-white')}
              style={helped ? undefined : { borderColor: sev.color + '55', color: sev.color }}>
              <ThumbsUp size={13} className={helped ? 'fill-white' : ''} /> Helpful · {alert.helpful + (helped ? 1 : 0)}
            </button>

            {!done && (
              <button type="button" onClick={() => { resolveAlert(alert.id); setDone(true) }}
                className="text-[11px] font-bold text-stone/45 hover:text-stone underline">mark resolved</button>
            )}
            {done && <span className="text-[11px] font-bold text-forest">✓ resolved</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
