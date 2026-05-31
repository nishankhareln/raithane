'use client'
import { useAlerts, isActive } from '@/lib/alertStore'
import AlertCard from '@/components/AlertCard'
import ReportAlert from '@/components/ReportAlert'
import { SectionHeader } from '@/components/ui'

export default function AlertsPage() {
  const alerts = useAlerts()
  const active = alerts.filter(isActive)
  const resolved = alerts.filter(a => a.resolved)

  return (
    <div className="space-y-5">
      <SectionHeader title="Live local alerts"
        sub="Real-time conditions posted by locals — road blocks, floods, strikes. The things a map can’t tell you."
        action={<ReportAlert />} />

      {active.length === 0 ? (
        <div className="rounded-2xl border border-sand bg-white p-12 text-center text-stone/50">
          No active alerts right now — all clear.
        </div>
      ) : (
        <div className="space-y-3">{active.map(a => <AlertCard key={a.id} alert={a} />)}</div>
      )}

      {resolved.length > 0 && (
        <div className="space-y-3">
          <h2 className="pt-2 text-sm font-bold text-stone/45">Recently resolved</h2>
          <div className="space-y-3 opacity-60">{resolved.map(a => <AlertCard key={a.id} alert={a} />)}</div>
        </div>
      )}
    </div>
  )
}
