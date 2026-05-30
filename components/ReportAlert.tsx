'use client'
import { useRef, useState } from 'react'
import { TriangleAlert, X, Mic, Square, Check } from 'lucide-react'
import { ALERT_KINDS, alertKindOf, DESTINATIONS, type AlertKind, type AlertSeverity } from '@/lib/mock'
import { addAlert } from '@/lib/alertStore'
import { cx } from './ui'
import RecordedAudio from './RecordedAudio'

export default function ReportAlert({ defaultPlaceId, className }: { defaultPlaceId?: string; className?: string }) {
  const [open, setOpen] = useState(false)
  const [placeId, setPlaceId] = useState(defaultPlaceId || DESTINATIONS[0].id)
  const [kind, setKind] = useState<AlertKind>('road_blocked')
  const [sev, setSev] = useState<AlertSeverity>('blocked')
  const [body, setBody] = useState('')
  const [done, setDone] = useState(false)
  // voice
  const [recording, setRecording] = useState(false)
  const [audioSrc, setAudioSrc] = useState<string | null>(null)
  const [recSecs, setRecSecs] = useState(0)
  const mrRef = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const secsRef = useRef(0)

  const pickKind = (k: AlertKind) => { setKind(k); setSev(alertKindOf(k).sev) }

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream); chunks.current = []
      mr.ondataavailable = e => e.data.size && chunks.current.push(e.data)
      mr.onstop = () => { const b = new Blob(chunks.current, { type: mr.mimeType || 'audio/webm' }); const r = new FileReader(); r.onload = () => setAudioSrc(typeof r.result === 'string' ? r.result : null); r.readAsDataURL(b); stream.getTracks().forEach(t => t.stop()) }
      mr.start(); mrRef.current = mr; setRecording(true)
      secsRef.current = 0; setRecSecs(0)
      timerRef.current = setInterval(() => { secsRef.current += 1; setRecSecs(secsRef.current) }, 1000)
    } catch { alert('Please allow the microphone.') }
  }
  const stopRec = () => { mrRef.current?.stop(); setRecording(false); if (timerRef.current) clearInterval(timerRef.current) }

  const submit = () => {
    addAlert({ placeId, kind, severity: sev, body: body.trim() || alertKindOf(kind).label, byCreatorId: 'maya', audioSrc: audioSrc || undefined, audioSecs: recSecs || undefined })
    setDone(true)
    setTimeout(() => { setOpen(false); setDone(false); setBody(''); setAudioSrc(null); setRecSecs(0) }, 1200)
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className={cx('inline-flex items-center gap-1.5 rounded-full bg-clay px-3.5 py-2 text-sm font-bold text-white hover:bg-clay-dark', className)}>
        <TriangleAlert size={15} /> Report a condition
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={() => setOpen(false)}>
          <div className="card w-full max-w-md overflow-hidden rounded-t-3xl rise sm:rounded-3xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-sand px-5 py-3.5">
              <div className="flex items-center gap-2 font-black text-stone"><TriangleAlert size={18} className="text-clay" /> Report a live condition</div>
              <button type="button" onClick={() => setOpen(false)} className="text-stone/40"><X size={20} /></button>
            </div>

            {done ? (
              <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
                <div className="pop flex h-14 w-14 items-center justify-center rounded-full bg-forest/15 text-forest"><Check size={28} /></div>
                <div className="text-lg font-black text-forest">Alert posted!</div>
                <p className="text-sm text-stone/60">Travelers heading there will be warned. Thank you.</p>
              </div>
            ) : (
              <div className="space-y-3 p-5">
                <div>
                  <div className="mb-1 text-xs font-bold text-stone/55">Where?</div>
                  <select value={placeId} onChange={e => setPlaceId(e.target.value)} className="w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm outline-none">
                    {DESTINATIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <div className="mb-1 text-xs font-bold text-stone/55">What’s happening?</div>
                  <div className="grid grid-cols-3 gap-2">
                    {ALERT_KINDS.map(k => (
                      <button key={k.key} type="button" onClick={() => pickKind(k.key)}
                        className={cx('rounded-xl border-2 px-2 py-2 text-xs font-bold', kind === k.key ? 'border-clay bg-clay/5 text-clay' : 'border-sand text-stone/60')}>
                        {k.label}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea value={body} onChange={e => setBody(e.target.value)} rows={3}
                  placeholder="Tell travelers what to do — e.g. ‘Road washed out at Sundarijal, take the Budhanilkantha route instead.’"
                  className="w-full rounded-xl border border-sand bg-white p-3 text-sm outline-none" />

                <div className="flex items-center gap-2">
                  {!recording ? (
                    <button type="button" onClick={startRec} className="flex items-center gap-1.5 rounded-full border border-sand bg-white px-3 py-1.5 text-xs font-bold text-clay">
                      <Mic size={14} /> {audioSrc ? 'Re-record voice' : 'Add a voice note'}
                    </button>
                  ) : (
                    <button type="button" onClick={stopRec} className="flex items-center gap-1.5 rounded-full bg-forest px-3 py-1.5 text-xs font-bold text-white">
                      <Square size={12} className="fill-white" /> Stop
                    </button>
                  )}
                  {audioSrc && !recording && <RecordedAudio src={audioSrc} secs={recSecs} className="flex-1" />}
                </div>

                <button type="button" onClick={submit}
                  className="w-full rounded-full bg-clay py-3 text-sm font-black text-white hover:bg-clay-dark">Post alert</button>
                <p className="text-center text-[11px] text-stone/45">Verified-helpful alerts earn the local a small credit.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
