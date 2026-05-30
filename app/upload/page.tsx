'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { Mic, Square, Camera, Volume2, ArrowLeft, Minus, Plus, PartyPopper, Palette, Gift, Coins, type LucideIcon } from 'lucide-react'
import { DESTINATIONS, CATEGORIES, fmtNpr, photo, type CategoryKey } from '@/lib/mock'
import { MoneySplit, Media, cx } from '@/components/ui'
import { addCreation } from '@/lib/userStore'

type Share = 'story' | 'photo' | 'skill'

function speak(text: string) {
  try { const u = new SpeechSynthesisUtterance(text); u.rate = 0.95; speechSynthesis.cancel(); speechSynthesis.speak(u) } catch {}
}

export default function Upload() {
  const [step, setStep] = useState(0)
  const [share, setShare] = useState<Share | null>(null)
  const [destId, setDestId] = useState<string | null>(null)
  const [cat, setCat] = useState<CategoryKey | null>(null)
  const [title, setTitle] = useState('')
  const [paid, setPaid] = useState(false)
  const [price, setPrice] = useState(200)
  const [captured, setCaptured] = useState(false)

  // recorder
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoData, setPhotoData] = useState<string | null>(null)
  const mrRef = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream); chunks.current = []
      mr.ondataavailable = e => e.data.size && chunks.current.push(e.data)
      mr.onstop = () => { const b = new Blob(chunks.current); setAudioUrl(URL.createObjectURL(b)); setCaptured(true); stream.getTracks().forEach(t => t.stop()) }
      mr.start(); mrRef.current = mr; setRecording(true)
    } catch { alert('Please allow the microphone.') }
  }
  const stopRec = () => { mrRef.current?.stop(); setRecording(false) }
  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    setPhotoUrl(URL.createObjectURL(f)); setCaptured(true)
    const r = new FileReader(); r.onload = () => setPhotoData(typeof r.result === 'string' ? r.result : null); r.readAsDataURL(f)
  }

  const publish = () => {
    const dest = DESTINATIONS.find(d => d.id === destId)
    const kind: 'post' | 'skill' = share === 'skill' ? 'skill' : 'post'
    const mediaType = share === 'story' ? 'AUDIO' : share === 'photo' ? 'PHOTO' : 'VIDEO'
    addCreation({
      id: 'u' + Date.now(), kind, creatorId: 'maya', destinationId: destId || 'kathmandu',
      category: kind === 'skill' ? 'SKILL' : (cat || 'CULTURE'),
      type: paid ? 'PREMIUM' : 'FREE',
      title: title.trim() || (kind === 'skill' ? 'My experience' : share === 'photo' ? 'My photo story' : 'My voice story'),
      body: '', priceNpr: paid ? price : 0,
      img: dest?.img || 'nepal', imgSrc: photoData || undefined,
      mediaType, delivery: kind === 'skill' ? 'IN_PERSON' : undefined, createdAt: Date.now(),
    })
  }

  const steps = ['Share', 'Where', 'About', 'Add', 'Earn', 'Done']
  const go = (n: number) => setStep(Math.max(0, Math.min(5, n)))
  const isSkill = share === 'skill'

  return (
    <div className="mx-auto max-w-lg space-y-5">
      {/* progress */}
      <div className="flex items-center gap-2">
        {step > 0 && step < 5 && <button onClick={() => go(step - 1)} className="text-stone/50"><ArrowLeft size={20} /></button>}
        <div className="flex flex-1 gap-1.5">
          {steps.map((_, i) => <div key={i} className={cx('h-1.5 flex-1 rounded-full', i <= step ? 'bg-clay' : 'bg-sand')} />)}
        </div>
      </div>

      {/* STEP 0 — what to share */}
      {step === 0 && (
        <Stepish q="What do you want to share?" onHear={() => speak('What do you want to share? A story, a photo, or a skill?')}>
          <div className="grid gap-3">
            <BigChoice icon={Mic} title="Tell a story" sub="Speak — no typing needed" color="#3b39e0"
              onClick={() => { setShare('story'); go(1) }} />
            <BigChoice icon={Camera} title="Show a photo" sub="A picture of your place or craft" color="#4f46e5"
              onClick={() => { setShare('photo'); go(1) }} />
            <BigChoice icon={Palette} title="Offer a skill" sub="A class, experience or craft to sell" color="#14b8a6"
              onClick={() => { setShare('skill'); setCat('SKILL'); go(1) }} />
          </div>
        </Stepish>
      )}

      {/* STEP 1 — where */}
      {step === 1 && (
        <Stepish q="Where is this?" onHear={() => speak('Where is this? Tap your place.')}>
          <div className="grid grid-cols-2 gap-3">
            {DESTINATIONS.map(d => (
              <button key={d.id} onClick={() => { setDestId(d.id); go(2) }}
                className={cx('hover-lift overflow-hidden rounded-2xl border-2', destId === d.id ? 'border-clay' : 'border-sand bg-white')}>
                <Media src={photo(d.img, d.id, 300, 180)} grad={d.grad} className="h-20 w-full" />
                <span className="block py-2 text-sm font-black text-stone">{d.name}</span>
              </button>
            ))}
          </div>
        </Stepish>
      )}

      {/* STEP 2 — category (skip detail for skill but still confirm) */}
      {step === 2 && (
        <Stepish q={isSkill ? 'What kind of skill?' : 'What is it about?'} onHear={() => speak(isSkill ? 'What kind of skill?' : 'What is it about? Tap a picture.')}>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.filter(c => isSkill ? true : c.key !== 'SKILL').map(c => (
              <button key={c.key} onClick={() => { setCat(c.key); go(3) }}
                className={cx('hover-lift flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3', cat === c.key ? 'border-clay' : 'border-sand bg-white')}>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ background: c.color }}><c.icon size={22} /></span>
                <span className="text-xs font-bold text-stone">{c.label}</span>
              </button>
            ))}
          </div>
        </Stepish>
      )}

      {/* STEP 3 — capture */}
      {step === 3 && (
        <Stepish q={share === 'story' ? 'Tell your story' : share === 'photo' ? 'Add your photo' : 'Name your skill'}
          onHear={() => speak(share === 'story' ? 'Press the big red button and speak your story.' : share === 'photo' ? 'Tap to add a photo.' : 'Say the name and price of your skill.')}>
          {share === 'story' && (
            <div className="flex flex-col items-center gap-3">
              {!recording ? (
                <button onClick={startRec} className="flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full bg-clay text-white shadow-lg hover:bg-clay-dark">
                  <Mic size={36} /><span className="text-xs font-bold">Tap to talk</span>
                </button>
              ) : (
                <button onClick={stopRec} className="flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full bg-forest text-white shadow-lg">
                  <Square size={32} className="fill-white" /><span className="text-xs font-bold">Stop</span>
                </button>
              )}
              {audioUrl && <audio src={audioUrl} controls className="w-full" />}
              <p className="text-center text-sm text-stone/55">Speak in your own language. We keep your voice; a youth translator can add Nepali & English later.</p>
            </div>
          )}
          {share === 'photo' && (
            <div className="flex flex-col items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />
              {photoUrl
                ? <img src={photoUrl} alt="" className="h-52 w-full rounded-2xl object-cover" />
                : <button onClick={() => fileRef.current?.click()} className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sand bg-white text-stone/50">
                    <Camera size={40} /><span className="font-bold">Tap to add a photo</span>
                  </button>}
              {photoUrl && <button onClick={() => fileRef.current?.click()} className="text-sm font-bold text-clay">Change photo</button>}
            </div>
          )}
          {(share === 'photo' || share === 'skill') && (
            <input value={title} onChange={e => { setTitle(e.target.value); setCaptured(true) }}
              placeholder={isSkill ? 'e.g. Cook Dal Bhat with me' : 'A few words (optional)'}
              className="mt-3 w-full rounded-2xl border-2 border-sand bg-white px-4 py-3 text-base outline-none" />
          )}
          <button onClick={() => go(4)} disabled={!captured && !isSkill}
            className="mt-4 w-full rounded-full bg-clay py-3 text-base font-black text-white disabled:opacity-40">Continue</button>
        </Stepish>
      )}

      {/* STEP 4 — price + money split */}
      {step === 4 && (
        <Stepish q="Free, or earn from it?" onHear={() => speak('Do you want to share it free, or earn money from it?')}>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPaid(false)} className={cx('rounded-2xl border-2 p-4 text-center', !paid ? 'border-forest bg-forest/5' : 'border-sand bg-white')}>
              <Gift size={30} className="mx-auto text-forest" /><div className="mt-1.5 font-black text-stone">Share free</div><div className="text-xs text-stone/50">Builds your following</div>
            </button>
            <button onClick={() => setPaid(true)} className={cx('rounded-2xl border-2 p-4 text-center', paid ? 'border-clay bg-clay/5' : 'border-sand bg-white')}>
              <Coins size={30} className="mx-auto text-clay" /><div className="mt-1.5 font-black text-stone">Earn from it</div><div className="text-xs text-stone/50">{isSkill ? 'Set a booking price' : 'People pay to unlock'}</div>
            </button>
          </div>

          {paid && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => setPrice(p => Math.max(50, p - 50))} className="flex h-12 w-12 items-center justify-center rounded-full bg-sand text-stone"><Minus size={22} /></button>
                <div className="text-center"><div className="text-3xl font-black text-clay">{fmtNpr(price)}</div></div>
                <button onClick={() => setPrice(p => p + 50)} className="flex h-12 w-12 items-center justify-center rounded-full bg-sand text-stone"><Plus size={22} /></button>
              </div>
              <MoneySplit amount={price} />
            </div>
          )}

          <button onClick={() => { publish(); go(5) }} className="mt-5 w-full rounded-full bg-clay py-3 text-base font-black text-white">Publish</button>
        </Stepish>
      )}

      {/* STEP 5 — done */}
      {step === 5 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="pop flex h-20 w-20 items-center justify-center rounded-full bg-forest/15 text-forest"><PartyPopper size={40} /></div>
          <h2 className="text-2xl font-black text-forest">Published!</h2>
          <p className="max-w-xs text-sm text-stone/65">
            Your {share} from {DESTINATIONS.find(d => d.id === destId)?.name} is live.
            {paid ? ` You’ll keep 90% — ${fmtNpr(Math.round(price * 0.9))} per ${isSkill ? 'booking' : 'unlock'}.` : ' Free posts grow your following fast.'}
          </p>
          <div className="mt-2 flex gap-2">
            <Link href="/dashboard" className="rounded-full bg-forest px-5 py-2.5 text-sm font-black text-white">See my earnings</Link>
            <button onClick={() => { setStep(0); setShare(null); setDestId(null); setCat(null); setCaptured(false); setAudioUrl(null); setPhotoUrl(null); setPhotoData(null); setTitle(''); setPaid(false); setPrice(200) }}
              className="rounded-full border border-sand bg-white px-5 py-2.5 text-sm font-bold text-stone/70">Share another</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Stepish({ q, onHear, children }: { q: string; onHear: () => void; children: React.ReactNode }) {
  return (
    <div className="rise space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-black text-stone">{q}</h1>
        <button onClick={onHear} title="Hear this" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lake/10 text-lake"><Volume2 size={20} /></button>
      </div>
      {children}
    </div>
  )
}

function BigChoice({ icon: Icon, title, sub, color, onClick }: { icon: LucideIcon; title: string; sub: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="hover-lift flex items-center gap-4 rounded-2xl border-2 border-sand bg-white p-4 text-left">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: color + '18', color }}><Icon size={30} /></span>
      <span className="flex-1">
        <span className="block text-lg font-black text-stone">{title}</span>
        <span className="block text-sm text-stone/55">{sub}</span>
      </span>
    </button>
  )
}
