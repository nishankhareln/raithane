'use client'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { DESTINATIONS } from '@/lib/mock'

export default function MapExplore({ userPos }: { userPos?: { lat: number; lng: number } | null }) {
  const center: [number, number] = userPos ? [userPos.lat, userPos.lng] : [27.9, 84.6]
  return (
    <div className="h-[420px] w-full overflow-hidden rounded-3xl border border-sand">
      <MapContainer center={center} zoom={userPos ? 11 : 7} scrollWheelZoom className="h-full w-full">
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {DESTINATIONS.map(d => (
          <CircleMarker key={d.id} center={[d.lat, d.lng]} radius={10}
            pathOptions={{ color: '#fff', weight: 2, fillColor: '#c1502e', fillOpacity: 1 }}>
            <Popup>
              <div style={{ minWidth: 160 }}>
                <b style={{ fontSize: 14 }}>{d.name}</b>
                <div style={{ color: '#6b6256', fontSize: 12, margin: '2px 0 6px' }}>{d.district}</div>
                <a href={`/destination/${d.slug}`} style={{ background: '#c1502e', color: '#fff', padding: '4px 12px', borderRadius: 999, fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>Open hub →</a>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        {userPos && (
          <CircleMarker center={[userPos.lat, userPos.lng]} radius={9} pathOptions={{ color: '#1d4ed8', weight: 2, fillColor: '#3b82f6', fillOpacity: 1 }}>
            <Popup>You are here</Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  )
}
