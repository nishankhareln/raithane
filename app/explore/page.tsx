'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { LocateFixed, MapPin, Navigation } from 'lucide-react'
import { DESTINATIONS, destImg } from '@/lib/mock'
import { SectionHeader, Media } from '@/components/ui'

const MapExplore = dynamic(() => import('@/components/MapExplore'), {
  ssr: false,
  loading: () => <div className="h-[420px] w-full animate-pulse rounded-3xl bg-sand" />,
})

function haversine(a: number, b: number, c: number, d: number) {
  const R = 6371, r = (x: number) => x * Math.PI / 180
  const dLat = r(c - a), dLon = r(d - b)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export default function Explore() {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null)
  const [busy, setBusy] = useState(false)

  const locate = () => {
    setBusy(true)
    navigator.geolocation?.getCurrentPosition(
      p => { setPos({ lat: p.coords.latitude, lng: p.coords.longitude }); setBusy(false) },
      () => setBusy(false), { enableHighAccuracy: true, timeout: 9000 })
  }

  const ranked = pos
    ? [...DESTINATIONS].map(d => ({ ...d, km: haversine(pos.lat, pos.lng, d.lat, d.lng) })).sort((a, b) => a.km - b.km)
    : DESTINATIONS.map(d => ({ ...d, km: null as number | null }))

  return (
    <div className="space-y-5">
      <SectionHeader title="Explore Nepal" sub="Browse the map, or switch on “Near me” to see what locals are sharing around you."
        action={
          <button onClick={locate} disabled={busy}
            className="flex items-center gap-1.5 rounded-full bg-lake px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
            <LocateFixed size={16} /> {busy ? 'Locating…' : 'Near me'}
          </button>} />

      <MapExplore userPos={pos} />

      <section>
        <h2 className="mb-2.5 flex items-center gap-1.5 text-lg font-black text-stone">{pos ? <><MapPin size={16} /> Nearest to you</> : 'Destinations'}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {ranked.map(d => (
            <Link key={d.id} href={`/destination/${d.slug}`} className="card hover-lift flex items-center gap-3 overflow-hidden rounded-2xl p-3">
              <Media src={destImg(d, 160, 160)} grad={d.grad} className="h-14 w-14 shrink-0 rounded-xl" overlay={false} />
              <div className="flex-1">
                <div className="text-sm font-black text-stone">{d.name}</div>
                <div className="line-clamp-1 text-xs text-stone/55">{d.description}</div>
              </div>
              {d.km != null && (
                <span className="flex items-center gap-1 rounded-full bg-lake/10 px-2 py-1 text-[11px] font-bold text-lake">
                  <Navigation size={11} /> {d.km < 1 ? `${Math.round(d.km * 1000)} m` : `${d.km.toFixed(0)} km`}
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
