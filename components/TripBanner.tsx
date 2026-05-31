'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Compass, ArrowRight, LocateFixed, MapPin, X, Loader2 } from 'lucide-react'
import { DESTINATIONS, destOf } from '@/lib/mock'
import { getTrip, setTrip, TRIP_EVT } from '@/lib/tripStore'

function haversine(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371, toR = (x: number) => (x * Math.PI) / 180
  const dLat = toR(bLat - aLat), dLng = toR(bLng - aLng)
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toR(aLat)) * Math.cos(toR(bLat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}
const NEAR_KM = 60 // within this, we treat you as "at" that destination

export default function TripBanner() {
  const [loaded, setLoaded] = useState(false)
  const [tripId, setTripId] = useState<string | null>(null)
  const [phase, setPhase] = useState<'idle' | 'locating' | 'denied' | 'far' | 'picking'>('idle')
  const [nearKm, setNearKm] = useState<number | null>(null)

  // read the saved trip on the client (avoids SSR/hydration mismatch)
  useEffect(() => {
    const load = () => setTripId(getTrip())
    load(); setLoaded(true)
    window.addEventListener(TRIP_EVT, load)
    window.addEventListener('storage', load)
    return () => { window.removeEventListener(TRIP_EVT, load); window.removeEventListener('storage', load) }
  }, [])

  const choose = (id: string, km: number | null) => { setNearKm(km); setTrip(id); setTripId(id); setPhase('idle') }

  const locate = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) { setPhase('picking'); return }
    setPhase('locating')
    navigator.geolocation.getCurrentPosition(
      p => {
        const nearest = DESTINATIONS
          .map(d => ({ d, km: haversine(p.coords.latitude, p.coords.longitude, d.lat, d.lng) }))
          .sort((a, b) => a.km - b.km)[0]
        if (nearest && nearest.km <= NEAR_KM) choose(nearest.d.id, Math.round(nearest.km))
        else setPhase('far')
      },
      () => setPhase('denied'),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
    )
  }

  if (!loaded) return null

  if (phase === 'locating') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-plum/25 bg-plum/5 px-4 py-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-plum/15 text-plum"><Loader2 size={20} className="animate-spin" /></span>
        <div className="flex-1 text-sm font-bold text-stone">Finding where you are…
          <div className="text-xs font-normal text-stone/55">We’ll tune your feed to the place you’re nearest to.</div>
        </div>
      </div>
    )
  }

  if (phase === 'picking') {
    return (
      <div className="rounded-2xl border border-plum/25 bg-plum/5 p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-black text-stone">Where are you headed?</div>
          <button onClick={() => setPhase('idle')} className="text-stone/40 hover:text-stone"><X size={18} /></button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DESTINATIONS.map(d => (
            <button key={d.id} onClick={() => choose(d.id, null)}
              className="flex items-center gap-1 rounded-full border border-plum/30 bg-white px-3 py-1.5 text-xs font-bold text-stone/75 transition hover:bg-plum hover:text-white">
              <MapPin size={11} /> {d.name}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (tripId) {
    const trip = destOf(tripId)
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-plum/25 bg-plum/5 px-4 py-3">
        <Link href={`/destination/${trip.slug}`} className="flex min-w-0 flex-1 items-center gap-3 hover:opacity-90">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-plum/15 text-plum"><Compass size={20} /></span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold text-stone">
              {nearKm != null ? <>You’re near <span className="text-plum">{trip.name}</span> · ~{nearKm} km away</> : <>Because you’re visiting <span className="text-plum">{trip.name}</span></>}
            </div>
            <div className="truncate text-xs text-stone/55">Your feed is tuned to your trip. Tap to open the {trip.name} hub.</div>
          </div>
          <ArrowRight size={18} className="shrink-0 text-plum" />
        </Link>
        <button onClick={() => setPhase('picking')} className="shrink-0 rounded-full border border-plum/30 bg-white px-2.5 py-1 text-[11px] font-bold text-plum hover:bg-plum hover:text-white">Change</button>
      </div>
    )
  }

  // no trip set yet → invite (covers first visit, GPS denied, or too far)
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-plum/25 bg-plum/5 px-4 py-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-plum/15 text-plum"><MapPin size={20} /></span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-stone">
          {phase === 'denied' ? 'Location is off — tell us where you’re headed' : phase === 'far' ? 'You’re not near a listed place — pick your destination' : 'Where are you headed in Nepal?'}
        </div>
        <div className="text-xs text-stone/55">Tune your feed to your trip — use your location, or pick a place.</div>
      </div>
      <div className="flex shrink-0 gap-2">
        <button onClick={locate} className="flex items-center gap-1 rounded-full bg-plum px-3 py-1.5 text-xs font-bold text-white hover:brightness-95"><LocateFixed size={13} /> Use my location</button>
        <button onClick={() => setPhase('picking')} className="rounded-full border border-plum/30 bg-white px-3 py-1.5 text-xs font-bold text-plum hover:bg-plum hover:text-white">Pick a place</button>
      </div>
    </div>
  )
}
